import { ServerStatusType, StatusError } from "@the-discounters/types";

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
      code: response.status,
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
      code: response.status,
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

export const updateAnswer = async (
  participantId,
  studyId,
  sessionId,
  answer
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    answer: answer,
  };
  await putRequest(data, "updateAnswer");
};

export const updateConsentShown = async (
  participantId,
  studyId,
  sessionId,
  timestamp
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    consentShownTimestamp: timestamp,
  };
  await putRequest(data, "updateConsentShown");
};

export const updateConsentCompleted = async (
  participantId,
  studyId,
  sessionId,
  payload
) => {
  const updateData = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    payload: payload,
  };
  await putRequest(updateData, "updateConsentCompleted");
};

export const updateInstructionsShown = async (
  participantId,
  studyId,
  sessionId,
  timestamp
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    instructionsShownTimestamp: timestamp,
  };
  await putRequest(data, "updateInstructionsShown");
};

export const updateInstructionsCompleted = async (
  participantId,
  studyId,
  sessionId,
  payload
) => {
  const updateData = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    payload: payload,
  };
  await putRequest(updateData, "updateInstructionsCompleted");
};

export const updateMCLInstructionsShown = async (
  participantId,
  studyId,
  sessionId,
  MCLInstructionShownTimestamps
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    payload: { MCLInstructionShownTimestamp: MCLInstructionShownTimestamps },
  };
  await putRequest(data, "updateMCLInstructionsShown");
};

export const updateMCLInstructionsCompleted = async (
  participantId,
  studyId,
  sessionId,
  timestamps
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    payload: { MCLInstructionCompletedTimestamp: timestamps },
  };
  await putRequest(data, "updateMCLInstructionsCompleted");
};

export const updateDemographic = async (
  participantId,
  studyId,
  sessionId,
  demograhics
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    demographics: demograhics,
  };
  await putRequest(data, "updateDemographic");
};

export const updateMCLInstructions = async (
  participantId,
  studyId,
  sessionId,
  MCLInstructions
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    MCLInstructions: MCLInstructions,
  };
  await putRequest(data, "updateMCLInstructions");
};

export const updateExperienceSurvey = async (
  participantId,
  studyId,
  sessionId,
  survey
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    survey: survey,
  };
  await putRequest(data, "updateExperienceSurvey");
};

export const updateFinancialLitSurvey = async (
  participantId,
  studyId,
  sessionId,
  survey
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    survey: survey,
  };
  await putRequest(data, "updateFinancialLitSurvey");
};

export const updatePurposeSurvey = async (
  participantId,
  studyId,
  sessionId,
  survey
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    survey: survey,
  };
  await putRequest(data, "updatePurposeSurvey");
};

export const updateDebrief = async (
  participantId,
  studyId,
  sessionId,
  debrief
) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    survey: debrief,
  };
  await putRequest(data, "updateDebrief");
};

export const updateState = async (participantId, studyId, sessionId, state) => {
  const data = {
    prolific_pid: participantId,
    study_id: studyId,
    session_id: sessionId,
    state: state,
  };
  await putRequest(data, "updateState");
};
