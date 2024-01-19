import _ from "lodash";
import {
  convertKeysCamelCaseToUnderscore,
  flattenArrayToObject,
} from "@the-discounters/types";
import { convertToCSV } from "@the-discounters/util";
import {
  readExperiment,
  readParticipants,
  readAudit,
} from "@the-discounters/firebase-shared";

export const flattenState = (obj) => {
  let result = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    let flattened = {};
    switch (key) {
      case "timestamps":
        flattened = { ...value };
        delete flattened.MCLInstructionCompletedTimestamp;
        let flattenedAry = value.MCLInstructionCompletedTimestamp.reduce(
          (acc, c) => {
            acc[`MCLInstructionCompletedTimestamp_${c.treatmentId}`] = c.value;
            return acc;
          },
          {}
        );
        flattened = {
          ...flattened,
          ...flattenedAry,
        };
        delete flattened.MCLInstructionShownTimestamp;
        flattenedAry = value.MCLInstructionShownTimestamp.reduce((acc, c) => {
          acc[`MCLInstructionShownTimestamp_${c.treatmentId}`] = c.value;
          return acc;
        }, {});
        flattened = {
          ...flattened,
          ...flattenedAry,
        };
        delete flattened.MCLInstructionTimeSec;
        flattenedAry = value.MCLInstructionTimeSec.reduce((acc, c) => {
          acc[`MCLInstructionTimeSec_${c.treatmentId}`] = c.value;
          return acc;
        }, {});
        flattened = {
          ...flattened,
          ...flattenedAry,
        };
        delete flattened.attentionCheckShownTimestamp;
        flattenedAry = value.attentionCheckShownTimestamp.reduce((acc, c) => {
          acc[`attentionCheckShownTimestamp_${c.treatmentId}`] = c.value;
          return acc;
        }, {});
        flattened = {
          ...flattened,
          ...flattenedAry,
        };
        delete flattened.attentionCheckCompletedTimestamp;
        flattenedAry = value.attentionCheckCompletedTimestamp.reduce(
          (acc, c) => {
            acc[`attentionCheckCompletedTimestamp_${c.treatmentId}`] = c.value;
            return acc;
          },
          {}
        );
        flattened = {
          ...flattened,
          ...flattenedAry,
        };
        delete flattened.attentionCheckTimeSec;
        flattenedAry = value.attentionCheckTimeSec.reduce((acc, c) => {
          acc[`attentionCheckTimeSec_${c.treatmentId}`] = c.value;
          return acc;
        }, {});
        flattened = {
          ...flattened,
          ...flattenedAry,
        };
        break;
      case "questions":
        value.forEach((v) => {
          delete v.screenAttributes;
          delete v.windowAttributes;
        });
        flattened = flattenArrayToObject(value, (key, value, obj) => {
          return key === "participantId" ||
            key === "sessionId" ||
            key === "studyId"
            ? key
            : `${key}_${obj.treatmentId}_${
                obj.sequenceId ? obj.sequenceId : ""
              }`;
        });
        break;
      case "financialLitSurvey":
      case "purposeSurvey":
      case "experienceSurvey":
        flattened = value;
        break;
      case "instructionTreatment":
        // not sure what to do with this
        break;
      default:
        flattened[key] = value;
    }
    result = {
      ...result,
      ...flattened,
    };
  });
  return result;
};

const exportParticipants = async (db, studyId) => {
  const experiment = await readExperiment(db, studyId);
  const participants = await readParticipants(db, experiment.path);
  return { experiment, participants };
};

export const exportParticipantsToJSON = async (db, studyId) => {
  const { experiment, participants } = await exportParticipants(db, studyId);
  return JSON.stringify({ ...experiment, participants: participants });
};

const exportAudit = async (db, studyId) => {
  const experiment = await readExperiment(db, studyId);
  const audit = await readAudit(db, experiment.path);
  return { experiment, audit };
};

export const exportAuditToJSON = async (db, studyId) => {
  const { experiment, audit } = await exportAudit(db, studyId);
  return JSON.stringify({ ...experiment, audit });
};

export const exportAuditToCSV = async (db, studyId) => {
  console.log("...exporting audit to CSV.");
  const { experiment, audit } = await exportAudit(db, studyId);
  const array = [];
  audit.forEach((cv) => {
    console.log(`...exporting audit ${cv.participantId}.`);
    const flattened = flattenState(cv);
    const underscore = convertKeysCamelCaseToUnderscore(flattened);
    array.push(underscore);
  });
  console.log("...converting audit to CSV.");
  return convertToCSV(array, true);
};

export const exportConfigToJSON = async (db, studyId) => {
  const exp = await readExperiment(db, studyId);
  //const participants = await readParticipants(db, exp.path);
  //return JSON.stringify({ ...exp, participants: participants });
};

export const participantToCSV = (participant, includeHeader) => {
  const flattened = flattenState(participant);
  const underscore = convertKeysCamelCaseToUnderscore(flattened);
  return convertToCSV(underscore, includeHeader);
};

export const exportParticipantsToCSV = async (db, studyId) => {
  console.log("...exporting participants to CSV.");
  const { experiment, participants } = await exportParticipants(db, studyId);
  const array = [];
  participants.forEach((cv) => {
    console.log(`...exporting participant ${cv.participantId}.`);
    const combined = {
      ...experiment,
      ...cv,
    };
    const flattened = flattenState(combined);
    const underscore = convertKeysCamelCaseToUnderscore(flattened);
    array.push(underscore);
  });
  console.log("...converting participants to CSV.");
  return convertToCSV(array, true);
};
