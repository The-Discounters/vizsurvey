/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// The Firebase Admin SDK to access Firestore.
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {calcTreatmentIds} from "./functionsUtil.js";
import {
  fetchExperiment,
  // writeTreatmentAssignment,
} from "@the-discounters/firebase-shared";
import {ProlificSumbissionStatusType} from "@the-discounters/prolific";

initializeApp();
const db = getFirestore();

export const fetchExpConfig = onRequest(async (request, response) => {
  logger.info(
      `fetchExpConfig prolific_pid=${request.query.prolific_pid},` +
      `study_id=${request.query.study_id},` +
      `session_id=${request.query.session_id}`);
  try {
    const prolificPid = request.query.prolific_pid;
    const studyId = request.query.study_id;
    const sessionId = request.query.session_id;

    if (!prolificPid || !studyId) {
      logger.error("fetchExpConfig Error with request parameters. " +
        "prolific_pid or study_id not in request", request);
      throw Error("Error with survey URL.");
    }
    // TODO put this in a transaction
    const expDoc = await fetchExperiment(db, studyId);
    if (
      expDoc.data().num_participants_started === expDoc.data().num_participants
    ) {
      logger.error(
          "fetchExpConfig participant tried starting survey after " +
          `the number of participants (${expDoc.data().num_participants}) ` +
          "has been fulfilled.",
          request, expDoc);
      throw Error("Error retrieving experiment configuration");
    }
    if (expDoc.status != ProlificSumbissionStatusType.active) {
      logger.error(
          "fetchExpConfig Participant tried to access experiment " +
          `that is not active ${expDoc.data().status} for ` +
          `studyId ${studyId}`, expDoc);
      throw Error("Error retrieving experiment configuration");
    }
    expDoc.data().num_participants_started++;
    const treatmentIds = calcTreatmentIds(
        expDoc.data().latin_square,
        expDoc.data().num_participants_started
    );
    logger.info(`assigned treatment order ${treatmentIds} to ` +
      `participant id ${prolificPid}, for study id ${studyId} for ` + 
      `session id ${sessionId}`);

    const treatments = fetchTreatments(db, studyId, treatmentIds);
    writeTreatmentAssignment(db, prolificPid, studyId, sessionId, treatments);

    // const writeResult = await getFirestore().collection(
    // "participantsAnswers")
    //     .add({exp_id: expDoc.ref,
    //       participant_id: prolificPid,
    //       session_id: sessionId,
    //       study_id: studyId,
    //       treatment_id: treatmentIds});

    // Send back a message that we've successfully written the message
    // response.json({result: `Message with ID: ${writeResult.id} added.`});
    response.json({result: "Treatment assigned"});
  } catch (err) {
    logger.error(err);
    response.json({error: "There was an error with the server."});
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

