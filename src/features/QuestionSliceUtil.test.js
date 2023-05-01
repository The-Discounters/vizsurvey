import { stateToDate } from "./ConversionUtil";
import {
  getRandomIntInclusive,
  flattenTreatmentValueAry,
  flattenState,
} from "./QuestionSliceUtil";
import { setAllPropertiesEmpty } from "./ObjectUtil.js";

import { TestDataFactory } from "./QuestionEngine.test.js";

describe("questionSlice tests", () => {
  test("Check how to use Luxon diff to calcualte elapsed time in seconds.", () => {
    const elapsedTimeInSec = stateToDate("2023-01-27T00:00:00.000-05:00").diff(
      stateToDate("2023-01-26T00:00:00.000-05:00"),
      ["seconds"]
    );
    expect(elapsedTimeInSec.seconds).toBe(60 * 60 * 24);
  });

  test("Spread operator behavior on objects with the same property names", () => {
    const obj1 = { prop1: "value1", prop2: "value2", unique: "valueunique" };
    const obj2 = {
      prop1: "value1",
      prop2: "value2",
      uniqueSecond: "valueuniquesecond",
    };
    const obj3 = { ...obj1, ...obj2 };
    expect(obj3).toStrictEqual({
      prop1: "value1",
      prop2: "value2",
      unique: "valueunique",
      uniqueSecond: "valueuniquesecond",
    });
    const obj4 = {
      prop1: "value1",
      prop2: "value2x",
      uniqueSecond: "valueuniquesecond",
    };
    const obj5 = { ...obj1, ...obj4 };
    expect(obj5).toStrictEqual({
      prop1: "value1",
      prop2: "value2",
      prop2: "value2x",
      unique: "valueunique",
      uniqueSecond: "valueuniquesecond",
    });
  });

  test("Test getRandomIntInclusive.", () => {
    let value = getRandomIntInclusive(0, 0);
    expect(value).toBe(0);
    expect(Number.isInteger(value)).toBe(true);
    value = getRandomIntInclusive(0, 1);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
    value = getRandomIntInclusive(3, 3);
    expect(value).toBeGreaterThanOrEqual(3);
    expect(value).toBeLessThanOrEqual(3);
  });

  test("Test flattenState one treatment.", () => {
    const state = {
      participantId: 2,
      sessionId: 3,
      studyId: 4,
      experienceSurvey: {},
      financialLitSurvey: {},
      purposeSurvey: {},
      screenAttributes: {
        // screen properties
        screenAvailHeight: null,
        screenAvailWidth: null,
        screenColorDepth: screen.colorDepth,
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenOrientationAngle: "100",
        screenOrientationType: "type",
        screenPixelDepth: screen.pixelDepth,
        // window properties
        windowDevicePixelRatio: window.devicePixelRatio,
        windowInnerHeight: null,
        windowInnerWidth: null,
        windowOuterHeight: null,
        windowOuterWidth: null,
        windowScreenLeft: null,
        windowScreenTop: null,
      },
      countryOfResidence: "",
      vizFamiliarity: "",
      age: "",
      gender: "",
      selfDescribeGender: "",
      profession: "",
      employment: "",
      selfDescribeEmployment: "",
      consentChecked: null,
      timezone: null,
      timestamps: {
        consentShownTimestamp: "2023-01-17T18:16:43.539+00:00",
        consentCompletedTimestamp: "2023-01-17T18:16:43.539+00:00",
        consentTimeSec: 1,
        demographicShownTimestamp: "2023-01-17T18:16:43.539+00:00",
        demographicCompletedTimestamp: "2023-01-17T18:16:43.539+00:00",
        demographicTimeSec: 1,
        introductionShownTimestamp: [],
        introductionCompletedTimestamp: [],
        introductionTimeSec: [],
        instructionsShownTimestamp: null,
        instructionsCompletedTimestamp: null,
        instructionsTimeSec: null,
        attentionCheckShownTimestamp: [],
        attentionCheckCompletedTimestamp: [],
        attentionCheckTimeSec: [1, 2],
        experienceSurveyQuestionsShownTimestamp: null,
        experienceSurveyQuestionsCompletedTimestamp: null,
        experienceSurveyTimeSec: null,
        financialLitSurveyQuestionsShownTimestamp: null,
        financialLitSurveyQuestionsCompletedTimestamp: null,
        financialLitSurveyTimeSec: null,
        purposeSurveyQuestionsShownTimestamp: null,
        purposeSurveyQuestionsCompletedTimestamp: null,
        purposeSurveyTimeSec: null,
        debriefShownTimestamp: null,
        debriefCompletedTimestamp: null,
        debriefTimeSec: null,
      },
      attentionCheck: ["agree", "agree"],
      feedback: "",
      treatments: [
        TestDataFactory.createQuestionNoTitrate(1, 1),
        TestDataFactory.create2ndQuestionNoTitrate(1, 2),
      ],
      answers: [
        TestDataFactory.createAnswer(1, 1),
        TestDataFactory.createAnswer(1, 2),
        TestDataFactory.createAnswer(2, 1),
        TestDataFactory.createAnswer(2, 2),
      ],
      instructionTreatment: null,
      currentAnswerIdx: 0,
      treatmentIds: [1, 2],
      highup: undefined,
      lowdown: undefined,
      status: "status",
      error: null,
      userAgent: null,
    };
    const result = setAllPropertiesEmpty(flattenState(state));
    expect(JSON.stringify(result)).toBe(
      '{"participantId":"","sessionId":"","studyId":"","treatmentId":"","consentShownTimestamp":"","consentCompletedTimestamp":"","consentTimeSec":"","demographicShownTimestamp":"","demographicCompletedTimestamp":"","demographicTimeSec":"","instructionsShownTimestamp":"","instructionsCompletedTimestamp":"","instructionsTimeSec":"","experienceSurveyQuestionsShownTimestamp":"","experienceSurveyQuestionsCompletedTimestamp":"","experienceSurveyTimeSec":"","financialLitSurveyQuestionsShownTimestamp":"","financialLitSurveyQuestionsCompletedTimestamp":"","financialLitSurveyTimeSec":"","purposeSurveyQuestionsShownTimestamp":"","purposeSurveyQuestionsCompletedTimestamp":"","purposeSurveyTimeSec":"","debriefShownTimestamp":"","debriefCompletedTimestamp":"","debriefTimeSec":"","attentionCheckTimeSec_undefined":"","consentChecked":"","countryOfResidence":"","vizFamiliarity":"","age":"","gender":"","selfDescribeGender":"","profession":"","employment":"","selfDescribeEmployment":"","timezone":"","userAgent":"","screenAvailHeight":"","screenAvailWidth":"","screenColorDepth":"","screenWidth":"","screenHeight":"","screenOrientationAngle":"","screenOrientationType":"","screenPixelDepth":"","windowDevicePixelRatio":"","windowInnerHeight":"","windowInnerWidth":"","windowOuterHeight":"","windowOuterWidth":"","windowScreenLeft":"","windowScreenTop":"","treatmentId_1_1":"","position_1_1":"","viewType_1_1":"","interaction_1_1":"","variableAmount_1_1":"","amountEarlier_1_1":"","timeEarlier_1_1":"","dateEarlier_1_1":"","amountLater_1_1":"","timeLater_1_1":"","dateLater_1_1":"","maxAmount_1_1":"","maxTime_1_1":"","verticalPixels_1_1":"","horizontalPixels_1_1":"","leftMarginWidthIn_1_1":"","bottomMarginHeightIn_1_1":"","graphWidthIn_1_1":"","graphHeightIn_1_1":"","widthIn_1_1":"","heightIn_1_1":"","showMinorTicks_1_1":"","choice_1_1":"","dragAmount_1_1":"","shownTimestamp_1_1":"","choiceTimestamp_1_1":"","choiceTimeSec_1_1":"","highup_1_1":"","lowdown_1_1":"","treatmentId_1_2":"","position_1_2":"","viewType_1_2":"","interaction_1_2":"","variableAmount_1_2":"","amountEarlier_1_2":"","timeEarlier_1_2":"","dateEarlier_1_2":"","amountLater_1_2":"","timeLater_1_2":"","dateLater_1_2":"","maxAmount_1_2":"","maxTime_1_2":"","verticalPixels_1_2":"","horizontalPixels_1_2":"","leftMarginWidthIn_1_2":"","bottomMarginHeightIn_1_2":"","graphWidthIn_1_2":"","graphHeightIn_1_2":"","widthIn_1_2":"","heightIn_1_2":"","showMinorTicks_1_2":"","choice_1_2":"","dragAmount_1_2":"","shownTimestamp_1_2":"","choiceTimestamp_1_2":"","choiceTimeSec_1_2":"","highup_1_2":"","lowdown_1_2":"","treatmentId_2_1":"","position_2_1":"","viewType_2_1":"","interaction_2_1":"","variableAmount_2_1":"","amountEarlier_2_1":"","timeEarlier_2_1":"","dateEarlier_2_1":"","amountLater_2_1":"","timeLater_2_1":"","dateLater_2_1":"","maxAmount_2_1":"","maxTime_2_1":"","verticalPixels_2_1":"","horizontalPixels_2_1":"","leftMarginWidthIn_2_1":"","bottomMarginHeightIn_2_1":"","graphWidthIn_2_1":"","graphHeightIn_2_1":"","widthIn_2_1":"","heightIn_2_1":"","showMinorTicks_2_1":"","choice_2_1":"","dragAmount_2_1":"","shownTimestamp_2_1":"","choiceTimestamp_2_1":"","choiceTimeSec_2_1":"","highup_2_1":"","lowdown_2_1":"","treatmentId_2_2":"","position_2_2":"","viewType_2_2":"","interaction_2_2":"","variableAmount_2_2":"","amountEarlier_2_2":"","timeEarlier_2_2":"","dateEarlier_2_2":"","amountLater_2_2":"","timeLater_2_2":"","dateLater_2_2":"","maxAmount_2_2":"","maxTime_2_2":"","verticalPixels_2_2":"","horizontalPixels_2_2":"","leftMarginWidthIn_2_2":"","bottomMarginHeightIn_2_2":"","graphWidthIn_2_2":"","graphHeightIn_2_2":"","widthIn_2_2":"","heightIn_2_2":"","showMinorTicks_2_2":"","choice_2_2":"","dragAmount_2_2":"","shownTimestamp_2_2":"","choiceTimestamp_2_2":"","choiceTimeSec_2_2":"","highup_2_2":"","lowdown_2_2":"","attentionCheck":"","feedback":""}'
    );
  });

  test("Test flattenTimestamp", () => {
    const treatmentValueAry = [
      { treatmentId: 1, value: "timestamp1" },
      { treatmentId: 2, value: "timestamp2" },
    ];
    const result = flattenTreatmentValueAry("timestamps", treatmentValueAry);
    expect(result).toStrictEqual({
      timestamps_1: "timestamp1",
      timestamps_2: "timestamp2",
    });
  });

  // I used this test to gather some data on what the random generation of treatment id distribution looked like.
  // test("Test getRandomIntInclusive distribution.", () => {
  //   //const treatmentIds = new Array();
  //   const distributions = new Array();
  //   for (let j = 1; j <= 100; j++) {
  //     const treatmentDist = [0, 0, 0];
  //     for (let i = 1; i <= 100; i++) {
  //       let value = getRandomIntInclusive(1, 3);
  //       expect(value).toBeGreaterThanOrEqual(1);
  //       expect(value).toBeLessThanOrEqual(3);
  //       //treatmentIds.push(value);
  //       treatmentDist[value - 1] = treatmentDist[value - 1] + 1;
  //     }
  //     //console.log(treatmentIds);
  //     console.log(treatmentDist);
  //     distributions.push(treatmentDist);
  //   }
  //   const distStr = distributions.reduce((acc, cv) => {
  //     return acc + `${cv[0]},${cv[1]},${cv[2]}\n`;
  //   }, "count1, count2, count3\n");
  //   fs.writeFileSync("getRandomIntInclusive-dist.csv", distStr);
  // });
  // I used this test to gather some data on what the random generation of treatment id distribution looked like.
  // test("Test getRandomIntInclusive distribution single execution.", () => {
  //   let value = getRandomIntInclusive(1, 3);
  //   fs.appendFileSync("getRandomIntInclusive-dist-single.txt", `${value}\n`);
  // });
});
