import { group } from "d3";
import { StatusType, nextStatus, AmountType } from "@the-discounters/types";
import { dateToState, ISODateStringWithNanoSec } from "@the-discounters/util";

export const validateExperimentData = (exp) => {
  const result = [];
  /**
consent checked is true on participant entry
status on participant is debrief or finished
Timestamp values are after previous one.
         */
  if (exp.numParticipantsCompleted !== exp.numParticipants) {
    result.push(
      `experiment: numParticipantsCompleted ${exp.numParticipantsCompleted} is not the expected value ${exp.numParticipants}`
    );
  }
  const participantAudits = group(exp.audit, (d) => d.participantId);
  participantAudits.forEach((ca) => {
    const auditStats = {
      maxSeqNum: 0,
    };
    const uniqueScreen = new Set();
    let lastStatus;
    const auditBySeq = ca.sort((a, b) =>
      +a.requestSequence < +b.requestSequence
        ? -1
        : +a.requestSequence > +b.requestSequence
        ? 1
        : 0
    );
    auditBySeq.forEach((cv, i, ary) => {
      auditStats.maxSeqNum = Math.max(auditStats.maxSeqNum, cv.requestSequence);
      uniqueScreen.add(JSON.stringify(cv.screenAttributes));
      if (lastStatus) {
        let onLastTreatmentQuestion;
        const onLastQuestion =
          cv.questions.slice(0, -1).choice !== AmountType.none;
        if (onLastQuestion) {
          onLastTreatmentQuestion = true;
        } else {
          onLastTreatmentQuestion =
            cv.questions[0].treatmentId !==
            auditBySeq[i + 1].questions[0].treatmentId;
        }
        const expectedStatus = nextStatus(
          lastStatus,
          onLastQuestion,
          onLastTreatmentQuestion
        );
        cv.status;
      }
      if (cv.requestSequence !== i + 1) {
        result.push(
          `audit: requestSequence ${cv.requestSequence} is not the expected value ${i}`
        );
      }
      if (i !== 0 && cv.broswerTimestamp <= ary[i - 1].broswerTimestamp) {
        result.push(
          `audit: broswerTimestamp: requestSequence ${
            cv.requestSequence
          } broswerTimestamp ${dateToState(
            cv.broswerTimestamp
          )} is less than the previous broswerTimestamp ${dateToState(
            ary[i - 1].broswerTimestamp
          )}`
        );
      }
      if (i !== 0 && cv.serverTimestamp <= ary[i - 1].serverTimestamp) {
        result.push(
          `audit: serverTimestamp: requestSequence ${
            cv.requestSequence
          } serverTimestamp ${ISODateStringWithNanoSec(
            cv.serverTimestamp.toDate(),
            cv.serverTimestamp.getNanoseconds()
          )} is less than the previous serverTimestamp ${ISODateStringWithNanoSec(
            ary[i - 1].serverTimestamp.toDate(),
            ary[i - 1].serverTimestamp.getNanoseconds()
          )}`
        );
      }
    }); // end audit by sequence forEach
    if (uniqueScreen.size !== 1) {
      result.push(
        `audit: screenAttributes found ${uniqueScreen.size} values and was expecting 1, ${uniqueScreen}`
      );
    }
    if (auditStats.maxSeqNum !== auditBySeq.slice(0, -1)) {
      result.push(
        `audit: requestSequence max value ${
          auditStats.maxSeqNum
        } is not equal to the last audit entry sequence number ${auditBySeq.slice(
          0,
          -1
        )}`
      );
    }
  });
  return result;
};
