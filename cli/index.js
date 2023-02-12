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
  writeFile,
  loadFile,
  fullPath,
  appendSepToPath,
  isCSVExt,
  isJSONExt,
} from "./src/files.js";
import { askS3BucketInfo } from "./src/inquier.js";
import { init, downloadFiles } from "./src/S3.js";
import {
  convertKeysToUnderscore,
  convertAnswersAryToObj,
} from "../src/features/ObjectUtil.js";
import {
  participantUniqueKey,
  CSVDataFilenameFromKey,
} from "../src/features/QuestionSliceUtil.js";

export const AMAZON_S3_BUCKET_KEY = "amazonS3Bucket";
export const AMAZON_REGION__KEY = "amazonRegion";
export const AMAZON_ACCESS_KEY_ID = "amazonAccessKeyId";
export const AMAZON_SECRET_ACCESS_KEY = "amazonSecretAccessKey";

const BLANK_STATE_JSON = {
  participantId: "",
  sessionId: "",
  studyId: "",
  treatmentId: "",
  consentShownTimestamp: "",
  consentCompletedTimestamp: "",
  consentTimeSec: "",
  demographicShownTimestamp: "",
  demographicCompletedTimestamp: "",
  demographicTimeSec: "",
  introductionShownTimestamp: "",
  introductionCompletedTimestamp: "",
  introductionTimeSec: "",
  instructionsShownTimestamp: "",
  instructionsCompletedTimestamp: "",
  instructionsTimeSec: "",
  attentionCheckShownTimestamp: "",
  attentionCheckCompletedTimestamp: "",
  attentionCheckTimeSec: "",
  experienceSurveyQuestionsShownTimestamp: "",
  experienceSurveyQuestionsCompletedTimestamp: "",
  experienceSurveyTimeSec: "",
  financialLitSurveyQuestionsShownTimestamp: "",
  financialLitSurveyQuestionsCompletedTimestamp: "",
  financialLitSurveyTimeSec: "",
  purposeSurveyQuestionsShownTimestamp: "",
  purposeSurveyQuestionsCompletedTimestamp: "",
  purposeSurveyTimeSec: "",
  debriefShownTimestamp: "",
  debriefCompletedTimestamp: "",
  debriefTimeSec: "",
  consentChecked: "",
  countryOfResidence: "",
  vizFamiliarity: "",
  age: "",
  gender: "",
  selfDescribeGender: "",
  profession: "",
  userAgent: "",
  position_1: "",
  viewType_1: "",
  interaction_1: "",
  variableAmount_1: "",
  amountEarlier_1: "",
  timeEarlier_1: "",
  dateEarlier_1: "",
  amountLater_1: "",
  timeLater_1: "",
  dateLater_1: "",
  maxAmount_1: "",
  maxTime_1: "",
  verticalPixels_1: "",
  horizontalPixels_1: "",
  leftMarginWidthIn_1: "",
  bottomMarginHeightIn_1: "",
  graphWidthIn_1: "",
  graphHeightIn_1: "",
  widthIn_1: "",
  heightIn_1: "",
  showMinorTicks_1: "",
  choice_1: "",
  dragAmount_1: "",
  shownTimestamp_1: "",
  choiceTimestamp_1: "",
  highup_1: "",
  lowdown_1: "",
  choiceTimeSec_1: "",
  position_2: "",
  viewType_2: "",
  interaction_2: "",
  variableAmount_2: "",
  amountEarlier_2: "",
  timeEarlier_2: "",
  dateEarlier_2: "",
  amountLater_2: "",
  timeLater_2: "",
  dateLater_2: "",
  maxAmount_2: "",
  maxTime_2: "",
  verticalPixels_2: "",
  horizontalPixels_2: "",
  leftMarginWidthIn_2: "",
  bottomMarginHeightIn_2: "",
  graphWidthIn_2: "",
  graphHeightIn_2: "",
  widthIn_2: "",
  heightIn_2: "",
  showMinorTicks_2: "",
  choice_2: "",
  dragAmount_2: "",
  shownTimestamp_2: "",
  choiceTimestamp_2: "",
  highup_2: "",
  lowdown_2: "",
  choiceTimeSec_2: "",
  position_3: "",
  viewType_3: "",
  interaction_3: "",
  variableAmount_3: "",
  amountEarlier_3: "",
  timeEarlier_3: "",
  dateEarlier_3: "",
  amountLater_3: "",
  timeLater_3: "",
  dateLater_3: "",
  maxAmount_3: "",
  maxTime_3: "",
  verticalPixels_3: "",
  horizontalPixels_3: "",
  leftMarginWidthIn_3: "",
  bottomMarginHeightIn_3: "",
  graphWidthIn_3: "",
  graphHeightIn_3: "",
  widthIn_3: "",
  heightIn_3: "",
  showMinorTicks_3: "",
  choice_3: "",
  dragAmount_3: "",
  shownTimestamp_3: "",
  choiceTimestamp_3: "",
  highup_3: "",
  lowdown_3: "",
  choiceTimeSec_3: "",
  position_4: "",
  viewType_4: "",
  interaction_4: "",
  variableAmount_4: "",
  amountEarlier_4: "",
  timeEarlier_4: "",
  dateEarlier_4: "",
  amountLater_4: "",
  timeLater_4: "",
  dateLater_4: "",
  maxAmount_4: "",
  maxTime_4: "",
  verticalPixels_4: "",
  horizontalPixels_4: "",
  leftMarginWidthIn_4: "",
  bottomMarginHeightIn_4: "",
  graphWidthIn_4: "",
  graphHeightIn_4: "",
  widthIn_4: "",
  heightIn_4: "",
  showMinorTicks_4: "",
  choice_4: "",
  dragAmount_4: "",
  shownTimestamp_4: "",
  choiceTimestamp_4: "",
  highup_4: "",
  lowdown_4: "",
  choiceTimeSec_4: "",
  position_5: "",
  viewType_5: "",
  interaction_5: "",
  variableAmount_5: "",
  amountEarlier_5: "",
  timeEarlier_5: "",
  dateEarlier_5: "",
  amountLater_5: "",
  timeLater_5: "",
  dateLater_5: "",
  maxAmount_5: "",
  maxTime_5: "",
  verticalPixels_5: "",
  horizontalPixels_5: "",
  leftMarginWidthIn_5: "",
  bottomMarginHeightIn_5: "",
  graphWidthIn_5: "",
  graphHeightIn_5: "",
  widthIn_5: "",
  heightIn_5: "",
  showMinorTicks_5: "",
  choice_5: "",
  dragAmount_5: "",
  shownTimestamp_5: "",
  choiceTimestamp_5: "",
  highup_5: "",
  lowdown_5: "",
  choiceTimeSec_5: "",
  position_6: "",
  viewType_6: "",
  interaction_6: "",
  variableAmount_6: "",
  amountEarlier_6: "",
  timeEarlier_6: "",
  dateEarlier_6: "",
  amountLater_6: "",
  timeLater_6: "",
  dateLater_6: "",
  maxAmount_6: "",
  maxTime_6: "",
  verticalPixels_6: "",
  horizontalPixels_6: "",
  leftMarginWidthIn_6: "",
  bottomMarginHeightIn_6: "",
  graphWidthIn_6: "",
  graphHeightIn_6: "",
  widthIn_6: "",
  heightIn_6: "",
  showMinorTicks_6: "",
  choice_6: "",
  dragAmount_6: "",
  shownTimestamp_6: "",
  choiceTimestamp_6: "",
  highup_6: "",
  lowdown_6: "",
  choiceTimeSec_6: "",
  position_7: "",
  viewType_7: "",
  interaction_7: "",
  variableAmount_7: "",
  amountEarlier_7: "",
  timeEarlier_7: "",
  dateEarlier_7: "",
  amountLater_7: "",
  timeLater_7: "",
  dateLater_7: "",
  maxAmount_7: "",
  maxTime_7: "",
  verticalPixels_7: "",
  horizontalPixels_7: "",
  leftMarginWidthIn_7: "",
  bottomMarginHeightIn_7: "",
  graphWidthIn_7: "",
  graphHeightIn_7: "",
  widthIn_7: "",
  heightIn_7: "",
  showMinorTicks_7: "",
  choice_7: "",
  dragAmount_7: "",
  shownTimestamp_7: "",
  choiceTimestamp_7: "",
  highup_7: "",
  lowdown_7: "",
  choiceTimeSec_7: "",
  position_8: "",
  viewType_8: "",
  interaction_8: "",
  variableAmount_8: "",
  amountEarlier_8: "",
  timeEarlier_8: "",
  dateEarlier_8: "",
  amountLater_8: "",
  timeLater_8: "",
  dateLater_8: "",
  maxAmount_8: "",
  maxTime_8: "",
  verticalPixels_8: "",
  horizontalPixels_8: "",
  leftMarginWidthIn_8: "",
  bottomMarginHeightIn_8: "",
  graphWidthIn_8: "",
  graphHeightIn_8: "",
  widthIn_8: "",
  heightIn_8: "",
  showMinorTicks_8: "",
  choice_8: "",
  dragAmount_8: "",
  shownTimestamp_8: "",
  choiceTimestamp_8: "",
  highup_8: "",
  lowdown_8: "",
  choiceTimeSec_8: "",
  experience_survey_enjoy: "",
  experience_survey_clear: "",
  experience_survey_understand: "",
  experience_survey_present: "",
  experience_survey_imagine: "",
  experience_survey_easy: "",
  experience_survey_format: "",
  financial_lit_survey_numeracy: "",
  financial_lit_survey_inflation: "",
  financial_lit_survey_risk: "",
  purpose_survey_differnce: "",
  purpose_survey_better: "",
  purpose_survey_serve: "",
  purpose_survey_truly: "",
  purpose_survey_describe: "",
  purpose_survey_effort: "",
  feedback: "",
};

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

const mergeDataToObject = (key, CSVData, mergedData) => {
  console.log(`...merging data for key ${key}`);
  if (CSVData) {
    let existingData = mergedData.has(key)
      ? mergedData.get(key)
      : BLANK_STATE_JSON;
    if (CSVData.length === 1) {
      console.log("...merging single row file");
      mergedData.set(key, { ...existingData, ...CSVData });
    } else {
      console.log(
        "...detected answer data (multiple rows) so converting to single row"
      );
      mergedData.set(key, {
        ...existingData,
        // for the legacy files from the pilot study, convert the multiple answer rows to a single row
        ...convertAnswersAryToObj(CSVData),
      });
    }
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
        console.log(err);
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
      const surveyData = new Map();
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
          const fullFilePath = loadFile(fullPath(source, file));
          console.log(`parsing file ${fullFilePath}`);
          const JSONData = parseJSON(fullFilePath);
          for (const property in JSONData) {
            // store the data as a merged object by participantId-studyId-sessionId
            const CSVData = parseCSV(JSONData[property].data);
            const key = participantUniqueKey(CSVData[0]);
            mergeDataToObject(key, CSVData, surveyData);
          }
        }
        surveyData.forEach((value, key) => {
          const filename = CSVDataFilenameFromKey(key);
          console.log(`...writing csv file ${filename}`);
          const underscoreObj = convertKeysToUnderscore(value);
          writeFile(fullPath(source, filename), convertToCSV([underscoreObj]));
        });
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
