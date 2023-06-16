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

export const deleteDocuments = async (path) => {
  const docRef = db.collection(path);
  const snapshot = await docRef.get();
  for (let i = 0; i < snapshot.size; i++) {
    const data = snapshot.docs[i];
    data.ref.delete();
  }
};

export const commitBatch = async () => {
  await batch.commit();
};

export const linkDocs = async (leftPath, leftField, rightPath, rightField) => {
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
      leftDoc.ref.set(updateObj);
    }
  }
};
