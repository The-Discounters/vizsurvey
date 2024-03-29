import { initializeApp } from "firebase-admin/app";
import { cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { collection, query, where, onSnapshot } from "firebase/firestore";

var batch;
var colRef;
var unsubscribe;

export const initFirestore = (projectId, databaseURL, adminCred) => {
  const app = initializeApp({
    projectId: projectId,
    credential: cert(adminCred),
    databaseURL: databaseURL,
  });
  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  return { app: app, db: db };
};

const readTreatmentQuestions = async (db, expPath) => {
  const result = [];
  const tqds = await db.collection(`${expPath}/treatmentQuestions`).get();
  for (let j = 0; j < tqds.size; j++) {
    const tqd = tqds.docs[j];
    const treatmentSnapshot = await tqd.data().treatmentId.get();
    const questionSnapshot = await tqd.data().questionId.get();
    result.push({
      path: tqd.ref.path, // TODO do I really need this field in the object?
      ...tqd.data(),
      ...treatmentSnapshot.data(),
      ...questionSnapshot.data(),
    });
  }
  return result;
};

const readCollection = async (db, path) => {
  const result = [];
  const col = await db.collection(path).get();
  col.forEach((doc) => {
    result.push({ path: doc.ref.path, ...doc.data() });
  });
  return result;
};

export const readParticipants = async (db, expPath) => {
  return readCollection(db, `${expPath}/participants`);
};

export const readAudit = async (db, expPath) => {
  return readCollection(db, `${expPath}/audit`);
};

export const readExperimentDocXaction = async (db, transaction, studyId) => {
  const expRef = await db.collection("experiments");
  const q = expRef.where("prolificStudyId", "==", studyId);
  const expSnapshot = await transaction.get(q);
  if (expSnapshot.docs.length != 1) {
    return null;
  }
  return expSnapshot.docs[0];
};

export const readExperimentDoc = async (db, studyId) => {
  const expRef = await db.collection("experiments");
  const q = expRef.where("prolificStudyId", "==", studyId);
  const expSnapshot = await q.get(q);
  if (expSnapshot.docs.length != 1) {
    return null;
  }
  return expSnapshot.docs[0];
};

export const readExperiment = async (db, studyId) => {
  const expDoc = await readExperimentDoc(db, studyId);
  return {
    path: expDoc.ref.path, // TODO do I really need this field in the object?
    ...expDoc.data(),
  };
};

export const readExperimentAndQuestions = async (db, studyId) => {
  const exp = await readExperiment(db, studyId);
  const tqs = await readTreatmentQuestions(db, exp.path);
  const result = {
    ...exp,
    treatmentQuestions: tqs,
  };
  return result;
};

export const readExperimentAndParticipants = async (db, studyId) => {
  const experiment = await readExperiment(db, studyId);
  const participants = await readParticipants(db, experiment.path);
  return { experiment, participants };
};

export const readExperimentAndAudit = async (db, studyId) => {
  const experiment = await readExperiment(db, studyId);
  const audit = await readAudit(db, experiment.path);
  return { experiment, audit };
};

export const readExperimentParticipantsAndAudit = async (db, studyId) => {
  const experiment = await readExperiment(db, studyId);
  const participants = await readParticipants(db, experiment.path);
  const audit = await readAudit(db, experiment.path);
  return { experiment, participants, audit };
};

export const readExperimentsAndQuestions = async (db) => {
  const expCol = await db.collection("experiments").get();
  const expAry = [];
  for (let i = 0; i < expCol.size; i++) {
    const expDoc = expCol.docs[i];
    const tqs = await readTreatmentQuestions(db, expDoc.ref.path);
    expAry.push({
      path: expDoc.ref.path, // TODO do I really need this field in the object?
      ...expDoc.data(),
      treatmentQuestions: tqs,
    });
  }
  return expAry;
};

export const createAnswers = async (
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
      `${participantId}-${writeData.treatmentQuestionId}`,
      null,
      writeData
    );
  });
  // TODO add writing the data to the audit table
  await commitBatch();
};

export const updateAnswer = async (
  db,
  expPath,
  participantId,
  treatmentQuestionId,
  //sessionId,
  answer
) => {
  const answerPath = `${expPath}/answers/${participantId}-${treatmentQuestionId}`;
  const answerRef = await db.doc(answerPath);
  const answerSnapshot = await answerRef.get();
  if (!answerSnapshot.exists) {
    return null;
  }
  const writeResult = await answerRef.update(answer);
  return writeResult.writeTime;
};

export const createAuditLogEntry = async (
  db,
  expPath,
  participantId,
  requestSequence,
  timestamp,
  state
) => {
  const ref = await db
    .collection(`${expPath}/audit`)
    .doc(`${participantId}-${requestSequence}-${timestamp.valueOf()}`)
    .create(state);
};

export const createParticipant = async (db, expPath, participant) => {
  const ref = await db
    .collection(`${expPath}/participants`)
    .doc(`${participant.participantId}`)
    .create(participant);
};

export const readParticipant = async (db, expPath, participantId) => {
  const participantPath = `${expPath}/participants/${participantId}`;
  const participantRef = await db.doc(participantPath);
  const participantSnapshot = await participantRef.get();
  return !participantSnapshot.exists ? null : participantSnapshot.data();
};

export const updateParticipant = async (
  db,
  expPath,
  participantId,
  //sessionId,
  updateData
) => {
  const participantPath = `${expPath}/participants/${participantId}`;
  const participantRef = await db.doc(participantPath);
  const participantSnapshot = await participantRef.get();
  if (!participantSnapshot.exists) {
    return null;
  }
  const writeResult = await participantRef.update(updateData);
  return writeResult.writeTime;
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

export const subscribeParticipantUpdates = (db, expPath, callback) => {
  unsubscribe = db
    .collection(`${expPath}/participants`)
    .onSnapshot((querySnapshot) => {
      const participants = [];
      querySnapshot.forEach((doc) => {
        participants.push(doc.data());
      });
      callback(participants);
    });
};

export const unsubscribeParticipantUpdates = () => {
  unsubscribe();
};
