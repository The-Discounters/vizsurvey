import { TEST_BETWEEN_ALL_JSON } from "@the-discounters/test-shared";
import { validateExperimentData } from "./Validator.js";

describe("Validator tests", () => {
  const result = validateExperimentData(TEST_BETWEEN_ALL_JSON);
  console.log(result);
  expect(result.length).toBe(1);
});
