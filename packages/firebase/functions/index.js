/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import {
  signupParticipant,
  readExperiment,
  validateExperiment,
} from "./functionsUtil.js";
import * as shared from "@the-discounters/firebase-shared";
import { ServerStatusType } from "@the-discounters/types";
import { StatusError } from "@the-discounters/types";

initializeApp();
const db = getFirestore();

const parseKeyFromQuery = (request) => {
  const participantId = request.query.prolific_pid;
  const studyId = request.query.study_id;
  const sessionId = request.query.session_id;
  return { participantId, studyId, sessionId };
};

const parseKeyFromBody = (request) => {
  const participantId = request.body.prolific_pid;
  const studyId = request.body.study_id;
  const sessionId = request.body.session_id;
  return { participantId, studyId, sessionId };
};

const validateKeyValues = ({ participantId, studyId, sessionId }) => {
  if (!participantId || !studyId) {
    throw new StatusError({
      message: `Error with request parameters. prolific_pid or study_id not in request.`,
      code: 400,
      reason: ServerStatusType.invalid,
      participantId,
      studyId,
      sessionId,
    });
  }
  return { participantId, studyId, sessionId };
};

export const signup = onRequest(async (request, response) => {
  logger.info(
    `signup prolific_pid=${request.query.prolific_pid}, study_id=${request.query.study_id}, session_id=${request.query.session_id}`
  );
  const { participantId, studyId, sessionId } = parseKeyFromQuery(request);
  const userAgent = request.query.user_agent;
  try {
    validateKeyValues({ participantId, studyId, sessionId });
    // TODO put this in a transaction
    logger.info(
      `signup fetching experiment for prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
    );
    const exp = validateExperiment(await readExperiment(db, studyId));
    logger.info(
      `signup fetched experiment ${exp.experimentId} for studyId=${studyId}, numParticipantsStarted = ${exp.numParticipantsStarted}, numParticipants = ${exp.numParticipants}, status = ${exp.status}, prolificPid = ${participantId}, sessionId = ${sessionId}`
    );
    if (exp.numParticipantsStarted === exp.numParticipants) {
      throw new StatusError({
        message: `participant tried starting survey after the number of participants (${exp.numParticipants}) has been fulfilled`,
        code: 400,
        reason: ServerStatusType.ended,
      });
    }
    logger.info(
      `signup Calculating participant number for experimentId ${exp.experimentId}, participantId ${participantId}`
    );
    const newExpCount = exp.numParticipantsStarted + 1;
    const updateTime = await shared.updateParticipantCount(
      db,
      studyId,
      newExpCount
    );
    logger.info(
      `signup Assigned participant number ${newExpCount}, experimentId ${
        exp.experimentId
      }, participantId ${participantId}, on ${updateTime.toDate()}`
    );
    logger.info(
      `signup Signing up participant for experimentId ${exp.experimentId}, participantId ${participantId}`
    );
    const signupData = await signupParticipant(
      db,
      participantId,
      studyId,
      sessionId,
      exp,
      (isError, msg) => {
        if (!isError) {
          logger.info(msg);
        } else {
          throw new StatusError({
            message: msg,
            code: 500,
            reason: ServerStatusType.error,
          });
        }
      }
    );
    response
      .status(200)
      .json({ ...signupData, status: ServerStatusType.success });
  } catch (err) {
    logger.error(
      `signup ${err.message} participantId=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
    );
    response
      .status(err.code ? err.code : 500)
      .json({ status: err.reason ? err.reason : ServerStatusType.error });
  }
});

export const updateState = onRequest(async (request, response) => {
  logger.info(
    `updateState prolific_pid=${request.body.prolific_pid}, study_id=${request.body.study_id}, session_id=${request.body.session_id}`
  );
  const { participantId, studyId, sessionId } = parseKeyFromBody(request);
  try {
    validateKeyValues({ participantId, studyId, sessionId });
    const state = request.body.state;
    if (!state) {
      throw new StatusError({
        message: "Error with request parameters. payload not in request.",
        code: 400,
        reason: ServerStatusType.invalid,
      });
    }
    const exp = await validateExperiment(await readExperiment(db, studyId));
    logger.info(
      `updateState fetched experiment ${exp.experimentId} for studyId=${studyId}, numParticipantsStarted = ${exp.numParticipantsStarted}, numParticipants = ${exp.numParticipants}, status = ${exp.status}, prolificPid = ${participantId}, sessionId = ${sessionId}`
    );
    const writeTime = await shared.updateParticipant(
      db,
      exp.path,
      participantId,
      state
    );
    if (!writeTime) {
      throw new StatusError({
        message: "did not update.",
        code: 400,
        reason: ServerStatusType.invalid,
      });
    }
    logger.info(
      `updateState succesfull participantId=${participantId}, study_id=${studyId}, session_id=${sessionId} update time ${writeTime.toDate()}`
    );
    response.status(200).json({ status: ServerStatusType.success });
  } catch (err) {
    logger.error(
      `updateState ${err.message} participantId=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
    );
    response
      .status(err.code ? err.code : 500)
      .json({ status: err.reason ? err.reason : ServerStatusType.error });
  }
});
