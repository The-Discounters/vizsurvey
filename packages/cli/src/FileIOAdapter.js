import _ from "lodash";
import { stringify } from "csv-stringify";
import fs from "fs";
import {
  convertKeysCamelCaseToUnderscore,
  flattenArrayToObject,
  removeUndefinedOrNullProperties,
  convertFields,
} from "@the-discounters/types";
import { convertToCSV, ISODateStringWithNanoSec } from "@the-discounters/util";
import { writeFile } from "./files.js";
import {
  readExperiment,
  readExperimentAndParticipants,
  readExperimentAndAudit,
  readExperimentParticipantsAndAudit,
} from "@the-discounters/firebase-shared";

/**
 * Converts array objects with treatmentId and value  properties like
 * [{treatmentId: 1, value: <value1>},{treatmentId: 2, value: <value2>}]
 * to {<propertyName>_1: <value1>, <propertyName>_2: >value2>}
 */
export const flattenTreatmentValueAry = (propertyName, array) => {
  return array.reduce((acc, cv) => {
    const key = `${propertyName}_${cv.treatmentId}`;
    acc[key] = convertValue(propertyName, cv.value).result;
    return acc;
  }, {});
};

export const convertValue = (key, value) => {
  switch (key) {
    case "serverTimestamp":
      return {
        converted: true,
        result: ISODateStringWithNanoSec(value.toDate(), value.nanoseconds),
      };
    case "browserTimestamp":
      return {
        converted: true,
        result: ISODateStringWithNanoSec(value.toDate(), value.nanoseconds),
      };
    default:
      return { converted: false, result: value };
  }
};

export const flattenState = (obj) => {
  let result = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    let flattened = {};
    switch (key) {
      case "timestamps":
        flattened = { ...convertValue(key, value).result };
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
        break;
      case "questions":
        value.forEach((v) => {
          delete v.screenAttributes;
          delete v.windowAttributes;
        });
        flattened = flattenArrayToObject(
          value,
          (key, value, obj) =>
            key === "participantId" || key === "sessionId" || key === "studyId"
              ? key
              : `${key}_${obj.treatmentId}_${
                  obj.sequenceId ? obj.sequenceId : ""
                }`,
          (key, value, obj) => convertValue(key, value).result
        );
        break;
      case "financialLitSurvey":
      case "experienceSurvey":
        flattened = convertFields(value, convertValue).result;
        break;
      case "instructionTreatment":
        // TODO not sure what to do with this
        break;
      default:
        flattened[key] = convertValue(key, value).result;
    }
    result = {
      ...result,
      ...flattened,
    };
  });
  return result;
};

export const exportParticipantsToJSON = async (db, studyId, filename) => {
  const { experiment, participants } = await readExperimentAndParticipants(
    db,
    studyId
  );
  const fileData = convertFields(
    {
      ...experiment,
      participants: participants,
    },
    convertValue
  );
  writeFile(filename, JSON.stringify(fileData));
};

export const exportAuditToJSON = async (db, studyId, filename) => {
  const { experiment, audit } = await readExperimentAndAudit(db, studyId);
  const fileData = convertFields(
    {
      ...experiment,
      audit: audit,
    },
    convertValue
  );
  writeFile(filename, JSON.stringify(fileData));
};

export const exportConfigToJSON = async (db, studyId) => {
  const exp = await readExperiment(db, studyId);
  //const participants = await readParticipants(db, exp.path);
  //return JSON.stringify(convertFields({ ...exp, participants: participants }, convertValue));
};

export const exportExperimentParticipantsAndAuditToJSON = async (
  db,
  studyId,
  filename
) => {
  const { experiment, participants, audit } =
    await readExperimentParticipantsAndAudit(db, studyId);
  const fileData = convertFields(
    {
      ...experiment,
      participants: participants,
      audit: audit,
    },
    convertValue
  );
  writeFile(filename, JSON.stringify(fileData));
};

export const exportAuditToCSV = async (db, studyId, filename) => {
  console.log("...exporting audit to CSV.");
  const { experiment, audit } = await readExperimentAndAudit(db, studyId);
  const array = [];
  audit.forEach((cv) => {
    console.log(`...exporting audit ${cv.participantId}.`);
    delete cv.experiment;
    const flattened = flattenState(cv);
    const underscore = convertKeysCamelCaseToUnderscore(flattened);
    array.push(underscore);
  });
  console.log("...converting audit to CSV.");
  stringify(array, { header: true }, (err, output) => {
    if (err) throw err;
    fs.writeFile(filename, output, (err) => {
      if (err) throw err;
      console.log(`...data written to CSV file ${filename}`);
    });
  });
};

export const exportParticipantsToCSV = async (db, studyId, filename) => {
  console.log("...exporting participants to CSV.");
  const { experiment, participants } = await readExperimentAndParticipants(
    db,
    studyId
  );
  const array = [];
  participants.forEach((cv) => {
    console.log(`...exporting participant ${cv.participantId}.`);
    delete cv.experiment;
    const combined = {
      ...experiment,
      ...cv,
    };
    const flattened = removeUndefinedOrNullProperties(flattenState(combined));
    const underscore = convertKeysCamelCaseToUnderscore(flattened);
    array.push(underscore);
  });
  let columns = new Set();
  array.forEach((cv) => {
    Object.keys(cv).forEach((ck) => columns.add(ck));
  });
  columns = Array.from(columns);
  console.log("...converting participants to CSV.");
  // const CSVData = convertToCSV(array);
  // writeFile(filename, CSVData);
  // console.log(`...data written to CSV file ${filename}`);
  stringify(array, { header: true, columns: columns }, (err, output) => {
    if (err) throw err;
    fs.writeFile(filename, output, (err) => {
      if (err) throw err;
      console.log(`...data written to CSV file ${filename}`);
    });
  });
};
