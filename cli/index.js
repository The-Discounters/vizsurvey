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

import { askS3BucketInfo } from "./src/inquier.js";

export const AMAZON_S3_BUCKET_KEY = "amazonS3Bucket";
export const AMAZON_REGION__KEY = "amazonRegion";
export const AMAZON_ACCESS_KEY_ID = "amazonAccessKeyId";
export const AMAZON_SECRET_ACCESS_KEY = "amazonSecretAccessKey";

const createMergeFile = (filename) => {};

const createCSVFromJSONFile = (filename, callback) => {
  console.log(`...parsing file ${filename}`);
  const jsonString = fs.readFileSync(filename);
  const answers = JSON.parse(jsonString);
  const pathroot = path.dirname(filename);
  if (answers.surveyAnswers) {
    const filename = `${pathroot}${path.sep}${answers.surveyAnswers.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.surveyAnswers.data);
    callback(filename, answers.surveyAnswers.data);
    console.log(`...file written.`);
  }
  if (answers.answerTimestamps) {
    const filename = `${pathroot}${path.sep}${answers.answerTimestamps.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.answerTimestamps.data);
    callback(filename, answers.answerTimestamps.data);
    console.log(`...file written.`);
  }
  if (answers.discountLitSurvey) {
    const filename = `${pathroot}${path.sep}${answers.discountLitSurvey.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.discountLitSurvey.data);
    callback(filename, answers.discountLitSurvey.data);
    console.log(`...file written.`);
  }
  if (answers.financialLitSurvey) {
    const filename = `${pathroot}${path.sep}${answers.financialLitSurvey.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.financialLitSurvey.data);
    callback(filename, answers.financialLitSurvey.data);
    console.log(`...file written.`);
  }
  if (answers.purposeSurvey) {
    const filename = `${pathroot}${path.sep}${answers.purposeSurvey.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.purposeSurvey.data);
    callback(filename, answers.purposeSurvey.data);
    console.log(`...file written.`);
  }
  if (answers.demographics) {
    const filename = `${pathroot}${path.sep}${answers.demographics.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.demographics.data);
    callback(filename, answers.demographics.data);
    console.log(`...file written.`);
  }
  if (answers.legal) {
    const filename = `${pathroot}${path.sep}${answers.legal.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.legal.data);
    callback(filename, answers.legal.data);
    console.log(`...file written.`);
  }
  if (answers.feedback) {
    const filename = `${pathroot}${path.sep}${answers.feedback.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.feedback.data);
    callback(filename, answers.feedback.data);
    console.log(`...file written.`);
  }
  if (answers.debriefTimestamps) {
    const filename = `${pathroot}${path.sep}${answers.debriefTimestamps.filename}`;
    console.log(`...writing ${filename} ...`);
    fs.writeFileSync(filename, answers.debriefTimestamps.data);
    callback(filename, answers.debriefTimestamps.data);
    console.log(`...file written.`);
  }
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
      "Splits out the CSV files that are in the JSON file if a single file is passed with -f or all JSON files in the directory if a directory is passed with -d.  The CSV files will be writen to the same folder as the JSON file."
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

        if (options.filename) {
          console.log(`...splitting filename "${source}"`);
          createCSVFromJSONFile(source);
        } else if (options.directory) {
          console.log(`...splitting files in directory "${source}"`);
          const files = fs.readdirSync(source).filter((file) => {
            return path.extname(file).toLowerCase() === ".json";
          });
          for (const file of files) {
            createCSVFromJSONFile(source + path.sep + file);
          }

          var mergeFilename = `${pathroot}${path.sep}answers-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          mergeFilename = `${pathroot}${path.sep}answers-timestamps-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          mergeFilename = `${pathroot}${path.sep}financial-lit-survey-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          mergeFilename = `${pathroot}${path.sep}discount-lit-survey-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          mergeFilename = `${pathroot}${path.sep}legal-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          mergeFilename = `${pathroot}${path.sep}demographics-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          mergeFilename = `${pathroot}${path.sep}purpose-survey-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          mergeFilename = `${pathroot}${path.sep}debrief-merged.csv`;
          console.log(`...creating merged file ${mergeFilename}...`);
          createMergeFile(mergeFilename);
          const mergeFilename = `${pathroot}${path.sep}feedback-merged.csv`;
          console.log(`...concatenating ${filename} to ${mergeFilename}...`);
          catToMergeFile(`${filename}`, mergeFilename);
        }
      } catch (err) {
        console.log(err);
        return;
      }
    });
  program.parse();
};

run();
