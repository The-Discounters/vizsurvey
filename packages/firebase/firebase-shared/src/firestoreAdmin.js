var batch;
var colRef;

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
    data.ref.delete();
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
