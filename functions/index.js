/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import { info } from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

export const fetchExpConfig = onRequest(async (request, response) => {
  info(`fetchExpConfig(${request})`, { structuredData: true });
  const prolific_pid = req.query.prolific_pid;
  const study_id = req.query.study_id;
  const session_id = req.query.session_id;

  const q = rightRef.where(rightField, "==", leftDoc.data()[leftField]);

  const writeResult = await getFirestore()
    .collection("experiments")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });

  response.send("Hello from Firebase!");
});
