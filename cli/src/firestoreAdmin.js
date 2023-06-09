import admin from "firebase-admin";
import SERVICE_ACCOUNT from "../admin-credentials-dev.json" assert { type: "json" };

var db;
var batch;
var colRef;

export const initAdminFirestoreDB = () => {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
  });
  db = admin.firestore();
};

export const initBatch = (colPath) => {
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
};
