import { StatusType } from "./StatusType";
import { AmountType } from "./AmountType";
import { InteractionType } from "./InteractionType";
import { Answer } from "./Answer";

export const TIMESTAMP_FORMAT = "MM/dd/yyyy H:mm:ss:SSS ZZZZ";

// TODO Need to capture errors in processing by settings state.status = StatusType.Error
export class QuestionEngine {
  constructor() {}

  currentTreatment(state) {
    return state.treatments[state.currentQuestionIdx];
  }

  currentTreatmentAndLatestAnswer(state) {
    const treatment = this.currentTreatment(state);
    const latestAnswer = this.latestAnswer(state);
    return { treatment, latestAnswer };
  }

  // TODO maybe change the name of this to be isLtestAnswerForTreatment since it was changed to get the latest answer for the current treatment
  // I think it is currently overcomplicatd but still will work correctly so we have coded it for a future with more than one answer.
  latestAnswer(state) {
    // TODO this is not coded for titration type surveys.  I need to change the filter criteria to find the answer for the titration key values (probably highup, lowdown or something like that)
    // return state.answers.length === 0
    //   ? null
    //   : state.answers[state.answers.length - 1];
    const treatment = this.currentTreatment(state);
    if (state.answers.length === 0) {
      return null;
    }
    const result = state.answers.filter((v) => {
      const value =
        v.treatmentId === treatment.treatmentId &&
        v.position === treatment.position;
      return value;
    });
    return result.length === 0 ? null : result[result.length - 1];
  }

  createNextAnswer(
    treatment,
    answers,
    amountEarlier,
    amountLater,
    highup,
    lowdown
  ) {
    const answer = Answer({
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
    state.currentQuestionIdx = 0;
    const treatment = this.currentTreatment(state);
    state.highup =
      treatment.variableAmount === AmountType.laterAmount
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
    state.status = StatusType.Instructions;
  }

  setLatestAnswerShown(state, action) {
    const latestAnswer = this.latestAnswer(state);
    if (latestAnswer.shownTimestamp === null) {
      latestAnswer.shownTimestamp = action.payload;
    }
  }

  // TODO we should renames these xxxQuestion not treatment.
  isFirstTreatment(state) {
    return state.currentQuestionIdx === 0;
  }

  isLastTreatment(state) {
    return state.currentQuestionIdx === state.treatments.length - 1;
  }

  isMiddleTreatment(state) {
    if (state.treatments.length < 3) {
      return false;
    }
    const calc = (state.treatments.length - 1) / 2;
    const result = state.currentQuestionIdx === calc;
    return result;
  }

  incNextQuestion(state) {
    const onLastTreatment = this.isLastTreatment(state);
    if (
      state.status === StatusType.Survey ||
      state.status === StatusType.Attention
    ) {
      if (!onLastTreatment) {
        state.currentQuestionIdx += 1;
        if (this.latestAnswer(state) === null) {
          const treatment = this.currentTreatment(state);
          this.createNextAnswer(
            treatment,
            state.answers,
            treatment.amountEarlier,
            treatment.amountLater
          );
        }
      }
    }
    state.status = this.nextStatus(state, onLastTreatment);
  }

  decPreviousQuestion(state) {
    const onFirstTreatment = this.isFirstTreatment(state);
    if (state.status === StatusType.Attention) {
      state.status = this.previousStatus(state, onFirstTreatment);
    } else if (state.status === StatusType.Survey && !onFirstTreatment) {
      state.currentQuestionIdx -= 1;
    } else {
      state.status = this.previousStatus(state, onFirstTreatment);
    }
  }

  updateHighupOrLowdown(state) {
    const { treatment, latestAnswer } =
      this.currentTreatmentAndLatestAnswer(state);
    switch (latestAnswer.choice) {
      case AmountType.earlierAmount:
        var possibleHighup =
          treatment.variableAmount === AmountType.laterAmount
            ? latestAnswer.amountLater
            : latestAnswer.amountEarlier;
        if (!state.highup || possibleHighup > state.highup)
          state.highup = possibleHighup;
        break;
      case AmountType.laterAmount:
        var possibleLowdown =
          treatment.variableAmount === AmountType.laterAmount
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
      case AmountType.laterAmount:
        console.assert(
          latestAnswer.choice && latestAnswer.choice !== AmountType.none
        );
        adjustmentAmount =
          latestAnswer.choice === AmountType.earlierAmount
            ? titrationAmount
            : -1 * titrationAmount;
        return (
          parseInt((latestAnswer.amountLater + adjustmentAmount) / 10) * 10
        );
      case AmountType.earlierAmount:
        adjustmentAmount =
          latestAnswer.choice === AmountType.earlierAmount
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
    latestAnswer.choiceTimestamp = action.payload.choiceTimestamp;
    latestAnswer.dragAmount = action.payload.dragAmount;
    if (treatment.interaction === InteractionType.titration) {
      throw new Error("Tirtration experiments not supported");
      // TODO I did not incorporate previous logic into titration experiments since we aren't piloting with those.  This code needs to be modified to incorporate previous action.
      //   const titrationAmount = this.calcTitrationAmount(
      //     treatment.variableAmount === AmountType.laterAmount
      //       ? latestAnswer.amountLater
      //       : latestAnswer.amountEarlier,
      //     state.highup,
      //     latestAnswer.length === 1 ? state.highup : null
      //   );
      //   this.updateHighupOrLowdown(state);
      //   // TODO we need a termination condition for runaway titration
      //   if (state.lowdown - state.highup <= 10) {
      //     this.incNextQuestion(state);
      //   } else {
      //     const newAmount = this.calcNewAmount(state, titrationAmount);
      //     if (treatment.variableAmount === AmountType.laterAmount) {
      //       this.createNextAnswer(
      //         treatment,
      //         state.answers,
      //         treatment.amountEarlier,
      //         newAmount
      //       );
      //     } else if (treatment.variableAmount === AmountType.earlierAmount) {
      //       this.createNextAnswer(
      //         treatment,
      //         state.answers,
      //         newAmount,
      //         treatment.amountLater
      //       );
      //     } else {
      //       console.assert(
      //         true,
      //         "Titration not set to amountEarlier or amountLater before calling answerCurrentQuestion"
      //       );
      //     }
      //   }
    }
  }

  nextStatus(state, onLastTreatment) {
    switch (state.status) {
      case StatusType.Unitialized:
        return StatusType.Fetching;
      case StatusType.Fetching:
        return StatusType.Fetched;
      case StatusType.Fetched:
        return StatusType.Consent;
      case StatusType.Consent:
        return StatusType.Introduction;
      case StatusType.Introduction:
        return StatusType.Instructions;
      case StatusType.Instructions:
        return StatusType.Survey;
      case StatusType.Survey:
        if (this.isLastTreatment(state) && onLastTreatment) {
          return StatusType.FinancialQuestionaire;
        } else {
          if (this.isMiddleTreatment(state)) {
            return StatusType.Attention;
          } else {
            return StatusType.Survey;
          }
        }
      case StatusType.Attention:
        return StatusType.Survey;
      case StatusType.FinancialQuestionaire:
        return StatusType.PurposeQuestionaire;
      case StatusType.PurposeQuestionaire:
        return StatusType.Debrief;
      case StatusType.Debrief:
        return StatusType.Done;
      case StatusType.Done:
        return StatusType.Done;
      case StatusType.Error:
        return StatusType.Error;
    }
  }

  previousStatus(state, onFirstTreatment) {
    switch (state.status) {
      case StatusType.Unitialized:
        return StatusType.Unitialized;
      case StatusType.Fetching:
        return StatusType.Unitialized;
      case StatusType.Fetched:
        return StatusType.Fetching;
      case StatusType.Consent:
        return StatusType.Fetched;
      case StatusType.Introduction:
        return StatusType.Consent;
      case StatusType.Instructions:
        return StatusType.Introduction;
      case StatusType.Survey:
        if (this.isFirstTreatment(state) && onFirstTreatment) {
          return StatusType.Instructions;
        } else {
          if (this.isMiddleTreatment(state)) {
            return StatusType.Attention;
          } else {
            return StatusType.Survey;
          }
        }
      case StatusType.Attention:
        return StatusType.Survey;
      case StatusType.FinancialQuestionaire:
        return StatusType.Survey;
      case StatusType.PurposeQuestionaire:
        return StatusType.FinancialQuestionaire;
      case StatusType.Debrief:
        return StatusType.PurposeQuestionaire;
      case StatusType.Done:
        return StatusType.Debrief;
      case StatusType.Error:
        return StatusType.Error;
    }
  }
}
