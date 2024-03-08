import { group } from "d3";
import {
  StatusType,
  nextStatus,
  AmountType,
  isAmountChoice,
} from "@the-discounters/types";
import { ProlificStudyStatusType } from "@the-discounters/prolific";
import { dateToState, ISODateStringWithNanoSec } from "@the-discounters/util";

export const ValidationLevel = {
  warning: "warning",
  error: "error",
};
Object.freeze(ValidationLevel);

const ERROR = ValidationLevel.error;
const WARN = ValidationLevel.warning;

export const ValidationType = {
  experiment: "experiment",
  participant: "participant",
  audit: "audit",
};
Object.freeze(ValidationType);

const EXPERIMENT = ValidationType.experiment;
const PARTICIPANT = ValidationType.participant;
const AUDIT = ValidationType.audit;

class ValidationIssue {
  constructor(level, type, message) {
    this.level = level;
    this.type = type;
    this.message = message;
  }

  message() {
    return `${level}: ${type} - ${message}`;
  }
}

export const validateExperimentData = (exp) => {
  const result = [];
  if (exp.numParticipantsCompleted !== exp.numParticipants) {
    result.push(
      new ValidationIssue(
        ERROR,
        EXPERIMENT,
        `numParticipantsCompleted ${exp.numParticipantsCompleted} is not the expected value ${exp.numParticipants}`
      )
    );
  }
  if (exp.numParticipantsStarted < exp.numParticipantsCompleted) {
    result.push(
      new ValidationIssue(
        ERROR,
        EXPERIMENT,
        `numParticipantsStarted ${exp.numParticipantsStarted} should be greater than or equal to the numParticipantsCompleted ${exp.numParticipantsCompleted}`
      )
    );
  }
  if (exp.status !== ProlificStudyStatusType.completed) {
    result.push(
      new ValidationIssue(
        ERROR,
        EXPERIMENT,
        `status value ${exp.status} not expected value ${ProlificStudyStatusType.completed}`
      )
    );
  }
  exp.participants.forEach((participant) => {
    if (!participant.consentChecked) {
      result.push(
        new ValidationIssue(
          ERROR,
          PARTICIPANT,
          `consentChecked ${participant.consentChecked} is not the expected value true for participant ${participant.participantId}`
        )
      );
    }
    if (
      participant.status !== StatusType.Debrief &&
      participant.status !== StatusType.Finished
    ) {
      result.push(
        new ValidationIssue(
          ERROR,
          PARTICIPANT,
          `status not equal to expected value of ${StatusType.Debrief} or ${StatusType.Finished} for participant ${participant.participantId}`
        )
      );
    }
    if (
      participant.questions.reduce(
        (pv, cv) => (isAmountChoice(cv.choice) ? pv + 1 : pv),
        0
      ) !== participant.questions.length
    ) {
      result.push(
        new ValidationIssue(
          ERROR,
          PARTICIPANT,
          `all questions  not equal to expected value of ${StatusType.Debrief} or ${StatusType.Finished} for participant ${participant.participantId}`
        )
      );
    }
  });
  group(exp.audit, (d) => d.participantId).forEach(
    (auditList, partcipantId) => {
      const auditStats = {
        maxSeqNum: 0,
      };
      const uniqueScreen = new Set();
      let lastStatus = null;
      const auditsForParticipantBySequence = auditList.sort((a, b) =>
        +a.requestSequence < +b.requestSequence
          ? -1
          : +a.requestSequence > +b.requestSequence
          ? 1
          : 0
      );
      auditsForParticipantBySequence.forEach((auditEntry, i, ary) => {
        auditStats.maxSeqNum = Math.max(
          auditStats.maxSeqNum,
          auditEntry.requestSequence
        );
        uniqueScreen.add(JSON.stringify(auditEntry.screenAttributes));
        if (lastStatus) {
          let onLastTreatmentQuestion;
          const onLastQuestion =
            auditEntry.questions.slice(0, -1).choice !== AmountType.none;
          if (onLastQuestion) {
            onLastTreatmentQuestion = true;
          } else {
            onLastTreatmentQuestion =
              auditEntry.questions[0].treatmentId !==
              auditsForParticipantBySequence[i + 1].questions[0].treatmentId;
          }
          const expectedStatus = nextStatus(
            lastStatus,
            onLastQuestion,
            onLastTreatmentQuestion
          );
          auditEntry.status;
        }
        if (auditEntry.requestSequence !== i + 1) {
          result.push(
            new ValidationIssue(
              ERROR,
              AUDIT,
              `requestSequence ${auditEntry.requestSequence} is not the expected value ${i} for audit entry ${auditEntry.path} participant ${auditEntry.participantId}`
            )
          );
        }
        if (
          i !== 0 &&
          auditEntry.broswerTimestamp <= ary[i - 1].broswerTimestamp
        ) {
          result.push(
            new ValidationIssue(
              ERROR,
              AUDIT,
              `broswerTimestamp broswerTimestamp ${dateToState(
                auditEntry.broswerTimestamp
              )} is less than the previous broswerTimestamp ${dateToState(
                ary[i - 1].broswerTimestamp
              )} for participant ${auditEntry.participantId} audit entry ${
                auditEntry.path
              } requestSequence ${auditEntry.requestSequence}`
            )
          );
        }
        if (
          i !== 0 &&
          auditEntry.serverTimestamp <= ary[i - 1].serverTimestamp
        ) {
          result.push(
            new ValidationIssue(
              WARN,
              AUDIT,
              `serverTimestamp ${ISODateStringWithNanoSec(
                auditEntry.serverTimestamp.toDate(),
                auditEntry.serverTimestamp.nanoseconds
              )} is less than the previous serverTimestamp ${ISODateStringWithNanoSec(
                ary[i - 1].serverTimestamp.toDate(),
                ary[i - 1].serverTimestamp.nanoseconds
              )} for participant ${auditEntry.participantId} audit entry ${
                auditEntry.path
              } requestSequence ${auditEntry.requestSequence}`
            )
          );
        }
      }); // end audit by sequence forEach
      if (uniqueScreen.size !== 1) {
        result.push(
          new ValidationIssue(
            ERROR,
            AUDIT,
            `screenAttributes found ${uniqueScreen.size} values and was expecting 1, ${uniqueScreen} values for participant ${partcipantId}`
          )
        );
      }
      if (
        auditStats.maxSeqNum !==
        auditsForParticipantBySequence[
          auditsForParticipantBySequence.length - 1
        ].requestSequence
      ) {
        result.push(
          new ValidationIssue(
            ERROR,
            AUDIT,
            `requestSequence max value ${
              auditStats.maxSeqNum
            } is not equal to the last audit entry sequence number ${
              auditsForParticipantBySequence[
                auditsForParticipantBySequence.length - 1
              ].requestSequence
            } for participant ${partcipantId}`
          )
        );
      }
    }
  );
  return result;
};
