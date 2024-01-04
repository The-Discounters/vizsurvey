import { ServerStatusType, StatusError } from "@the-discounters/types";
import { dateToState } from "@the-discounters/util";
import { DateTime } from "luxon";

const putRequest = async (data, URLSubdirectory) => {
  const URL = `${process.env.REACT_APP_SERVER_URL}/${URLSubdirectory}`;
  const response = await fetch(URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (response.status !== 200 || result.status !== ServerStatusType.success) {
    throw new StatusError({
      message: `Server error when putting data to ${URL}!`,
      httpstatus: response.status,
      reason: result.status,
    });
  }
};

const getRequest = async (URLSubdirectory, parameters) => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/${URLSubdirectory}?${parameters}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await response.json();
  if (response.status !== 200 || data.status !== ServerStatusType.success) {
    throw new StatusError({
      message: "initializeSurvey server error!",
      httpstatus: response.status,
      reason: data.status,
    });
  }
  return data;
};

export const signupParticipant = async (
  participantId,
  studyId,
  sessionId,
  userAgentString
) => {
  const data = await getRequest(
    "signup",
    `prolific_pid=${participantId}&study_id=${studyId}&session_id=${sessionId}&user_agent=${userAgentString}`
  );
  return data;
};

export const updateState = async (participantId, studyId, sessionId, state) => {
  const augmentedState = state.browserTimestamp
    ? state
    : {
        ...state,
        browserTimestamp: dateToState(DateTime.now()),
      };
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    state: augmentedState,
  };
  await putRequest(data, "updateState");
};
