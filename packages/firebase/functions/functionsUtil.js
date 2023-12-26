import { group } from "d3";
import * as shared from "@the-discounters/firebase-shared";
import { Participant, ServerStatusType } from "@the-discounters/types";
import {
  setUndefinedPropertiesNull,
  injectSurveyQuestionFields,
} from "@the-discounters/types";
import { ProlificSumbissionStatusType } from "@the-discounters/prolific";

export const calcTreatmentIds = (latinSquare, participantCount) => {
  const index = participantCount % latinSquare.length;
  return latinSquare[index];
};

export const filterQuestions = (treatmentIds, treatmentQuestions) => {
  // between subject studies will have a latin square sub array
  // of one entry so filtering will leave only one treatment.
  const result = treatmentQuestions.filter((d) =>
    treatmentIds.includes(d.treatmentId)
  );
  return result;
};

export const parseQuestions = (treatmentQuestions) => {
  const grouped = group(treatmentQuestions, (d) => d.instructionQuestion);
  return { instruction: grouped.get(true), survey: grouped.get(false) };
};

export const orderQuestions = (questions, treatmentIds) => {
  questions.sort((a, b) => {
    const tsr =
      treatmentIds.indexOf(a.treatmentId) - treatmentIds.indexOf(b.treatmentId);
    const psr = a.sequenceId - b.sequenceId;
    return tsr != 0 ? tsr : psr;
  });
  return questions;
};

/**
 * Got this from https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj.  It uses Fisher-Yates algorithm
 * to randomly shuffle the array.
 * @param {*} array
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export const orderQuestionsRandom = (questions, treatmentIds) => {
  const result = new Array();
  const qbt = group(questions, (d) => d.treatmentId);
  treatmentIds.forEach((id) => {
    const q = qbt.get(id);
    shuffleArray(q);
    q.forEach((cv, i) => {
      cv.sequenceId = i + 1;
    });
    result.push(...q);
  });
  return result;
};

export const readExperiment = async (db, studyId, callback) => {
  const exp = await shared.readExperiment(db, studyId);
  if (!exp) {
    callback(
      ServerStatusType.invalid,
      400,
      `...tried to access experiment that was not found`
    );
  } else if (exp.status !== ProlificSumbissionStatusType.active) {
    callback(
      ServerStatusType.invalid,
      400,
      `...tried to access experiment that is not active (${exp.status})`
    );
  } else {
    callback(
      ServerStatusType.success,
      200,
      `...fetched experiment ${exp.experimentId} for studyId=${studyId}, numParticipantsStarted = ${exp.numParticipantsStarted}, numParticipants = ${exp.numParticipants}, status = ${exp.status}`
    );
  }
  return exp;
};

export const signupParticipant = async (
  db,
  participantId,
  studyId,
  sessionId,
  exp,
  callback
) => {
  const treatmentIds = calcTreatmentIds(
    JSON.parse(exp.latinSquare),
    exp.numParticipantsStarted
  );
  callback(
    false,
    `assigned treatment order ${treatmentIds} to ` +
      `participant id ${participantId}, for study id ${studyId} for ` +
      `session id ${sessionId}`
  );
  let treatmentQuestions = filterQuestions(
    treatmentIds,
    exp.treatmentQuestions
  );
  let { instruction, survey } = parseQuestions(treatmentQuestions);
  survey = injectSurveyQuestionFields(survey);
  survey = survey.map((v) => setUndefinedPropertiesNull(v));
  survey = orderQuestions(survey, treatmentIds);
  await shared.createAnswers(db, exp.path, participantId, sessionId, survey);
  await shared.createParticipant(
    db,
    exp.path,
    setUndefinedPropertiesNull(Participant({ participantId }))
  );
  callback(
    false,
    `${survey.length} questions sent back to participant for participant id ${participantId}, ` +
      `study id ${studyId}, session id ${sessionId}`
  );
  return { instruction, survey };
};
