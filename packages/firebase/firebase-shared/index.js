import {
  initFirestore,
  initBatch,
  fetchExperiment,
  fetchExperiments,
  setBatchItem,
  deleteDocs,
  commitBatch,
  linkDocs,
} from "./src/firestoreAdmin.js";
import {
  deleteCollection, // TODO this was exported as unit testing utility.  Is there a way to create an export for development dependency only.
} from "./src/firestoreTestUtil.js";

export {
  initFirestore,
  initBatch,
  setBatchItem,
  deleteDocs,
  commitBatch,
  linkDocs,
  fetchExperiment,
  fetchExperiments,
  deleteCollection,
};
