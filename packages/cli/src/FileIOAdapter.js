import AWS from "aws-sdk";
import {
  stateFilename,
  setAllPropertiesEmpty,
  stateFormatFilename,
  convertKeysCamelCaseToUnderscore,
  CSVDataFilename,
  convertAnswersAryToObj,
} from "@the-discounters/types";
import { convertToCSV } from "@the-discounters/util";

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_REGION;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_accessKeyId,
  secretAccessKey: process.env.REACT_APP_secretAccessKey,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const uploadFileOffline = (name, data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, data: data }),
  };
  fetch("http://localhost:3001/test", requestOptions)
    .then((response) => response.json())
    .then((data) => console.log(data));
};

const uploadFile = (name, data) => {
  const params = {
    ACL: "private",
    Body: data,
    Bucket: S3_BUCKET,
    Key: name,
  };

  myBucket
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      console.log(Math.round((evt.loaded / evt.total) * 100));
    })
    .send((err) => {
      if (err) console.log(err);
    });
};

export const writeFile = async (filename, strData) => {
  if (process.env.REACT_APP_AWS_ENABLED) {
    console.log("AWS ENABLED");
    uploadFile(filename, strData);
  } else {
    console.log("AWS DISABLED");
    uploadFileOffline(filename, strData);
  }
};

/**
 * Converts array timestamp properties like
 * instructionsShownTimestamp: [{treatmentId: 1, value: <value1>},{treatmentId: 2, value: <value2>}]
 * to
 * {instructionsShownTimestamp_1: <value1>, instructionsShownTimestamp_2: >value2>}
 * TODO does this need to be exported?  How do I unit test without exporting.
 * @param {*} timestamps
 */
export const flattenTreatmentValueAry = (propertyName, timestamps) => {
  return timestamps.reduce((acc, cv) => {
    const key = `${propertyName}_${cv.treatmentId}`;
    acc[key] = cv.value;
    return acc;
  }, {});
};

export const flattenTimestampObj = (timestamps) => {
  let result = {
    consentShownTimestamp: timestamps.consentShownTimestamp,
    consentCompletedTimestamp: timestamps.consentCompletedTimestamp,
    consentTimeSec: timestamps.consentTimeSec,
    demographicShownTimestamp: timestamps.demographicShownTimestamp,
    demographicCompletedTimestamp: timestamps.demographicCompletedTimestamp,
    demographicTimeSec: timestamps.demographicTimeSec,
    instructionsShownTimestamp: timestamps.instructionsShownTimestamp,
    instructionsCompletedTimestamp: timestamps.instructionsCompletedTimestamp,
    instructionsTimeSec: timestamps.instructionsTimeSec,
    experienceSurveyQuestionsShownTimestamp:
      timestamps.experienceSurveyQuestionsShownTimestamp,
    experienceSurveyQuestionsCompletedTimestamp:
      timestamps.experienceSurveyQuestionsCompletedTimestamp,
    experienceSurveyTimeSec: timestamps.experienceSurveyTimeSec,
    financialLitSurveyQuestionsShownTimestamp:
      timestamps.financialLitSurveyQuestionsShownTimestamp,
    financialLitSurveyQuestionsCompletedTimestamp:
      timestamps.financialLitSurveyQuestionsCompletedTimestamp,
    financialLitSurveyTimeSec: timestamps.financialLitSurveyTimeSec,
    purposeSurveyQuestionsShownTimestamp:
      timestamps.purposeSurveyQuestionsShownTimestamp,
    purposeSurveyQuestionsCompletedTimestamp:
      timestamps.purposeSurveyQuestionsCompletedTimestamp,
    purposeSurveyTimeSec: timestamps.purposeSurveyTimeSec,
    debriefShownTimestamp: timestamps.debriefShownTimestamp,
    debriefCompletedTimestamp: timestamps.debriefCompletedTimestamp,
    debriefTimeSec: timestamps.debriefTimeSec,
  };
  result = {
    ...result,
    ...flattenTreatmentValueAry(
      "MCLInstructionShownTimestamp",
      timestamps.MCLInstructionShownTimestamp
    ),
    ...flattenTreatmentValueAry(
      "MCLInstructionCompletedTimestamp",
      timestamps.MCLInstructionCompletedTimestamp
    ),
    ...flattenTreatmentValueAry(
      "MCLInstructionTimeSec",
      timestamps.MCLInstructionTimeSec
    ),
    ...flattenTreatmentValueAry(
      "attentionCheckShownTimestamp",
      timestamps.attentionCheckShownTimestamp
    ),
    ...flattenTreatmentValueAry(
      "attentionCheckCompletedTimestamp",
      timestamps.attentionCheckCompletedTimestamp
    ),
    ...flattenTreatmentValueAry(
      "attentionCheckTimeSec",
      timestamps.attentionCheckTimeSec
    ),
  };
  return result;
};

export const flattenState = (state) => {
  // turn answer rows into columns with sequenceId number as suffix
  const answersAsObj = convertAnswersAryToObj(state.questions);
  const timetamps = flattenTimestampObj(state.timestamps);
  const attentionChecks = flattenTreatmentValueAry(
    "attentionCheck",
    state.attentionCheck
  );

  const flattenedState = {
    ...{
      participantId: state.participantId,
      sessionId: state.sessionId,
      studyId: state.studyId,
    },
    ...timetamps,
    consentChecked: state.consentChecked,
    // demographic
    countryOfResidence: state.countryOfResidence,
    vizFamiliarity: state.vizFamiliarity,
    age: state.age,
    gender: state.gender,
    selfDescribeGender: state.selfDescribeGender,
    profession: state.profession,
    employment: state.employment,
    selfDescribeEmployment: state.selfDescribeEmployment,
    timezone: state.timezone,
    userAgent: state.userAgent,
    ...state.screenAttributes,
    ...answersAsObj,
    attentionCheck: attentionChecks,
    ...state.experienceSurvey,
    ...state.financialLitSurvey,
    ...state.purposeSurvey,
    feedback: state.feedback,
  };
  return flattenedState;
};

export const writeStateAsCSV = (state) => {
  // TODO remove this before going to production maybe
  writeFile(stateFilename(state), JSON.stringify(state));
  const flattenedState = flattenState(state);
  const allKeysState = JSON.stringify(setAllPropertiesEmpty(flattenedState));
  writeFile(stateFormatFilename(state), allKeysState);
  // change capital letter in camel case to _ with lower case letter to make the column headers easier to read when importing to excel
  const underscoreKeys = convertKeysCamelCaseToUnderscore(flattenedState);
  const filename = CSVDataFilename(state);
  const CSVData = convertToCSV(underscoreKeys);
  writeFile(filename, CSVData);
};
