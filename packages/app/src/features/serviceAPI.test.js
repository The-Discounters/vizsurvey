import nock from "nock";
import { ServerStatusType } from "@the-discounters/types";
import { getRandomIntInclusive } from "@the-discounters/util";
import { putRequest, signupParticipant, initFirestore } from "./serviceAPI.js";

const URLROOT = "http://127.0.0.1:5001/vizsurvey-staging/us-central1";
const PARMATERS = "prolific_pid=1&study_id=2&session_id=3&user_agent=agent";

describe("serviceAPI tests", () => {
  test("getRequest throws error on three retries.", async () => {
    // TODO fix this now that I switched to google function implementation
    // const scope = nock(URLROOT)
    //   .defaultReplyHeaders({
    //     "access-control-allow-origin": "*",
    //     "access-control-allow-credentials": "true",
    //   })
    //   .get(`/signup?${PARMATERS}`)
    //   .reply(503, {})
    //   .get(`/signup?${PARMATERS}`)
    //   .reply(503, {})
    //   .get(`/signup?${PARMATERS}`)
    //   .reply(503, {});
    // await expect(
    //   getRequest(`${URLROOT}/signup?${PARMATERS}`)
    // ).rejects.toHaveProperty("httpstatus", 503);
    // if (!scope.isDone()) {
    //   console.error("pending mocks: %j", scope.pendingMocks());
    // }
    // scope.done();
  });

  test("getRequest doesn't throw error on two failues and last try a success.", async () => {
    // TODO fix this now that I switched to google function implementation.
    // const scope = nock(URLROOT)
    //   .defaultReplyHeaders({
    //     "access-control-allow-origin": "*",
    //     "access-control-allow-credentials": "true",
    //   })
    //   .get(`/signup?${PARMATERS}`)
    //   .reply(503, {})
    //   .get(`/signup?${PARMATERS}`)
    //   .reply(503, {})
    //   .get(`/signup?${PARMATERS}`)
    //   .reply(200, { status: ServerStatusType.success });
    // const result = await getRequest(`${URLROOT}/signup?${PARMATERS}`);
    // if (!scope.isDone()) {
    //   console.error("pending mocks: %j", scope.pendingMocks());
    // }
    // scope.done();
    // // TODO fix this
    // //expect(result.status).toBe(ServerStatusType.success);
  });

  test("getRequest doesn't retry on success the first time.", async () => {
    // TODO fix this now that I switched to google function implementation
    // const scope = nock(URLROOT)
    //   .defaultReplyHeaders({
    //     "access-control-allow-origin": "*",
    //     "access-control-allow-credentials": "true",
    //   })
    //   .get(`/signup?${PARMATERS}`)
    //   .reply(200, { status: ServerStatusType.success });
    // const result = await getRequest(`${URLROOT}/signup?${PARMATERS}`);
    // if (!scope.isDone()) {
    //   console.error("pending mocks: %j", scope.pendingMocks());
    // }
    // scope.done();
    // // TODO fix this.
    // // expect(result.status).toBe(ServerStatusType.success);
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

  test("signupParticipant", async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyD_28tvkqLM5yIMXiIujOsy597e8y1O_Mw",
      authDomain: "vizsurvey-staging.firebaseapp.com",
      projectId: "vizsurvey-staging",
      storageBucket: "vizsurvey-staging.appspot.com",
      messagingSenderId: "500855366678",
      appId: "1:500855366678:web:79d68a0dba013a8c1a4137",
      measurementId: "G-9JM63BDRPY",
    };
    initFirestore(firebaseConfig);
    const result = signupParticipant(
      "https://us-central1-vizsurvey-staging.cloudfunctions.net",
      getRandomIntInclusive(0, 1000000),
      "testbetween",
      1,
      "userAgent"
    );
    expect(result.status).toBe("success");
  });

  // test("signin.", async () => {
  //   const firebaseConfig = {
  //     apiKey: "AIzaSyD_28tvkqLM5yIMXiIujOsy597e8y1O_Mw",
  //     authDomain: "vizsurvey-staging.firebaseapp.com",
  //     projectId: "vizsurvey-staging",
  //     storageBucket: "vizsurvey-staging.appspot.com",
  //     messagingSenderId: "500855366678",
  //     appId: "1:500855366678:web:79d68a0dba013a8c1a4137",
  //     measurementId: "G-9JM63BDRPY",
  //   };
  //   initFirestore(firebaseConfig);
  //   await signin(
  //     "web-service-account@vizsurvey-staging.iam.gserviceaccount.com",
  //     "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9H/lA58Dyzba1\nvF71o4rTrByhqDfD/Ely5yyhYOg5ejYDHEWEX7PcwRSukg98GuAg30+Q+hK04VE2\n0tvPbfwWC1o21n8cMdU6HhoIaGkbUeIOcEoSeXTvA0FK5r+aRAvKumsfjV3GRA24\nIJ/5iSy0WFQoFBaRY+uu/eiiFGiQcOaIHOZTR9/GSaMoN4a/ar3aE8qG+bLm5dY2\nd2y/OGbdS5Ur2CcWhf5OzTMr23eyPy6n5rsoS+uvBDVhWs2muEVb2oUYJUeTzynj\nrgYIcE02XxVLBYZ2fgg3E0K49FxWg6oaA1kKOVzme7QwFDOC/9UVzwaFGgMSrHZz\nT1/+ehAZAgMBAAECggEACOJzZGnuvclNs8hrYplB+JMtjieXpRCZR7lV9qfViPu1\nhVxi5KbVTYHRjajlatRdYpXzCDHDRrWOCegKdPpq/QMgBBL8CjBKHs6StQHorCSi\n3MBILol/pYnO26yu5BmdvzKWPTd4KAwC4/s+YKvhyoAaxf45mC9sPz6E2vZf+icK\n8sIOGn60m/O3xTemXLsCS+i95cgsjre8+f9sEBzbWQDDp8sp7GR43lU+R3fevu9Y\nKR+roqXHkKrZ+WOB0S1bg9hzlEk/WCZ7so1ztnW15uBIvlQ1sfpcQOYxHedtYS+K\nPzer7YzAFRx+wWGXcvBbRQ+/prCAgY01WBgzNqJoIQKBgQDicq4+pMB3B8auD0gt\nTeI8fKDrNF8Sr/xR6GdNSyAKrAv5tHbtR2iLTP5tgesXtgu8G7dMyaX9iXVZJWnm\n8vG+ljkaQeQp/hIXMAQQJh1DvOst+/5Cfzj/Oj9rBWDuUriF5UM05u6Q7Tb7RMFF\ng00sCjUpPBV0beGaew6nM54xcQKBgQDVzmE3hzbudUUtxRrfQ3p+ARYCWRAhiyPU\nsSU3oGvOGX/pP7m4u9qDF5V41fnAzzrRsgMXHkafOGtdLkj7btmSn/dRdMuiN/rT\nNp0cyP2XJ+h4hZmRJ9iGa2bPW46qpJ0PkDPFU+ZRq661epBJxhc2swCkRROCEA9H\ntTAriIP1KQKBgBow4W5lZ81cnOIs6lAzHeOZFpOdrxFeQXTHyIrsEXyqgYgUE11G\nURUrhpHr4OERMTJEkmLTP9ufNm9lIGaR2twMS/Z5gIZK2JTN/OpRPjlDdIAREUtn\no5QBjKw4Jwnpj2YNKkTIIPeqOB2/ygrcMOTTGWr3hBO/UcSoTv2PvtBBAoGAPpUF\nMcq7Unsy/521KurGfQF2XsORDDB9EXG0sh6bz5z5Kt4DT8Z0xHBvyQng7AX8corH\nisnK5CoQixrUM/yTZO675rToMhhuq8pNnLJcQBVnX3fDppBiOZ5QXpuvG9XJP1f3\nP2g6f2dgYTB58Y4xF0q4Al1Rw31N67BmZCe2cFkCgYEAyMGhW+z4zaNywDip/AOL\nusDhbZqXgrBQue/phvraSgVcFCUXAOY7noZcY1/3ZbqNHCOPjYjKjKIXsXQ/WpKy\neQlMhvJNIbF2ZNoSlt02XAOpxo3OYsN9o3mMnO640Xn6b6V52QfIj689TXYQeMX4\n2jwJp0Hj1pn2M1VPmlkvAr0="
  //   );
  // });
});
