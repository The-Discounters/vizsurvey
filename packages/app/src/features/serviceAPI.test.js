import nock from "nock";
import { StatusError } from "@the-discounters/types";

import { putRequest, getRequest } from "./serviceAPI.js";

const URLROOT = "http://localhost:5001/vizsurvey-test/us-central1";
const PARMATERS = "prolific_pid=1&study_id=2&session_id=3&user_agent=agent";

describe("serviceAPI tests", () => {
  test("getRequest throws error on three retries.", async () => {
    const scope = nock(URLROOT)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get(`/signup?${PARMATERS}`)
      .reply(503, {})
      .get(`/signup?${PARMATERS}`)
      .reply(503, {})
      .get(`/signup?${PARMATERS}`)
      .reply(503, {});
    await expect(
      getRequest(`${URLROOT}/signup`, `${PARMATERS}`)
    ).rejects.toHaveProperty("httpstatus", 503);
    scope.done();
  });
});
