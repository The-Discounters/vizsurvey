import nock from "nock";
import { ServerStatusType } from "@the-discounters/types";
import { putRequest, getRequest } from "./serviceAPI.js";

const URLROOT = "http://127.0.0.1:5001/vizsurvey-staging/us-central1";
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
      getRequest(`${URLROOT}/signup?${PARMATERS}`)
    ).rejects.toHaveProperty("httpstatus", 503);
    if (!scope.isDone()) {
      console.error("pending mocks: %j", scope.pendingMocks());
    }
    scope.done();
  });

  test("getRequest doesn't throw error on two failues and last try a success.", async () => {
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
      .reply(200, { status: ServerStatusType.success });
    const result = await getRequest(`${URLROOT}/signup?${PARMATERS}`);
    if (!scope.isDone()) {
      console.error("pending mocks: %j", scope.pendingMocks());
    }
    scope.done();
    // TODO fix this
    //expect(result.status).toBe(ServerStatusType.success);
  });

  test("getRequest doesn't retry on success the first time.", async () => {
    const scope = nock(URLROOT)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get(`/signup?${PARMATERS}`)
      .reply(200, { status: ServerStatusType.success });
    const result = await getRequest(`${URLROOT}/signup?${PARMATERS}`);
    if (!scope.isDone()) {
      console.error("pending mocks: %j", scope.pendingMocks());
    }
    scope.done();
    // TODO fix this.
    // expect(result.status).toBe(ServerStatusType.success);
  });

  test("putRequest throws error on three retries.", async () => {
    const scope = nock(URLROOT)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "content-type",
        "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "content-type": "application/json",
      })
      .intercept("/updateState", "OPTIONS")
      .reply(200)
      .put("/updateState", '{"value":1}')
      .reply(503, {})
      .intercept("/updateState", "OPTIONS")
      .reply(200)
      .put("/updateState", '{"value":1}')
      .reply(503, {})
      .intercept("/updateState", "OPTIONS")
      .reply(200)
      .put("/updateState", '{"value":1}')
      .reply(503, {});
    await expect(
      putRequest(`${URLROOT}/updateState`, { value: 1 })
    ).rejects.toHaveProperty("httpstatus", 503);
    if (!scope.isDone()) {
      console.error("pending mocks: %j", scope.pendingMocks());
    }
    scope.done();
  });

  test("putRequest doesn't throw error on two failues and last try a success.", async () => {
    const scope = nock(URLROOT)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "content-type",
        "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "content-type": "application/json",
      })
      .intercept("/updateState", "OPTIONS")
      .reply(200)
      .put("/updateState", '{"value":1}')
      .reply(503, {})
      .intercept("/updateState", "OPTIONS")
      .reply(200)
      .put("/updateState", '{"value":1}')
      .reply(503, {})
      .intercept("/updateState", "OPTIONS")
      .reply(200)
      .put("/updateState", '{"value":1}')
      .reply(200, { status: ServerStatusType.success });
    const result = await putRequest(`${URLROOT}/updateState`, { value: 1 });
    if (!scope.isDone()) {
      console.error("pending mocks: %j", scope.pendingMocks());
    }
    scope.done();
    // TODO fix this.
    // expect(result.status).toBe(ServerStatusType.success);
  });

  test("putRequest doesn't retry on success the first time.", async () => {
    const scope = nock(URLROOT)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get(`/signup`)
      .reply(200, { status: ServerStatusType.success });
    const result = await putRequest(`${URLROOT}/updateState`, {});
    if (!scope.isDone()) {
      console.error("pending mocks: %j", scope.pendingMocks());
    }
    scope.done();
    // TODO fix this.
    // expect(result.status).toBe(ServerStatusType.success);
  });
});
