import { StatusType } from "./StatusType";
import { VariableType } from "./VariableType";
import { InteractionType } from "./InteractionType";
import { ChoiceType } from "./ChoiceType";
import { Answer } from "./Answer";

export const TIMESTAMP_FORMAT = "MM/dd/yyyy H:mm:ss:SSS ZZZZ";

// TODO Need to capture errors in processing by settings state.status = StatusType.Error
export class QuestionEngine {
  constructor() {}

  currentTreatment(state) {
    return state.questions[state.currentQuestionIdx];
  }

  currentTreatmentAndLatestAnswer(state) {
    const treatment = this.currentTreatment(state);
    const latestAnswer = this.latestAnswer(state);

    return { treatment, latestAnswer };
  }

  latestAnswer(state) {
    return state.answers.length === 0
      ? null
      : state.answers[state.answers.length - 1];
  }

  createNextAnswer(
    treatment,
    answers,
    amountEarlier,
    amountLater,
    highup,
    lowdown
  ) {
    const answer = new Answer({
      questionId: treatment.id,
      viewType: treatment.viewType,
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
      choice: ChoiceType.unitialized,
      highup: highup,
      lowdown: lowdown,
    });
    answers.push(answer);
  }

  allQuestions(state) {
    return state.answers;
  }

  startSurvey(state) {
    state.currentQuestionIdx = 0;
    const treatment = this.currentTreatment(state);
    if (treatment === undefined) return;
    state.highup =
      treatment.variableAmount === VariableType.laterAmount
        ? treatment.amountEarlier
        : treatment.amountLater;
    state.lowdown = undefined;
    this.createNextAnswer(
      treatment,
      state.answers,
      treatment.amountEarlier,
      treatment.amountLater,
      state.highup,
      state.lowdown
    );
  }

  setLatestAnswerShown(state, action) {
    this.latestAnswer(state).shownTimestamp = action.payload;
  }

  isLastTreatment(state) {
    return state.currentQuestionIdx === state.questions.length - 1;
  }

  incNextQuestion(state) {
    if (this.isLastTreatment(state)) {
      state.status = StatusType.Complete;
    } else {
      state.currentQuestionIdx += 1;
      const treatment = this.currentTreatment(state);
      this.createNextAnswer(
        treatment,
        state.answers,
        treatment.amountEarlier,
        treatment.amountLater
      );
    }
  }

  updateHighupOrLowdown(state) {
    const { treatment, latestAnswer } =
      this.currentTreatmentAndLatestAnswer(state);
    switch (latestAnswer.choice) {
      case ChoiceType.earlier:
        var possibleHighup =
          treatment.variableAmount === VariableType.laterAmount
            ? latestAnswer.amountLater
            : latestAnswer.amountEarlier;
        if (!state.highup || possibleHighup > state.highup)
          state.highup = possibleHighup;
        break;
      case ChoiceType.later:
        var possibleLowdown =
          treatment.variableAmount === VariableType.laterAmount
            ? latestAnswer.amountLater
            : latestAnswer.amountEarlier;
        if (!state.lowdown || possibleLowdown < state.lowdown)
          state.lowdown = possibleLowdown;
        break;
      default:
        console.assert(
          true,
          "Invalid value for current answer in setAnswerCurrentQuestion"
        );
        break;
    }
  }

  calcTitrationAmount(titratingAmount, highup, override) {
    return (override ? override : titratingAmount - highup) / 2;
  }

  calcNewAmount(state, titrationAmount) {
    const { treatment, latestAnswer } =
      this.currentTreatmentAndLatestAnswer(state);
    var adjustmentAmount;
    switch (treatment.variableAmount) {
      case VariableType.laterAmount:
        console.assert(
          latestAnswer.choice && latestAnswer.choice !== ChoiceType.unitialized
        );
        adjustmentAmount =
          latestAnswer.choice === ChoiceType.earlier
            ? titrationAmount
            : -1 * titrationAmount;
        return (
          parseInt((latestAnswer.amountLater + adjustmentAmount) / 10) * 10
        );
      case VariableType.earlierAmount:
        adjustmentAmount =
          latestAnswer.choice === ChoiceType.earlier
            ? -1 * titrationAmount
            : titrationAmount;
        return (
          parseInt((latestAnswer.amountEarlier + adjustmentAmount) / 10) * 10
        );
      default:
        console.assert(
          true,
          "Invalid value for question titration type in calcEarlierAndLaterAmounts"
        );
        break;
    }
  }

  answerCurrentQuestion(state, action) {
    const { treatment, latestAnswer } =
      this.currentTreatmentAndLatestAnswer(state);
    latestAnswer.choice = action.payload.choice;
    latestAnswer.choiceTimestamp =
      action.payload.choiceTimestamp.toFormat(TIMESTAMP_FORMAT);
    if (
      treatment.interaction === InteractionType.none ||
      treatment.interaction === InteractionType.drag
    ) {
      this.incNextQuestion(state);
    } else if (treatment.interaction === InteractionType.titration) {
      const titrationAmount = this.calcTitrationAmount(
        treatment.variableAmount === VariableType.laterAmount
          ? latestAnswer.amountLater
          : latestAnswer.amountEarlier,
        state.highup,
        latestAnswer.length === 1 ? state.highup : null
      );
      this.updateHighupOrLowdown(state);
      // TODO we need a termination condition for runaway titration
      if (state.lowdown - state.highup <= 10) {
        this.incNextQuestion(state);
      } else {
        const newAmount = this.calcNewAmount(state, titrationAmount);
        if (treatment.variableAmount === VariableType.laterAmount) {
          this.createNextAnswer(
            treatment,
            state.answers,
            treatment.amountEarlier,
            newAmount
          );
        } else if (treatment.variableAmount === VariableType.earlierAmount) {
          this.createNextAnswer(
            treatment,
            state.answers,
            newAmount,
            treatment.amountLater
          );
        } else {
          console.assert(
            true,
            "Titration not set to amountEarlier or amountLater before calling answerCurrentQuestion"
          );
        }
      }
    }
  }
}
