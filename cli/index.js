#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import Configstore from "configstore";
import { Command } from "commander";
import fs from "fs";
import { DateTime } from "luxon";
import clui from "clui";
import clc from "cli-color";
import { spawnSync, execSync } from "child_process";
import readline from "readline";
import { parseCSV, parseJSON, convertToCSV } from "./src/parserUtil.js";
import { convertKeysToUnderscore } from "./src/ObjectUtil.js";
import { CSVDataFilenameFromKey } from "./src/QuestionSliceUtil.js";
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

clear();

console.log(
  chalk.yellow(figlet.textSync("Discounters", { horizontalLayout: "full" }))
);

const mergeCSVData = (CSVData, mergedData) => {
  if (CSVData) {
    console.log(`...merging data ${CSVData.length} rows`);
    mergedData.push(CSVData[0]);
    console.log(`...data merged`);
  } else {
    console.log(`...no data to merge`);
  }
};

const run = async () => {
  const createMergeFile = (filename, mergedData) => {
    if (mergedData && mergedData.length > 0) {
      console.log(`...creating merged file ${filename}`);
      const CSVData = convertToCSV(mergedData);
      writeFile(filename, CSVData);
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
            console.log(`...merging data for property ${property}`);
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
          if (file === "data-merged.csv") {
            console.log(chalk.yellow(`...skipping file ${file}`));
          } else {
            mergeCSVData(
              parseCSV(loadFile(fullPath(source, file))),
              mergedData
            );
          }
        }
        createMergeFile(fullPath(source, "data-merged.csv"), mergedData);
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
      "<number participants>",
      "the total number of participants the experiment was ran for.  Used to update the percent progress bars"
    )
    .option(
      "-l, --laterthan <date>",
      "the date to filter out files that are are equal to or later than"
    )
    .action((source, options) => {
      const drawStatus = (
        surveysTotal,
        surveysComplete,
        surveysInProgress,
        countryUSA,
        countryOther,
        consentComplete,
        demographicsComplete,
        introductionComplete,
        instructionsComplete,
        surveyComplete,
        experienceComplete,
        financialComplete,
        purposeComplete,
        debriefComplete,
        feedback
      ) => {
        var outputBuffer = new clui.LineBuffer({
          x: 0,
          y: 0,
          width: "console",
          height: "console",
        });
        var title = new clui.Line(outputBuffer)
          .column("", 15, [clc.yellow])
          .column("Totals", 20, [clc.yellow])
          .fill()
          .store();
        var line = new clui.Line(outputBuffer)
          .column("Surveys Completed", 20, [clc.green])
          .column(
            clui.Gauge(
              surveysComplete,
              surveysTotal,
              20,
              surveysTotal,
              surveysComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Surveys In Progress", 20, [clc.green])
          .column(
            clui.Gauge(
              surveysInProgress,
              surveysTotal,
              20,
              surveysTotal,
              surveysInProgress
            ),
            30
          )
          .fill()
          .store();
        title = new clui.Line(outputBuffer)
          .column("", 15, [clc.yellow])
          .column("Breakdown By Country", 20, [clc.yellow])
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("USA", 20, [clc.green])
          .column(
            clui.Gauge(countryUSA, surveysTotal, 20, surveysTotal, countryUSA),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Non USA", 20, [clc.green])
          .column(
            clui.Gauge(countryOther, surveysTotal, 20, 1, countryOther),
            30
          )
          .fill()
          .store();
        title = new clui.Line(outputBuffer)
          .column("", 15, [clc.yellow])
          .column("Breakdown By Step", 20, [clc.yellow])
          .fill()
          .store();
        var header = new clui.Line(outputBuffer)
          .column("Step", 20, [clc.green])
          .column("Progress", 22, [clc.green])
          .column("Count", 5, [clc.green])
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Consent", 20, [clc.green])
          .column(
            clui.Gauge(
              consentComplete,
              surveysTotal,
              20,
              surveysTotal,
              consentComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Demographic", 20, [clc.green])
          .column(
            clui.Gauge(
              demographicsComplete,
              surveysTotal,
              20,
              surveysTotal,
              demographicsComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Introduction", 20, [clc.green])
          .column(
            clui.Gauge(
              introductionComplete,
              surveysTotal,
              20,
              surveysTotal,
              introductionComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Instruction", 20, [clc.green])
          .column(
            clui.Gauge(
              instructionsComplete,
              surveysTotal,
              20,
              surveysTotal,
              instructionsComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Survey", 20, [clc.green])
          .column(
            clui.Gauge(
              surveyComplete,
              surveysTotal,
              20,
              surveysTotal,
              surveyComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Experience Survey", 20, [clc.green])
          .column(
            clui.Gauge(
              experienceComplete,
              surveysTotal,
              20,
              surveysTotal,
              experienceComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Financial Survey", 20, [clc.green])
          .column(
            clui.Gauge(
              financialComplete,
              surveysTotal,
              20,
              surveysTotal,
              financialComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Purpose Survey", 20, [clc.green])
          .column(
            clui.Gauge(
              purposeComplete,
              surveysTotal,
              20,
              surveysTotal,
              purposeComplete
            ),
            30
          )
          .fill()
          .store();
        line = new clui.Line(outputBuffer)
          .column("Debrief Survey", 20, [clc.green])
          .column(
            clui.Gauge(
              debriefComplete,
              surveysTotal,
              20,
              surveysTotal,
              debriefComplete
            ),
            30
          )
          .fill()
          .store();
        var title = new clui.Line(outputBuffer)
          .column("", 15, [clc.yellow])
          .column("Feedback", 20, [clc.yellow])
          .fill()
          .store();
        feedback.forEach((e) =>
          new clui.Line(outputBuffer).column(e, 80, [clc.white]).fill().store()
        );
        new clui.Line(outputBuffer)
          .column("Ctrl + C to exit the monitor.", 40, [clc.red])
          .fill()
          .store();
        // write a for loop with the top 20 feedback comments
        return outputBuffer;
      };

      const getUpdatedStates = (laterThanDate) => {
        downloadFiles(appendSepToPath(source), laterThanDate);
      };

      try {
        const laterThanDate = options.laterthan
          ? DateTime.fromFormat(options.laterthan, "M/d/yyyy")
          : null;
        const totalParticipants = argument;
        console.log(
          `Monitoring experiment with ${totalParticipants} total participants that started  ${
            options.laterthan ? options.laterthan : "all"
          }" ...`
        );
        var quit = false;
        console.log(chalk.red("Press Enter to start monitoring."));
        var startMonitoring = false;
        var gaugeFactor = 1;
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on("keypress", (str, key) => {
          if (key.ctrl && key.name === "c") {
            console.log("monitor ending.");
            process.exit(); // eslint-disable-line no-process-exit
          } else if (key.name === "return") {
            startMonitoring = true;
            clear();
          } else if (key.name === "+") {
            gaugeFactor++;
          } else if (key.name === "-") {
            gaugeFactor--;
          }
        });
        let nIntervId = setInterval(() => {
          if (startMonitoring) {
            const stats = new Map();
            // get a list of the files with .csv created on or after date passed in.
            // update the count of participants to the file count.
            // open each file and calcualte the stats (# at each state, country of origin, )
            drawStatus(
              totalParticipants,
              25,
              5,
              25,
              0,
              10,
              5,
              8,
              12,
              18,
              15,
              12,
              11,
              10,
              ["comment 1", "comment 2", "comment 3"]
            ).output();
          }
        }, 1000);
      } catch (err) {
        console.log(chalk.red(err));
        return;
      }
      // while (1) {
      //   execSync("sleep 1");
      // }
    });

  program.parse();
};

run();
