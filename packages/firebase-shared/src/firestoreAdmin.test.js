import {
  initAdminFirestoreDB,
  initBatch,
  setBatchItem,
  commitBatch,
  linkDocs,
  deleteDocs,
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
    await deleteDocs("integrationTests");
  });

  it("Integration test for deleteDocs.", async () => {
    initBatch("deleteTest");
    setBatchItem(null, { item1: "value1" });
    await commitBatch();
    await deleteDocs("deleteTest");
  });

  it("Integration test for linkDocs.", async () => {
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
    await deleteDocs("linkTestPrimary");
    await deleteDocs("linkTestForeign");
  });
});
