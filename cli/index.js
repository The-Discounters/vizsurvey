#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Configstore from "configstore";
import { Command } from "commander";
import fs from "fs";
import { DateTime } from "luxon";
import { parseCSV, parseJSON } from "./src/parser.js";
import {
  writeFile,
  loadFile,
  fullPath,
  appendSepToPath,
  isCSVExt,
  isJSONExt,
  createCSVStringFromArray,
} from "./src/files.js";
import { askS3BucketInfo } from "./src/inquier.js";
import { init, downloadFiles } from "./src/S3.js";
//import { DataType, dataTypeFromFilename } from "../src/features/DataType.js";

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

const dataTypeFromFilename = (filename) => {
  for (const type in DataType) {
    if (filename.includes(DataType[type].filenamePrefix)) return type;
  }
};

clear();

console.log(
  chalk.yellow(figlet.textSync("Discounters", { horizontalLayout: "full" }))
);

const mergeCSVData = (propertyName, CSVData, mergedData) => {
  console.log(
    `...merging ${CSVData.length} ros for ${propertyName} type of data`
  );
  if (CSVData) {
    if (mergedData.has(propertyName)) {
      mergedData.set(
        propertyName,
        mergedData.get(propertyName).concat(CSVData)
      );
    } else {
      mergedData.set(propertyName, CSVData);
    }
    console.log(`...data merged`);
  } else {
    console.log(`...no data to merge`);
  }
};

const run = async () => {
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

  const createMergeFile = (filename, mergedData) => {
    if (mergedData && mergedData.length > 0) {
      console.log(`...creating merged file ${filename}`);
      writeFile(filename, createCSVStringFromArray(mergedData));
    } else {
      console.log(`...no data for merged file ${filename}...`);
    }
  };

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
      console.log(`Loading file "${source}" for splitting...`);
      try {
        console.log(
          `...splitting "${
            options.filename ? "" : "files in directory "
          }"${source}`
        );
        const files = options.filename
          ? options.filename
          : fs.readdirSync(source).filter((file) => {
              return isJSONExt(file);
            });

        for (const file of files) {
          console.log(`...parsing file ${file}`);
          const answers = parseJSON(loadFile(fullPath(source, file)));
          for (const JSONKey in DataType) {
            if (answers[DataType[JSONKey].key]) {
              writeFile(
                fullPath(source, answers[DataType[JSONKey].key].filename),
                answers[DataType[JSONKey].key].data
              );
            }
          }
        }
      } catch (err) {
        console.log(err);
        return;
      }
    });

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
        console.log(err);
        return;
      }
    });

  program
    .command("merge")
    .description(
      "Creates a merge file from CSV files in the directory passed as an argument.  The CSV files will be writen to the same folder as the CSV files."
    )
    .argument("<directory>", "directory containg csv files to merge")
    .option("-c, --columns", "the answer rows will be converted to columns.")
    .action((source, options) => {
      // TODO implement -c option
      console.log(`Scanning directory ${source} for merging...`);
      try {
        const mergedData = new Map();
        console.log(`merging ${source}`);
        const files = options.filename
          ? options.filename
          : fs.readdirSync(source).filter((file) => {
              return isCSVExt(file);
            });
        for (const file of files) {
          console.log(`considering merging file ${file}`);
          const type = dataTypeFromFilename(file);
          if (type) {
            console.log(
              `...detected file of type ${type}, merging data from file`
            );
            mergeCSVData(
              DataType[type].key,
              parseCSV(loadFile(fullPath(source, file))),
              mergedData
            );
          } else {
            console.log(
              `...detected unknown file type for file ${file} so skipping.`
            );
          }
        }
        for (const key in DataType) {
          createMergeFile(
            `${fullPath(source, DataType[key].filenamePrefix)}-merged.csv`,
            mergedData.get(DataType[key].key)
          );
        }
      } catch (err) {
        console.log(err);
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
