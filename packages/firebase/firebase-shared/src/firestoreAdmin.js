import { initializeApp } from "firebase-admin/app";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { Experiment } from "@the-discounters/types";
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

export const fetchExperimentSnapshot = async (db, studyId) => {
  console.log("studyId=" + studyId);
  const expRef = await db.collection("experiments");
  const q = expRef.where("prolific_study_id", "==", studyId);
  const expSnapshot = await q.get();
  console.log("expSnapshot=" + expSnapshot);
  return expSnapshot;
};

export const fetchExperiment = async (db, studyId) => {
  const expSnapshot = await fetchExperimentSnapshot(db, studyId);
  console.log("expSnapshot.size" + expSnapshot.size);
  const expDoc = expSnapshot.docs[0];
  console.log("expSnapshot.docs[0]" + expSnapshot.docs[0]);
  console.log("data" + expDoc.data().id);
  const result = Experiment({
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
  });
  return result;
};

export const fetchExperiments = async (db) => {
  const entries = await db.collection("experiments").get();
  const result = await entries.docs.map((exp) =>
    Experiment({
      path: exp.ref.path,
      id: exp.data().id,
      status: exp.data().status,
      numParticipantsStarted: exp.data().num_participants_started,
      numParticipantsCompleted: exp.data().num_participants_completed,
      type: exp.data().type,
      latinSquare: exp.data().latin_square,
      startDate: exp.data().start_date,
      endDate: exp.data().end_date,
      numParticipants: exp.data().num_participants,
      prolificCode: exp.data().prolific_code,
      prolificStudyId: exp.data().prolific_study_id,
      description: exp.data().description,
    })
  );
  return result;
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
