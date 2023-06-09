import {
  initAdminFirestoreDB,
  initBatch,
  setBatchItem,
  commitBatch,
} from "./firestoreAdmin.js";

describe("firestoreAdmin test ", () => {
  it("Integration test for batch writing data to firestore.", async () => {
    initAdminFirestoreDB();
    initBatch("integrationTests");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
  });
});
