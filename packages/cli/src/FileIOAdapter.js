import _ from "lodash";
import { stringify } from "csv-stringify";
import fs from "fs";
import {
  convertKeysCamelCaseToUnderscore,
  flattenArrayToObject,
  renameKeys,
  convertFields,
} from "@the-discounters/types";
import {
  ISODateStringWithNanoSec,
  stateToDate,
  secondsBetween,
} from "@the-discounters/util";
import {
  readExperiment,
  readExperimentAndParticipants,
  readExperimentAndAudit,
  readExperimentParticipantsAndAudit,
} from "@the-discounters/firebase-shared";
import { writeFile } from "./files.js";
import { ParticipantCSV } from "./ParticipantCSV.js";
import { QuestionCSV } from "./QuestionCSV.js";

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

//TODO what do we do with this?  Export audit to CSV is still using it but it needs to be changed to incorporate export participant to CSV which doesn't use it and is doing a lot of data patchup based on the bugs with sequence id.
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
        // TODO this code can be removed for the next experiment.
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
    if (!experiment) throw Error(`experiment for studyId ${studyId} not found`);
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
  if (!experiment) throw Error(`experiment for studyId ${studyId} not found`);
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
  if (!experiment) throw Error(`experiment for studyId ${studyId} not found`);
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

// TODO hack - copied from functions package to get around sequenceId bug.
const orderQuestions = (questions, treatmentIds) => {
  questions.sort((a, b) => {
    const tsr =
      treatmentIds.indexOf(a.treatmentId) - treatmentIds.indexOf(b.treatmentId);
    const psr = a.sequenceId - b.sequenceId;
    return tsr != 0 ? tsr : psr;
  });
  return questions;
};

const orderByTreatmentIdThenDerivedFromId = (questions) => {
  questions.sort((a, b) => {
    const tsr = a.treatmentId - b.treatmentId;
    const psr = a.derivedFromQuestionId - b.derivedFromQuestionId;
    return tsr != 0 ? tsr : psr;
  });
  return questions;
};

// TODO hack delete this - copied from functions pacakge to get around sequenceId bug.
export const calcTreatmentIds = (latinSquare, participantCount) => {
  const index = participantCount % latinSquare.length;
  return latinSquare[index];
};

export const exportParticipantsToCSV = async (db, studyId, filename) => {
  console.log("...exporting participants to CSV.");
  const { experiment, participants } = await readExperimentAndParticipants(
    db,
    studyId
  );
  if (!experiment) throw Error(`experiment for studyId ${studyId} not found`);
  const array = [];
  // MAP map to patchup newly added field derivedFromQuestionId for 7/10/24 experiment.  Removed for next experiment
  const derivedFieldsMap = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    38: 1,
    39: 2,
    40: 3,
    41: 4,
    42: 5,
    43: 6,
    44: 7,
    45: 8,
    46: 1,
    47: 2,
    48: 3,
    49: 4,
    50: 5,
    51: 6,
    52: 7,
    53: 8,
  };
  participants.forEach((participant) => {
    console.log(`...exporting participant ${participant.participantId}.`);
    let screenWindowAttributes;
    if (participant.questions > 0) {
      screenWindowAttributes = {
        ...participant.questions[0].screenAttributes,
        ...participant.questions[0].windowAttributes,
      };
    } else {
      screenWindowAttributes = {};
    }
    var flattenedParticipant = {
      ...ParticipantCSV({
        ...participant,
        ...participant.experienceSurvey,
        ...participant.financialLitSurvey,
        ...participant.timestamps,
        ...screenWindowAttributes,
      }),
      // TODO this code can be removed for next experiment since we only show first treatment in MEL instructions.
      // TODO this code can be removed for next experiment since we only show first treatment in MEL instructions.
      choiceInstructionShownTimestamp:
        participant.timestamps.choiceInstructionShownTimestamp.length !== 0
          ? participant.timestamps.choiceInstructionShownTimestamp[0].value
          : "",
      // TODO this code can be removed for next experiment since we only show first treatment in MEL instructions and it was put here to fix the bug on calcuating time in seconds.
      choiceInstructionCompletedTimestamp:
        participant.timestamps.choiceInstructionCompletedTimestamp.length !== 0
          ? participant.timestamps.choiceInstructionCompletedTimestamp[0].value
          : "",
      // TODO this code can be removed for next experiment since we only show first treatment in MEL instructions and it was put here to fix the bug on calculating time in seconds.
      choiceInstructionTimeSec:
        participant.timestamps.choiceInstructionShownTimestamp.length !== 0 &&
        participant.timestamps.choiceInstructionCompletedTimestamp.length !== 0
          ? secondsBetween(
              stateToDate(
                participant.timestamps.choiceInstructionShownTimestamp[0].value
              ),
              stateToDate(
                participant.timestamps.choiceInstructionCompletedTimestamp[0]
                  .value
              )
            )
          : "",
      ...flattenTreatmentValueAry(
        "breakShownTimestamp",
        participant.timestamps.breakShownTimestamp
      ),
      ...flattenTreatmentValueAry(
        "breakCompletedTimestamp",
        participant.timestamps.breakCompletedTimestamp
      ),
    };

    const sortedQuestions = orderQuestions(
      // TODO this can be removed for the next experiment since we added derivedFromQuestionId to the question configuration
      participant.questions.map((q) => {
        q.derivedFromQuestionId = derivedFieldsMap[q.questionId];
        console.log(
          `...... participant ${participant.participantId} assigning questionId ${q.questionId} derivedFromQuestionId ${q.derivedFromQuestionId}`
        );
        return QuestionCSV(q);
      }),
      calcTreatmentIds(
        JSON.parse(experiment.latinSquare),
        participant.participantSequence
      )
    );
    const MELQuestionsAnswerTime = sortedQuestions.reduce(
      (pv, cv) => pv + cv.choiceTimeSec,
      0
    );
    const MELQuestionBreakTime =
      participant.timestamps.breakShownTimestamp.reduce((pv, bst) => {
        const breakCompletedTimestamp =
          participant.timestamps.breakCompletedTimestamp.find(
            (bct) => bct.treatmentId === bst.treatmentId
          ).value;
        if (!bst.value || !breakCompletedTimestamp) {
          return pv;
        }
        const before = stateToDate(bst.value);
        const after = stateToDate(breakCompletedTimestamp);
        const breakTime = secondsBetween(before, after);
        return pv + breakTime;
      }, 0);
    flattenedParticipant.totalMoneyQuestionTime = (
      Number(MELQuestionsAnswerTime) + Number(MELQuestionBreakTime)
    ).toFixed(3);
    const patchedQuestions = sortedQuestions.map((q, i) => {
      const result = { ...q, derivedSequenceId: i + 1 };
      console.log(
        `...... participant ${participant.participantId} assigning questionId ${result.questionId} treatmentId ${result.treatmentId} sequenceId ${result.sequenceId} derivedSequenceId ${result.derivedSequenceId}`
      );
      return result;
    });
    flattenedParticipant.totalSurveyTime = (
      Number(flattenedParticipant.consentTimeSec) +
      Number(flattenedParticipant.instructionsTimeSec) +
      Number(flattenedParticipant.choiceInstructionTimeSec) +
      Number(flattenedParticipant.experienceSurveyTimeSec) +
      Number(flattenedParticipant.financialLitSurveyTimeSec) +
      Number(flattenedParticipant.demographicTimeSec) +
      Number(flattenedParticipant.debriefTimeSec) +
      Number(flattenedParticipant.totalMoneyQuestionTime)
    ).toFixed(3);

    orderByTreatmentIdThenDerivedFromId(patchedQuestions);
    const flattenedQuestions = patchedQuestions.reduce((acc, q) => {
      const renamed = renameKeys(
        q,
        (key, value, obj) =>
          `${key}_${obj.treatmentId}_${obj.derivedFromQuestionId}`,
        (key, value, obj) => convertValue(key, value).result
      );
      const mappedObj = {
        ...acc,
        ...renamed,
      };
      return mappedObj;
    }, {});
    const treatmentOrder = [...participant.questions]
      .sort((a, b) => a.sequenceId - b.sequenceId)
      .reduce((pv, cv) => {
        return pv.add(cv.treatmentId);
      }, new Set());
    flattenedParticipant = {
      ...flattenedParticipant,
      treatmentOrder: Array.from(treatmentOrder).toString(),
      ...flattenedQuestions,
    };
    const underscore = convertKeysCamelCaseToUnderscore(flattenedParticipant);
    array.push(underscore);
  });
  let columns = new Set();
  array.forEach((cv) => {
    Object.keys(cv).forEach((ck) => columns.add(ck));
  });
  columns = Array.from(columns);
  console.log("...converting participants to CSV.");
  stringify(array, { header: true, columns: columns }, (err, output) => {
    if (err) throw err;
    fs.writeFile(filename, output, (err) => {
      if (err) throw err;
      console.log(`...data written to CSV file ${filename}`);
    });
  });
};
