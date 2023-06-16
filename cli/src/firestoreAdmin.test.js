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

afterAll(() => {});

describe("firestoreAdmin test ", () => {
  it("Integration test for batch writing data to firestore.", async () => {
    initBatch("integrationTests");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    await deleteDocuments("integrationTests");
  });

  it("Integration test for deleting document.", async () => {
    initBatch("deleteTest");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    await deleteDocuments("deleteTest");
  });

  it("Integration test for querying firestore.", async () => {
    initBatch("linkTestPrimary");
    setBatchItem(null, { id: 1, foreign: 1 });
    setBatchItem(null, { id: 2, foreign: 2 });
    setBatchItem(null, { id: 3, foreign: 3 });
    await commitBatch();
    initBatch("linkTestForeign");
    setBatchItem(null, { id: 1, value: "value 1" });
    setBatchItem(null, { id: 2, value: "value 2" });
    setBatchItem(null, { id: 3, value: "value 3" });
    await commitBatch();
    await linkDocs("linkTestPrimary", "foreign", "linkTestForeign", "id");
    await deleteDocuments("linkTestPrimary");
    await deleteDocuments("linkTestForeign");
  });
});
