/* eslint-disable no-unused-vars */
import { writeFile } from "./FileIOAdapter.js";
import {
  convertKeysToUnderscore,
  convertAnswersAryToObj,
  setAllPropertiesEmpty,
} from "./ObjectUtil.js";
import { convertToCSV } from "./parserUtil.js";

export const participantUniqueKey = (dataObj) => {
  return `${dataObj.participantId}`;
};

export const stateUniqueKey = (dataObj) => {
  return `${dataObj.participantId}-${dataObj.sessionId}-${dataObj.studyId}`;
};

export const CSVDataFilename = (dataObj) => {
  return CSVDataFilenameFromKey(`${participantUniqueKey(dataObj)}`);
};

export const CSVDataFilenameFromKey = (uniqueKey) => {
  return `data-${uniqueKey}.csv`;
};

export const stateFormatFilename = (dataObj) => {
  return `state-format-${stateUniqueKey(dataObj)}.json`;
};

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
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
    introductionShownTimestamp: timestamps.introductionShownTimestamp,
    introductionCompletedTimestamp: timestamps.introductionCompletedTimestamp,
    introductionTimeSec: timestamps.introductionTimeSec,
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
      "instructionsShownTimestamp",
      timestamps.instructionsShownTimestamp
    ),
    ...flattenTreatmentValueAry(
      "instructionsCompletedTimestamp",
      timestamps.instructionsCompletedTimestamp
    ),
    ...flattenTreatmentValueAry(
      "instructionsTimeSec",
      timestamps.instructionsTimeSec
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
  // turn answer rows into columns with position number as suffix
  const answersAsObj = convertAnswersAryToObj(state.answers);
  const treatmentIds = state.treatmentIds.toString().replaceAll(",", "-");
  const timetamps = flattenTimestampObj(state.timestamps);

  const flattenedState = {
    ...{
      participantId: state.participantId,
      sessionId: state.sessionId,
      studyId: state.studyId,
      treatmentId: treatmentIds,
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
    attentionCheck: state.attentionCheck,
    ...state.experienceSurvey,
    ...state.financialLitSurvey,
    ...state.purposeSurvey,
    feedback: state.feedback,
  };
  return flattenedState;
};

export const writeStateAsCSV = (state) => {
  // const flattenedState = flattenState(state);
  // const allKeysState = JSON.stringify(setAllPropertiesEmpty(flattenedState));
  // writeFile(stateFormatFilename(state), allKeysState);
  // // change capital letter in camel case to _ with lower case letter to make the column headers easier to read when importing to excel
  // const underscoreKeys = convertKeysToUnderscore(flattenedState);
  // const filename = CSVDataFilename(state);
  // const CSVData = convertToCSV(underscoreKeys);
  // writeFile(filename, CSVData);
};
