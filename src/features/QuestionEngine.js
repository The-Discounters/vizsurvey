import { StatusType } from "./StatusType.js";
import { AmountType } from "./AmountType.js";
import { InteractionType } from "./InteractionType.js";
import { Answer } from "./Answer.js";
import { secondsBetween } from "./ConversionUtil.js";
import { loadTreatmentConfiguration } from "./TreatmentUtil.js";

export const TIMESTAMP_FORMAT = "MM/dd/yyyy H:mm:ss:SSS ZZZZ";

// TODO Need to capture errors in processing by settings state.status = StatusType.Error
export class QuestionEngine {
  constructor() {}

  loadTreatment(state) {
    const { questions, instructions } = loadTreatmentConfiguration(
      state.treatmentId
    );
    state.treatments = questions;
    state.instructionTreatment = instructions[0];
    state.currentTreatmentQuestionIdx = 0;
  }

  currentAnswer(state) {
    return state.answers[state.currentAnswerIdx];
  }

  currentTreatment(state) {
    return state.treatments[state.currentTreatmentQuestionIdx];
  }

  currentTreatmentAndCurrentAnswer(state) {
    const treatment = this.currentTreatment(state);
    const answer = this.currentAnswer(state);
    return { treatment, answer };
  }

  createNextAnswer(
    participantId,
    sessionId,
    studyId,
    treatment,
    answers,
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
    answers.push(answer);
  }

  allQuestions(state) {
    return state.answers;
  }

  startSurvey(state) {
    state.allTreatments = null;
    const treatment = this.currentTreatment(state);
    state.highup =
      treatment.variableAmount === AmountType.laterAmount
        ? treatment.amountEarlier
        : treatment.amountLater;
    state.lowdown = undefined;
    this.createNextAnswer(
      state.participantId,
      state.sessionId,
      state.studyId,
      treatment,
      state.answers,
      treatment.amountEarlier,
      treatment.amountLater,
      state.highup,
      state.lowdown
    );
    state.status = this.nextState(state);
  }

  setCurrentAnswerShown(state, date) {
    const ca = this.currentAnswer(state);
    ca.shownTimestamp = date;
    if (this.isFirstTreatmentQuestion(state)) {
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

  isFirstTreatmentQuestion(state) {
    return state.currentTreatmentQuestionIdx === 0;
  }

  isLastTreatmentQuestion(state) {
    return state.currentTreatmentQuestionIdx === state.treatments.length - 1;
  }

  isOnLastTreatment(state) {
    return state.currentTreatmentIdx === state.treatments.length - 1;
  }

  isOnFirstTreatment(state) {
    return state.currentTreatmentIdx === 0;
  }

  incNextTreatment(state) {
    state.currentTreatmentIdx++;
    state.treatmentId = state.treatmentIds[state.currentTreatmentIdx];
    state.currentTreatmentQuestionIdx = 0;
  }

  incNextQuestion(state) {
    const onLastTreatmentQuestion = this.isLastTreatmentQuestion(state);
    const onLastTreatment = this.isOnLastTreatment(state);
    if (state.status === StatusType.Survey) {
      if (!onLastTreatmentQuestion) {
        const treatment = this.currentTreatment(state);
        state.currentAnswerIdx++;
        state.currentTreatmentQuestionIdx++;
        this.createNextAnswer(
          state.participantId,
          state.sessionId,
          state.studyId,
          treatment,
          state.answers,
          treatment.amountEarlier,
          treatment.amountLater
        );
      } else {
        if (!onLastTreatment) {
          state.currentAnswerIdx++;
          this.incNextTreatment(state);
          this.loadTreatment(state);
          this.startSurvey(state);
        }
      }
    }
    state.status = this.nextStatus(
      state,
      onLastTreatmentQuestion,
      onLastTreatment
    );
  }

  answerCurrentQuestion(state, payload) {
    const { treatment, answer } = this.currentTreatmentAndCurrentAnswer(state);
    answer.choice = payload.choice;
    answer.choiceTimestamp = payload.choiceTimestamp;
    answer.choiceTimeSec = secondsBetween(
      answer.shownTimestamp,
      answer.choiceTimestamp
    );
    answer.dragAmount = payload.dragAmount;
    if (treatment.interaction === InteractionType.titration) {
      throw new Error("Tirtration experiments not supported");
    }
  }

  nextState(state) {
    return this.nextStatus(
      state,
      this.isLastTreatmentQuestion(state),
      this.isOnLastTreatment(state)
    );
  }

  nextStatus(state, onLastTreatmentQuestion, onLastTreatment) {
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
        if (onLastTreatmentQuestion && onLastTreatment) {
          return StatusType.ExperienceQuestionaire;
        } else {
          return StatusType.MCLInstructions;
        }
      case StatusType.ExperienceQuestionaire:
        return StatusType.FinancialQuestionaire;
      case StatusType.FinancialQuestionaire:
        return StatusType.PurposeQuestionaire;
      case StatusType.PurposeQuestionaire:
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
