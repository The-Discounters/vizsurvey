// import { onRequest } from "firebase-functions/v2/https";
// The Firebase Admin SDK to access Firestore.
// import { getFirestore } from "firebase-admin/firestore";

export const calcTreatmentIds = (latinSquare, numParticipantsCompleted) => {
  const latinSquareAry = JSON.parse(latinSquare);
  const index = numParticipantsCompleted % latinSquareAry.length;
  return latinSquareAry[index];
};


