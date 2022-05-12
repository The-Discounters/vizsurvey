import { DateTime } from "luxon";
import { QuestionEngine } from "./QuestionEngine";
import { ViewType } from "./ViewType";
import { ChoiceType } from "./ChoiceType";
import { StatusType } from "./StatusType";
import { Question } from "./Question";
import { InteractionType } from "./InteractionType";
import { AmountType } from "./AmountType";
import { Answer } from "./Answer";
import { dateToState } from "./ConversionUtil";

describe("QuestionEngine tests", () => {
  test("startSurvey should create a single answer entry for titration question.", () => {
    const state = {
      treatments: [TestDataFactory.createQuestionLaterTitrate()],
      answers: [],
      currentQuestionIdx: 0,
    };
    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].amountEarlier).toBe(500);
    expect(state.answers[0].timeEarlier).toBe(1);
    expect(state.answers[0].amountLater).toBe(1000);
    expect(state.answers[0].timeLater).toBe(3);
    expect(state.highup).toBe(500);
    expect(state.lowdown).toBeUndefined();
  });

  test("startSurvey should create a single answer entry for non titraiton question.", () => {
    const state = {
      treatments: [TestDataFactory.createQuestionNoTitrate()],
      answers: [],
      currentQuestionIdx: 0,
    };
    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].amountEarlier).toBe(400);
  });

  test("Test calculation methods using example for the values from Read 2001 paper.", () => {
    const state = {
      treatmentId: 1,
      treatments: [TestDataFactory.createQuestionLaterTitrate()],
      answers: [TestDataFactory.createInitialAnswerTitrate()],
      currentQuestionIdx: 0,
      highup: 500,
      lowdown: undefined,
    };
    const a = state.answers[0];
    // initial condition from paper uses earlier amount as difference override when calculation titration amount.
    expect(state.highup).toBe(500);
    expect(state.lowdown).toBeUndefined();
    expect(a.amountEarlier).toBe(500);
    expect(a.amountLater).toBe(1000);
    const qe = new QuestionEngine();
    a.choice = ChoiceType.earlier;
    // first calc from paper example, use highdown which is initilly set equal to earlier amount
    qe.updateHighupOrLowdown(state);
    expect(state.highup).toBe(1000);
    expect(state.lowdown).toBeUndefined();
    expect(qe.calcTitrationAmount(undefined, 500, 500)).toBe(250);
    a.amountLater = 1250;
    a.choice = ChoiceType.later;
    // second calc from paper example there is no lowdown, so passes larger later amount as lowdown
    qe.updateHighupOrLowdown(state);
    expect(state.highup).toBe(1000);
    expect(state.lowdown).toBe(1250);
    expect(qe.calcTitrationAmount(1250, 1000, null)).toBe(125);
    a.amountLater = 1120;
    a.choice = ChoiceType.later;
    // third calc from paper example
    qe.updateHighupOrLowdown(state);
    expect(state.highup).toBe(1000);
    expect(state.lowdown).toBe(1120);
    expect(qe.calcTitrationAmount(1120, 1000, null)).toBe(60);
    a.amountLater = 1060;
    a.choice = ChoiceType.earlier;
    // fourth calc from paper example
    qe.updateHighupOrLowdown(state);
    expect(state.highup).toBe(1060);
    expect(state.lowdown).toBe(1120);
    expect(qe.calcTitrationAmount(1120, 1060, null)).toBe(30);
    a.amountLater = 1090;
    a.choice = ChoiceType.later;
    // fifth calc from paper example
    qe.updateHighupOrLowdown(state);
    expect(state.highup).toBe(1060);
    expect(state.lowdown).toBe(1090);
    expect(qe.calcTitrationAmount(1090, 1060, null)).toBe(15);
    a.amountLater = 1070;
    a.choice = ChoiceType.earlier;
    // sixth calc from paper example
    qe.updateHighupOrLowdown(state);
    expect(state.highup).toBe(1070);
    expect(state.lowdown).toBe(1090); // different from the paper
    expect(qe.calcTitrationAmount(1070, 1060, null)).toBe(5);
  });

  test("Integration test QuestionEngine titrationfrom Read 2001 paper.", () => {
    const state = {
      treatmentId: 1,
      participantId: 1,
      treatments: [TestDataFactory.createQuestionLaterTitrate()],
      answers: [],
      currentQuestionIdx: 0,
      highup: 500,
      lowdown: undefined,
      status: "Unitialized",
      error: null,
    };

    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.highup).toBe(500);
    expect(state.lowdown).toBeUndefined();
    expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
    expect(state.answers[state.answers.length - 1].amountLater).toBe(1000);
    // first answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.earlier,
        choiceTimestamp: dateToState(DateTime.utc()),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(state.highup).toBe(1000);
    expect(state.lowdown).toBeUndefined();
    expect(state.answers.length).toBe(2);
    expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
    expect(state.answers[state.answers.length - 1].amountLater).toBe(1250);
    // second answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.later,
        choiceTimestamp: dateToState(DateTime.utc()),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(state.highup).toBe(1000);
    expect(state.lowdown).toBe(1250);
    expect(state.answers.length).toBe(3);
    expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
    expect(state.answers[state.answers.length - 1].amountLater).toBe(1120);
    // third answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.later,
        choiceTimestamp: dateToState(DateTime.utc()),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(state.highup).toBe(1000);
    expect(state.lowdown).toBe(1120);
    expect(state.answers.length).toBe(4);
    expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
    expect(state.answers[state.answers.length - 1].amountLater).toBe(1060);
    // fourth answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.earlier,
        choiceTimestamp: dateToState(DateTime.utc()),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(state.highup).toBe(1060);
    expect(state.lowdown).toBe(1120);
    expect(state.answers.length).toBe(5);
    expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
    expect(state.answers[state.answers.length - 1].amountLater).toBe(1090);
    // fifth answer
    qe.answerCurrentQuestion(state, {
      payload: {
        choice: ChoiceType.later,
        choiceTimestamp: dateToState(DateTime.utc()),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Unitialized");
    expect(state.error).toBeNull();
    expect(state.highup).toBe(1060);
    expect(state.lowdown).toBe(1090);
    expect(state.answers.length).toBe(6);
    expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
    expect(state.answers[state.answers.length - 1].amountLater).toBe(1070);
    // sixth answer
    qe.answerCurrentQuestion(state, {
      payload: {
        // the paper said the last choice was earlier; however, I think it is wrong and meant later.
        // Choice of later seems to make the last value of lowdown work according to the algorithm
        // I derived from the earlier steps in the example.
        choice: ChoiceType.later,
        choiceTimestamp: dateToState(DateTime.utc()),
      },
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe("Complete");
    expect(state.error).toBeNull();
    expect(state.highup).toBe(1060);
    expect(state.lowdown).toBe(1070);
    expect(state.answers.length).toBe(6);
    expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
    expect(state.answers[state.answers.length - 1].amountLater).toBe(1070);
    expect(state.status).toBe(StatusType.Complete);
  });
});

export class TestDataFactory {
  static createQuestionLaterTitrate() {
    return Question({
      treatmentId: 1,
      position: 1,
      viewType: ViewType.barchart,
      interaction: InteractionType.titration,
      variableAmount: AmountType.laterAmount,
      amountEarlier: 500,
      timeEarlier: 1,
      dateEarlier: undefined,
      amountLater: 1000,
      timeLater: 3,
      dateLater: undefined,
      maxAmount: 2000,
      maxTime: 8,
      horizontalPixels: 480,
      verticalPixels: 480,
      leftMarginWidthIn: 0.5,
      bottomMarginHeightIn: 0.5,
      graphWidthIn: 6,
      graphHeightIn: 6,
      widthIn: 6.5,
      heightIn: 6.5,
      comment: "Titration earlier amount test case.",
    });
  }

  static createInitialAnswerTitrate() {
    return Answer({
      treatmentId: 1,
      viewType: ViewType.barchart,
      amountEarlier: 500,
      timeEarlier: 1,
      dateEarlier: undefined,
      amountLater: 1000,
      timeLater: 3,
      dateLater: undefined,
      maxAmount: 2000,
      maxTime: 8,
      verticalPixels: 480,
      horizontalPixels: 480,
      choice: ChoiceType.undefined,
      shownTimestamp: null,
      choiceTimestamp: null,
      highup: null,
      lowdown: null,
    });
  }

  static createQuestionNoTitrate() {
    return Question({
      treatmentId: 1,
      position: 1,
      viewType: ViewType.barchart,
      interaction: InteractionType.none,
      variableAmount: AmountType.laterAmount,
      amountEarlier: 400,
      timeEarlier: 1,
      dateEarlier: undefined,
      amountLater: 500,
      timeLater: 3,
      dateLater: undefined,
      maxAmount: 500,
      maxTime: 8,
      horizontalPixels: 480,
      verticalPixels: 480,
      leftMarginWidthIn: 0.5,
      bottomMarginHeightIn: 0.5,
      graphWidthIn: 6,
      graphHeightIn: 6,
      widthIn: 6.5,
      heightIn: 6.5,
      comment: "No titration test case.",
    });
  }
}
