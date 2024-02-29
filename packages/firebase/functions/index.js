/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { stateToDate } from "@the-discounters/util";
import { ServerStatusType, StatusError } from "@the-discounters/types";
import {
  readParticipant,
  updateParticipant,
  createAuditLogEntry,
  readExperimentAndQuestions,
} from "@the-discounters/firebase-shared";
import {
  signupParticipant,
  validateExperiment,
  assignParticipantSequenceNumberXaction,
} from "./functionsUtil.js";
import pkgJSON from "./package.json" assert { type: "json" };

initializeApp();
const db = getFirestore();

const CORS_URLS = process.env.CORS_URLS ? process.env.CORS_URLS.split(",") : [];

logger.info(`CORS_URLS=${CORS_URLS}`);

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
      httpstatus: 400,
      reason: ServerStatusType.invalid,
      participantId,
      studyId,
      sessionId,
    });
  }
  return { participantId, studyId, sessionId };
};

// TODO fix cors to use CORS_URL since we can then specify the urls per environment.
export const signup = onRequest(
  {
    cors: [
      "https://localhost:3000",
      "https://staging.d2ptxb5fbsc082.amplifyapp.com",
      "https://release.d2ptxb5fbsc082.amplifyapp.com",
    ],
  },
  async (request, response) => {
    logger.info(
      `signup prolific_pid=${request.query.prolific_pid}, study_id=${request.query.study_id}, session_id=${request.query.session_id}`
    );
    const { participantId, studyId, sessionId } = parseKeyFromQuery(request);
    const userAgent = request.query.user_agent;
    try {
      validateKeyValues({ participantId, studyId, sessionId });
      logger.info(
        `signup fetching experiment for prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      const { experimentId, sequenceNumber } =
        await assignParticipantSequenceNumberXaction(db, studyId);
      logger.info(
        `signup Assigned participant number ${sequenceNumber}, experimentId ${experimentId}, participantId ${participantId}.`
      );
      logger.info(
        `signup reading back experiment for prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      const exp = validateExperiment(
        await readExperimentAndQuestions(db, studyId)
      );
      // It's possible other participants signed up and the count increased so we can't check equal to
      if (exp.numParticipantsStarted < sequenceNumber) {
        logger.warning(
          `signup read back experiment with numParticipantsStarted ${exp.numParticipantsStarted} which is less than the value ${sequenceNumber} when it should be equal to or greater than.`
        );
      }
      logger.info(
        `signup Signing up participant for experimentId ${exp.experimentId}, participantId ${participantId}, server assigned sequence ${sequenceNumber}`
      );
      const signupData = await signupParticipant(
        db,
        participantId,
        studyId,
        sessionId,
        sequenceNumber,
        exp,
        (isError, msg) => {
          if (!isError) {
            logger.info(msg);
          } else {
            throw new StatusError({
              message: msg,
              httpstatus: 500,
              reason: ServerStatusType.error,
            });
          }
        }
      );
      const sendbackData = { ...signupData, status: ServerStatusType.success };
      logger.info(
        `signup Senging back singup data ${JSON.stringify(
          sendbackData
        )} for experimentId ${
          exp.experimentId
        }, participantId ${participantId}, server assigned sequence ${sequenceNumber}`
      );
      response.status(200).json(sendbackData);
    } catch (err) {
      logger.error(
        `signup ${err.message} participantId=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      response
        .status(err.httpstatus ? err.httpstatus : 500)
        .json({ status: err.reason ? err.reason : ServerStatusType.error });
    }
  }
);

export const updateState = onRequest(
  {
    cors: [
      "https://localhost:3000",
      "https://staging.d2ptxb5fbsc082.amplifyapp.com",
      "https://release.d2ptxb5fbsc082.amplifyapp.com",
    ],
  },
  async (request, response) => {
    logger.info(
      `updateState prolific_pid=${request.body.prolific_pid}, study_id=${request.body.study_id}, session_id=${request.body.session_id}`
    );
    const { participantId, studyId, sessionId } = parseKeyFromBody(request);
    let requestSequence;
    try {
      validateKeyValues({ participantId, studyId, sessionId });
      let state = request.body.state;
      requestSequence = state.requestSequence;
      if (!state) {
        throw new StatusError({
          message: "Error with request parameters. payload not in request.",
          httpstatus: 400,
          reason: ServerStatusType.invalid,
        });
      }
      const exp = await validateExperiment(
        await readExperimentAndQuestions(db, studyId)
      );
      logger.info(
        `updateState requestSequence=${requestSequence} fetched experiment ${exp.experimentId} for studyId=${studyId}, numParticipantsStarted = ${exp.numParticipantsStarted}, numParticipants = ${exp.numParticipants}, status = ${exp.status}, prolificPid = ${participantId}, sessionId = ${sessionId}`
      );
      state = { ...state, serverTimestamp: Timestamp.now() };
      state.browserTimestamp = state.browserTimestamp
        ? Timestamp.fromDate(stateToDate(state.browserTimestamp).toJSDate())
        : state.browserTimestamp;

      const lastParticipantEntry = await readParticipant(
        db,
        exp.path,
        participantId
      );
      if (
        !lastParticipantEntry.requestSequence ||
        state.requestSequence > lastParticipantEntry.requestSequence
      ) {
        logger.info(
          `updateState current requestSequence ${state.requestSequence} is greater than last request sequence ${lastParticipantEntry.requestSequence} so updating participant entry foer participantId=${participantId}, study_id=${studyId}, session_id=${sessionId}}`
        );
        const writeTime = await updateParticipant(
          db,
          exp.path,
          participantId,
          state
        );
        if (!writeTime) {
          throw new StatusError({
            message: "did not update.",
            httpstatus: 400,
            reason: ServerStatusType.invalid,
          });
        }
        logger.info(
          `updateState succesfull requestSequence=${requestSequence}, participantId=${participantId}, study_id=${studyId}, session_id=${sessionId} update time ${writeTime.toDate()}`
        );
      } else {
        logger.info(
          `updateState current requestSequence ${state.requestSequence} is NOT greater than or is equal to last request sequence ${lastParticipantEntry.requestSequence} so NOT updating participant entry foer participantId=${participantId}, study_id=${studyId}, session_id=${sessionId}}`
        );
      }
      await createAuditLogEntry(
        db,
        exp.path,
        participantId,
        requestSequence,
        state.serverTimestamp,
        state
      );
      response.status(200).json({
        status: ServerStatusType.success,
        requestSequence: requestSequence,
      });
    } catch (err) {
      logger.error(
        `updateState requestSequence=${requestSequence}, ${err.message}, httpstatus=${err.httpstatus} participantId=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      response
        .status(err.httpstatus ? err.httpstatus : 500)
        .json({ status: err.reason ? err.reason : ServerStatusType.error });
    }
  }
);

export const version = onRequest(
  {
    cors: [
      "https://localhost:3000",
      "https://staging.d2ptxb5fbsc082.amplifyapp.com/",
      "https://release.d2ptxb5fbsc082.amplifyapp.com",
    ],
  },
  async (request, response) => {
    logger.info(`version ${pkgJSON.version}`);
    try {
      response.status(200).json({
        version: pkgJSON.version,
        commitId: `${process.env.GIT_COMMIT_HASH}`,
      });
    } catch (err) {
      logger.error(`version ${err.message}, httpstatus=${err.httpstatus}`);
      response
        .status(err.httpstatus ? err.httpstatus : 500)
        .json({ status: err.reason ? err.reason : ServerStatusType.error });
    }
  }
);
