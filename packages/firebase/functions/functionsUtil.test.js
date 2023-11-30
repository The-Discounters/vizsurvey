import { strict as assert } from "assert";
import { assertSucceeds } from "@firebase/rules-unit-testing";
import { calcTreatmentIds, createQuestions } from "./functionsUtil.js";
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
    const latinSquare =
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]";
    const result = calcTreatmentIds(latinSquare, 0);
    assert.equal(
      arraysEqual([1, 2, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for calcTreatmentIds.", async () => {
    const latinSquare =
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]";
    const result = calcTreatmentIds(latinSquare, 5);
    assert.equal(
      arraysEqual([2, 1, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for calcTreatmentIds.", async () => {
    const latinSquare =
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]";
    const result = calcTreatmentIds(latinSquare, 6);
    assert.equal(
      arraysEqual([1, 2, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for createQuestions.", async () => {
    const result = createQuestions("parent-path", TREATMENT_QUESTIONS_JSON);
    assert.equal(48, result.length, "Returned array was not expected size.");
    assert.equal(
      "parent-path/21",
      result[0].path,
      "path property did not match the expected value 'parent-path/21'"
    );
  });

  it("Test for orderQuestions.", async () => {
    const result = createQuestions("parent-path", TREATMENT_QUESTIONS_JSON);
    assert.equal(48, result.length, "Returned array was not expected size.");
    assert.equal(
      "parent-path/21",
      result[0].path,
      "path property did not match the expected value 'parent-path/21'"
    );
  });
});
