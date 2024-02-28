import { DateTime } from "luxon";
import { QuestionEngine } from "./QuestionEngine.js";
import {
  AmountType,
  ViewType,
  SurveyQuestion,
  InteractionType,
} from "@the-discounters/types";
import { StatusType } from "@the-discounters/types";
import { dateToState } from "@the-discounters/util";
import {
  createQuestionNoTitrate,
  create2ndQuestionNoTitrate,
  mockGlobalWindow,
} from "@the-discounters/test-shared";

describe("QuestionEngine tests", () => {
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
      StatusType.ChoiceInstructions
    );
    expect((state.status = qe.nextStatus(state, false, false))).toBe(
      StatusType.Survey
    );
    expect((state.status = qe.nextStatus(state, true, false))).toBe(
      StatusType.ChoiceInstructions
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

  test("answerCurrentQuestion for non titration single treatment question.", () => {
    const state = {
      questions: [createQuestionNoTitrate(1, 1)],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.answerCurrentQuestion(state, {
      choice: AmountType.earlierAmount,
      choiceTimestamp: dateToState(DateTime.now()),
      window: mockGlobalWindow,
    });
    expect(state.currentAnswerIdx).toBe(0);
    expect(state.questions).not.toBeUndefined();
    expect(state.questions[0].choice).toBe(AmountType.earlierAmount);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("answerCurrentQuestion for non titration multiple treatment questions.", () => {
    const state = {
      questions: [
        createQuestionNoTitrate(1, 1),
        create2ndQuestionNoTitrate(1, 2),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.answerCurrentQuestion(state, {
      choice: AmountType.earlierAmount,
      choiceTimestamp: dateToState(DateTime.now()),
      window: mockGlobalWindow,
    });
    expect(state.currentAnswerIdx).toBe(0);
    expect(state.questions).not.toBeUndefined();
    expect(state.questions[0].choice).toBe(AmountType.earlierAmount);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("incNextQuestion for two questions single treatment.", () => {
    const state = {
      questions: [
        createQuestionNoTitrate(1, 1),
        create2ndQuestionNoTitrate(1, 2),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(1);
    expect(state.questions).not.toBeUndefined();
    expect(state.questions[1].choice).toBe(AmountType.none);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("incNextQuestion for two questions two treatments.", () => {
    const state = {
      questions: [
        createQuestionNoTitrate(1, 1),
        create2ndQuestionNoTitrate(1, 2),
        createQuestionNoTitrate(2, 1),
        create2ndQuestionNoTitrate(2, 2),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(qe.currentAnswer(state).treatmentId).toBe(1);
    expect(state.currentAnswerIdx).toBe(1);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentAnswerIdx).toBe(2);
    expect(qe.currentAnswer(state).treatmentId).toBe(2);
    expect(state.status).toBe(StatusType.ChoiceInstructions);
    qe.incNextQuestion(state);
    expect(qe.currentAnswer(state).treatmentId).toBe(2);
    expect(state.currentAnswerIdx).toBe(3);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(qe.currentAnswer(state).treatmentId).toBe(2);
    expect(state.currentAnswerIdx).toBe(3);
    expect(state.status).toBe(StatusType.ExperienceQuestionaire);
  });

  test("incNextQuestion for three questions single treatment should increment question index and enter attention state then experiene survey.", () => {
    const state = {
      questions: [
        createQuestionNoTitrate(1, 1),
        create2ndQuestionNoTitrate(1, 2),
        create2ndQuestionNoTitrate(1, 3),
      ],
      currentAnswerIdx: 0,
      status: StatusType.Survey,
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
    return SurveyQuestion({
      treatmentId: 1,
      sequenceId: 1,
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
}
