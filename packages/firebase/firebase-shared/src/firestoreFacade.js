import {
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {initializeApp} from "firebase-admin/app";
import {cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {readFileSync} from "fs";
import {logger} from "firebase-functions";
// import { onRequest } from "firebase-functions/v2/https";
// The Firebase Admin SDK to access Firestore.
// import { getFirestore } from "firebase-admin/firestore";
import {ProlificSumbissionStatusType} from "@the-discounters/prolific";

export const initEmulatorEnv = async (
  projectId,
  rulesPath,
  host,
  port,
) => {
  const testEnv = await initializeTestEnvironment({
      projectId: projectId,
      firestore: {
        rules: readFileSync(rulesPath, "utf8"),
        host: host,
        port: port,
      },
    });
  const db = testEnv.unauthenticatedContext().firestore();
  return { testEnv: testEnv, db: db };
};

export const initLiveEnv = async (projectId, databaseURL, adminCred) => {
  const app = initializeApp({
      projectId: projectId,
      credential: cert(adminCred),
      databaseURL: databaseURL,
    });
  const db = getFirestore();
  return {app: app, db: db};
};

export const fetchExperiment = async (db, studyId) => {
  const expRef = db.collection("experiments");

  // const q = expColRef.where("prolific_study_id", "==", `"${study_id}"`);
  const q = expRef.where("prolific_study_id", "==", "2");
  const expSnapshot = await q.get();
  if (expSnapshot.size != 1) {
    logger.error(
      `fetchExpConfig expects to find one experiment with 
        study_id ${studyId} and found ${expSnapshot.size} experiment entries`
    );
    throw Error("Error retrieving experiment configuration");
  }
  const expDoc = expSnapshot.docs[0];
  if (expDoc.status != ProlificSumbissionStatusType.active) {
    logger.error(
      `fetchExpConfig Participant tried to access experiment that is not
        active ${expDoc.data().status} for studyId ${studyId}`,
      expDoc
    );
    throw Error("Error retrieving experiment configuration");
  }
  return expDoc;
};
