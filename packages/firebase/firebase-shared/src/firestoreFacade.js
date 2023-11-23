import {initializeApp} from "firebase-admin/app";
import {cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {logger} from "firebase-functions";
// import { onRequest } from "firebase-functions/v2/https";
// The Firebase Admin SDK to access Firestore.
// import { getFirestore } from "firebase-admin/firestore";
import {Experiment} from "@the-discounters/types";
import {ProlificSumbissionStatusType} from "@the-discounters/prolific";

export const initFirestore = async (projectId, databaseURL, adminCred) => {
  const app = initializeApp({
      projectId: projectId,
      credential: cert(adminCred),
      databaseURL: databaseURL,
    });
  const db = getFirestore(app);
  return {app: app, db: db};
};

export const fetchExperiment = async (db, studyId) => {
  const expRef = db.collection("experiments");
  const q = expRef.where("prolific_study_id", "==", studyId);
  const expSnapshot = await q.get();
  const expDoc = expSnapshot.docs[0];
  // return expDoc;
  const result = Experiment({
    id: expDoc.data().id,
    status: expDoc.data().status,
    numParticipantsStarted: expDoc.data().num_participants_started,
    numParticipantsCompleted: expDoc.data().num_participants_completed,
    type: expDoc.data().type,
    latinSquare: expDoc.data().latin_square,
    startDate: expDoc.data().start_date,
    endDate: expDoc.data().end_date,
    numParticipants: expDoc.data().num_participants,
    prolificCode: expDoc.data().prolific_code,
    prolificStudyId: expDoc.data().prolific_study_id,
    description: expDoc.data().description,
  }); 
  return result;
};

export const fetchTreatments = async (db, studyId, treatmentIds) => {
}

export const writeTreatmentAssignment = async (
  db,
  prolificPid,
  studyId,
  sessionId,
  treatments
) => {};

export const writeAnswers = (db,
  prolificPid,
  studyId,
  sessionId,
  answers) => {
  
  }