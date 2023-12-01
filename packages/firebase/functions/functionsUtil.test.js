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
} from "./functionsUtil.js";
import TREATMENT_QUESTIONS_JSON from "./treatmentQuestionsTest.json" assert { type: "json" };

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
    const result = createQuestions("parent-path", TREATMENT_QUESTIONS_JSON);
    assert.equal(result.length, 27, "Returned array was not expected size.");
    assert.equal(
      "parent-path/178",
      result[0].path,
      "path property did not match the expected value 'parent-path/21'"
    );
    assert.notEqual(
      result,
      TREATMENT_QUESTIONS_JSON,
      "Arrays should not point to the same reference."
    );
  });

  it("Test for createQuestions for between subject study (treatmentIds array like [1]).", async () => {
    const result = createQuestions("parent-path", TREATMENT_QUESTIONS_JSON);
    assert.equal(result.length, 27, "Returned array was not expected size.");
    assert.equal(
      result[0].path,
      "parent-path/178",
      "path property did not match the expected value."
    );
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
});
