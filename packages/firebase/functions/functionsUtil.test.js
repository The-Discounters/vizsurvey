import { strict as assert } from "assert";
import { assertSucceeds } from "@firebase/rules-unit-testing";
import { group } from "d3";
import {
  calcTreatmentIds,
  filterQuestions,
  parseQuestions,
  orderQuestions,
  orderQuestionsRandom,
  signupParticipant,
  validateExperiment,
  assignParticipantSequenceNumberXaction,
} from "./functionsUtil.js";
import {
  initFirestore,
  readExperimentAndQuestions,
  readExperimentDoc,
} from "@the-discounters/firebase-shared";
import { SURVEY_QUESTIONS_JSON } from "@the-discounters/test-shared";
import { deleteCollection } from "@the-discounters/firebase-test-shared";
import ADMIN_CREDS from "../../../admin-credentials-dev.json" assert { type: "json" };

// this needs to match the value that is passed to firebase emulators:start --project=
const PROJECT_ID = "vizsurvey-test";

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const resetExperiments = async (db) => {
  const docRef = db.collection("experiments");
  const snapshot = assertSucceeds(await docRef.get());
  for (const docSnapshot of snapshot.docs) {
    await deleteCollection(db, `${docSnapshot.ref.path}/answers`);
    await deleteCollection(db, `${docSnapshot.ref.path}/participants`);
  }
};

// This function with the corresponding test was created to validate without a transaction, the code would generate duplicate sequence ids.
// const assignParticipantSequenceNumber = async (db, studyId) => {
//   const expDoc = await readExperimentDoc(db, studyId);
//   validateExperiment(expDoc.data());
//   if (expDoc.data().numParticipantsStarted === expDoc.data().numParticipants) {
//     throw new StatusError({
//       message: `participant tried starting survey after the number of participants (${
//         expDoc.data().numParticipants
//       }) has been fulfilled`,
//       httpstatus: 400,
//       reason: ServerStatusType.ended,
//     });
//   }
//   const newCount = expDoc.data().numParticipantsStarted + 1;
//   const updateObj = { numParticipantsStarted: newCount };
//   const res = await expDoc.ref.update(updateObj);
//   return {
//     experimentId: expDoc.data().experimentId,
//     sequenceNumber: newCount,
//     updateTime: res.writeTime,
//   };
// };

describe("functionsUtil test ", () => {
  let app, db;

  before(async () => {
    const result = initFirestore(
      PROJECT_ID,
      "https://vizsurvey-test.firebaseio.com/",
      ADMIN_CREDS
    );
    app = result.app;
    db = result.db;
    await deleteCollection(db, "functionsUtil-writeQuestions-test");
  });

  after(async () => {
    await deleteCollection(db, "functionsUtil-writeQuestions-test");
  });

  afterEach(async () => {
    await resetExperiments(db);
  });

  it("Test for calcTreatmentIds .", async () => {
    const latinSquare = JSON.parse(
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]"
    );
    const result = calcTreatmentIds(latinSquare, 0);
    assert.equal(
      arraysEqual([1, 2, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for calcTreatmentIds.", async () => {
    const latinSquare = JSON.parse(
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]"
    );
    const result = calcTreatmentIds(latinSquare, 5);
    assert.equal(
      arraysEqual([2, 1, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for calcTreatmentIds.", async () => {
    const latinSquare = JSON.parse(
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]"
    );
    const result = calcTreatmentIds(latinSquare, 6);
    assert.equal(
      arraysEqual([1, 2, 3], result),
      true,
      `[${result}] wasn't expected value.`
    );
  });

  it("Test for filterQuestions between subject study (treatmentIds array like [1]).", async () => {
    const result = filterQuestions([1], SURVEY_QUESTIONS_JSON);
    assert.equal(result.length, 9, "Returned array was not expected size.");
  });

  it("Test for filterQuestions for within subject study (treatmentIds array like [1,2,3]).", async () => {
    const result = filterQuestions([1, 2, 3], SURVEY_QUESTIONS_JSON);
    assert.equal(result.length, 27, "Returned array was not expected size.");
  });

  it("Test for parseQuestions.", async () => {
    const { instruction, survey } = parseQuestions(SURVEY_QUESTIONS_JSON);
    assert.equal(
      instruction.length,
      3,
      "Returned instruction array was not expected size."
    );
    assert.equal(
      survey.length,
      24,
      "Returned survey array was not expected size."
    );
  });

  const assertCorrectOrder = (result) => {
    for (let i = 1; i < result.length; i++) {
      if (result[i - 1].treatmentId === result[i].treatmentId) {
        assert.equal(
          result[i - 1].sequenceId < result[i].sequenceId,
          true,
          `Question number ${i} was out of order.`
        );
      } else if (result[i - 1].treatmentId < result[i].treatmentId) {
        assert.equal(
          result[i].sequenceId,
          1,
          "First question in a treatment should be sequence number 1."
        );
      } else {
        fail(
          `Treatment id ${result[i - 1].treatmentId} was larger than ${
            result[i].treatmentId
          }`
        );
      }
    }
  };

  it("Test for orderQuestions for within subject study (latin square 1, 2, 3]).", async () => {
    const grouped = group(SURVEY_QUESTIONS_JSON, (d) => d.instructionQuestion);
    const q = grouped.get(false);
    const result = orderQuestions(q, [1, 2, 3]);
    assertCorrectOrder(result);
  });

  it("Test for orderQuestionsRandom for within subject study (latin square 1, 2, 3]).", async () => {
    const grouped = group(SURVEY_QUESTIONS_JSON, (d) => d.instructionQuestion);
    const q = grouped.get(false);
    let result = orderQuestionsRandom(q, [1, 2, 3]);
    assert.notEqual(
      result,
      q,
      "Array instance returned should not be the same as parameter value."
    );
    assertCorrectOrder(result);
    const first = result.map((v) => v.treatmentQuestionId);
    result = orderQuestionsRandom(q, [1, 2, 3]);
    assertCorrectOrder(result);
    const second = result.map((v) => v.treatmentQuestionId);
    assert.notDeepEqual(
      first,
      second,
      "Order of entries returned by orderQuestionsRandom was the same which is higly unlikely but possible."
    );
  });

  it("Test for signupParticipant for within subject study (latin square entries [1, 2, 3]).", async () => {
    const exp = await readExperimentAndQuestions(db, "testwithin");
    const result = await signupParticipant(
      db,
      "1",
      "2",
      "3",
      1,
      exp,
      (isError, msg) => {
        assert.equal(
          isError,
          false,
          `Expected there not to be an error in callback with message: ${msg}.`
        );
      }
    );
    assert.equal(
      result.survey.length,
      24,
      "Wrong number of questions returned."
    );
    assertCorrectOrder(result);
    assert.equal(
      result.instruction.length,
      3,
      "Wrong number of instruction questions returned."
    );
  });

  it("Test for signupParticipant for between subject study (latin square entries [1], [2], [3]).", async () => {
    const exp = await readExperimentAndQuestions(db, "testbetween");
    const result = await signupParticipant(
      db,
      "1",
      "2",
      "3",
      1,
      exp,
      (isError, msg) => {
        assert.equal(
          isError,
          false,
          `Expected there not to be an error in callback with message: ${msg}.`
        );
      }
    );
    assert.equal(
      result.survey.length,
      8,
      "Wrong number of questions returned."
    );
    assertCorrectOrder(result);
    assert.equal(
      result.instruction.length,
      1,
      "Wrong number of instruction questions returned."
    );
  });

  it("Test for assignParticipantSequenceNumberXaction.", async () => {
    const expRef = db.collection("experiments");
    const q = expRef.where("prolificStudyId", "==", "testbetween");
    const expSnapshot = await assertSucceeds(q.get());
    assert.equal(
      expSnapshot.docs.length,
      1,
      "Expected to retrieve one experiment"
    );
    assert.notEqual(expSnapshot.docs[0].data().numParticipantsStarted, null);
    const beforeNumParticipantsStarted =
      expSnapshot.docs[0].data().numParticipantsStarted;
    const { experimentId, sequenceNumber } =
      await assignParticipantSequenceNumberXaction(db, "testbetween");
    assert.equal(
      sequenceNumber,
      beforeNumParticipantsStarted + 1,
      "Participant sequence number did not increment by 1."
    );
    assert.equal(experimentId, 6, "Didn't return expected experiment id.");
  });

  it("Test for assignParticipantSequenceNumberXaction race condition.", async () => {
    return new Promise(function (resolve, reject) {
      const expRef = db.collection("experiments");
      const q = expRef.where("prolificStudyId", "==", "testbetween");
      assertSucceeds(q.get()).then((expSnapshot) => {
        assert.equal(
          expSnapshot.docs.length,
          1,
          "Expected to retrieve one experiment"
        );
        assert.notEqual(
          expSnapshot.docs[0].data().numParticipantsStarted,
          null
        );
        const beforeNumParticipantsStarted =
          expSnapshot.docs[0].data().numParticipantsStarted;
        const NO_REQUESTS = 20;
        const results = [];
        for (let i = 0; i < NO_REQUESTS; i++) {
          assignParticipantSequenceNumberXaction(db, "testbetween").then(
            (result) => {
              results.push(result);
              if (results.length === 1) {
                console.log("First result returned");
              }
              if (results.length === NO_REQUESTS) {
                console.log(`All results returned.`);
                const sorted = results.sort((a, b) =>
                  a.sequenceNumber < b.sequenceNumber
                    ? -1
                    : a.sequenceNumber > b.sequenceNumber
                    ? 1
                    : 0
                );
                for (let k = 0; k < sorted.length; k++) {
                  if (
                    sorted[k].sequenceNumber !==
                    beforeNumParticipantsStarted + 1 + k
                  ) {
                    reject(
                      `Entry ${k} with value ${
                        sorted[k].sequenceNumber
                      } is not expected next in the sequence.  Starting value was ${beforeNumParticipantsStarted} and returned values are ${sorted.map(
                        (v) => v.sequenceNumber
                      )}}`
                    );
                  }
                }
                resolve();
              }
            }
          );
          if (i === NO_REQUESTS - 1) {
            console.log("All requests initiated");
          }
        }
      });
    });
  }).timeout(40000);

  // This test was created to validate that without a transaction, the code for assigning a sequence id would return duplicate values.
  // it("Test for assignParticipantSequenceNumberWithoutTransaction race condition.", async () => {
  //   return new Promise(function (resolve, reject) {
  //     const expRef = db.collection("experiments");
  //     const q = expRef.where("prolificStudyId", "==", "testbetween");
  //     assertSucceeds(q.get()).then((expSnapshot) => {
  //       assert.equal(
  //         expSnapshot.docs.length,
  //         1,
  //         "Expected to retrieve one experiment"
  //       );
  //       assert.notEqual(
  //         expSnapshot.docs[0].data().numParticipantsStarted,
  //         null
  //       );
  //       const beforeNumParticipantsStarted =
  //         expSnapshot.docs[0].data().numParticipantsStarted;
  //       const NO_REQUESTS = 10;
  //       const results = [];
  //       for (let i = 0; i < NO_REQUESTS; i++) {
  //         assignParticipantSequenceNumber(db, "testbetween").then((result) => {
  //           results.push(result);
  //           if (results.length === 1) {
  //             console.log("First result returned");
  //           }
  //           if (results.length === NO_REQUESTS) {
  //             console.log(`All results returned.`);
  //             const sorted = results.sort((a, b) =>
  //               a.sequenceNumber < b.sequenceNumber
  //                 ? -1
  //                 : a.sequenceNumber > b.sequenceNumber
  //                 ? 1
  //                 : 0
  //             );
  //             for (let k = 0; k < sorted.length; k++) {
  //               if (
  //                 sorted[k].sequenceNumber !==
  //                 beforeNumParticipantsStarted + 1 + k
  //               ) {
  //                 reject(
  //                   `Entry ${k} with value ${
  //                     sorted[k].sequenceNumber
  //                   } is not expected next in the sequence.  Starting value was ${beforeNumParticipantsStarted} and returned values are ${sorted.map(
  //                     (v) => v.sequenceNumber
  //                   )}}`
  //                 );
  //               }
  //             }
  //             resolve();
  //           }
  //         });
  //         if (i === NO_REQUESTS - 1) {
  //           console.log("All requests initiated");
  //         }
  //       }
  //     });
  //   });
  // }).timeout(40000);
});
