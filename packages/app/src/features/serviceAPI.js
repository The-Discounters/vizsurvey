import { ServerStatusType, StatusError } from "@the-discounters/types";
import { dateToState } from "@the-discounters/util";
import { DateTime } from "luxon";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

let callback;
let activePutRequestCount = 0;
let requestSequence = 0;
let app;
export let analytics;

export const subscribe = (_callback) => {
  callback = _callback;
};

const incActivePutRequestCount = () => {
  activePutRequestCount++;
  if (activePutRequestCount === 1 && callback) {
    callback(true);
  }
};

const decActivePutRequestCount = () => {
  activePutRequestCount--;
  console.assert(activePutRequestCount >= 0);
  if (activePutRequestCount === 0 && callback) {
    callback(false);
  }
};

export const initFirestore = ({
  apiKey,
  authDomain,
  projectId,
  messagingSenderId,
  appId,
  measurementId,
}) => {
  app = initializeApp({
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
  });
  isSupported().then((value) => {
    if (value) {
      analytics = getAnalytics(app);
    }
  });
};

export const putRequest = async (URL, body, numRetries = 3) => {
  incActivePutRequestCount();
  const response = await fetch(URL, {
    method: "PUT",
    headers: {
      "access-control-request-method": "PUT",
      "Content-Type": "application/json",
    },
    body: body,
  });
  const result = await response.json();
  decActivePutRequestCount();
  if (response.status !== 200 || result.status !== ServerStatusType.success) {
    if (numRetries > 1 && response.status >= 500 && response.status <= 599) {
      numRetries--;
      await putRequest(URL, body, numRetries);
    } else {
      throw new StatusError({
        message: `Server error when putting data to ${URL}!`,
        httpstatus: response.status,
        reason: result.status,
      });
    }
  }
  return result;
};

export const getRequest = async (URL, numRetries = 3) => {
  incActivePutRequestCount();
  const response = await fetch(URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  decActivePutRequestCount();
  if (response.status !== 200 || data.status !== ServerStatusType.success) {
    if (numRetries > 1 && response.status >= 500 && response.status <= 599) {
      numRetries--;
      await getRequest(URL, numRetries);
    } else {
      throw new StatusError({
        message: `Server error when getting data from ${URL}!`,
        httpstatus: response.status,
        reason: data.status,
      });
    }
  }
  return data;
};

export const signupParticipant = async (
  URLRoot,
  participantId,
  studyId,
  sessionId,
  userAgentString,
  treatmentIds = null
) => {
  const data = await getRequest(
    `${URLRoot}/signup?key=${
      app.options.apiKey
    }&prolific_pid=${participantId}&study_id=${studyId}&session_id=${sessionId}&user_agent=${userAgentString}${
      treatmentIds ? "&treatment_ids=" + encodeURIComponent(treatmentIds) : ""
    }`
  );
  return data;
};

export const updateState = async (
  URLRoot,
  participantId,
  studyId,
  sessionId,
  state
) => {
  requestSequence++;
  const augmentedState = state.browserTimestamp
    ? {
        ...state,
        requestSequence: requestSequence,
        browserTimestamp: state.browserTimestamp,
      }
    : {
        ...state,
        requestSequence: requestSequence,
        browserTimestamp: dateToState(DateTime.now()),
      };
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    state: augmentedState,
  };
  putRequest(`${URLRoot}/updateState`, JSON.stringify(data));
};

export const readExperimentConfigurations = async (
  URLRoot,
  studyIds,
  treatmentIds,
  questionOrderIds
) => {
  const URL = `${URLRoot}/readExperimentConfigurations?key=${
    app.options.apiKey
  }&study_ids=${encodeURIComponent(
    studyIds
  )}&treatment_ids=${encodeURIComponent(
    treatmentIds
  )}&question_order_ids=${encodeURIComponent(questionOrderIds)}`;
  const data = await getRequest(URL);
  return data;
};
