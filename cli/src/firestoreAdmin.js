import admin from "firebase-admin";
import SERVICE_ACCOUNT from "../admin-credentials-dev.json" assert { type: "json" };

var db;
var batch;
var colRef;

export const initAdminFirestoreDB = () => {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    //databaseURL: "https://vizsurvey-test-default-rtdb.firebaseio.com/",
    databaseURL: "https://vizsurvey-test.firebaseio.com/",
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

export const deleteDocuments = async (path, callback) => {
  const docRef = db.collection(path);
  await docRef.get().then((snapshot) => {
    console.log("then code block start");
    snapshot.forEach((data) => {
      data.ref.delete();
    });
    callback();
  });
};

export const commitBatch = async () => {
  await batch.commit();
};

export const linkDocs = async (leftPath, leftField, rightPath, rightField) => {
  const leftRef = await db.collection(leftPath);
  const rightRef = await db.collection(rightPath);

  let leftSnapshot = await leftRef.get();
  await leftSnapshot.forEach(async (leftDoc) => {
    const q = await rightRef.where(rightField, "==", leftDoc.data().id);
    let rightSnapshot = await q.get();
    await rightSnapshot.forEach(async (rightDoc) => {
      console.log(
        `...linking ${leftPath}/${leftDoc.id} => ${rightPath}/${rightDoc.id}}`
      );
    });
  });
};
