import { StatusType } from "./StatusType.js";
import { secondsBetween } from "@the-discounters/util";
import { ScreenAttributes, WindowAttributes } from "@the-discounters/types";

export const TIMESTAMP_FORMAT = "MM/dd/yyyy H:mm:ss:SSS ZZZZ";

export class QuestionEngine {
  isFirstQuestion(state) {
    return state.currentAnswerIdx === 0;
  }

  isLastQuestion(state) {
    return state.currentAnswerIdx === state.questions.length - 1;
  }

  isLastTreatmentQuestion(state) {
    if (state.currentAnswerIdx === state.questions.length - 1) {
      return true;
    }
    return (
      this.currentAnswer(state).treatmentId !==
      this.nextAnswer(state).treatmentId
    );
  }

  currentAnswer(state) {
    return state.questions[state.currentAnswerIdx];
  }

  nextAnswer(state) {
    if (state.currentAnswerIdx === state.questions.length - 1) {
      return null;
    } else {
      return state.questions[state.currentAnswerIdx + 1];
    }
  }

  currentInstructions(state) {
    const currentTreatmentId = this.currentAnswer(state).treatmentId;
    const result = state.instructionTreatment.filter(
      (v) => v.treatmentId === currentTreatmentId
    );
    if (result.length !== 1) {
      throw Error(
        "currentInstructions found more than one treatment instruction entry!"
      );
    }
    return result[0];
  }

  setCurrentAnswerShown(state, date) {
    const ca = this.currentAnswer(state);
    ca.shownTimestamp = date;
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
    answer.screenAttributes = ScreenAttributes(payload.window.screen);
    answer.windowAttributes = WindowAttributes(payload.window);
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
        if (onLastQuestion) {
          return StatusType.ExperienceQuestionaire;
        } else if (onLastTreatmentQuestion) {
          return StatusType.MCLInstructions;
        } else {
          return StatusType.Survey;
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
      default:
        return null;
    }
  }
}
