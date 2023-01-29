#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Configstore from "configstore";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { csvParse } from "d3";
import csv from "to-csv";
import { DateTime } from "luxon";

import { askS3BucketInfo } from "./src/inquier.js";
import { init, downloadFiles } from "./src/S3.js";

export const AMAZON_S3_BUCKET_KEY = "amazonS3Bucket";
export const AMAZON_REGION__KEY = "amazonRegion";
export const AMAZON_ACCESS_KEY_ID = "amazonAccessKeyId";
export const AMAZON_SECRET_ACCESS_KEY = "amazonSecretAccessKey";

const createMergeFile = (filename, mergedData) => {
  if (mergedData && mergedData.length > 0) {
    console.log(`...creating merged file ${filename}...`);
    const CSV = csv(mergedData);
    fs.writeFileSync(filename, CSV);
  } else {
    console.log(`...no data for merged file ${filename}...`);
  }
};

const createCSVFileFromData = (propertyName, pathroot, answers) => {
  if (answers[propertyName]) {
    const filename = `${pathroot}${path.sep}${answers[propertyName].filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers[propertyName].data);
    console.log(`...file written.`);
    return answers[propertyName].data;
  } else {
    return null;
  }
};

const createCSVFromJSONFile = (filename, callback) => {
  console.log(`...parsing file ${filename}`);
  const jsonString = fs.readFileSync(filename);
  const answers = JSON.parse(jsonString);
  const pathroot = path.dirname(filename);
  callback(
    "surveyAnswers",
    createCSVFileFromData("surveyAnswers", pathroot, answers)
  );
  callback(
    "answerTimestamps",
    createCSVFileFromData("answerTimestamps", pathroot, answers)
  );
  callback(
    "financialLitSurvey",
    createCSVFileFromData("financialLitSurvey", pathroot, answers)
  );
  callback(
    "purposeSurvey",
    createCSVFileFromData("purposeSurvey", pathroot, answers)
  );
  callback(
    "demographics",
    createCSVFileFromData("demographics", pathroot, answers)
  );
  callback("legal", createCSVFileFromData("legal", pathroot, answers));
  callback("feedback", createCSVFileFromData("feedback", pathroot, answers));
  callback(
    "debriefTimestamps",
    createCSVFileFromData("debriefTimestamps", pathroot, answers)
  );
};

clear();

console.log(
  chalk.yellow(figlet.textSync("Discounters", { horizontalLayout: "full" }))
);

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
        const mergedData = new Map();

        const mergeCallback = (propertyName, CSVData) => {
          console.log(`...merging ${propertyName}`);
          if (CSVData) {
            const parsedCSV = csvParse(CSVData);
            if (mergedData.has(propertyName)) {
              mergedData.set(
                propertyName,
                mergedData.get(propertyName).concat(parsedCSV)
              );
            } else {
              mergedData.set(propertyName, parsedCSV);
            }
            console.log(`...data merged`);
          } else {
            console.log(`...no data to merge`);
          }
        };

        if (options.filename) {
          console.log(`...splitting filename "${source}"`);
          createCSVFromJSONFile(source, createCSVFromJSONFile);
        } else if (options.directory) {
          console.log(`...splitting files in directory "${source}"`);
          const files = fs.readdirSync(source).filter((file) => {
            return path.extname(file).toLowerCase() === ".json";
          });
          for (const file of files) {
            createCSVFromJSONFile(source + path.sep + file, mergeCallback);
          }

          var mergeFilename = `${source}${path.sep}answers-merged.csv`;
          createMergeFile(mergeFilename, mergedData.get("surveyAnswers"));

          mergeFilename = `${source}${path.sep}answers-timestamps-merged.csv`;
          createMergeFile(mergeFilename, mergedData.get("answerTimestamps"));

          mergeFilename = `${source}${path.sep}financial-lit-survey-merged.csv`;
          createMergeFile(mergeFilename, mergedData.get("financialLitSurvey"));

          mergeFilename = `${source}${path.sep}purpose-survey-merged.csv`;
          createMergeFile(mergeFilename, mergedData.get("purposeSurvey"));

          mergeFilename = `${source}${path.sep}demographics-merged.csv`;
          createMergeFile(mergeFilename, mergedData.get("demographics"));

          mergeFilename = `${source}${path.sep}legal-merged.csv`;
          createMergeFile(mergeFilename, mergedData.get("legal"));

          mergeFilename = `${source}${path.sep}feedback.csv`;
          createMergeFile(mergeFilename, mergedData.get("feedback"));

          mergeFilename = `${source}${path.sep}debrief-merged.csv`;
          createMergeFile(mergeFilename, mergedData.get("debriefTimestamps"));
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
        downloadFiles(source + path.sep, laterThanDate);
      } catch (err) {
        console.log(err);
        return;
      }
    });
  program.parse();
};

run();
