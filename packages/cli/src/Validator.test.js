import { convertFields } from "@the-discounters/types";
import { TEST_BETWEEN_ALL_JSON } from "@the-discounters/test-shared";
import { validateExperimentData } from "./Validator.js";

import { typeStateFields } from "@the-discounters/firebase-test-shared";

describe("Validator tests", () => {
  it("validateExperimentData.", async () => {
    const typedBetweenAllJson = convertFields(
      TEST_BETWEEN_ALL_JSON,
      typeStateFields
    );
    const participants = typedBetweenAllJson.participants;
    const audit = typedBetweenAllJson.audit;
    delete typedBetweenAllJson.participants;
    delete typedBetweenAllJson.audit;
    const result = validateExperimentData(
      typedBetweenAllJson,
      participants,
      audit
    );
    // TODO I need to flush out this expected criteria.
    expect(result.length).toBe(9);
  });
});
