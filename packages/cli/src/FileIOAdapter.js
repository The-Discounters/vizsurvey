import {
  stateFilename,
  setAllPropertiesEmpty,
  stateFormatFilename,
  convertKeysCamelCaseToUnderscore,
  CSVDataFilename,
  convertAnswersAryToObj,
} from "@the-discounters/types";
import { convertToCSV } from "@the-discounters/util";
import {
  readExperiment,
  readParticipants,
} from "@the-discounters/firebase-shared";

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
    ...answersAsObj,
    attentionCheck: attentionChecks,
    ...state.experienceSurvey,
    ...state.financialLitSurvey,
    ...state.purposeSurvey,
    feedback: state.feedback,
  };
  return flattenedState;
};

export const exportParticipantsToJSON = async (db, studyId) => {
  const exp = await readExperiment(db, studyId);
  const participants = await readParticipants(db, exp.path);
  return JSON.stringify({ ...exp, participants: participants });
};

export const exportParticipantToCSV = (participant, includeHeader) => {
  const flattened = flattenState(participant);
  const underscore = convertKeysCamelCaseToUnderscore(flattened);
  return convertToCSV(underscore, includeHeader);
};

export const exportParticipantsToCSV = async (db, studyId) => {
  const exp = await readExperiment(db, studyId);
  const participants = await readParticipants(db, exp.path);
  return participants.reduce(
    (acc, cv, i) => acc + participantToCSV(cv, underscore, i === 0) + "\n"
  );
};
