import { initializeApp } from "firebase-admin/app";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
  const tqds = await db.collection(`${expPath}/treatmentQuestions`).get();
  for (let j = 0; j < tqds.size; j++) {
    const tqd = tqds.docs[j];
    const treatmentSnapshot = await tqd.data().treatment_id.get();
    const questionSnapshot = await tqd.data().question_id.get();
    result.push({
      path: tqd.ref.path, // TODO do I really need this field in the object?
      ...tqd.data(),
      ...treatmentSnapshot.data(),
      ...questionSnapshot.data(),
    });
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
  const result = {
    path: expDoc.ref.path, // TODO do I really need this field in the object?
    ...expDoc.data(),
    treatmentQuestions: tqs,
  };
  return result;
};

export const fetchExperiments = async (db) => {
  const expCol = await db.collection("experiments").get();
  const expAry = [];
  for (let i = 0; i < expCol.size; i++) {
    const expDoc = expCol.docs[i];
    const tqs = await fetchTreatmentQuestions(db, expDoc.ref.path);
    expAry.push({
      path: expDoc.ref.path, // TODO do I really need this field in the object?
      ...expDoc.data(),
      treatmentQuestions: tqs,
    });
  }
  return expAry;
};

export const updateParticipantCount = async (
  db,
  studyId,
  newCount,
  callback
) => {
  const expRef = await db.collection("experiments");
  const q = expRef.where("prolific_study_id", "==", studyId);
  const expSnapshot = await q.get();
  if (expSnapshot.docs.length != 1) {
    return null;
  }
  const expDoc = expSnapshot.docs[0];
  const updateObj = { num_participants_started: newCount };
  const res = await expDoc.ref.update(updateObj);
  callback(
    `updated partcipant count for study ${studyId} with result ${JSON.stringify(
      res
    )}`
  );
};

export const writeAnswers = async (
  db,
  expPath,
  participantId,
  sessionId,
  answers
) => {
  initBatch(db, `${expPath}/answers`);
  answers.forEach((a) => {
    const writeData = {
      participantId: participantId,
      ...a,
    };
    setBatchItem(
      `${participantId}-${writeData.treatment_question_id}`,
      null,
      writeData
    );
  });
  // TODO write the audit log entries
};

export const writeSurveyQuestions = async (
  db,
  expPath,
  participantId,
  sessionId,
  questions
) => {
  initBatch(db, `${expPath}/answers`);
  questions.forEach((a) => {
    const writeData = {
      participantId: participantId,
      sessionId: sessionId,
      ...a,
    };
    setBatchItem(
      `${participantId}-${writeData.treatment_question_id}`,
      null,
      writeData
    );
  });
  // TODO add writing the data to the audit table
  await commitBatch();
};

export const writeParticipant = async (db, expPath, participant) => {
  const ref = await db
    .collection(`${expPath}/participants`)
    .doc(`${participant.participantId}`)
    .create(participant);
};

export const initBatch = (db, colPath) => {
  colRef = db.collection(colPath);
  batch = db.batch();
};

export const setBatchItem = (idvalue, idfield, item) => {
  const docId = idvalue
    ? idvalue
    : idfield
    ? item[idfield].toString()
    : colRef.doc().id;
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
export const linkDocsForDoc = async (
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

export const linkDocs = async (
  db,
  leftPath,
  leftField,
  rightPath,
  rightField
) => {
  const pathSegs = leftPath.split("/");
  if (pathSegs.length === 1) {
    await linkDocsForDoc(db, leftPath, leftField, rightPath, rightField);
  } else if (pathSegs.length > 2) {
    throw Error(
      "linking with more than a single parent path is not supported at this time."
    );
  } else {
    const lastSeg = pathSegs[1];
    const parentSeg = pathSegs[0];
    const parentSegRef = db.collection(parentSeg);
    let parentSegSnapshot = await parentSegRef.get();
    for (let i = 0; i < parentSegSnapshot.size; i++) {
      const leftDoc = parentSegSnapshot.docs[i];
      await linkDocsForDoc(
        db,
        `${leftDoc.ref.path}/${lastSeg}`,
        leftField,
        rightPath,
        rightField
      );
    }
  }
};
