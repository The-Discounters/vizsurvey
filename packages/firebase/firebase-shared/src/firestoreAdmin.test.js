import { strict as assert } from "assert";
import { assertSucceeds } from "@firebase/rules-unit-testing";
import { SURVEY_QUESTIONS_JSON } from "@the-discounters/test-shared";
import { deleteCollection } from "@the-discounters/firebase-test-shared";
import { Participant } from "@the-discounters/types";

import ADMIN_CREDS from "../../../../admin-credentials-dev.json" assert { type: "json" };

// this needs to match the value that is passed to firebase emulators:start --project=
const PROJECT_ID = "vizsurvey-test";

import {
  initFirestore,
  readExperiment,
  readExperiments,
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
  createAnswers,
  updateAnswer,
  updateParticipantCount,
  createParticipant,
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

  after(() => {
    // RulesTestEnvironment.emulators;
  });

  afterEach(async () => {
    await deleteCollection(db, "firestoreAdmin-test-batch-idfield-null");
    await deleteCollection(db, "firestoreAdmin-test-batch-idfield-notnull");
    await deleteCollection(db, "firestoreAdmin-test-deleteDocs");
    await deleteCollection(db, "firestoreAdmin-test-linkTestPrimary");
    await deleteCollection(db, "firestoreAdmin-test-linkTestForeign");
    await deleteCollection(db, "firestoreAdmin-test-linkTestParentPrimary");
    await deleteCollection(db, "firestoreAdmin-test-linkTestParentForeign");
  });

  // it("Getting to the emulator.", async () => {
  //   const emulator = RulesTestEnvironment.emulators;
  //   assert.notEqual(
  //     undefined,
  //     emulator,
  //     "Didn't get a reference to the emulator."
  //   );
  // });

  // it("Query test.", async () => {
  //   const expRef = db.collection("experiments");
  //   const q = expRef.where("prolificStudyId", "==", "1");
  //   const expSnapshot = await assertSucceeds(q.get());
  //   assert.equal(expSnapshot.docs[0].data().prolificStudyId, "1", "Did not retrieve expected data from query");
  // });

  // it("Test for writing using firestore APIbatch.", async () => {
  //   const colRef = db.collection("firestoreAdmin-test-test-1");
  //   const batch = db.batch();
  //   const docId = colRef.doc().id;
  //   const docRef = colRef.doc(docId);
  //   batch.set(docRef, {item1: "value1"});
  //   await batch.commit();
  // });

  // it("Test for writing to a nested collection when the parent collection doesn't exist.", async () => {
  //   const parentColRef = db.collection("firestoreAdmin-test-nested-collection");
  //   let batch = db.batch();
  //   let parentDocRef = parentColRef.doc("1");
  //   batch.set(parentDocRef, { value: "parentValue1" });
  //   await batch.commit();
  //   // child reference is always to a document, not the collection, when writing.
  //   let childColRef = db.collection(
  //     "firestoreAdmin-test-nested-collection/answers/1"
  //   );
  //   batch = db.batch();
  //   let docRef = childColRef.doc("1");
  //   batch.set(docRef, { value: "value1" });
  //   childColRef = db.collection(
  //     "firestoreAdmin-test-nested-collection/answers/2"
  //   );
  //   docRef = childColRef.doc("2");
  //   batch.set(docRef, { value: "value2" });
  //   await batch.commit();
  // });

  it("Integration test for batch writing data to firestore null id field.", async () => {
    initBatch(db, "firestoreAdmin-test-batch-idfield-null");
    setBatchItem(null, null, { item1: "value1" });
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
    setBatchItem(null, "item1", { item1: "value1" });
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
    const ref = await assertSucceeds(
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

  it("Integration test for linkDocs parent path and one to one link.", async () => {
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestParentPrimary").doc().create({
        id: 1,
      })
    );
    const testPrimaryRef = await db.collection(
      "firestoreAdmin-test-linkTestParentPrimary"
    );
    let q = testPrimaryRef.where("id", "==", 1);
    let primarySnapshot = await q.get();
    await assertSucceeds(
      primarySnapshot.docs[0].ref.collection("nested").doc().create({
        id: 1,
        foreign: 1,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestParentPrimary").doc().create({
        id: 2,
      })
    );
    q = testPrimaryRef.where("id", "==", 2);
    primarySnapshot = await q.get();
    await assertSucceeds(
      primarySnapshot.docs[0].ref.collection("nested").doc().create({
        id: 2,
        foreign: 2,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestParentPrimary").doc().create({
        id: 3,
      })
    );
    q = testPrimaryRef.where("id", "==", 3);
    primarySnapshot = await q.get();
    await assertSucceeds(
      primarySnapshot.docs[0].ref.collection("nested").doc().create({
        id: 3,
        foreign: 3,
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestParentForeign").doc().create({
        id: 1,
        value: "value 1",
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestParentForeign").doc().create({
        id: 2,
        value: "value 2",
      })
    );
    await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestParentForeign").doc().create({
        id: 3,
        value: "value 3",
      })
    );
    await linkDocs(
      db,
      "firestoreAdmin-test-linkTestParentPrimary/nested",
      "foreign",
      "firestoreAdmin-test-linkTestParentForeign",
      "id"
    );
    const checkSnapshot = await assertSucceeds(
      db.collection("firestoreAdmin-test-linkTestParentPrimary").get()
    );
    for (let i = 0; i < checkSnapshot.size; i++) {
      const entryDoc = checkSnapshot.docs[i];
      const nestedSnapshot = await assertSucceeds(
        db.collection(`${entryDoc.ref.path}/nested`).get()
      );
      const foreignDoc = await assertSucceeds(
        nestedSnapshot.docs[0].data().foreign.get()
      );
      const entryId = entryDoc.data().id;
      const foreignEntryValue = foreignDoc.data().value;
      assert.equal(
        `value ${entryId}`,
        foreignEntryValue,
        `Wasn't able to follow the foreign reference ${entryId} to the object.`
      );
    }
  });

  it("Integration test for readExperiment.", async () => {
    const exp = await readExperiment(db, "649f3cffea5a1b2817d17d7e");
    assert.equal(
      exp.experimentId,
      5,
      "experiment experimentId=5 not loaded correctly."
    );
  });

  it("Integration test for readExperiments.", async () => {
    const exp = await readExperiments(db);
    assert.equal(
      exp.length,
      8,
      `${exp.length} was not the expected number of experiment entries.`
    );
    const exp5 = exp.filter((v) => {
      return v.experimentId === 5;
    });
    assert.equal(
      exp5[0].treatmentQuestions.length,
      27,
      `Did not find the expected number of questions in experiment 6.`
    );
  });

  it("Test for createAnswers.", async () => {
    await assertSucceeds(
      db.collection("functionsUtil-createAnswers-test").doc().create({ id: 1 })
    );
    let snapshot = await assertSucceeds(
      db.collection("functionsUtil-createAnswers-test").get()
    );
    const path = snapshot.docs[0].ref.path;
    await createAnswers(db, path, 1, 2, SURVEY_QUESTIONS_JSON);
    snapshot = await assertSucceeds(db.collection(`${path}/answers`).get());
    assert.equal(
      snapshot.docs.length,
      27,
      "Number of survey questions written did not match was expected."
    );
    assert.equal(
      snapshot.docs[0].id,
      "1-161",
      "Did not write what was expected for the questions."
    );
  });

  it("Test for updateAnswer.", async () => {
    await assertSucceeds(
      db.collection("firestoreAdmin-updateAnswer-test").doc().create({ id: 1 })
    );
    let snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-updateAnswer-test").get()
    );
    const path = snapshot.docs[0].ref.path;
    await assertSucceeds(
      db
        .collection(`${path}/answers`)
        .doc("1-1")
        .create({ id: 1, key1: "value1", key2: "value2" })
    );
    const doc = await assertSucceeds(db.doc(`${path}/answers/1-1`).get());
    assert.equal(
      doc.data().key2,
      "value2",
      "Did not create test document with right key2 value."
    );
    const writeTime = await updateAnswer(db, path, 1, 1, { key1: "newValue1" });
    assert.notEqual(writeTime, null);
    const updateDoc = await assertSucceeds(db.doc(`${path}/answers/1-1`).get());
    assert.equal(
      updateDoc.data().key1,
      "newValue1",
      "Did not create test document with right key2 value."
    );
  });

  it("Test for updateParticipantCount", async () => {
    const writeTime = await updateParticipantCount(db, "testbetween", 1);
    assert.notEqual(writeTime, null, "Expected write time to be returned.");
    const expRef = db.collection("experiments");
    const q = expRef.where("prolificStudyId", "==", "testbetween");
    const expSnapshot = await assertSucceeds(q.get());
    assert.equal(
      expSnapshot.docs.length,
      1,
      "Expected to retrieve one experiment"
    );
    assert.equal(expSnapshot.docs[0].data().numParticipantsStarted, 1);
  });

  it("Test for createParticipant", async () => {
    await assertSucceeds(
      db
        .collection("firestoreAdmin-createParticipant-test")
        .doc()
        .create({ id: 1 })
    );
    let snapshot = await assertSucceeds(
      db.collection("firestoreAdmin-createParticipant-test").get()
    );
    const path = snapshot.docs[0].ref.path;
    const data = Participant({
      participantId: 1,
      countryOfResidence: "Country",
      vizFamiliarity: 1,
      age: 55,
      gender: "gender",
      selfDescribeGender: "selfDescribeGender",
      profession: "profession",
      employment: "employment",
      selfDescribeEmployment: "selfDescribeEmployment",
      consentChecked: false,
      timezone: "EST",
      feedback: "feedback",
      userAgent: "userAgent",
    });
    await createParticipant(db, path, data);
    snapshot = await assertSucceeds(
      db.collection(`${path}/participants`).get()
    );
    assert.equal(
      snapshot.docs.length,
      1,
      "Expected one participant document to be retrieved."
    );
    assert.equal(
      snapshot.docs[0].data().participantId,
      1,
      "Did not write what was expected for the participant."
    );
  });
});
