import _ from "lodash";
import { stringify } from "csv-stringify";
import fs from "fs";
import {
  convertKeysCamelCaseToUnderscore,
  flattenArrayToObject,
} from "@the-discounters/types";
import { convertToCSV, ISODateStringWithNanoSec } from "@the-discounters/util";
import {
  readExperiment,
  readParticipants,
  readAudit,
} from "@the-discounters/firebase-shared";

/**
 * Converts array objects with treatmentId and value  properties like
 * [{treatmentId: 1, value: <value1>},{treatmentId: 2, value: <value2>}]
 * to {<propertyName>_1: <value1>, <propertyName>_2: >value2>}
 */
export const flattenTreatmentValueAry = (propertyName, array) => {
  return array.reduce((acc, cv) => {
    const key = `${propertyName}_${cv.treatmentId}`;
    acc[key] = cv.value;
    return acc;
  }, {});
};

export const flattenState = (obj) => {
  let result = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    let flattened = {};
    switch (key) {
      case "timestamps":
        flattened = { ...value };
        delete flattened.choiceInstructionCompletedTimestamp;
        flattened = {
          ...flattened,
          ...flattenTreatmentValueAry(
            "choiceInstructionCompletedTimestamp",
            value.choiceInstructionCompletedTimestamp
          ),
        };
        delete flattened.choiceInstructionShownTimestamp;
        flattened = {
          ...flattened,
          ...flattenTreatmentValueAry(
            "choiceInstructionShownTimestamp",
            value.choiceInstructionShownTimestamp
          ),
        };
        delete flattened.choiceInstructionTimeSec;
        flattened = {
          ...flattened,
          ...flattenTreatmentValueAry(
            "choiceInstructionTimeSec",
            value.choiceInstructionTimeSec
          ),
        };
        delete flattened.attentionCheckShownTimestamp;
        flattened = {
          ...flattened,
          ...flattenTreatmentValueAry(
            "attentionCheckShownTimestamp",
            value.attentionCheckShownTimestamp
          ),
        };
        delete flattened.attentionCheckCompletedTimestamp;
        flattened = {
          ...flattened,
          ...flattenTreatmentValueAry(
            "attentionCheckCompletedTimestamp",
            value.attentionCheckCompletedTimestamp
          ),
        };
        delete flattened.attentionCheckTimeSec;
        flattened = {
          ...flattened,
          ...flattenTreatmentValueAry(
            "attentionCheckTimeSec",
            value.attentionCheckTimeSec
          ),
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
        // TODO not sure what to do with this
        break;
      case "serverTimestamp":
        flattened[key] = ISODateStringWithNanoSec(
          value.toDate(),
          value.nanoseconds
        );
        break;
      case "browserTimestamp":
        flattened[key] = ISODateStringWithNanoSec(
          value.toDate(),
          value.nanoseconds
        );
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

export const exportParticipantsToCSV = async (db, studyId, filename) => {
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
  stringify(array, { header: true }, (err, output) => {
    if (err) throw err;
    fs.writeFile(filename, output, (err) => {
      if (err) throw err;
      console.log(`...data written to CSV file ${filename}`);
    });
  });
};
