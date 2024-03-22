#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { Command, InvalidArgumentError } from "commander";
import fs from "fs";
import { DateTime } from "luxon";
import readline from "readline";
import isValid from "is-valid-path";
import { parseCSV } from "@the-discounters/util";
import {
  initFirestore,
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
  readExperimentsAndQuestions,
  readExperimentParticipantsAndAudit,
  subscribeParticipantUpdates,
  unsubscribeParticipantUpdates,
  readExperimentAndQuestions,
} from "@the-discounters/firebase-shared";
import { convertKeysUnderscoreToCamelCase } from "@the-discounters/types";
import { isCSVExt, directoryOrFileExists, writeFile } from "./files.js";
import { Stats } from "./stats.js";
import { drawStatus } from "./monitorUtil.js";
import {
  typeExperimentObj,
  typeQuestionObj,
  typeTreatmentObj,
  typeTreatmentQuestionObj,
  parseLinkText,
  parseFileToObj,
  parseLookupText,
} from "./importUtil.js";
import {
  exportParticipantsToJSON,
  exportAuditToJSON,
  exportParticipantsToCSV,
  exportAuditToCSV,
  exportExperimentParticipantsAndAuditToJSON,
} from "./FileIOAdapter.js";
import { validateExperimentData } from "./Validator.js";

const validateInt = (value, dummyPrevious) => {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsedValue;
};

const validateDate = (value, dummyPrevious) => {
  const result = DateTime.fromFormat(value, "MM/dd/yyyy");
  if (result.invalidReason) {
    throw new InvalidArgumentError("Not a valid date.");
  }
  return result;
};

const validatePath = (value, dummyPrevious) => {
  if (!isValid(value)) {
    throw new InvalidArgumentError("Not a valid path.");
  }
  if (!directoryOrFileExists(value)) {
    throw new InvalidArgumentError("Path or file does not exist.");
  }
  return value;
};

const initializeDB = () => {
  console.log(
    chalk.yellow(
      `Using creds from ${process.env.GOOGLE_APPLICATION_CREDENTIALS} ` +
        `and project id ${process.env.FIRESTORE_PROJECT_ID} ` +
        `and database url ${process.env.FIRESTORE_DATABASE_URL} ` +
        `and emulator host ${process.env.FIRESTORE_EMULATOR_HOST}` +
        "set with environment variables GOOGLE_APPLICATION_CREDENTIALS, " +
        "FIRESTORE_PROJECT_ID, and FIRESTORE_DATABASE_URL"
    )
  );
  const ADMIN_CREDS = JSON.parse(
    fs.readFileSync(
      new URL(process.env.GOOGLE_APPLICATION_CREDENTIALS, import.meta.url)
    )
  );
  const result = initFirestore(
    process.env.FIRESTORE_PROJECT_ID,
    process.env.FIRESTORE_DATABASE_URL,
    ADMIN_CREDS
  );
  return result;
};

const program = new Command();
program
  .name("dsc")
  .description(
    "CLI for processing files created from vizsurvey capturing participants survey answers."
  )
  .version("2.0.0")
  .option("-q, --quiet", "run without showing the banner")
  .hook("preAction", (thisCommand, actionCommand) => {
    if (!program.opts().quiet) {
      console.log(
        chalk.yellow(
          figlet.textSync("Discounters", { horizontalLayout: "full" })
        )
      );
    }
  });

const ExportTypes = {
  configuration: "configuration",
  data: "data",
  audit: "audit",
  all: "all",
};
Object.freeze(ExportTypes);

const validateExportType = (value) => {
  const result = ExportTypes[value];
  if (!result) {
    throw new InvalidArgumentError(
      `Export type ${value} is not a valid value.`
    );
  }
  return result;
};

const FileTypes = {
  json: "json",
  csv: "csv",
};
Object.freeze(FileTypes);

const validateFileType = (value) => {
  const result = FileTypes[value];
  if (!result) {
    throw new InvalidArgumentError(`File type ${value} is not json or csv.`);
  }
  return result;
};

const exportConfig = async (db, format, studyId, filename) => {
  let fileData;
  switch (format) {
    case FileTypes.json:
      //fileData = await exportParticipantsToJSON(db, studyId);
      break;
    case FileTypes.csv:
      throw new Error("CSV export type not implemented yet!");
    default:
      break;
  }
  writeFile(filename, fileData);
};

program
  .command("export")
  .description("Exports data from firestore to a CSV file.")
  .argument("<filename>", "the filename to export the data to.")
  .option(
    "-l, --laterthan <date>",
    "the date to filter out entries that are are equal to or later than",
    validateDate
  )
  .option(
    "-e, --experiment <experiment id>",
    "the experiment id to export.  If non is provided all experiments are exported."
  )
  .option(
    "-t, --type <definitions, data, audit, all>",
    "they data to export; configuration for experiment configuration, data for exeperiment data, audit for audit data, all for all data.",
    validateExportType
  )
  .option(
    "-f, --format <json or csv>",
    "the format of the export file.",
    validateFileType
  )
  .action((filename, options) => {
    try {
      if (options.experiment === "all") {
        throw new Error("Experiment option all not implemented yet!");
      }
      console.log(
        `Exporting data for ${
          options.experiment
            ? "experiment " + options.experiment
            : "all experiments"
        } of type ${options.type} in format ${
          options.format
        } to file ${filename} ...`
      );
      const { db } = initializeDB();
      switch (options.type) {
        case ExportTypes.configuration:
          throw new Error("Not implemented yet!");
        case ExportTypes.data:
          switch (options.format) {
            case FileTypes.json:
              exportParticipantsToJSON(db, options.experiment, filename);
              break;
            case FileTypes.csv:
              exportParticipantsToCSV(db, options.experiment, filename);
            default:
              break;
          }
          break;
        case ExportTypes.audit:
          switch (options.format) {
            case FileTypes.json:
              exportAuditToJSON(db, options.experiment, filename);
              break;
            case FileTypes.csv:
              exportAuditToCSV(db, options.experiment, filename);
            default:
              break;
          }
          break;
        case ExportTypes.all:
          switch (options.format) {
            case FileTypes.json:
              exportExperimentParticipantsAndAuditToJSON(
                db,
                options.experiment,
                filename
              );
              break;
            case FileTypes.csv:
              throw new InvalidArgumentError(
                "Exporting all to CSV is not supported at this time."
              );
            default:
              break;
          }
          break;
        default:
          console.log(`Unknow export type ${options.type}`);
      }
    } catch (err) {
      console.log(chalk.red(err));
      throw err;
    }
  });

program
  .command("monitor")
  .description(
    "Monitors the status of an experiment running by reporting summary statistics in real time to the screen."
  )
  .argument("<experiment id>", "the experiment to validate data for.")
  .action((studyId) => {
    console.log(chalk.red(`Monitoring expriment ${studyId}...`));
    console.log(chalk.yellow("Press Enter to start monitoring."));
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    const { db } = initializeDB();
    readExperimentAndQuestions(db, studyId)
      .then((exp) => {
        let treatmentIds = new Set(
          exp.treatmentQuestions
            .map((item) => item.treatmentId)
            .sort((a, b) => a - b)
        );
        let stats = new Stats(treatmentIds, exp.numParticipants);
        subscribeParticipantUpdates(db, exp.path, (participants) => {
          stats.updateStats(participants);
          clear();
          drawStatus(stats).output();
          process.stdin.on("keypress", (str, key) => {
            if (key.ctrl && key.name === "c") {
              console.log("monitor ending.");
              process.exit(); // eslint-disable-line no-process-exit
            }
          });
        });
      })
      .catch((err) => {
        console.log(chalk.red(err));
        throw err;
      });
  });

const commitBatchSync = async () => {
  await commitBatch();
};

const ImportCollextionTypes = {
  experiments: "experiments",
  questions: "questions",
  visualizations: "visualizations",
  treatments: "treatments",
  treatmentQuestions: "treatmentQuestions",
};
Object.freeze(ImportCollextionTypes);

const validateImportCollextionType = (value, dummyPrevious) => {
  const result = ImportCollextionTypes[value];
  if (!result) {
    throw new InvalidArgumentError(
      `Collection type ${value} is not a valid value.`
    );
  }
  return result;
};

const typeFieldsFunction = (collectionType) => {
  switch (collectionType) {
    case ImportCollextionTypes.experiments:
      return typeExperimentObj;
    case ImportCollextionTypes.questions:
      return typeQuestionObj;
    case ImportCollextionTypes.treatments:
      return typeTreatmentObj;
    case ImportCollextionTypes.treatmentQuestions:
      return typeTreatmentQuestionObj;
  }
};

const importWithoutParent = (db, collection, data) => {
  initBatch(db, collection);
  for (const item of data) {
    const camelCaseItem = convertKeysUnderscoreToCamelCase(item);
    setBatchItem(null, null, camelCaseItem);
  }
  commitBatchSync();
};

const importWithParent = async (db, collection, data, linkFields) => {
  const experiments = await readExperimentsAndQuestions(db);
  for (const exp of experiments) {
    const dataToWrite = data.filter(
      (v) => v[linkFields.rightField] === exp[linkFields.leftField]
    );
    if (dataToWrite.length === 0) {
      console.log(
        chalk.yellow(
          `No entries found in the file for parent entry ${exp.path}` +
            "matched on fields " +
            `${linkFields.leftField}=>${linkFields.rightField} ` +
            `value ${exp[linkFields.leftField]}`
        )
      );
    } else {
      importWithoutParent(db, exp.path + "/" + collection, dataToWrite);
    }
  }
};

program
  .command("import")
  .description(
    "Imports data from csv or json format into the firestore database."
  )
  .option("-s, --src <path>", "Source file path", validatePath)
  .option(
    "-c, --collection <name>",
    "Collection name in database",
    validateImportCollextionType
  )
  .option(
    "-p, --parent <name>",
    "Collection parent name in database",
    validateImportCollextionType
  )
  .option(
    "-l, --lookup <parent field name>=><child field name>",
    "Parent and child collection fields to lookup the parent entry for the child entries."
  )
  .action((args, options) => {
    try {
      const { db } = initializeDB();
      if (args.parent) {
        if (args.parent !== ImportCollextionTypes.experiments) {
          throw new InvalidArgumentError(
            "parent of experiment type is the only supported at this time."
          );
        }
        const linkFields = parseLookupText(args.lookup);
        const data = parseFileToObj(args.src);
        const typeFieldsFn = typeFieldsFunction(args.collection);
        const typedData = data.map((v) => typeFieldsFn(v));
        importWithParent(db, args.collection, typedData, linkFields);
      } else {
        const data = parseFileToObj(args.src);
        const typeFieldsFn = typeFieldsFunction(args.collection);
        const typedData = data.map((v) => typeFieldsFn(v));
        importWithoutParent(db, args.collection, typedData);
      }
      console.log("Firestore import successfull!");
    } catch (err) {
      console.log(chalk.red("Migration failed!"), err);
      throw err;
    }
  });

program
  .command("link")
  .description("Creates reference fields between firestore documents.")
  .option(
    "-f, --fields <collection path>.<field name>=><collection path>.<field name>",
    "Collection and field paths to link.  Each left path segment will be scanned for right collection entries to link."
  )
  .action((args, options) => {
    try {
      const fields = args.fields;
      const links = parseLinkText(fields);
      const { db } = initializeDB();
      linkDocs(
        db,
        links.leftPath,
        links.leftField,
        links.rightPath,
        links.rightField
      );
      console.log("Firestore linking was successfull!");
    } catch (err) {
      console.log(chalk.red(`Linking failed for ${fields}!`), err);
      throw err;
    }
  });

const deletePath = async (db, path) => {
  await deleteDocs(db, path);
};

program
  .command("delete")
  .description(
    "Deletes a collection path and all documents under it.  WARNING DELETES CAN'T BE UNDONE!"
  )
  .option(
    "-c, --collection <path>",
    "Collection path in database",
    validateImportCollextionType
  )
  .action((args) => {
    try {
      const { db } = initializeDB();
      deletePath(db, args.collection);
      console.log("Firestore delete collection was successfull!");
    } catch (err) {
      console.log(chalk.red(`Delete failed for ${args.collection}!`), err);
      throw err;
    }
  });

program
  .command("validate")
  .description("Validate data recorded for an experiment.")
  .argument("<experiment id>", "the experiment to validate data for.")
  .option(
    "-l, --laterthan <date>",
    "the date to filter out files that are are equal to or later than",
    validateDate
  )
  .action((experiment, options) => {
    try {
      console.log(`Validating data for experiment id ${experiment}`);
      const { db } = initializeDB();
      readExperimentParticipantsAndAudit(db, experiment).then(
        ({ experiment, participants, audit }) => {
          const result = validateExperimentData(
            experiment,
            participants,
            audit
          );
          console.log(
            result.reduce((acc, issue) => {
              return acc + issue.message;
            }, "")
          );
        }
      );
    } catch (err) {
      console.log(chalk.red(err));
      throw err;
    }
  });

try {
  program.parse();
} catch (err) {
  console.log(chalk.red(err));
  process.exit(1);
}
