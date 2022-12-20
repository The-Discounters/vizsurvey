import { FileIOAdapter } from "./FileIOAdapter";
import { InteractionType } from "./InteractionType";
import { AmountType } from "./AmountType";
import { ViewType } from "./ViewType";
import { Answer } from "./Answer";
import { DateTime } from "luxon";

describe("Enum tests", () => {
  const result = ViewType["barchart"];
  expect(result).toBe(ViewType.barchart);
});

describe("FileIOAdapter tests", () => {
  test("Validate loadTreatment loads CSV fields correctly.", async () => {
    const io = new FileIOAdapter();
    var questions = await io.loadTreatment(1);
    expect(questions.length).toBe(3);
    expect(questions[0].treatmentId).toBe(1);
    expect(questions[0].position).toBe(1);
    expect(questions[0].viewType).toBe(ViewType.word);
    expect(questions[0].interaction).toBe(InteractionType.none);
    expect(questions[0].variableAmount).toBe(AmountType.none);
    expect(questions[0].amountEarlier).toBe(500);
    expect(questions[0].timeEarlier).toBe(2);
    expect(questions[0].dateEarlier).toBeUndefined();
    expect(questions[0].amountLater).toBe(1000);
    expect(questions[0].timeLater).toBe(5);
    expect(questions[0].dateLater).toBeUndefined();
    expect(questions[0].maxAmount).toBeUndefined();
    expect(questions[0].maxTime).toBe(10);
    expect(questions[0].horizontalPixels).toBeUndefined();
    expect(questions[0].verticalPixels).toBeUndefined();
    expect(questions[0].leftMarginWidthIn).toBeUndefined();
    expect(questions[0].bottomMarginHeightIn).toBeUndefined();
    expect(questions[0].graphWidthIn).toBeUndefined();
    expect(questions[0].graphHeightIn).toBeUndefined();
    expect(questions[0].widthIn).toBe(4);
    expect(questions[0].heightIn).toBe(4);

    const showMinorTicks = "yes";
    const value = showMinorTicks
      ? "yes" === showMinorTicks.trim().toLowerCase()
        ? true
        : false
      : false;
    expect(value).toBe(true);
    expect(questions[0].showMinorTicks).toBe(false);
    expect(questions[0].comment).toBe(
      "Worded with no interaction and Read 2001 example values."
    );
    questions = await io.loadTreatment(3);
    expect(questions.length).toBe(5);
    expect(questions[0].treatmentId).toBe(3);
    expect(questions[0].position).toBe(1);
    expect(questions[0].viewType).toBe(ViewType.barchart);
    expect(questions[0].interaction).toBe(InteractionType.none);
    expect(questions[0].variableAmount).toBe(AmountType.none);
    expect(questions[0].amountEarlier).toBe(300);
    expect(questions[0].timeEarlier).toBe(2);
    expect(questions[0].dateEarlier).toBeUndefined();
    expect(questions[0].amountLater).toBe(700);
    expect(questions[0].timeLater).toBe(5);
    expect(questions[0].dateLater).toBeUndefined();
    expect(questions[0].maxAmount).toBe(1100);
    expect(questions[0].maxTime).toBe(10);
    expect(questions[0].horizontalPixels).toBe(800);
    expect(questions[0].verticalPixels).toBe(300);
    expect(questions[0].leftMarginWidthIn).toBeUndefined();
    expect(questions[0].bottomMarginHeightIn).toBeUndefined();
    expect(questions[0].graphWidthIn).toBeUndefined();
    expect(questions[0].graphHeightIn).toBeUndefined();
    expect(questions[0].widthIn).toBeUndefined();
    expect(questions[0].heightIn).toBeUndefined();
    expect(questions[0].comment).toBe(
      "Barchart MEL question with no interaction pixels."
    );
  });

  test("Validate loadAllTreatments loads all treatments correctly.", async () => {
    const io = new FileIOAdapter();
    var questions = await io.loadAllTreatments();
    expect(questions.length).toBe(65);
  });

  test("Validate answer CSV fields are written correctly.", async () => {
    const answer1 = Answer({
      treatmentId: 1,
      position: 2,
      viewType: ViewType.word,
      interaction: InteractionType.none,
      variableAmount: AmountType.earlierAmount,
      amountEarlier: 3,
      timeEarlier: 4,
      dateEarlier: DateTime.fromFormat("1/1/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      amountLater: 5,
      timeLater: 6,
      dateLater: DateTime.fromFormat("1/2/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      maxAmount: 7,
      maxTime: 8,
      verticalPixels: 9,
      horizontalPixels: 10,
      leftMarginWidthIn: 11,
      bottomMarginHeightIn: 12,
      graphWidthIn: 13,
      graphHeightIn: 14,
      widthIn: 15,
      heightIn: 16,
      choice: AmountType.earlierAmount,
      shownTimestamp: DateTime.fromFormat("1/3/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      choiceTimestamp: DateTime.fromFormat("1/4/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      highup: 17,
      lowdown: 18,
      participantId: "participant id",
    });
    const answer2 = Answer({
      treatmentId: 13,
      position: 14,
      viewType: ViewType.barchart,
      interaction: InteractionType.drag,
      variableAmount: AmountType.earlierAmount,
      amountEarlier: 15,
      timeEarlier: 16,
      dateEarlier: DateTime.utc(2001, 1, 2, 1, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      amountLater: 17,
      timeLater: 18,
      dateLater: DateTime.utc(2001, 1, 2, 2, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      maxAmount: 19,
      maxTime: 20,
      verticalPixels: 21,
      horizontalPixels: 22,
      leftMarginWidthIn: 23,
      bottomMarginHeightIn: 24,
      graphWidthIn: 25,
      graphHeightIn: 26,
      widthIn: 27,
      heightIn: 28,
      choice: AmountType.laterAmount,
      shownTimestamp: DateTime.utc(2001, 1, 2, 3, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      choiceTimestamp: DateTime.utc(2001, 1, 2, 4, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      highup: 29,
      lowdown: 30,
      participantId: "participant id 2",
    });
    const answers = [answer1, answer2];
    expect(
      DateTime.fromMillis(answers[0].dateEarlier, { zone: "utc" }).year
    ).toBe(2001);
    const io = new FileIOAdapter();
    const result = io.convertToCSV(answers);
    expect(result)
      .toBe(`participantId,sessionId,studyId,treatmentId,position,viewType,interaction,variableAmount,amountEarlier,timeEarlier,dateEarlier,amountLater,timeLater,dateLater,maxAmount,maxTime,verticalPixels,horizontalPixels,leftMarginWidthIn,bottomMarginHeightIn,graphWidthIn,graphHeightIn,widthIn,heightIn,showMinorTicks,choice,dragAmount,shownTimestamp,choiceTimestamp,highup,lowdown
1,2,word,none,earlierAmount,3,4,2001-01-01T00:00:00.000Z,5,6,2001-01-02T00:00:00.000Z,7,8,9,10,11,12,13,14,15,16,earlierAmount,2001-01-03T00:00:00.000Z,2001-01-04T00:00:00.000Z,17,18,participant code
13,14,barchart,drag,earlierAmount,15,16,2001-01-02T01:01:01.001Z,17,18,2001-01-02T02:01:01.001Z,19,20,21,22,23,24,25,26,27,28,laterAmount,2001-01-02T03:01:01.001Z,2001-01-02T04:01:01.001Z,29,30,participant code 2`);
  });

  test("Validate timestamp file is written correctly.", async () => {
    const timestamp = DateTime.fromFormat("1/1/2001", "M/d/yyyy", {
      zone: "utc",
    }).toMillis();

    const answer1 = Answer({
      treatmentId: 1,
      position: 2,
      viewType: ViewType.word,
      interaction: InteractionType.none,
      variableAmount: AmountType.earlierAmount,
      amountEarlier: 3,
      timeEarlier: 4,
      dateEarlier: DateTime.fromFormat("1/1/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      amountLater: 5,
      timeLater: 6,
      dateLater: DateTime.fromFormat("1/2/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      maxAmount: 7,
      maxTime: 8,
      verticalPixels: 9,
      horizontalPixels: 10,
      leftMarginWidthIn: 11,
      bottomMarginHeightIn: 12,
      graphWidthIn: 13,
      graphHeightIn: 14,
      widthIn: 15,
      heightIn: 16,
      choice: AmountType.earlierAmount,
      shownTimestamp: DateTime.fromFormat("1/3/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      choiceTimestamp: DateTime.fromFormat("1/4/2001", "M/d/yyyy", {
        zone: "utc",
      }).toMillis(),
      highup: 17,
      lowdown: 18,
      participantId: "participant id",
    });
    const answer2 = Answer({
      treatmentId: 13,
      position: 14,
      viewType: ViewType.barchart,
      interaction: InteractionType.drag,
      variableAmount: AmountType.earlierAmount,
      amountEarlier: 15,
      timeEarlier: 16,
      dateEarlier: DateTime.utc(2001, 1, 2, 1, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      amountLater: 17,
      timeLater: 18,
      dateLater: DateTime.utc(2001, 1, 2, 2, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      maxAmount: 19,
      maxTime: 20,
      verticalPixels: 21,
      horizontalPixels: 22,
      leftMarginWidthIn: 23,
      bottomMarginHeightIn: 24,
      graphWidthIn: 25,
      graphHeightIn: 26,
      widthIn: 27,
      heightIn: 28,
      choice: AmountType.laterAmount,
      shownTimestamp: DateTime.utc(2001, 1, 2, 3, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      choiceTimestamp: DateTime.utc(2001, 1, 2, 4, 1, 1, 1, {
        zone: "utc",
      }).toMillis(),
      highup: 29,
      lowdown: 30,
      participantId: "participant id 2",
    });
    const answers = [answer1, answer2];

    const financialLitSurvey = {
      participantId: 1,
      key1: "value1",
      key2: "value2",
    };
    const purposeSurvey = {
      participantId: 1,
      key1: "value1",
      key2: "value2",
    };

    const timestamps = {
      participantId: 1,
      consentShownTimestamp: timestamp,
      consentCompletedTimestamp: timestamp,
      introductionShowTimestamp: timestamp,
      introductionCompletedTimestamp: timestamp,
      instructionsShownTimestamp: timestamp,
      instructionsCompletedTimestamp: timestamp,
      attentionCheckShownTimestamp: timestamp,
      attentionCheckCompletedTimestamp: timestamp,
      financialLitSurveyQuestionsShownTimestamp: timestamp,
      purposeSurveyQuestionsShownTimestamp: timestamp,
      debriefShownTimestamp: timestamp,
      debriefCompletedTimestamp: timestamp,
      theEndShownTimestamp: timestamp,
    };

    const demographic = {
      participantId: 1,
      countryOfResidence: "Country of residence",
      vizFamiliarity: "vis familiarity",
      age: "age",
      gender: "gender",
      selfDescribeGender: "self describe gender",
      profession: "profession",
    };

    const legal = {
      participantId: 1,
      consentChecked: true,
      attentionCheck: true,
    };

    const io = new FileIOAdapter();
    io.writeAnswers(
      1,
      1,
      answers,
      timestamps,
      financialLitSurvey,
      purposeSurvey,
      demographic,
      legal
    );
  });
});
