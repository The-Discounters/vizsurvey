import { group } from "d3";
import {
  createParticipant,
  readExperimentDocXaction,
} from "@the-discounters/firebase-shared";
import {
  ServerStatusType,
  StatusError,
  setUndefinedPropertiesNull,
  injectSurveyQuestionFields,
} from "@the-discounters/types";
import { ProlificSumbissionStatusType } from "@the-discounters/prolific";

export const isStateLater = (state) => {
  throw new Error("Not implemented yet!");
};

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

export const validateExperiment = (exp) => {
  if (!exp) {
    throw new StatusError({
      message: "tried to access experiment that was not found",
      httpstatus: 400,
      reason: ServerStatusType.invalid,
    });
  } else if (exp.status !== ProlificSumbissionStatusType.active) {
    throw new StatusError({
      message: `tried to access experiment that is not active (${exp.status})`,
      httpstatus: 400,
      reason: ServerStatusType.invalid,
    });
  }
  return exp;
};

export const assignParticipantSequenceNumberXaction = async (db, studyId) => {
  const result = await db.runTransaction(async (transaction) => {
    const expDoc = await readExperimentDocXaction(db, transaction, studyId);
    validateExperiment(expDoc.data());
    if (
      expDoc.data().numParticipantsStarted === expDoc.data().numParticipants
    ) {
      throw new StatusError({
        message: `participant tried starting survey after the number of participants (${
          expDoc.data().numParticipants
        }) has been fulfilled`,
        httpstatus: 400,
        reason: ServerStatusType.ended,
      });
    }
    const newCount = expDoc.data().numParticipantsStarted + 1;
    const updateObj = { numParticipantsStarted: newCount };
    await transaction.update(expDoc.ref, updateObj);
    return {
      experimentId: expDoc.data().experimentId,
      sequenceNumber: newCount,
    };
  });
  return result;
};

export const signupParticipant = async (
  db,
  participantId,
  studyId,
  sessionId,
  participantSequence,
  exp,
  callback
) => {
  const treatmentIds = calcTreatmentIds(
    JSON.parse(exp.latinSquare),
    participantSequence
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
  await createParticipant(
    db,
    exp.path,
    setUndefinedPropertiesNull({ participantId, participantSequence })
  );
  callback(
    false,
    `${survey.length} questions sent back to participant for participant id ${participantId}, ` +
      `study id ${studyId}, session id ${sessionId}`
  );
  return { instruction, survey };
};
