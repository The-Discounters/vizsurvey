#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Configstore from "configstore";
import { Command } from "commander";
import fs from "fs";
import { DateTime } from "luxon";
import {
  parseCSV,
  parseJSON,
  convertToCSV,
} from "../src/features/parserUtil.js";
import {
  convertKeysToUnderscore,
  convertAnswersAryToObj,
} from "../src/features/ObjectUtil.js";
import {
  participantUniqueKey,
  CSVDataFilenameFromKey,
} from "../src/features/QuestionSliceUtil.js";
import {
  writeFile,
  loadFile,
  fullPath,
  appendSepToPath,
  isCSVExt,
  isJSONExt,
} from "./src/files.js";
import { askS3BucketInfo } from "./src/inquier.js";
import { init, downloadFiles } from "./src/S3.js";
import { MergedData } from "./src/MergedData.js";

export const AMAZON_S3_BUCKET_KEY = "amazonS3Bucket";
export const AMAZON_REGION__KEY = "amazonRegion";
export const AMAZON_ACCESS_KEY_ID = "amazonAccessKeyId";
export const AMAZON_SECRET_ACCESS_KEY = "amazonSecretAccessKey";

/// TODO this is a total hack.  I can't get the import to work when it points to the src folder in the main code base.
const DataType = {
  Answers: { key: "surveyAnswers", filenamePrefix: "answers" },
  Timestamps: {
    key: "answerTimestamps",
    filenamePrefix: "answer-timestamps",
  },
  SurveyExperience: {
    key: "surveyExperienceSurvey",
    filenamePrefix: "survey-experience-survey",
  },
  FinancialSurvey: {
    key: "financialLitSurvey",
    filenamePrefix: "financial-lit-survey",
  },
  PurposeSurvey: {
    key: "purposeSurvey",
    filenamePrefix: "purpose-survey",
  },
  Demographic: {
    key: "demographics",
    filenamePrefix: "demographics",
  },
  Legal: { key: "legal", filenamePrefix: "legal" },
  Feedback: { key: "feedback", filenamePrefix: "feedback.csv" },
  DebriefTimestamps: {
    key: "debriefTimestamps",
    filenamePrefix: "debrief",
  },
};

Object.freeze(DataType);

const parseKeyFromFilename = (filename) => {
  return filename.substring(0, filename.indexOf("-"));
};

clear();

console.log(
  chalk.yellow(figlet.textSync("Discounters", { horizontalLayout: "full" }))
);

const mergeCSVData = (CSVData, mergedData) => {
  console.log(`...merging data ${CSVData.length} rows`);
  if (CSVData) {
    mergedData.concat(CSVData);
    console.log(`...data merged`);
  } else {
    console.log(`...no data to merge`);
  }
};

const run = async () => {
  const createMergeFile = (filename, mergedData) => {
    if (mergedData && mergedData.length > 0) {
      console.log(`...creating merged file ${filename}`);
      writeFile(filename, convertToCSV(mergedData));
    } else {
      console.log(`...no data for merged file ${filename}...`);
    }
  };

  const conf = new Configstore("discounters");
  if (!conf.has(AMAZON_S3_BUCKET_KEY)) {
    const settings = await askS3BucketInfo();
    conf.set(settings);
  }

  init(conf);

  const program = new Command();
  program
    .name("discounters")
    .description(
      "CLI for processing files created from vizsurvey capturing participants survey answers."
    )
    .version("1.0.0");

  program
    .command("download")
    .description("Downloads files from the S3 bucket.")
    .argument("<directory>", "directory to store the files in.")
    .option(
      "-l, --laterthan <date>",
      "the date to filter out files that are are equal to or later than"
    )
    .action((source, options) => {
      console.log(`Downloading files from S3 bucket...`);
      try {
        const laterThanDate = options.laterthan
          ? DateTime.fromFormat(options.laterthan, "M/d/yyyy")
          : null;
        downloadFiles(appendSepToPath(source), laterThanDate);
      } catch (err) {
        console.log(chalk.red(err));
        return;
      }
    });

  program
    .command("split")
    .description(
      "Splits out the CSV files that are in the JSON file if a single file is passed or all JSON files in the directory if a directory is passed.  The CSV files will be writen to the same folder as the JSON file."
    )
    .argument("<filename or directory>", "filename or directory to split")
    .option("-f, --filename", "the single json filename to split")
    .option(
      "-d, --directory",
      "the directory path containing the json files to split."
    )
    .action((source, options) => {
      const surveyData = new MergedData();
      try {
        console.log(
          `splitting "${
            options.filename ? "" : "files in directory "
          }"${source}`
        );
        const files = options.filename
          ? options.filename
          : fs.readdirSync(source).filter((file) => {
              return isJSONExt(file);
            });
        for (const file of files) {
          const absolutePath = fullPath(source, file);
          const JSONStr = loadFile(absolutePath);
          console.log(`parsing file ${absolutePath}`);
          const JSONData = parseJSON(JSONStr);
          for (const property in JSONData) {
            // store the data as a merged object by participantId-studyId-sessionId
            const CSVData = parseCSV(JSONData[property].data);
            surveyData.addEntry(CSVData);
          }
        }
        surveyData.callbackOnEntries((value, key) => {
          const filename = CSVDataFilenameFromKey(key);
          console.log(`...writing csv file ${filename}`);
          const underscoreObj = convertKeysToUnderscore(value);
          writeFile(fullPath(source, filename), convertToCSV([underscoreObj]));
        });
      } catch (err) {
        console.log(chalk.red(err));
        return;
      }
    });

  program
    .command("merge")
    .description(
      "Creates a merge file from CSV files in the directory passed as an argument.  The CSV files will be writen to the same folder as the CSV files."
    )
    .argument("<directory>", "directory containg csv files to merge")
    .action((source, options) => {
      // TODO implement -c option
      console.log(`Scanning directory ${source} for merging...`);
      try {
        const mergedData = new Array();
        console.log(`merging ${source}`);
        const files = options.filename
          ? options.filename
          : fs.readdirSync(source).filter((file) => {
              return isCSVExt(file);
            });
        for (const file of files) {
          console.log(`considering merging file ${file}`);
          mergeCSVData(parseCSV(loadFile(fullPath(source, file))), mergedData);
        }
        for (const key in DataType) {
          createMergeFile(
            `${fullPath(source, DataType[key].filenamePrefix)}-merged.csv`,
            mergedData
          );
        }
      } catch (err) {
        console.log(chalk.red(err));
        return;
      }
    });

  program
    .command("monitor")
    .description(
      "Monitors the status of an experiment running by downloading the S3 files and reporting summary statistics in real time to the screen."
    )
    .argument(
      "<date>",
      "the date to filter out files that are are equal to or later than"
    )
    .action((source, options) => {
      // TODO implement monitoring
      console.log(
        `Monitoring experiment for files with a timestamp equal to or greater than ${source}" ...`
      );
      // download the answer-timestamps- files
      // create the answer-timestamps- merge file
      // count the number of completed partcipants
      // count the number of inprogress participants - this number shoul bounce up and go to zero and will get stuck at what is incomplete
      // download the demographic files
      // create the demographic merge file
      // count the number of gbr and usa and show it
      // add an option to show feedback as a log stream by downloading the feedback files, parsing them and showing the feedback.
      // download the survey experience files and create the merge file
      // show the toatal summary by each of the questions.
    });

  program.parse();
};

run();
