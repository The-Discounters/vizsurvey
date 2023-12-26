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
import { signupParticipant, readExperiment } from "./functionsUtil.js";
import * as shared from "@the-discounters/firebase-shared";
import { ServerStatusType } from "@the-discounters/types";
import { StatusError } from "@the-discounters/types";

initializeApp();
const db = getFirestore();

export const signup = onRequest(async (request, response) => {
  logger.info(
    `signup prolific_pid=${request.query.prolific_pid},` +
      `study_id=${request.query.study_id},` +
      `session_id=${request.query.session_id}`
  );
  const participantId = request.query.prolific_pid;
  const studyId = request.query.study_id;
  const sessionId = request.query.session_id;
  const userAgent = request.body.user_agent;
  logger.info(
    `...parsed values prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}, userAgent=${userAgent} from request`
  );
  try {
    if (!participantId || !studyId) {
      throw new StatusError({
        message:
          "signup Error with request parameters. prolific_pid or study_id not in request.",
        code: 400,
        reason: ServerStatusType.invalid,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    // TODO put this in a transaction
    logger.info(
      `...fetching experiment for prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
    );
    const exp = await readExperiment(
      db,
      studyId,
      (serverStatus, statusCode, msg) => {
        if (serverStatus === ServerStatusType.success) {
          `${msg}, prolificPid = ${participantId}, studyId = ${studyId}, sessionId = ${sessionId}`;
        } else {
          throw new StatusError({
            message: msg,
            code: statusCode,
            reason: serverStatus,
            participantId,
            studyId,
            sessionId,
            request,
          });
        }
      }
    );
    if (exp.numParticipantsStarted === exp.numParticipants) {
      throw new StatusError({
        message: `signup participant tried starting survey after the number of participants (${exp.numParticipants}) has been fulfilled`,
        code: 400,
        reason: ServerStatusType.ended,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    logger.info(
      `...signup Calculating participant number for experimentId ${exp.experimentId}, participantId ${participantId}`
    );
    const newExpCount = exp.numParticipantsStarted + 1;
    const updateTime = await shared.updateParticipantCount(
      db,
      studyId,
      newExpCount
    );
    logger.info(
      `...signup Assigned participant number ${newExpCount}, experimentId ${
        exp.experimentId
      }, participantId ${participantId}, on ${updateTime.toDate()}`
    );
    logger.info(
      `...signup Signing up participant for experimentId ${exp.experimentId}, participantId ${participantId}`
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
            participantId,
            studyId,
            sessionId,
            request,
          });
        }
      }
    );
    response
      .status(200)
      .json({ ...signupData, status: ServerStatusType.success });
  } catch (err) {
    logger.error(
      `signup ${err.message}  participantId=${err.participantId}, studyId=${err.studyId}, sessionId=${err.sessionId}`
    );
    response
      .status(err.code ? err.code : 500)
      .json({ status: err.reason ? err.reason : ServerStatusType.error });
  }
});

export const updateAnswer = onRequest(async (request, response) => {
  logger.info(
    `updateAnswer prolific_pid=${request.body.prolific_pid}, study_id=${request.body.study_id}, session_id=${request.body.session_id}`
  );
  try {
    const participantId = request.body.prolific_pid;
    const studyId = request.body.study_id;
    const sessionId = request.body.session_id;
    const answer = request.body.answer;
    if (!participantId || !studyId) {
      throw new StatusError({
        message:
          "updateAnswer Error with request parameters. prolific_pid or study_id not in request.",
        code: 400,
        reason: ServerStatusType.invalid,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    if (!answer || !answer.treatmentQuestionId) {
      throw new StatusError({
        message:
          "updateAnswer Error with request parameters. answer or answer.treatmentQuestionId not in request.",
        code: 400,
        reason: ServerStatusType.invalid,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    const exp = await readExperiment(
      db,
      studyId,
      (serverStatus, statusCode, msg) => {
        if (serverStatus === ServerStatusType.success) {
          logger.info(
            `${msg}, prolificPid = ${participantId}, studyId = ${studyId}, sessionId = ${sessionId}`
          );
        } else {
          throw new StatusError({
            message: msg,
            code: statusCode,
            reason: serverStatus,
            participantId,
            studyId,
            sessionId,
            request,
          });
        }
      }
    );
    const writeTime = await shared.updateAnswer(
      db,
      exp.path,
      participantId,
      answer.treatmentQuestionId,
      answer
    );
    if (!writeTime) {
      throw new StatusError({
        message: `updateAnswer did not update for ${answer.treatmentQuestionId}`,
        code: 400,
        reason: ServerStatusType.invalid,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    logger.info(
      `updateAnswer succesfull participantId=${participantId}, study_id=${studyId}, session_id=${sessionId}, treatmentQuestionId=${
        answer.treatmentQuestionId
      } answer update time ${writeTime.toDate()}`
    );
    response.status(200).json({ status: ServerStatusType.success });
  } catch (err) {
    logger.error(
      ` updateAnswer ${err.message}  participantId=${err.participantId}, studyId=${err.studyId}, sessionId=${err.sessionId}, treatmentQuestionId=${answer.treatmentQuestionId}`
    );
    response
      .status(err.code ? err.code : 500)
      .json({ status: err.reason ? err.reason : ServerStatusType.error });
  }
});

export const writeState = onRequest(async (request, response) => {
  logger.info(
    `writeState prolific_pid=${request.query.prolific_pid},` +
      `study_id=${request.query.study_id},` +
      `session_id=${request.query.session_id}`
  );
  try {
    const participantId = request.query.prolific_pid;
    const studyId = request.query.study_id;
    const sessionId = request.query.session_id;

    if (!participantId || !studyId) {
      throw new StatusError({
        message:
          "writeState Error with request parameters. prolific_pid or study_id not in request.",
        code: 400,
        reason: ServerStatusType.invalid,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    // TODO add code to write state
    response.status(200).json({ add: "ResponseData" });
  } catch (err) {
    logger.error(
      `writeState ${err.message}  participantId=${err.participantId}, studyId=${err.studyId}, sessionId=${err.sessionId}`
    );
    response
      .status(err.code ? err.code : 500)
      .json({ status: err.reason ? err.reason : ServerStatusType.error });
  }
});
