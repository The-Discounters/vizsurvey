import admin from "firebase-admin";
import { DateTime } from "luxon";
import { assertSucceeds } from "@firebase/rules-unit-testing";

// TODO this needs to recurse down to delete collections deeper than one level.
export const deleteCollection = async (db, path) => {
  const docRef = db.collection(path);
  const snapshot = assertSucceeds(await docRef.get());
  for (let i = 0; i < snapshot.size; i++) {
    const data = snapshot.docs[i];
    assertSucceeds(data.ref.delete());
  }
};

const FSTimestampFromISOStringWithNanoSec = (ISOdateStr) => {
  // format 2017-04-22T20:47:05.3350000000-04:00
  const regex = /\.(?<nanosec>[\d]+)/;
  const matches = ISOdateStr.match(regex);
  const date = DateTime.fromISO(ISOdateStr);
  return admin.firestore.Timestamp.fromDate(date.toJSDate());
  // TODO For some reason I am getting this error when I use constructor: Value for argument "seconds" is not a valid integer.
  //const date = DateTime.fromISO(ISOdateStr);
  //const nanosec = matches ? parseInt(matches.groups.nanosec) : 0;
  //return new admin.firestore.Timestamp({
  //  seconds: date.toUnixInteger(),
  //  nanoseconds: nanosec,
  //});
};

export const typeStateFields = (key, value) => {
  switch (key) {
    case "serverTimestamp":
      return {
        converted: true,
        result: FSTimestampFromISOStringWithNanoSec(value),
      };
    case "browserTimestamp":
      return {
        converted: true,
        result: FSTimestampFromISOStringWithNanoSec(value),
      };
    default:
      return { converted: false, result: value };
  }
};
