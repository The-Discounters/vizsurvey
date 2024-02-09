import { ServerStatusType, StatusError } from "@the-discounters/types";
import { dateToState } from "@the-discounters/util";
import { DateTime } from "luxon";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const updateStateStack = [];
let callback;
let processingRequests = false;
let requestSequence = 0;
let app;
export let analytics;

export const subscribe = (_callback) => {
  callback = _callback;
};

const setProcessingRequest = (value) => {
  if (processingRequests !== value) {
    processingRequests = value;
    callback(processingRequests);
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
  analytics = getAnalytics(app);
};

export const putRequest = async (URL, body, numRetries = 3) => {
  const response = await fetch(URL, {
    method: "PUT",
    headers: {
      referer: "http://localhost/",
      origin: "http://localhost",
      "access-control-request-method": "PUT",
      "Content-Type": "application/json",
    },
    body: body,
  });
  const result = await response.json();
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
  const response = await fetch(URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
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
  userAgentString
) => {
  const data = await getRequest(
    `${URLRoot}/signup?key=${app.options.apiKey}&prolific_pid=${participantId}&study_id=${studyId}&session_id=${sessionId}&user_agent=${userAgentString}`
  );
  return data;
};

export const processesStateUpdateQueue = async (URLRoot) => {
  setProcessingRequest(true);
  const data = updateStateStack.shift();
  putRequest(`${URLRoot}/updateState`, data).then((serverStatus) => {
    if (updateStateStack.length !== 0) {
      processesStateUpdateQueue(URLRoot);
    } else {
      setProcessingRequest(false);
    }
  });
};

export const updateState = async (
  URLRoot,
  participantId,
  studyId,
  sessionId,
  state
) => {
  const augmentedState = state.browserTimestamp
    ? state
    : {
        ...state,
        browserTimestamp: dateToState(DateTime.now()),
        requestSequence: requestSequence++,
      };
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    state: augmentedState,
  };
  updateStateStack.push(JSON.stringify(data));
  if (!processingRequests) {
    processesStateUpdateQueue(URLRoot);
  }
};
