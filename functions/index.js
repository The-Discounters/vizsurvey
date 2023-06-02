/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { info } from "firebase-functions/logger";

export const helloWorld = onRequest((request, response) => {
  info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

/**
 * Question - collection
 *  - amount_earlier
 *  - time_earlier
 *  - date_earlier
 *  - amount_later
 *  - time_later
 *  - date_later
 *  - max_amount
 *  - max_time
 *  - comment
 * Visualization - collection
 *  - horizontal_pixels
 *  - vertical_pixels
 *  - left_margin_width_in
 *  - bottom_margin_height_in
 *  - graph_width_in
 *  - graph_height_in
 *  - width_in
 *  - height_in
 *  - show_minor_ticks
 *  - instruction_gif_prefix
 * Treatment - collection
 *  - Questions
 *   - Question
 *   - Visualization
 * Survey
 *  participants
 *   - prolific id
 *   - survey state
 *   - question attributes
 *   - visualization attributes
 *   - answer
 */
export const getTreatment = onRequest((request, response) => {
  info(`getTreatment(${request})`, { structuredData: true });
  // check if the user has already taken the survey
  response.send("Hello from Firebase!");
});
