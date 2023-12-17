import { DateTime } from "luxon";
import { QuestionEngine } from "./QuestionEngine.js";
import { ViewType } from "@the-discounters/types";
import { StatusType } from "./StatusType.js";
import { Question } from "./Question.js";
import { InteractionType } from "@the-discounters/types";
import { AmountType } from "@the-discounters/types";
import { Answer } from "./Answer.js";
import { dateToState } from "@the-discounters/util";

describe("QuestionEngine tests", () => {
  test("createAnswersForTreatments test.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(1, 1),
        TestDataFactory.create2ndQuestionNoTitrate(1, 2),
        TestDataFactory.create2ndQuestionNoTitrate(1, 3),
      ],
      answers: [],
      currentAnswerIdx: 0,
      status: StatusType.Unitialized,
      treatmentIds: [1],
    };
    const qe = new QuestionEngine();
    qe.createAnswersForTreatments(state);
    expect(state.answers.length).toBe(3);
    expect(state.answers[0].position).toBe(1);
    expect(state.answers[1].position).toBe(2);
    expect(state.answers[2].position).toBe(3);
  });

  test("nextStatus testing state transitions with a single treatment.", () => {
    const state = {
      status: StatusType.Unitialized,
    };
    const qe = new QuestionEngine();
    expect((state.status = qe.nextStatus(state, false, true))).toBe(
      StatusType.Fetching
    );
    expect((state.status = qe.nextStatus(state, false, false))).toBe(
      StatusType.Consent
    );
    expect((state.status = qe.nextStatus(state, false, false))).toBe(
      StatusType.Instructions
    );
    expect((state.status = qe.nextStatus(state, false, false))).toBe(
      StatusType.MCLInstructions
    );
    expect((state.status = qe.nextStatus(state, false, false))).toBe(
      StatusType.Survey
    );
    expect((state.status = qe.nextStatus(state, true, false))).toBe(
      StatusType.MCLInstructions
    );
    expect((state.status = qe.nextStatus(state, true, false))).toBe(
      StatusType.Survey
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.ExperienceQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.FinancialQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.PurposeAwareQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.PurposeWorthQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.Demographic
    );
    expect((state.status = qe.nextStatus(state, true, true))).toBe(
      StatusType.Debrief
    );
    expect(qe.nextStatus(state, true, true)).toBe(StatusType.Finished);
  });

  test("answerCurrentQuestion for non titration single treatment question and answer should update the current answer choice and not create more answer entries.", () => {
    const state = {
      treatments: [TestDataFactory.createQuestionNoTitrate(1, 1)],
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
        TestDataFactory.createQuestionNoTitrate(1, 1),
        TestDataFactory.create2ndQuestionNoTitrate(1, 2),
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
        TestDataFactory.createQuestionNoTitrate(1, 1),
        TestDataFactory.create2ndQuestionNoTitrate(1, 2),
      ],
      answers: [
        TestDataFactory.createAnswer(1, 1),
        TestDataFactory.createAnswer(1, 2),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
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
        TestDataFactory.createQuestionNoTitrate(1, 1),
        TestDataFactory.create2ndQuestionNoTitrate(1, 2),
        TestDataFactory.createQuestionNoTitrate(2, 1),
        TestDataFactory.create2ndQuestionNoTitrate(2, 2),
      ],
      answers: [
        TestDataFactory.createAnswer(1, 1),
        TestDataFactory.createAnswer(1, 2),
        TestDataFactory.createAnswer(2, 1),
        TestDataFactory.createAnswer(2, 2),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
      treatmentIds: [1, 2],
    };
    state.treatments[1].treatmentId = 2;
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(qe.currentTreatment(state).treatmentId).toBe(1);
    expect(state.currentAnswerIdx).toBe(1);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers[1].choice).toBe(AmountType.none);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(2);
    expect(qe.currentTreatment(state).treatmentId).toBe(2);
    expect(state.answers).not.toBeUndefined();
    expect(state.status).toBe(StatusType.MCLInstructions);
    qe.incNextQuestion(state);
    expect(qe.currentTreatment(state).treatmentId).toBe(2);
    expect(state.currentAnswerIdx).toBe(3);
    expect(state.answers).not.toBeUndefined();
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(qe.currentTreatment(state).treatmentId).toBe(2);
    expect(state.currentAnswerIdx).toBe(3);
    expect(state.answers).not.toBeUndefined();
    expect(state.status).toBe(StatusType.ExperienceQuestionaire);
  });

  test("incNextQuestion for three questions single treatment should increment question index and enter attention state then experiene survey.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(1, 1),
        TestDataFactory.create2ndQuestionNoTitrate(1, 2),
        TestDataFactory.create2ndQuestionNoTitrate(1, 3),
      ],
      answers: [
        TestDataFactory.createAnswer(1, 1),
        TestDataFactory.createAnswer(1, 2),
        TestDataFactory.createAnswer(1, 3),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
      treatmentIds: [1],
    };
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(1);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(2);
    expect(state.status).toBe(StatusType.Survey);
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
    });
  }

  static createQuestionNoTitrate(treatmentId, positionId) {
    return Question({
      treatmentId: treatmentId,
      position: positionId,
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

  static create2ndQuestionNoTitrate(treatmentId, positionId) {
    return Question({
      treatmentId: treatmentId,
      position: positionId,
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
