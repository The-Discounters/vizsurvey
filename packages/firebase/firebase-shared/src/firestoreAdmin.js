import { initializeApp } from "firebase-admin/app";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { Experiment, TreatmentQuestion } from "@the-discounters/types";
import { ProlificSumbissionStatusType } from "@the-discounters/prolific";

var batch;
var colRef;

export const initFirestore = (projectId, databaseURL, adminCred) => {
  const app = initializeApp({
    projectId: projectId,
    credential: cert(adminCred),
    databaseURL: databaseURL,
  });
  const db = getFirestore(app);
  return { app: app, db: db };
};

const fetchTreatmentQuestions = async (db, expPath) => {
  const result = [];
  const tqds = await db.collection(expPath + "/treatmentQuestions").get();
  for (let j = 0; j < tqds.size; j++) {
    const tqd = tqds.docs[j];
    result.push(
      TreatmentQuestion({
        path: tqd.ref.path,
        exp_id: tqd.data().exp_id,
        id: tqd.data().id,
        question_id: tqd.data().question_id,
        sequence_id: tqd.data().sequence_id,
        treatment_id: tqd.data().treatment_id,
      })
    );
  }
  return result;
};

export const fetchExperiment = async (db, studyId) => {
  const expRef = await db.collection("experiments");
  const q = expRef.where("prolific_study_id", "==", studyId);
  const expSnapshot = await q.get();
  if (expSnapshot.docs.length != 1) {
    return null;
  }
  const expDoc = expSnapshot.docs[0];
  const tqs = await fetchTreatmentQuestions(db, expDoc.ref.path);
  const result = Experiment({
    path: expDoc.ref.path,
    id: expDoc.data().id,
    status: expDoc.data().status,
    numParticipantsStarted: expDoc.data().num_participants_started,
    numParticipantsCompleted: expDoc.data().num_participants_completed,
    type: expDoc.data().type,
    latinSquare: expDoc.data().latin_square,
    startDate: expDoc.data().start_date,
    endDate: expDoc.data().end_date,
    numParticipants: expDoc.data().num_participants,
    prolificCode: expDoc.data().prolific_code,
    prolificStudyId: expDoc.data().prolific_study_id,
    description: expDoc.data().description,
    treatmentQuestions: tqs,
  });
  return result;
};

export const fetchExperiments = async (db) => {
  const expCol = await db.collection("experiments").get();
  const expAry = [];
  for (let i = 0; i < expCol.size; i++) {
    const expDoc = expCol.docs[i];
    const tqs = await fetchTreatmentQuestions(db, expDoc.ref.path);
    expAry.push(
      Experiment({
        path: expDoc.ref.path,
        id: expDoc.data().id,
        status: expDoc.data().status,
        numParticipantsStarted: expDoc.data().num_participants_started,
        numParticipantsCompleted: expDoc.data().num_participants_completed,
        type: expDoc.data().type,
        latinSquare: expDoc.data().latin_square,
        startDate: expDoc.data().start_date,
        endDate: expDoc.data().end_date,
        numParticipants: expDoc.data().num_participants,
        prolificCode: expDoc.data().prolific_code,
        prolificStudyId: expDoc.data().prolific_study_id,
        description: expDoc.data().description,
        treatmentQuestions: tqs,
      })
    );
  }
  return expAry;
}

export const writeTreatmentAssignment = async (
  db,
  prolificPid,
  studyId,
  sessionId,
  treatments
) => {};

export const writeAnswers = (
  db,
  prolificPid,
  studyId,
  sessionId,
  answers
) => {};

export const initBatch = (db, colPath) => {
  colRef = db.collection(colPath);
  batch = db.batch();
};

export const setBatchItem = (idfield, item) => {
  const docId = idfield ? item[idfield].toString() : colRef.doc().id;
  const docRef = colRef.doc(docId);
  batch.set(docRef, item);
};

export const commitBatch = async () => {
  await batch.commit();
  batch = null;
};

export const deleteDocs = async (db, path) => {
  const docRef = db.collection(path);
  const snapshot = await docRef.get();
  for (let i = 0; i < snapshot.size; i++) {
    const data = snapshot.docs[i];
    await data.ref.delete();
  }
};



// TODO I need to implement linking a two dimensional array type field that could result from seven squares
// assignment, for example [[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]].  I can do this
// in theory with a map of arrays where the map entries could be the rows with keys equal to the row numbers
// (1, 2, 3, ...).  Then I can sort the kwys by natural order and convert the map of arrays into a two dimensional
// array in the function code to access the next row of treatment sequence assignment.  I would need this for the
// within subject study and we aren't running that yet so I didn't do it.
export const linkDocs = async (
  db,
  leftPath,
  leftField,
  rightPath,
  rightField
) => {
  const leftRef = db.collection(leftPath);
  const rightRef = db.collection(rightPath);
  let leftSnapshot = await leftRef.get();
  for (let i = 0; i < leftSnapshot.size; i++) {
    const leftDoc = leftSnapshot.docs[i];
    const q = rightRef.where(rightField, "==", leftDoc.data()[leftField]);
    let rightSnapshot = await q.get();
    for (let j = 0; j < rightSnapshot.size; j++) {
      const rightDoc = rightSnapshot.docs[j];
      console.log(
        `...linking ${leftPath}/${leftDoc.id} to ${rightPath}/${
          rightDoc.id
        } on ${leftField}=${leftDoc.data()[leftField]}=>${rightField}=${
          rightDoc.data()[rightField]
        }}`
      );
      const updateObj = {};
      updateObj[leftField] = rightDoc.ref;
      const res = await leftDoc.ref.update(updateObj);
      console.log(`...update result ${JSON.stringify(res)}`);
    }
  }
};
