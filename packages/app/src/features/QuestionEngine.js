import { nextStatus } from "@the-discounters/types";
import { secondsBetween } from "@the-discounters/util";

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

  remainingTreatmentCount(state) {
    let set = new Set(
      state.questions
        .slice(state.currentAnswerIdx + 1)
        .map((q) => q.treatmentId)
    );
    return set.size;
  }

  completedTreatmentCount(state) {
    let set = new Set(
      state.questions.slice(0, state.currentAnswerIdx).map((q) => q.treatmentId)
    );
    return set.size;
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
    answer.screenAttributes = payload.screen;
    answer.windowAttributes = payload.window;
  }

  nextState(state) {
    return this.nextStatus(
      state,
      this.isLastTreatmentQuestion(state),
      this.isLastQuestion(state)
    );
  }

  nextStatus(state, onLastTreatmentQuestion, onLastQuestion) {
    return nextStatus(state.status, onLastQuestion, onLastTreatmentQuestion);
  }
}
