import {strict as assert} from "assert";
import {assertSucceeds} from "@firebase/rules-unit-testing";
import {collection, doc, setDoc, addDoc } from "firebase/firestore";
import ADMIN_CREDS from "../../../../admin-credentials-dev.json" assert {type: "json"};

// this needs to match the value that is passed to firebase emulators:start --project=
const SIMULATOR_PROJECT_ID = "demo-firebase-shared";
const LIVE_PROJECT_ID = "vizsurvey-test";
const useEmulator = true;

import {
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
} from "./firestoreAdmin.js";
import { initEmulatorEnv, initLiveEnv } from "./firestoreFacade.js";

describe("firestoreAdmin test ", () => {
  let testEnv, app, db;

  before(async () => {
    if (useEmulator) {
      const result = await initEmulatorEnv(
        SIMULATOR_PROJECT_ID,
        "/Users/pete/vizsurvey/packages/firebase/firestore.rules",
        "127.0.0.1",
        "8080",
      );
      testEnv = result.testEnv;
      db = result.db;
    } else {
      const result = await initLiveEnv(LIVE_PROJECT_ID, "https://vizsurvey-test.firebaseio.com/", ADMIN_CREDS);
      app = result.app;
      db = result.db;
    }
  });

  after(() => {
    if (testEnv) {
      testEnv.cleanup();
    }
  });

  afterEach(() => {
    if (testEnv) {
      testEnv.clearFirestore();
    }
  });

  it("Test for writing using firestore APIbatch.", async () => {
    const colRef = db.collection("firestoreAdmin-test-test-1");
    const batch = db.batch();
    const docId = colRef.doc().id;
    const docRef = colRef.doc(docId);
    batch.set(docRef, { item1: "value1" });
    await batch.commit();
  });

  it("Integration test for batch writing data to firestore.", async () => {
    initBatch(db, "firestoreAdmin-test-test-2");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    const snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-test-2").get()
    );
    assert.equal(
      "value1",
      snapshot.docs[0].data()["item1"],
      `Did not read back what was written.  ${
        snapshot.docs[0].data()["item1"]
      } doesn't equal 'value1'`
    );
  });

  it("Integration test for deleteDocs.", async () => {
    await assertSucceeds(db
      .collection("firestoreAdmin-test-test-3")
      .doc()
      .create({key1: "value1"}));
    const snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-test-3").get()
    );
    assert.equal(
      "value1",
      snapshot.docs[0].data()["key1"],
      `Wasn't able to read back written document as part of setup.  ${
        snapshot.docs[0].data()["key1"]
      } doesn't equal 'value1'`
    );
    await deleteDocs(db, "firestoreAdmin-test-test-3");
    const readBackSnapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-test-3").get()
    );
    assert.equal(
      0,
      readBackSnapshot.docs.length,
      "The document wasn't deleted."
    );
  });

  it("Integration test for linkDocs.", async () => {
    await assertSucceeds(
      db.collection("firestoreAdmin-test-test-4-linkTestPrimary").doc().create({
        id: 1,
        foreign: 1,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-test-4-linkTestPrimary").doc().create({
        id: 2,
        foreign: 2,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-test-4-linkTestPrimary").doc().create({
        id: 3,
        foreign: 3,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-test-4-linkTestForeign").doc().create({
        id: 1,
        value: "value 1",
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-test-4-linkTestForeign").doc().create({
        id: 2,
        value: "value 2",
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-test-4-linkTestForeign").doc().create({
        id: 3,
        value: "value 3",
      })
    );
    await linkDocs(
      db,
      "firestoreAdmin-test-test-4-linkTestPrimary",
      "foreign",
      "firestoreAdmin-test-test-4-linkTestForeign",
      "id"
    );
    const snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-test-4-linkTestPrimary").get()
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
    }
  });
});
