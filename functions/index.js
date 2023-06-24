/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

import { ProlificStudyStatusType } from "../cli/src/ProlificStatusTypes.js";

export const fetchExpConfig = onRequest(async (request, response) => {
  info(`fetchExpConfig(${request})`, { structuredData: true });
  try {
    const prolific_pid = req.query.prolific_pid;
    const study_id = req.query.study_id;
    const session_id = req.query.session_id;

    if (!prolific_pid || !study_id) {
      logger.error(
        `fetchExpConfig Error with request parameters.  prolific_pid or study_id not in request`,
        request
      );
      throw "Error with survey URL.";
    }

    const expColRef = db.collection("experiments");
    const q = expColRef.where("prolific_study_id", "==", study_id);
    let expSnapshot = await q.get();
    if (expSnapshot.size != 1) {
      logger.error(
        `fetchExpConfig expects to find one experiment with study_id ${study_id} and found ${expSnapshot.size}`,
        request,
        expSnapshot.docs
      );
      throw "Error retrieving experiment configuration";
    }
    const expDoc = expSnapshot.docs[0];
    if (expDoc.status != ProlificStudyStatusType.active) {
      logger.error(
        `fetchExpConfig Participant tried to access experiment that is not active ${
          expDoc.data().status
        } for study_id ${study_id}`,
        request,
        expDoc
      );
      throw "Error retrieving experiment configuration";
    }

    if (
      expDoc.data().num_participants_completed ===
      expDoc.data().num_participants
    ) {
      logger.error(
        `fetchExpConfig participant tried starting survey after the number of participants (${
          expDoc.data().num_participants
        }) has been fulfilled.`,
        request,
        expDoc
      );
    }

    let treatment_id;

    const writeResult = await getFirestore().collection("results").add({
      exp_id: expDoc.ref,
      participant_id: prolific_pid,
      session_id: session_id,
      study_id: study_id,
      treatment_id: treatment_id,
    });

    // Send back a message that we've successfully written the message
    response.json({ result: `Message with ID: ${writeResult.id} added.` });
  } catch (err) {
    response.json({ error: err });
  }
});
