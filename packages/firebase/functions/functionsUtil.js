import { Question } from "@the-discounters/types";
import {
  initBatch,
  setBatchItem,
  commitBatch,
} from "@the-discounters/firebase-shared";
import { group } from "d3";

export const calcTreatmentIds = (latinSquare, participantCount) => {
  const index = participantCount % latinSquare.length;
  return latinSquare[index];
};

export const filterQuestions = (treatmentIds, treatmentQuestions) => {
  // between subject studies will have a latin square sub array
  // of one entry so filtering will leave only one treatment.
  const result = treatmentQuestions.filter((d) =>
    treatmentIds.includes(d.treatment_id)
  );
  return result;
};

export const parseQuestions = (treatmentQuestions) => {
  const grouped = group(treatmentQuestions, (d) => d.instruction_question);
  return { instruction: grouped.get(true), survey: grouped.get(false) };
};

export const createQuestions = (
  studyId,
  sessionId,
  prolificPid,
  treatmentQuestions
) => {
  const result = treatmentQuestions.map((v) =>
    Question({
      id: `${prolificPid}-${studyId}-${sessionId}-${v.treatment_id}-${v.question_id}`,
      exp_id: v.exp_id,
      participant_id: prolificPid,
      session_id: sessionId,
      study_id: studyId,
      question_id: v.question_id,
      sequence_id: v.sequence_id,
      treatment_id: v.treatment_id,
    })
  );
  return result;
};

export const orderQuestions = (questions, treatmentIds) => {
  questions.sort((a, b) => {
    const tsr =
      treatmentIds.indexOf(a.treatment_id) -
      treatmentIds.indexOf(b.treatment_id);
    const psr = a.sequence_id - b.sequence_id;
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
  const qbt = group(questions, (d) => d.treatment_id);
  treatmentIds.forEach((id) => {
    const q = qbt.get(id);
    shuffleArray(q);
    q.forEach((cv, i) => {
      cv.sequence_id = i + 1;
    });
    result.push(...q);
  });
  return result;
};

export const writeQuestions = async (db, rootPath, answers) => {
  initBatch(db, rootPath);
  answers.forEach((a) => {
    setBatchItem("id", a);
  });
  await commitBatch();
};
