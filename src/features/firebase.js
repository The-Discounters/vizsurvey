import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  runTransaction,
  get,
  child,
} from "firebase/database";

// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export const getId = async () => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "/"));
    if (snapshot.exists()) {
      return snapshot.val().participant_sequence;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

export async function getServerSequenceId() {
  const postRef = ref(database, "/participant_sequence");
  const result = await runTransaction(postRef, (participant_sequence) => {
    if (participant_sequence) {
      participant_sequence++;
    }
    return participant_sequence;
  });
  return result.snapshot.val();
}
