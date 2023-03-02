// TODO TOTAL HACK.  I HAD TO COPY THIS FILE FROM VIZSURVEY SOURCE BEACUSE WHEN I ADD type: "module" TO PACKAGE.JSON
// I GET PROBLEMS WITH REACT 17.  CLI NEEDS TO BE MOVED TO ITS OWN PROJECT AND THEN SHARED CODE IMPORTED.
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
  return dataObj.studyId;
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

export const flattenState = (state) => {
  // turn answer rows into columns with position number as suffix
  const answersAsObj = convertAnswersAryToObj(state.answers);

  const flattenedState = {
    ...{
      participantId: state.participantId,
      sessionId: state.sessionId,
      studyId: state.studyId,
      treatmentId: state.treatmentId,
    },
    ...state.timestamps,
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
  const flattenedState = flattenState(state);
  const allKeysState = JSON.stringify(setAllPropertiesEmpty(flattenedState));
  writeFile(stateFormatFilename(state), allKeysState);
  // change capital letter in camel case to _ with lower case letter to make the column headers easier to read when importing to excel
  const underscoreKeys = convertKeysToUnderscore(flattenedState);
  const filename = CSVDataFilename(state);
  const CSVData = convertToCSV(underscoreKeys);
  writeFile(filename, CSVData);
};
