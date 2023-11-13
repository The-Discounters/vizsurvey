import { StatusType } from "./StatusType.js";
import { AmountType } from "./AmountType.js";
import { Answer } from "./Answer.js";
import { secondsBetween } from "@the-discounters/util";

export const TIMESTAMP_FORMAT = "MM/dd/yyyy H:mm:ss:SSS ZZZZ";

// TODO Need to capture errors in processing by settings state.status = StatusType.Error
export class QuestionEngine {
  constructor() {}

  isFirstQuestion(state) {
    return state.currentAnswerIdx == 0;
  }

  isLastQuestion(state) {
    return state.currentAnswerIdx == state.answers.length - 1;
  }

  isLastTreatmentQuestion(state) {
    if (
      state.answers.length == 1 ||
      state.currentAnswerIdx == state.answers.length - 1
    ) {
      return true;
    }
    return (
      this.currentAnswer(state).treatmentId !=
      this.nextAnswer(state).treatmentId
    );
  }

  currentAnswer(state) {
    return state.answers[state.currentAnswerIdx];
  }

  nextAnswer(state) {
    if (state.currentAnswerIdx == state.answers.length - 1) {
      return null;
    } else {
      return state.answers[state.currentAnswerIdx + 1];
    }
  }

  currentTreatment(state) {
    const treatment = state.treatments[this.currentTreatmentIndex(state)];
    return treatment;
  }

  currentInstructions(state) {
    const instructions =
      state.instructionTreatment[this.currentTreatmentIndex(state)];
    return instructions;
  }

  currentTreatmentIndex(state) {
    return state.treatmentIds.indexOf(this.currentAnswer(state).treatmentId);
  }

  createNextAnswer(
    participantId,
    sessionId,
    studyId,
    treatment,
    amountEarlier,
    amountLater,
    highup,
    lowdown
  ) {
    const answer = Answer({
      participantId: participantId,
      sessionId: sessionId,
      studyId: studyId,
      treatmentId: treatment.treatmentId,
      position: treatment.position,
      viewType: treatment.viewType,
      interaction: treatment.interaction,
      variableAmount: treatment.variableAmount,
      amountEarlier: amountEarlier,
      timeEarlier: treatment.timeEarlier,
      dateEarlier: treatment.dateEarlier,
      amountLater: amountLater,
      timeLater: treatment.timeLater,
      dateLater: treatment.dateLater,
      maxAmount: treatment.maxAmount,
      maxTime: treatment.maxTime,
      verticalPixels: treatment.verticalPixels,
      horizontalPixels: treatment.horizontalPixels,
      leftMarginWidthIn: treatment.leftMarginWidthIn,
      bottomMarginHeightIn: treatment.bottomMarginHeightIn,
      graphWidthIn: treatment.graphWidthIn,
      graphHeightIn: treatment.graphHeightIn,
      widthIn: treatment.widthIn,
      heightIn: treatment.heightIn,
      showMinorTicks: treatment.showMinorTicks,
      choice: AmountType.none,
      highup: highup,
      lowdown: lowdown,
    });
    return answer;
  }

  createAnswersForTreatments(state) {
    state.treatments.forEach((treatment) => {
      state.answers.push(
        this.createNextAnswer(
          state.participantId,
          state.sessionId,
          state.studyId,
          treatment,
          treatment.amountEarlier,
          treatment.amountLater,
          state.highup,
          state.lowdown
        )
      );
    });
  }

  setCurrentAnswerShown(state, date) {
    const ca = this.currentAnswer(state);
    ca.shownTimestamp = date;
    if (this.isFirstQuestion(state)) {
      state.screenAttributes.screenAvailHeight = window.availHeight;
      state.screenAttributes.screenAvailWidth = window.availWidth;
      state.screenAttributes.windowInnerHeight = window.innerHeight;
      state.screenAttributes.windowInnerWidth = window.innerWidth;
      state.screenAttributes.windowOuterHeight = window.outerHeight;
      state.screenAttributes.windowOuterWidth = window.outerWidth;
      state.screenAttributes.windowScreenLeft = window.screenLeft;
      state.screenAttributes.windowScreenTop = window.screenTop;
    }
  }

  incNextQuestion(state) {
    const isLastQuestion = this.isLastQuestion(state);
    const nextStatus = this.nextStatus(
      state,
      this.isLastTreatmentQuestion(state),
      isLastQuestion
    );
    if (!isLastQuestion) {
      state.currentAnswerIdx++;
    }
    state.status = nextStatus;
  }

  answerCurrentQuestion(state, payload) {
    const answer = this.currentAnswer(state);
    answer.choice = payload.choice;
    answer.choiceTimestamp = payload.choiceTimestamp;
    answer.choiceTimeSec = secondsBetween(
      answer.shownTimestamp,
      answer.choiceTimestamp
    );
    answer.dragAmount = payload.dragAmount;
  }

  nextState(state) {
    return this.nextStatus(
      state,
      this.isLastTreatmentQuestion(state),
      this.isLastQuestion(state)
    );
  }

  nextStatus(state, onLastTreatmentQuestion, onLastQuestion) {
    switch (state.status) {
      case StatusType.Unitialized:
        return StatusType.Fetching;
      case StatusType.Fetching:
        return StatusType.Consent;
      case StatusType.Consent:
        return StatusType.Instructions;
      case StatusType.Instructions:
        return StatusType.MCLInstructions;
      case StatusType.MCLInstructions:
        return StatusType.Survey;
      case StatusType.Survey:
        if (onLastTreatmentQuestion) {
          return StatusType.Attention;
        } else {
          return StatusType.Survey;
        }
      case StatusType.Attention:
        if (onLastQuestion) {
          return StatusType.ExperienceQuestionaire;
        } else {
          return StatusType.MCLInstructions;
        }
      case StatusType.ExperienceQuestionaire:
        return StatusType.FinancialQuestionaire;
      case StatusType.FinancialQuestionaire:
        return StatusType.PurposeAwareQuestionaire;
      case StatusType.PurposeAwareQuestionaire:
        return StatusType.PurposeWorthQuestionaire;
      case StatusType.PurposeWorthQuestionaire:
        return StatusType.Demographic;
      case StatusType.Demographic:
        return StatusType.Debrief;
      case StatusType.Debrief:
        return StatusType.Finished;
      case StatusType.Error:
        return StatusType.Error;
    }
  }
}
