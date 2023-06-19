#!/usr/bin/env node
import * as dotenv from "dotenv";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { Command, InvalidArgumentError } from "commander";
import fs from "fs";
import { DateTime } from "luxon";
import readline from "readline";
import isValid from "is-valid-path";
import { parseCSV, convertToCSV } from "./parserUtil.js";
import {
  getFilename,
  loadFile,
  writeFile,
  appendSepToPath,
  isCSVExt,
  isJSONExt,
  directoryOrFileExists,
} from "./files.js";
import { updateStats, createStat, clearStats } from "./stats.js";
import { drawStatus } from "./monitorUtil.js";
import {
  initAdminFirestoreDB,
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
} from "./firestoreAdmin.js";
import {
  typeExperimentObj,
  typeQuestionObj,
  typeTreatmentObj,
  typeTreatmentQuestionObj,
  typeVisObj,
  parseLinkText,
} from "./importUtil.js";

dotenv.config();

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

const program = new Command();
program
  .name("dsc")
  .description(
    "CLI for processing files created from vizsurvey capturing participants survey answers."
  )
  .version("1.0.0")
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

program
  .command("download")
  .description("Downloads files from the S3 bucket.")
  .argument("<directory>", "directory to store the files in.")
  .option(
    "-l, --laterthan <date>",
    "the date to filter out files that are are equal to or later than",
    validateDate
  )
  .action((source, options) => {
    try {
      console.log(`Downloading files from S3 bucket...`);
      listFiles().then((response) => {
        const files = response.Contents.filter((file) => {
          if (
            options.laterthan &&
            DateTime.fromJSDate(file.LastModified) < options.laterthan
          ) {
            console.log(
              `...skipping ${file.Key} since the date is before ${options.laterthan}`
            );
            return false;
          } else {
            return true;
          }
        });
        files.forEach((file) => {
          console.log(
            `...downloading file ${file.Key} created on date ${file.LastModified}`
          );
          const data = downloadFile(file, (error) => {
            console.log(chalk.red(error));
          }).then((data) => {
            const fullPath = `${appendSepToPath(source)}${file.Key}`;
            console.log(`...writing file ${file.Key}`);
            fs.writeFile(fullPath, data, (err) => {
              if (err) {
                console.log(
                  chalk.red(`error writing file ${param.file.Key}`, err)
                );
                throw err;
              }
            });
          });
        });
      });
    } catch (err) {
      console.log(chalk.red(err));
      throw err;
    }
  });

program
  .command("monitor")
  .description(
    "Monitors the status of an experiment running by downloading the S3 files and reporting summary statistics in real time to the screen."
  )
  .argument(
    "<number participants>",
    "the total number of participants the experiment was ran for.  Used to update the percent progress bars",
    validateInt
  )
  .option(
    "-l, --laterthan <date>",
    "the date to filter out files that are are equal to or later than",
    validateDate
  )
  .option(
    "-t, --numtreatments <number>",
    "the number of treatments for breaking down inprogress results by treatment",
    validateInt
  )
  .action((totalParticipants, options) => {
    const MonitorStateType = {
      monitorPaused: "monitorPaused",
      fetchingData: "fetchingData",
      refreshingScreen: "refreshingScreen",
    };
    Object.freeze(MonitorStateType);
    try {
      console.log(
        chalk.red(
          `Monitoring with ${totalParticipants} total participants that started  ${
            options.laterthan ? options.laterthan : "all"
          }" for ${options.numtreatments} treatments...`
        )
      );
      var monitorState = MonitorStateType.monitorPaused;
      console.log(chalk.yellow("Press Enter to start monitoring."));
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      let inProgressMax = Math.floor(totalParticipants / 10);
      let pendingPauseMonitor = false;
      process.stdin.on("keypress", (str, key) => {
        if (key.ctrl && key.name === "c") {
          console.log("monitor ending.");
          process.exit(); // eslint-disable-line no-process-exit
        } else if (key.name === "return") {
          switch (monitorState) {
            case MonitorStateType.monitorPaused:
              monitorState = MonitorStateType.fetchingData;
              break;
            case MonitorStateType.fetchingData:
            case MonitorStateType.refreshingScreen:
              pendingPauseMonitor = true;
              break;
          }
        } else if (key.name === "up") {
          inProgressMax = Math.min(
            inProgressMax + Math.floor(totalParticipants / 10),
            totalParticipants
          );
        } else if (key.name === "down") {
          inProgressMax = Math.max(
            inProgressMax - Math.floor(totalParticipants / 10),
            totalParticipants / 10
          );
        }
      });
      let stats = createStat(options.numtreatments);
      let inFetchingData = false;
      let inRefreshingScreen = false;
      let nIntervId = setInterval(() => {
        try {
          switch (monitorState) {
            case MonitorStateType.monitorPaused:
              break;
            case MonitorStateType.fetchingData:
              if (inFetchingData) break;
              inFetchingData = true;
              listFiles().then((response) => {
                const files = response.Contents.filter((file) => {
                  if (
                    isCSVExt(file.Key) &&
                    (!options.laterthan ||
                      (options.laterthan &&
                        DateTime.fromJSDate(file.LastModified) >=
                          options.laterthan))
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                });
                let filesDownloaded = 0;
                if (files.length === 0) {
                  monitorState = MonitorStateType.refreshingScreen;
                  inFetchingData = false;
                } else {
                  files.forEach((file, index) => {
                    downloadFile(
                      file /*, (error) => {
                    //console.log(chalk.red(error));
                  }*/
                    ).then((data) => {
                      filesDownloaded++;
                      const CSVData = parseCSV(data)[0];
                      if (CSVData.treatment_id > options.numtreatments) {
                        console.log(
                          `file ${file.Key} has treatment_id of ${CSVData.teratment_id} which is greater than ${options.numtreatments} exiting.`
                        );
                        process.exit(); // eslint-disable-line no-process-exit
                      }
                      stats = updateStats(CSVData);
                      if (filesDownloaded === files.length) {
                        monitorState = MonitorStateType.refreshingScreen;
                        inFetchingData = false;
                      }
                    });
                  });
                }
              });
              break;
            case MonitorStateType.refreshingScreen:
              if (inRefreshingScreen) break;
              inRefreshingScreen = true;
              clear();
              if (pendingPauseMonitor) {
                monitorState = MonitorStateType.monitorPaused;
                pendingPauseMonitor = false;
              }
              drawStatus(
                totalParticipants,
                stats,
                monitorState != MonitorStateType.monitorPaused,
                inProgressMax,
                options.numtreatments
              ).output();
              inRefreshingScreen = false;
              stats = clearStats();
              if (monitorState != MonitorStateType.monitorPaused) {
                monitorState = MonitorStateType.fetchingData;
              }
              break;
          }
        } catch (err) {
          console.log(chalk.red(err));
          throw err;
        }
      }, 1000);
    } catch (err) {
      console.log(chalk.red(err));
      throw err;
    }
  });

const parseFileToObj = (file) => {
  let data;
  if (isJSONExt(file)) {
    data = fs.readJSONSync(file);
  }
  if (isCSVExt(file)) {
    const fileData = loadFile(file);
    data = parseCSV(fileData);
  }
  return data;
};

const commitBatchSync = async () => {
  await commitBatch();
};

const ImportCollextionTypes = {
  experiments: "experiments",
  questions: "questions",
  visualizations: "visualizations",
  treatments: "treatments",
  treatmentQuestionVisualizations: "treatmentQuestionVisualizations",
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
    case ImportCollextionTypes.visualizations:
      return typeVisObj;
    case ImportCollextionTypes.treatmentQuestionVisualizations:
      return typeTreatmentQuestionObj;
  }
};

program
  .command("import")
  .description(
    "Imports data from csv or json format into the firestore database."
  )
  .option("-s, --src <path>", "Source file path", validatePath)
  .option(
    "-c, --collection <path>",
    "Collection path in database",
    validateImportCollextionType
  )
  .option("-i, --id [id]", "Optional field to use for document ID")
  .action((args, options) => {
    try {
      const colPath = args.collection;
      const file = args.src;
      initAdminFirestoreDB();
      initBatch(colPath);
      const data = parseFileToObj(file);
      const typeFieldsFn = typeFieldsFunction(colPath);
      for (const item of data) {
        const typedItem = typeFieldsFn(item);
        setBatchItem(args.id, typedItem);
      }
      commitBatchSync();
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
    "Collection and field paths to link."
  )
  .action((args, options) => {
    try {
      const fields = args.fields;
      const links = parseLinkText(fields);
      initAdminFirestoreDB();
      linkDocs(
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

const deletePath = async (path) => {
  await deleteDocs(path);
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
    const colPath = args.collection;
    try {
      initAdminFirestoreDB();
      deletePath(colPath);
      console.log("Firestore delete collection was successfull!");
    } catch (err) {
      console.log(chalk.red(`Delete failed for ${colPath}!`), err);
      throw err;
    }
  });

try {
  program.parse();
} catch (err) {
  process.exit(1);
}
