import { readFileSync } from "fs";
import { strict as assert } from "assert";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

import { addDoc, collection } from "firebase/firestore";


// this needs to match the value that is passed to firebase emulators:start --project=
const MY_PROJECT_ID = "demo-firebase-shared";

import {
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
} from "./firestoreAdmin.js";

describe("firestoreAdmin test ", () => {
  let testEnv, db;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: MY_PROJECT_ID,
      firestore: {
        rules: readFileSync(
          "/Users/pete/vizsurvey/packages/firebase/firestore.rules",
          "utf8"
        ),
        host: "127.0.0.1",
        port: "8080",
      },
    });
    db = testEnv.unauthenticatedContext().firestore();
  });

  after(() => {
    testEnv.cleanup();
  });

  afterEach(function () {
    testEnv.clearFirestore();
  });

  it("Test for writing using firestore APIbatch.", async () => {
    const colRef = db.collection("test-1");
    const batch = db.batch();
    const docId = colRef.doc().id;
    const docRef = colRef.doc(docId);
    batch.set(docRef, { item1: "value1" });
    await batch.commit();
  });

  it("Integration test for batch writing data to firestore.", async () => {
    initBatch(db, "test-2");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    const snapshot = await assertSucceeds(db.collection("test-2").get());
    assert.equal(
      "value1",
      snapshot.docs[0].data()["item1"],
      `Did not read back what was written.  ${snapshot.docs[0].data()["item1"]} doesn't equal 'value1'`
    );
  });

  it("Integration test for deleteDocs.", async () => {
    await assertSucceeds(addDoc(collection(db, "test-3"), { key1: "value1" }));
    const snapshot = await assertSucceeds(db.collection("test-3").get());
     assert.equal(
       "value1",
       snapshot.docs[0].data()["key1"],
       `Wasn't able to read back written document as part of setup.  ${
         snapshot.docs[0].data()["key1"]
       } doesn't equal 'value1'`
     );
    await deleteDocs(db, "test-3");
    const readBackSnapshot = await assertSucceeds(db.collection("test-3").get());
    assert.equal(0, readBackSnapshot.docs.length, "The document wasn't deleted.");
  });

  it("Integration test for linkDocs.", async () => {
    await assertSucceeds(
      addDoc(collection(db, "test-4-linkTestPrimary"), { id: 1, foreign: 1 })
    );
    await assertSucceeds(
      addDoc(collection(db, "test-4-linkTestPrimary"), { id: 2, foreign: 2 })
    );
    await assertSucceeds(
      addDoc(collection(db, "test-4-linkTestPrimary"), { id: 3, foreign: 3 })
    );
     await assertSucceeds(
       addDoc(collection(db, "test-4-linkTestForeign"), {
         id: 1,
         value: "value 1",
       })
     );
     await assertSucceeds(
       addDoc(collection(db, "test-4-linkTestForeign"), {
         id: 2,
         value: "value 2",
       })
     );
     await assertSucceeds(
       addDoc(collection(db, "test-4-linkTestForeign"), {
         id: 3,
         value: "value 3",
       })
     );
    await linkDocs(
      db,
      "test-4-linkTestPrimary",
      "foreign",
      "test-4-linkTestForeign",
      "id"
    );
    const snapshot = await assertSucceeds(
      db.collection("test-4-linkTestPrimary").get()
    );
    for (let i = 0; i < snapshot.size; i++) {
      const entry = snapshot.docs[i];
      const foreignEntry = await assertSucceeds(entry.data()["foreign"].get());
      const entryId = entry.data()["id"];
      const foreignEntryValue = foreignEntry.data()["value"];
      assert.equal(
        `value ${entryId}`,
        foreignEntryValue,
        `Wasn't able to follow the foreign reference ${entryId} to the object.`
      );
    };
  });
});
