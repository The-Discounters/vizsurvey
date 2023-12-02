import { assertSucceeds } from "@firebase/rules-unit-testing";

export const deleteCollection = async (db, path) => {
  const docRef = db.collection(path);
  const snapshot = assertSucceeds(await docRef.get());
  for (let i = 0; i < snapshot.size; i++) {
    const data = snapshot.docs[i];
    assertSucceeds(data.ref.delete());
  }
};
