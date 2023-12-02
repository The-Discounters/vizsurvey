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
  calcTreatmentIds,
  filterQuestions,
  createQuestions,
  orderQuestions,
  writeQuestions,
} from "./functionsUtil.js";
import {
  fetchExperiment,
  updateParticipantCount,
} from "@the-discounters/firebase-shared";
import { ProlificSumbissionStatusType } from "@the-discounters/prolific";

initializeApp();
const db = getFirestore();

export const fetchExpConfig = onRequest(async (request, response) => {
  logger.info(
    `fetchExpConfig prolific_pid=${request.query.prolific_pid},` +
      `study_id=${request.query.study_id},` +
      `session_id=${request.query.session_id}`
  );
  try {
    const prolificPid = request.query.prolific_pid;
    const studyId = request.query.study_id;
    const sessionId = request.query.session_id;

    if (!prolificPid || !studyId) {
      logger.error(
        "fetchExpConfig Error with request parameters. " +
          "prolific_pid or study_id not in request",
        request
      );
      throw Error("Error with survey URL.");
    }
    // TODO put this in a transaction
    const exp = await fetchExperiment(db, studyId);
    if (exp.num_participants_started === exp.num_participants) {
      logger.error(
        "fetchExpConfig participant tried starting survey after " +
          `the number of participants (${exp.num_participants}) ` +
          "has been fulfilled.",
        request,
        exp
      );
      throw Error("Error no more recruitment slots left.");
    }
    if (exp.status != ProlificSumbissionStatusType.active) {
      logger.error(
        "fetchExpConfig Participant tried to access experiment " +
          `that is not active ${exp.status} for ` +
          `studyId ${studyId}`,
        exp
      );
      throw Error("Error experiment is not active.");
    }
    exp.num_participants_started++;
    updateParticipantCount(db, studyId, exp.num_participants_started);
    const treatmentIds = calcTreatmentIds(
      exp.latin_square,
      exp.num_participants_started
    );
    logger.info(
      `assigned treatment order ${treatmentIds} to ` +
        `participant id ${prolificPid}, for study id ${studyId} for ` +
        `session id ${sessionId}`
    );
    let questions = filterQuestions(treatmentIds, exp.treatmentQuestions);
    const { instruction, survey } = parseQuestions(questions);
    questions = createQuestions(studyId, sessionId, prolificPid, survey);
    questions = orderQuestions(questions, treatmentIds);
    writeQuestions(db, questions);
    logger.info(
      `${questions.length} questions sent back to participant for participant id ${prolificPid}, ` +
        `study id ${studyId}, session id ${sessionId}`
    );
    response.json({ result: "Treatment assigned" });
  } catch (err) {
    logger.error(err);
    response.json({ error: "There was an error with the server." });
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
