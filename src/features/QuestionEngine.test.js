import { DateTime } from "luxon";
import { QuestionEngine } from "./QuestionEngine.js";
import { ViewType } from "./ViewType.js";
import { StatusType } from "./StatusType.js";
import { Question } from "./Question.js";
import { InteractionType } from "./InteractionType.js";
import { AmountType } from "./AmountType.js";
import { Answer } from "./Answer.js";
import { dateToState } from "./ConversionUtil.js";

describe("QuestionEngine tests", () => {
  test("nextStatus testing state transitions with a single treatment.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Unitialized,
      treatmentId: 1,
      treatmentIds: [1],
    };
    state.treatments[2].position = 3;
    const qe = new QuestionEngine();
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.Fetching
    );
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.Consent
    );
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.Instructions
    );
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.MCLInstructions
    );
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.Survey
    );
    state.currentAnswerIdx = 1;
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.Survey
    );
    state.currentAnswerIdx = 2;
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.Survey
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.Attention
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.ExperienceQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.FinancialQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.PurposeQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.Demographic
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.Debrief
    );
    expect(qe.nextStatus(state, true, true)).toBe(StatusType.Finished);
  });

  test("startSurvey should create a single answer entry for titration question.", () => {
    const state = {
      treatments: [TestDataFactory.createQuestionLaterTitrate()],
      answers: [],
      currentAnswerIdx: 0,
      treatmentId: 1,
      treatmentIds: [1],
    };
    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.currentAnswerIdx).toBe(0);
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
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
      ],
      answers: [],
      currentAnswerIdx: 0,
      treatmentId: 1,
      treatmentIds: [1],
    };
    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.status).toBeUndefined();
    expect(state.currentAnswerIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].amountEarlier).toBe(400);
  });

  test("answerCurrentQuestion for non titration single treatment question and answer should update the current answer choice and not create more answer entries.", () => {
    const state = {
      treatments: [TestDataFactory.createQuestionNoTitrate()],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.answerCurrentQuestion(state, {
      choice: AmountType.earlierAmount,
      choiceTimestamp: dateToState(DateTime.now()),
    });
    expect(state.currentAnswerIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].choice).toBe(AmountType.earlierAmount);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("answerCurrentQuestion for non titration multiple treatment questions single answer should update the current answer choice and not create more answer entries.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
      ],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.answerCurrentQuestion(state, {
      choice: AmountType.earlierAmount,
      choiceTimestamp: dateToState(DateTime.now()),
    });
    expect(state.currentAnswerIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].choice).toBe(AmountType.earlierAmount);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("incNextQuestion for two questions single treatment should increment question index and stay in survey state.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
      ],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
      treatmentId: 1,
      treatmentIds: [1],
    };
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(1);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(2);
    expect(state.answers[1].choice).toBe(AmountType.none);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("incNextQuestion for two questions two treatment should increment treatment index to show second treatment questions.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
      ],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
      treatmentIds: [1, 2],
    };
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(1);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(2);
    expect(state.answers[1].choice).toBe(AmountType.none);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(2);
    expect(qe.currentTreatment().treatmentId).toBe(2);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(3);
    expect(state.status).toBe(StatusType.Attention);
    expect((state.status = qe.nextStatus(state, true, false))).toBe(
      StatusType.MCLInstructions
    );
    qe.incNextQuestion(state);
    expect(qe.currentTreatment().treatmentId).toBe(2);
    expect(state.currentAnswerIdx).toBe(3);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(3);
    qe.incNextQuestion(state);
    expect(qe.currentTreatment().treatmentId).toBe(2);
    expect(state.currentAnswerIdx).toBe(3);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(4);
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.Attention
    );
  });

  test("incNextQuestion for three questions single treatment should increment question index and enter attention state then experiene survey.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate(),
      ],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
      treatmentId: 1,
      treatmentIds: [1],
    };
    state.treatments[2].position = 3;
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(1);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(2);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(2);
    expect(state.status).toBe(StatusType.Attention);
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(2);
    expect(state.status).toBe(StatusType.ExperienceQuestionaire);
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

  static createAnswer(treatmentId, positionId) {
    return Answer({
      participantId: 1,
      sessionId: 1,
      studyId: 1,
      treatmentId: treatmentId,
      position: positionId,
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
      choice: AmountType.none,
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

  static create2ndQuestionNoTitrate() {
    return Question({
      treatmentId: 1,
      position: 2,
      viewType: ViewType.barchart,
      interaction: InteractionType.none,
      variableAmount: AmountType.laterAmount,
      amountEarlier: 200,
      timeEarlier: 2,
      dateEarlier: undefined,
      amountLater: 1000,
      timeLater: 4,
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
      comment: "No titration test case second treatment.",
    });
  }
}
