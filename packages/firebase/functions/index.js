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
import { signupParticipant } from "./functionsUtil.js";
import {
  fetchExperiment,
  updateParticipantCount,
} from "@the-discounters/firebase-shared";
import { ProlificSumbissionStatusType } from "@the-discounters/prolific";
import { ServerStatusType } from "@the-discounters/types";
import { StatusError } from "./StatusError.js";

initializeApp();
const db = getFirestore();

export const fetchExpConfig = onRequest(async (request, response) => {
  logger.info(
    `fetchExpConfig prolific_pid=${request.query.prolific_pid},` +
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
        msg: "fetchExpConfig Error with request parameters. prolific_pid or study_id not in request.",
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
    const exp = await fetchExperiment(db, studyId);
    if (!exp) {
      throw new StatusError({
        msg: `fetchExpConfig Participant tried to access experiment that was not found.`,
        code: 400,
        reason: ServerStatusType.invalid,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    logger.info(
      `...fetched experiment ${exp.experimentId} for prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}, numParticipantsStarted=${exp.numParticipantsStarted}, numParticipants=${exp.numParticipants}, status=${exp.status}`
    );
    if (exp.numParticipantsStarted === exp.numParticipants) {
      throw new StatusError({
        msg: `fetchExpConfig participant tried starting survey after the number of participants (${exp.numParticipants}) has been fulfilled`,
        code: 400,
        reason: ServerStatusType.ended,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    if (exp.status != ProlificSumbissionStatusType.active) {
      throw new StatusError({
        msg: `fetchExpConfig Participant tried to access experiment that is not active (${exp.status})`,
        code: 400,
        reason: ServerStatusType.ended,
        participantId,
        studyId,
        sessionId,
        request,
      });
    }
    logger.info(
      `...Calculating participant number for experimentId ${exp.experimentId}, participantId ${participantId}`
    );
    const newExpCount = exp.numParticipantsStarted + 1;
    logger.info(
      `...Assigned participant number ${newExpCount}, experimentId ${exp.experimentId}, participantId ${participantId}`
    );
    updateParticipantCount(db, studyId, newExpCount, (msg) => {
      logger.info(msg);
    });
    logger.info(
      `...Signing up participant for experimentId ${exp.experimentId}, participantId ${participantId}`
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
            msg: msg,
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
      `${err.msg}  participantId=${err.participantId}, studyId=${err.studyId}, sessionId=${err.sessionId}`
    );
    response
      .status(err.httpcode ? err.httpcode : 500)
      .json({ status: err.reason ? err.reason : ServerStatusType.error });
  }
});

// export const writeAnswers = onRequest(async (request, response) => {
//   logger.info(
//       `writeAnswers prolific_pid=${request.query.prolific_pid}, \
// study_id=${request.query.study_id}, session_id=${request.query.session_id}`);
//   try {
//     const prolificPid = request.query.prolific_pid;
//     const studyId = request.query.study_id;
//     // const sessionId = request.query.session_id;

//     if (!prolificPid || !studyId) {
//       logger.error(
//           // eslint-disable-next-line quotes
//           `writeAnswers Error with request parameters.\
// prolific_pid or study_id not in request`, request);
//       throw Error("Error with survey URL.");
//     }
//     response.json({result: "Treatment assigned"});
//   } catch (err) {
//     logger.error(err);
//     response.json({error: "There was an error with the server."});
//   }
// });
