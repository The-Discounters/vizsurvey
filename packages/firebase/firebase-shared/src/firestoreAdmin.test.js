import {readFileSync} from "fs";
import {strict as assert} from "assert";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

const MY_PROJECT_ID = "demo-firebase-shared";

import {
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
} from "./firestoreAdmin.js";

// import {
//   initializeTestEnvironment,
// } from "@firebase/rules-unit-testing";

// after(() => {
//   firebase.apps().forEach((app) => app.delete());
// });

describe("firestoreAdmin test ", () => {
  let testEnv, db;  

  before(async () => {
    console.log("before start");
    testEnv = await initializeTestEnvironment({
      projectId: MY_PROJECT_ID,
      firestore: {
        rules: readFileSync("../firestore.rules", "utf8"),
      },
    });
    const alice = testEnv.unauthenticatedContext();
    db = alice.firestore();
  });

  it("Integration test for batch writing data to firestore.", async () => {
    initBatch(db, "integrationTests");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    const testDoc = db.collection("integrationTests").doc("value1");
    await assertSucceeds(testDoc.get());
    //await deleteDocs(db, "integrationTests");
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
