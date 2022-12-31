#!/usr/bin/env node
/* eslint-disable no-unused-vars */
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Configstore from "configstore";
import { Command } from "commander";
import { readFileSync, writeFileSync } from "fs";
import { dirname, sep } from "path";

import { getCurrentDirectoryBase, directoryExists } from "./src/files.js";
import {
  AMAZON_S3_BUCKET_KEY,
  AMAZON_REGION__KEY,
  AMAZON_ACCESS_KEY_ID,
  AMAZON_SECRET_ACCESS_KEY,
  askS3BucketInfo,
} from "./src/inquier.js";

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
      "Splits out the CSV files that are in the JSON file.  The CSV files will be writen to the same folder as the JSON file."
    )
    .argument("<filename>", "filename to split")
    .action((filename, options) => {
      console.log(`Loading file ${filename} for slitting...`);
      try {
        // Note that jsonString will be a <Buffer> since we did not specify an
        // encoding type for the file. But it'll still work because JSON.parse() will
        // use <Buffer>.toString().
        const jsonString = readFileSync(filename);
        const answers = JSON.parse(jsonString);
        const pathroot = dirname(filename);
        if (answers.surveyAnswers) {
          const filename = `${pathroot}${sep}${answers.surveyAnswers.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.surveyAnswers.data);
          console.log(`File written.`);
        }
        if (answers.answerTimestamps) {
          const filename = `${pathroot}${sep}${answers.answerTimestamps.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.answerTimestamps.data);
          console.log(`File written.`);
        }
        if (answers.discountLitSurvey) {
          const filename = `${pathroot}${sep}${answers.discountLitSurvey.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.discountLitSurvey.data);
          console.log(`File written.`);
        }
        if (answers.financialLitSurvey) {
          const filename = `${pathroot}${sep}${answers.financialLitSurvey.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.financialLitSurvey.data);
          console.log(`File written.`);
        }
        if (answers.purposeSurvey) {
          const filename = `${pathroot}${sep}${answers.purposeSurvey.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.purposeSurvey.data);
          console.log(`File written.`);
        }
        if (answers.demographics) {
          const filename = `${pathroot}${sep}${answers.demographics.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.demographics.data);
          console.log(`File written.`);
        }
        if (answers.legal) {
          const filename = `${pathroot}${sep}${answers.legal.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.legal.data);
          console.log(`File written.`);
        }
        if (answers.feedback) {
          const filename = `${pathroot}${sep}${answers.feedback.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.feedback.data);
          console.log(`File written.`);
        }
        if (answers.debriefTimestamps) {
          const filename = `${pathroot}${sep}${answers.debriefTimestamps.filename}`;
          console.log(`Writing ${filename} ...`);
          writeFileSync(filename, answers.debriefTimestamps.data);
          console.log(`File written.`);
        }
      } catch (err) {
        console.log(err);
        return;
      }
    });
  program.parse();
};

run();
// if (directoryExists(".git")) {
//   console.log(chalk.red("Already a Git repository!"));
//   process.exit();
// }
