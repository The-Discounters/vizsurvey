import { strict as assert } from "assert";
import { assertSucceeds } from "@firebase/rules-unit-testing";
import { group } from "d3";
import {
  calcTreatmentIds,
  createQuestions,
  filterQuestions,
  parseQuestions,
  orderQuestions,
  orderQuestionsRandom,
  writeQuestions,
} from "./functionsUtil.js";
import {
  initBatch,
  setBatchItem,
  commitBatch,
  initFirestore,
  deleteCollection,
} from "@the-discounters/firebase-shared";
import TREATMENT_QUESTIONS_JSON from "./treatmentQuestionsTest.json" assert { type: "json" };
import QUESTIONS_JSON from "./questionsTest.json" assert { type: "json" };
import ADMIN_CREDS from "../../../admin-credentials-dev.json" assert { type: "json" };

// this needs to match the value that is passed to firebase emulators:start --project=
const PROJECT_ID = "vizsurvey-test";

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

describe("functionsUtil test ", () => {
  let app, db;

  before(async () => {
    const result = initFirestore(
      PROJECT_ID,
      "https://vizsurvey-test.firebaseio.com/",
      ADMIN_CREDS
    );
    app = result.app;
    db = result.db;
    //await deleteCollection(db, "functionsUtil-writeQuestions-test");
  });

  after(async () => {
    //await deleteCollection(db, "functionsUtil-writeQuestions-test");
  });

  // it("Integration test for batch writing data to firestore null id field.", async () => {
  //   initBatch(db, "firestoreAdmin-test-batch-idfield-null");
  //   setBatchItem(null, { item1: "value1" });
  //   await commitBatch();
  //   const snapshot = await assertSucceeds(
  //     db.collection("firestoreAdmin-test-batch-idfield-null").get()
  //   );
  //   assert.equal(
  //     "value1",
  //     snapshot.docs[0].data()["item1"],
  //     `Did not read back what was written.  ${
  //       snapshot.docs[0].data()["item1"]
  //     } doesn't equal 'value1'`
  //   );
  // });

  it("Test for calcTreatmentIds .", async () => {
    const latinSquare = JSON.parse(
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]"
    );
    const result = calcTreatmentIds(latinSquare, 0);
    assert.equal(
      arraysEqual([1, 2, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for calcTreatmentIds.", async () => {
    const latinSquare = JSON.parse(
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]"
    );
    const result = calcTreatmentIds(latinSquare, 5);
    assert.equal(
      arraysEqual([2, 1, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for calcTreatmentIds.", async () => {
    const latinSquare = JSON.parse(
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]"
    );
    const result = calcTreatmentIds(latinSquare, 6);
    assert.equal(
      arraysEqual([1, 2, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for filterQuestions between subject study (treatmentIds array like [1]).", async () => {
    const result = filterQuestions([1], TREATMENT_QUESTIONS_JSON);
    assert.equal(result.length, 9, "Returned array was not expected size.");
  });

  it("Test for filterQuestions for within subject study (treatmentIds array like [1,2,3]).", async () => {
    const result = filterQuestions([1, 2, 3], TREATMENT_QUESTIONS_JSON);
    assert.equal(result.length, 27, "Returned array was not expected size.");
  });

  it("Test for createQuestions for within subject study (treatmentIds array like [1,2,3]).", async () => {
    const result = createQuestions(1, 2, 3, TREATMENT_QUESTIONS_JSON);
    assert.equal(result.length, 27, "Returned array was not expected size.");
    assert.notEqual(
      result,
      TREATMENT_QUESTIONS_JSON,
      "Arrays should not point to the same reference."
    );
  });

  it("Test for createQuestions for between subject study (treatmentIds array like [1]).", async () => {
    const result = createQuestions(1, 2, 3, TREATMENT_QUESTIONS_JSON);
    assert.equal(result.length, 27, "Returned array was not expected size.");
    assert.notEqual(
      result,
      TREATMENT_QUESTIONS_JSON,
      "Arrays should not point to the same reference."
    );
  });

  it("Test for parseQuestions.", async () => {
    const { instruction, survey } = parseQuestions(TREATMENT_QUESTIONS_JSON);
    assert.equal(
      instruction.length,
      3,
      "Returned instruction array was not expected size."
    );
    assert.equal(
      survey.length,
      24,
      "Returned survey array was not expected size."
    );
  });

  const assertCorrectOrder = (result) => {
    for (let i = 1; i < result.length; i++) {
      if (result[i - 1].treatment_id === result[i].treatment_id) {
        assert.equal(
          result[i - 1].sequence_id < result[i].sequence_id,
          true,
          `Question number ${i} was out of order.`
        );
      } else if (result[i - 1].treatment_id < result[i].treatment_id) {
        assert.equal(
          result[i].sequence_id,
          1,
          "First question in a treatment should be sequence number 1."
        );
      } else {
        fail(
          `Treatment id ${result[i - 1].treatment_id} was larger than ${
            result[i].treatment_id
          }`
        );
      }
    }
  };

  it("Test for orderQuestions for within subject study (latin square 1, 2, 3]).", async () => {
    const grouped = group(
      TREATMENT_QUESTIONS_JSON,
      (d) => d.instruction_question
    );
    const q = grouped.get(false);
    const result = orderQuestions(q, [1, 2, 3]);
    assertCorrectOrder(result);
  });

  it("Test for orderQuestionsRandom for within subject study (latin square 1, 2, 3]).", async () => {
    const grouped = group(
      TREATMENT_QUESTIONS_JSON,
      (d) => d.instruction_question
    );
    const q = grouped.get(false);
    let result = orderQuestionsRandom(q, [1, 2, 3]);
    assert.notEqual(
      result,
      q,
      "Array instance returned should not be the same as parameter value."
    );
    assertCorrectOrder(result);
    const first = result.map((v) => v.id);
    result = orderQuestionsRandom(q, [1, 2, 3]);
    assertCorrectOrder(result);
    const second = result.map((v) => v.id);
    assert.notDeepEqual(
      first,
      second,
      "Order of entries returned by orderQuestionsRandom was the same which is higly unlikely but possible."
    );
  });

  it("Test for writeQuestions.", async () => {
    await writeQuestions(
      db,
      "functionsUtil-writeQuestions-test",
      QUESTIONS_JSON
    );
  });
});
