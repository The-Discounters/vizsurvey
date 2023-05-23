import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

console.log(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

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
