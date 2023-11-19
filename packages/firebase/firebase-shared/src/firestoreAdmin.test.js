import { readFileSync } from "fs";
import { strict as assert } from "assert";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

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

  it("Test for writing using firestore batch.", async () => {
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
    const testDoc = db.collection("test-2");
    const snapshot = await testDoc.get();
    assert.equal(
      "value1",
      snapshot.docs[0].data()["item1"],
      snapshot.docs[0].data()["item1"] + " doesn't equal 'value1'"
    );
  });

  // it("Integration test for deleteDocs.", async () => {
  //   initBatch(db, "deleteTest");
  //   setBatchItem(null, { item1: "value1" });
  //   await commitBatch();
  //   await deleteDocs(db, "deleteTest");
  // });

  // it("Integration test for linkDocs.", async () => {
  //   initBatch(db, "linkTestPrimary");
  //   setBatchItem(null, { id: 1, foreign: 1 });
  //   setBatchItem(null, { id: 2, foreign: 2 });
  //   setBatchItem(null, { id: 3, foreign: 3 });
  //   await commitBatch();
  //   initBatch(db, "linkTestForeign");
  //   setBatchItem(null, { id: 1, value: "value 1" });
  //   setBatchItem(null, { id: 2, value: "value 2" });
  //   setBatchItem(null, { id: 3, value: "value 3" });
  //   await commitBatch();
  //   await linkDocs(db, "linkTestPrimary", "foreign", "linkTestForeign", "id");
  //   await deleteDocs(db,"linkTestPrimary");
  //   await deleteDocs(db, "linkTestForeign");
  // });
});
