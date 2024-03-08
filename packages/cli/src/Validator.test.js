import { convertFields } from "@the-discounters/types";
import { TEST_BETWEEN_ALL_JSON } from "@the-discounters/test-shared";
import { validateExperimentData } from "./Validator.js";

import { typeStateFields } from "@the-discounters/firebase-test-shared";

describe("Validator tests", () => {
  const typedBetweenAllJson = convertFields(
    TEST_BETWEEN_ALL_JSON,
    typeStateFields
  );
  const result = validateExperimentData(typedBetweenAllJson);
  console.log(result);
  expect(result.length).toBe(1);
});
