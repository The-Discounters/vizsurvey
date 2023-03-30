import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://vizsurvey-default-rtdb.firebaseio.com/",
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
