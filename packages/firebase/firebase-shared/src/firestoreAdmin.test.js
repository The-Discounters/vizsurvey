import { strict as assert } from "assert";
import { assertSucceeds } from "@firebase/rules-unit-testing";
import { deleteCollection } from "./firestoreTestUtil.js";

import ADMIN_CREDS from "../../../../admin-credentials-dev.json" assert { type: "json" };

// this needs to match the value that is passed to firebase emulators:start --project=
const PROJECT_ID = "vizsurvey-test";

import {
  initFirestore,
  fetchExperiment,
  fetchExperiments,
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
} from "./firestoreAdmin.js";

describe("firestoreAdmin test ", () => {
  let app, db;

  before(async () => {
    const result = initFirestore(
      PROJECT_ID,
      "https://vizsurvey-test.firebaseio.com/",
      ADMIN_CREDS
    );
    app = result.app;
    db = result.db;
  });

  after(() => {});

  afterEach(async () => {
    await deleteCollection(db, "firestoreAdmin-test-batch-idfield-null");
    await deleteCollection(db, "firestoreAdmin-test-batch-idfield-notnull");
    await deleteCollection(db, "firestoreAdmin-test-deleteDocs");
    await deleteCollection(db, "firestoreAdmin-test-linkTestPrimary");
    await deleteCollection(db, "firestoreAdmin-test-linkTestForeign");
  });

  // it("Query test.", async () => {
  //   const expRef = db.collection("experiments");
  //   const q = expRef.where("prolific_study_id", "==", "1");
  //   const expSnapshot = await assertSucceeds(q.get());
  //   assert.equal(expSnapshot.docs[0].data().prolific_study_id, "1", "Did not retrieve expected data from query");
  // });

  // it("Test for writing using firestore APIbatch.", async () => {
  //   const colRef = db.collection("firestoreAdmin-test-test-1");
  //   const batch = db.batch();
  //   const docId = colRef.doc().id;
  //   const docRef = colRef.doc(docId);
  //   batch.set(docRef, {item1: "value1"});
  //   await batch.commit();
  // });

  it("Integration test for batch writing data to firestore null id field.", async () => {
    initBatch(db, "firestoreAdmin-test-batch-idfield-null");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    const snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-batch-idfield-null").get()
    );
    assert.equal(
      "value1",
      snapshot.docs[0].data()["item1"],
      `Did not read back what was written.  ${
        snapshot.docs[0].data()["item1"]
      } doesn't equal 'value1'`
    );
  });

  it("Integration test for batch writing data to firestore .", async () => {
    initBatch(db, "firestoreAdmin-test-batch-idfield-notnull");
    setBatchItem("item1", { item1: "value1" });
    await commitBatch();
    const snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-batch-idfield-notnull").get()
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
    await assertSucceeds(
      db
        .collection("firestoreAdmin-test-deleteDocs")
        .doc()
        .create({ key1: "value1" })
    );
    const snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-deleteDocs").get()
    );
    assert.equal(
      "value1",
      snapshot.docs[0].data()["key1"],
      `Wasn't able to read back written document as part of setup.  ${
        snapshot.docs[0].data()["key1"]
      } doesn't equal 'value1'`
    );
    await deleteDocs(db, "firestoreAdmin-test-deleteDocs");
    const readBackSnapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-deleteDocs").get()
    );
    assert.equal(
      0,
      readBackSnapshot.docs.length,
      "The document wasn't deleted."
    );
  });

  it("Integration test for linkDocs one to one link.", async () => {
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestPrimary").doc().create({
        id: 1,
        foreign: 1,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestPrimary").doc().create({
        id: 2,
        foreign: 2,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestPrimary").doc().create({
        id: 3,
        foreign: 3,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestForeign").doc().create({
        id: 1,
        value: "value 1",
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestForeign").doc().create({
        id: 2,
        value: "value 2",
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestForeign").doc().create({
        id: 3,
        value: "value 3",
      })
    );
    await linkDocs(
      db,
      "firestoreAdmin-test-linkTestPrimary",
      "foreign",
      "firestoreAdmin-test-linkTestForeign",
      "id"
    );
    const snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestPrimary").get()
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

  // it("Integration test for linkDocs array reference link.", async () => {
  //   await assertSucceeds(
  //     db.collection("firestoreAdmin-test-test-5-linkTestPrimary").doc().create({
  //       id: 1,
  //       foreign: "[1,2]",
  //     })
  //   );
  //   await assertSucceeds(
  //     db.collection("firestoreAdmin-test-test-5-linkTestPrimary").doc().create({
  //       id: 2,
  //       foreign: "[3]",
  //     })
  //   );
  //   await assertSucceeds(
  //     db.collection("firestoreAdmin-test-test-5-linkTestPrimary").doc().create({
  //       id: 3,
  //       foreign: "",
  //     })
  //   );
  //   await assertSucceeds(
  //     db.collection("firestoreAdmin-test-test-5-linkTestForeign").doc().create({
  //       id: 1,
  //       value: "value 1",
  //     })
  //   );
  //   await assertSucceeds(
  //     db.collection("firestoreAdmin-test-test-5-linkTestForeign").doc().create({
  //       id: 2,
  //       value: "value 2",
  //     })
  //   );
  //   await assertSucceeds(
  //     db.collection("firestoreAdmin-test-test-5-linkTestForeign").doc().create({
  //       id: 3,
  //       value: "value 3",
  //     })
  //   );
  //   await linkDocs(
  //     db,
  //     "firestoreAdmin-test-test-5-linkTestPrimary",
  //     "foreign",
  //     "firestoreAdmin-test-test-5-linkTestForeign",
  //     "id"
  //   );
  //   const snapshot = await assertSucceeds(
  //     db.collection("firestoreAdmin-test-test-5-linkTestPrimary").get()
  //   );
  //   for (let i = 0; i < snapshot.size; i++) {
  //     const entry = snapshot.docs[i];
  //     const foreignEntry = await assertSucceeds(entry.data()["foreign"].get());
  //     const entryId = entry.data()["id"];
  //     const foreignEntryValue = foreignEntry.data()["value"];
  //     assert.equal(
  //       `value ${entryId}`,
  //       foreignEntryValue,
  //       `Wasn't able to follow the foreign reference ${entryId} to the object.`
  //     );
  //   }
  // });

  it("Integration test for fetchExperiment.", async () => {
    const exp = await fetchExperiment(db, "649f3cffea5a1b2817d17d7e");
    assert.equal(
      exp.prolificStudyId,
      "649f3cffea5a1b2817d17d7e",
      'experiment prolificStudyId="-649f3cffea5a1b2817d17d7e" not loaded correctly.'
    );
  });

  it("Integration test for fetchExperiments.", async () => {
    const exp = await fetchExperiments(db);
    assert.equal(
      exp.length,
      7,
      `${exp.length} was not the expected number of experiment entries.`
    );
    const exp6 = exp.filter((v) => {
      return v.id === 6;
    });
    assert.equal(
      exp6[0].treatmentQuestions.length,
      27,
      `Did not find the expected number of questions in experiment 6.`
    );
  });
});
