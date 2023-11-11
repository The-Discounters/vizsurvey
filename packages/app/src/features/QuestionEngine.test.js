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
  test("nextStatus testing state transitions.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
        (TestDataFactory.create2ndQuestionNoTitrate.position = 3),
      ],
      currentQuestionIdx: 0,
      status: StatusType.Unitialized,
    };
    const qe = new QuestionEngine();
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.Fetching
    );
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.Consent
    );
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.Instructions
    );
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.MCLInstructions
    );
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.Survey
    );
    state.currentQuestionIdx = 1;
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.Survey
    );
    state.currentQuestionIdx = 2;
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.Survey
    );
    expect((state.status = qe.nextStatus(state, true))).toBe(
      StatusType.ExperienceQuestionaire
    );
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.FinancialQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true))).toBe(
      StatusType.PurposeAwareQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true))).toBe(
      StatusType.PurposeWorthQuestionaire
    );
    expect((state.status = qe.nextStatus(state, true))).toBe(
      StatusType.Demographic
    );
    expect((state.status = qe.nextStatus(state, false))).toBe(
      StatusType.Debrief
    );
    expect(qe.nextStatus(state, false)).toBe(StatusType.Finished);
  });

  test("previousStatus testing state transitions.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
        (TestDataFactory.create2ndQuestionNoTitrate.position = 3),
      ],
      currentQuestionIdx: 2,
      status: StatusType.Debrief,
    };
    const qe = new QuestionEngine();
    // we can't go back once we hit Debrief status
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.Debrief
    );
    state.status = StatusType.Demographic;
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.PurposeWorthQuestionaire
    );
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.PurposeAwareQuestionaire
    );
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.FinancialQuestionaire
    );
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.ExperienceQuestionaire
    );
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.Survey
    );
    state.currentQuestionIdx = 1;
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.Survey
    );
    state.currentQuestionIdx = 0;
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.Survey
    );
    expect((state.status = qe.previousStatus(state, true))).toBe(
      StatusType.MCLInstructions
    );
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.Instructions
    );
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.Consent
    );
    expect((state.status = qe.previousStatus(state, false))).toBe(
      StatusType.Fetching
    );
    expect((state.status = qe.previousStatus(state))).toBe(
      StatusType.Unitialized
    );
    expect(qe.previousStatus(state)).toBe(StatusType.Unitialized);
  });

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
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
      ],
      answers: [],
      currentQuestionIdx: 0,
    };
    const qe = new QuestionEngine();
    qe.startSurvey(state);
    expect(state.status).toBeUndefined();
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].amountEarlier).toBe(400);
  });

  test("answerCurrentQuestion for non titration single treatment question and answer should update the current answer choice and not create more answer entries.", () => {
    const state = {
      treatments: [TestDataFactory.createQuestionNoTitrate()],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentQuestionIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.answerCurrentQuestion(state, {
      choice: AmountType.earlierAmount,
      choiceTimestamp: dateToState(DateTime.now()),
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].choice).toBe(AmountType.earlierAmount);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("answerCurrentQuestion for non titration multiple treatment questions single answer should update the current answer choice and not create more answer entries.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
      ],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentQuestionIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.answerCurrentQuestion(state, {
      choice: AmountType.earlierAmount,
      choiceTimestamp: dateToState(DateTime.now()),
    });
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].choice).toBe(AmountType.earlierAmount);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("incNextQuestion for two treatment should increment question index and stay in survey state.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
      ],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentQuestionIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(state.currentQuestionIdx).toBe(1);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(2);
    expect(state.answers[1].choice).toBe(AmountType.none);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("incNextQuestion for three treatment should increment question index and not enter attention state.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
        (TestDataFactory.create2ndQuestionNoTitrate.position = 3),
      ],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentQuestionIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.incNextQuestion(state);
    expect(state.currentQuestionIdx).toBe(1);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentQuestionIdx).toBe(2);
    expect(state.status).toBe(StatusType.Survey);
    qe.incNextQuestion(state);
    expect(state.currentQuestionIdx).toBe(2);
    expect(state.status).toBe(StatusType.ExperienceQuestionaire);
  });

  test("decPreviousQuestion for single treatment should update state to post survey.", () => {
    const state = {
      treatments: [TestDataFactory.createQuestionNoTitrate()],
      answers: [TestDataFactory.createAnswer(1, 1)],
      currentQuestionIdx: 0,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.decPreviousQuestion(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(1);
    expect(state.answers[0].choice).toBe(AmountType.none);
    expect(state.status).toBe(StatusType.MCLInstructions);
  });

  test("decPreviousQuestion for two treatment when on the 2nd treatment should decrement question and stay in survey state.", () => {
    const answer1 = TestDataFactory.createAnswer(1, 1);
    answer1.choice = AmountType.earlierAmount;
    const answer2 = TestDataFactory.createAnswer(1, 2);
    answer2.choice = AmountType.laterAmount;
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
      ],
      answers: [answer1, answer2],
      currentQuestionIdx: 1,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.decPreviousQuestion(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.answers).not.toBeUndefined();
    expect(state.answers.length).toBe(2);
    expect(state.answers[0].choice).toBe(AmountType.earlierAmount);
    expect(state.status).toBe(StatusType.Survey);
  });

  test("decPreviousQuestion for two treatment when on the 2nd treatment should decrement question and stay in survey state.", () => {
    const state = {
      treatments: [
        TestDataFactory.createQuestionNoTitrate(),
        TestDataFactory.create2ndQuestionNoTitrate,
        (TestDataFactory.create2ndQuestionNoTitrate.position = 1),
      ],
      currentQuestionIdx: 2,
      status: StatusType.Survey,
    };
    const qe = new QuestionEngine();
    qe.decPreviousQuestion(state);
    expect(state.currentQuestionIdx).toBe(1);
    expect(state.status).toBe(StatusType.Survey);
    qe.decPreviousQuestion(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe(StatusType.Survey);
    qe.decPreviousQuestion(state);
    expect(state.currentQuestionIdx).toBe(0);
    expect(state.status).toBe(StatusType.MCLInstructions);
  });

  // TODO Titration functionality is broken.  I have not coded previous button to work with it.
  // test("Test calculation methods using example for the values from Read 2001 paper.", () => {
  //   const state = {
  //     treatmentId: 1,
  //     treatments: [TestDataFactory.createQuestionLaterTitrate()],
  //     answers: [TestDataFactory.createInitialAnswerTitrate()],
  //     currentQuestionIdx: 0,
  //     highup: 500,
  //     lowdown: undefined,
  //   };
  //   const a = state.answers[0];
  //   // initial condition from paper uses earlier amount as difference override when calculation titration amount.
  //   expect(state.highup).toBe(500);
  //   expect(state.lowdown).toBeUndefined();
  //   expect(a.amountEarlier).toBe(500);
  //   expect(a.amountLater).toBe(1000);
  //   const qe = new QuestionEngine();
  //   a.choice = AmountType.earlierAmount;
  //   // first calc from paper example, use highdown which is initilly set equal to earlier amount
  //   qe.updateHighupOrLowdown(state);
  //   expect(state.highup).toBe(1000);
  //   expect(state.lowdown).toBeUndefined();
  //   expect(qe.calcTitrationAmount(undefined, 500, 500)).toBe(250);
  //   a.amountLater = 1250;
  //   a.choice = AmountType.laterAmount;
  //   // second calc from paper example there is no lowdown, so passes larger later amount as lowdown
  //   qe.updateHighupOrLowdown(state);
  //   expect(state.highup).toBe(1000);
  //   expect(state.lowdown).toBe(1250);
  //   expect(qe.calcTitrationAmount(1250, 1000, null)).toBe(125);
  //   a.amountLater = 1120;
  //   a.choice = AmountType.laterAmount;
  //   // third calc from paper example
  //   qe.updateHighupOrLowdown(state);
  //   expect(state.highup).toBe(1000);
  //   expect(state.lowdown).toBe(1120);
  //   expect(qe.calcTitrationAmount(1120, 1000, null)).toBe(60);
  //   a.amountLater = 1060;
  //   a.choice = AmountType.earlierAmount;
  //   // fourth calc from paper example
  //   qe.updateHighupOrLowdown(state);
  //   expect(state.highup).toBe(1060);
  //   expect(state.lowdown).toBe(1120);
  //   expect(qe.calcTitrationAmount(1120, 1060, null)).toBe(30);
  //   a.amountLater = 1090;
  //   a.choice = AmountType.laterAmount;
  //   // fifth calc from paper example
  //   qe.updateHighupOrLowdown(state);
  //   expect(state.highup).toBe(1060);
  //   expect(state.lowdown).toBe(1090);
  //   expect(qe.calcTitrationAmount(1090, 1060, null)).toBe(15);
  //   a.amountLater = 1070;
  //   a.choice = AmountType.earlierAmount;
  //   // sixth calc from paper example
  //   qe.updateHighupOrLowdown(state);
  //   expect(state.highup).toBe(1070);
  //   expect(state.lowdown).toBe(1090); // different from the paper
  //   expect(qe.calcTitrationAmount(1070, 1060, null)).toBe(5);
  // });

  // test("Integration test QuestionEngine titrationfrom Read 2001 paper.", () => {
  //   const state = {
  //     treatmentId: 1,
  //     participantId: 1,
  //     treatments: [TestDataFactory.createQuestionLaterTitrate()],
  //     answers: [],
  //     currentQuestionIdx: 0,
  //     highup: 500,
  //     lowdown: undefined,
  //     status: StatusType.Unitialized,
  //     error: null,
  //   };

  //   const qe = new QuestionEngine();
  //   qe.startSurvey(state);
  //   expect(state.highup).toBe(500);
  //   expect(state.lowdown).toBeUndefined();
  //   expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
  //   expect(state.answers[state.answers.length - 1].amountLater).toBe(1000);
  //   // first answer
  //   qe.answerCurrentQuestion(state, {
  //     payload: {
  //       choice: AmountType.earlierAmount,
  //       choiceTimestamp: dateToState(DateTime.now()),
  //       direction: DirectionType.next,
  //       answerChanged: true,
  //     },
  //   });
  //   expect(state.currentQuestionIdx).toBe(0);
  //   expect(state.status).toBe(StatusType.Instructions);
  //   expect(state.error).toBeNull();
  //   expect(state.highup).toBe(1000);
  //   expect(state.lowdown).toBeUndefined();
  //   expect(state.answers.length).toBe(2);
  //   expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
  //   expect(state.answers[state.answers.length - 1].amountLater).toBe(1250);
  //   // second answer
  //   qe.answerCurrentQuestion(state, {
  //     payload: {
  //       choice: AmountType.laterAmount,
  //       choiceTimestamp: dateToState(DateTime.now()),
  //       direction: DirectionType.next,
  //       answerChanged: true,
  //     },
  //   });
  //   expect(state.currentQuestionIdx).toBe(0);
  //   expect(state.status).toBe(StatusType.Instructions);
  //   expect(state.error).toBeNull();
  //   expect(state.highup).toBe(1000);
  //   expect(state.lowdown).toBe(1250);
  //   expect(state.answers.length).toBe(3);
  //   expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
  //   expect(state.answers[state.answers.length - 1].amountLater).toBe(1120);
  //   // third answer
  //   qe.answerCurrentQuestion(state, {
  //     payload: {
  //       choice: AmountType.laterAmount,
  //       choiceTimestamp: dateToState(DateTime.now()),
  //       direction: DirectionType.next,
  //       answerChanged: true,
  //     },
  //   });
  //   expect(state.currentQuestionIdx).toBe(0);
  //   expect(state.status).toBe(StatusType.Instructions);
  //   expect(state.error).toBeNull();
  //   expect(state.highup).toBe(1000);
  //   expect(state.lowdown).toBe(1120);
  //   expect(state.answers.length).toBe(4);
  //   expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
  //   expect(state.answers[state.answers.length - 1].amountLater).toBe(1060);
  //   // fourth answer
  //   qe.answerCurrentQuestion(state, {
  //     payload: {
  //       choice: AmountType.earlierAmount,
  //       choiceTimestamp: dateToState(DateTime.now()),
  //       direction: DirectionType.next,
  //       answerChanged: true,
  //     },
  //   });
  //   expect(state.currentQuestionIdx).toBe(0);
  //   expect(state.status).toBe(StatusType.Instructions);
  //   expect(state.error).toBeNull();
  //   expect(state.highup).toBe(1060);
  //   expect(state.lowdown).toBe(1120);
  //   expect(state.answers.length).toBe(5);
  //   expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
  //   expect(state.answers[state.answers.length - 1].amountLater).toBe(1090);
  //   // fifth answer
  //   qe.answerCurrentQuestion(state, {
  //     payload: {
  //       choice: AmountType.laterAmount,
  //       choiceTimestamp: dateToState(DateTime.now()),
  //       direction: DirectionType.next,
  //       answerChanged: true,
  //     },
  //   });
  //   expect(state.currentQuestionIdx).toBe(0);
  //   expect(state.status).toBe(StatusType.Instructions);
  //   expect(state.error).toBeNull();
  //   expect(state.highup).toBe(1060);
  //   expect(state.lowdown).toBe(1090);
  //   expect(state.answers.length).toBe(6);
  //   expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
  //   expect(state.answers[state.answers.length - 1].amountLater).toBe(1070);
  //   // sixth answer
  //   qe.answerCurrentQuestion(state, {
  //     payload: {
  //       // the paper said the last choice was earlier; however, I think it is wrong and meant later.
  //       // Choice of later seems to make the last value of lowdown work according to the algorithm
  //       // I derived from the earlier steps in the example.
  //       choice: AmountType.laterAmount,
  //       choiceTimestamp: dateToState(DateTime.now()),
  //       direction: DirectionType.next,
  //       answerChanged: true,
  //     },
  //   });
  //   expect(state.currentQuestionIdx).toBe(0);
  //   expect(state.status).toBe(StatusType.Questionaire);
  //   expect(state.error).toBeNull();
  //   expect(state.highup).toBe(1060);
  //   expect(state.lowdown).toBe(1070);
  //   expect(state.answers.length).toBe(6);
  //   expect(state.answers[state.answers.length - 1].amountEarlier).toBe(500);
  //   expect(state.answers[state.answers.length - 1].amountLater).toBe(1070);
  //   expect(state.status).toBe(StatusType.Questionaire);
  // });
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
