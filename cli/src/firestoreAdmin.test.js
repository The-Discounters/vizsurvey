import {
  initAdminFirestoreDB,
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocuments,
} from "./firestoreAdmin.js";

beforeAll(() => {
  initAdminFirestoreDB();
});

describe("firestoreAdmin test ", () => {
  it("Integration test for batch writing data to firestore.", async () => {
    initBatch("integrationTests");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
  });

  it("Integration test for deleting document.", async () => {
    initBatch("deleteTest");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    let callbackCalled = false;
    await deleteDocuments("deleteTest", () => {
      callbackCalled = true;
    });
    expect(callbackCalled).toBe(true);
  });

  it("Integration test for querying firestore.", async () => {
    initBatch("firestoreLinkTestPrimary");
    setBatchItem(null, { id: 1, foreign: 1 });
    setBatchItem(null, { id: 2, foreign: 2 });
    setBatchItem(null, { id: 3, foreign: 3 });
    await commitBatch();
    initBatch("firestoreLinkTestForeign");
    setBatchItem(null, { id: 1, value: "value 1" });
    setBatchItem(null, { id: 2, value: "value 2" });
    setBatchItem(null, { id: 3, value: "value 3" });
    await commitBatch();
    await linkDocs(
      "firestoreLinkTestPrimary",
      "foreign",
      "firestoreLinkTestForeign",
      "id"
    );
  });
});
