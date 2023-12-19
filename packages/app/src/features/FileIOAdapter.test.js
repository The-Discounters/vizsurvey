//import AWS from "aws-sdk";
import { DateTime } from "luxon";
import { InteractionType, ViewType, AmountType } from "@the-discounters/types";
import { Answer } from "./Answer";
import { convertToCSV } from "@the-discounters/util";
import { flattenTreatmentValueAry, flattenState } from "./FileIOAdapter.js";
import { setAllPropertiesEmpty } from "@the-discounters/types";
import {
  createQuestionNoTitrate,
  create2ndQuestionNoTitrate,
} from "@the-discounters/test-shared";

describe("Enum tests", () => {
  const result = ViewType["barchart"];
  expect(result).toBe(ViewType.barchart);
});

describe("Regular express test", () => {
  const files = [
    "answer-timestamps-1-2-1671914207718.csv",
    "answer-timestamps-1-2-1671914717290.csv",
    "answers-1-2-1671914207715.json",
    "answers-1-2-1671914207718.csv",
    "answers-1-2-1671914717289.json",
    "answers-1-2-1671914717290.csv",
    "debrief-1-2-1671914210663.json",
    "debrief-1-2-1671914720923.json",
    "debrief-timestamps-1-2-1671914210663.csv",
    "debrief-timestamps-1-2-1671914720923.csv",
    "demographics-1-2-1671914207718.csv",
    "demographics-1-2-1671914717290.csv",
    "discount-lit-survey-1-2-1671914207718.csv",
    "discount-lit-survey-1-2-1671914717290.csv",
    "feedback - 1 - 2 - 1671914210663.csv",
    "feedback-1-2-1671914720923.csv",
    "financial-lit-survey-1-2-1671914207718.csv",
    "financial-lit-survey-1-2-1671914717290.csv",
    "legal-1-2-1671914207718.csv",
    "legal-1-2-1671914717290.csv",
    "purpose-survey-1-2-1671914207718.csv",
    "purpose-survey-1-2-1671914717290.csv",
  ];
  const result = [];
  //const re = /answer-timestamps-\d+-\d+-\d+\.csv/;
  const re = new RegExp("answer-timestamps-\\d+-\\d+-\\d+\\.csv");
  files.forEach((file) => {
    if (re.test(file)) {
      result.push(file);
    }
  });
  expect(result.length).toBe(2);
});

describe("FileIOAdapter tests", () => {
  test("Validate answer CSV fields are written correctly.", async () => {
    const answer1 = Answer({
      participantId: 1,
      sessionId: 2,
      studyId: 3,
      treatmentId: 4,
      position: 5,
      viewType: ViewType.word,
      interaction: InteractionType.none,
      variableAmount: AmountType.earlierAmount,
      amountEarlier: 6,
      timeEarlier: 7,
      dateEarlier: DateTime.fromFormat("1/1/2001", "M/d/yyyy", {
        zone: "utc",
      }).toISO(),
      amountLater: 8,
      timeLater: 9,
      dateLater: DateTime.fromFormat("1/2/2001", "M/d/yyyy", {
        zone: "utc",
      }).toISO(),
      maxAmount: 10,
      maxTime: 11,
      verticalPixels: 12,
      horizontalPixels: 13,
      leftMarginWidthIn: 14,
      bottomMarginHeightIn: 15,
      graphWidthIn: 16,
      graphHeightIn: 17,
      widthIn: 18,
      heightIn: 19,
      choice: AmountType.earlierAmount,
      showMinorTicks: false,
      shownTimestamp: DateTime.fromFormat("1/3/2001", "M/d/yyyy", {
        zone: "utc",
      }).toISO(),
      choiceTimestamp: DateTime.fromFormat("1/4/2001", "M/d/yyyy", {
        zone: "utc",
      }).toISO(),
      choiceTimeSec: 1,
    });
    const answer2 = Answer({
      participantId: 22,
      sessionId: 23,
      studyId: 24,
      treatmentId: 25,
      position: 26,
      viewType: ViewType.barchart,
      interaction: InteractionType.drag,
      variableAmount: AmountType.earlierAmount,
      amountEarlier: 27,
      timeEarlier: 28,
      dateEarlier: DateTime.utc(2001, 1, 2, 1, 1, 1, 1, {
        zone: "utc",
      }).toISO(),
      amountLater: 29,
      timeLater: 30,
      dateLater: DateTime.utc(2001, 1, 2, 2, 1, 1, 1, {
        zone: "utc",
      }).toISO(),
      maxAmount: 31,
      maxTime: 32,
      verticalPixels: 33,
      horizontalPixels: 34,
      leftMarginWidthIn: 35,
      bottomMarginHeightIn: 36,
      graphWidthIn: 37,
      graphHeightIn: 38,
      widthIn: 39,
      heightIn: 40,
      choice: AmountType.laterAmount,
      showMinorTicks: false,
      shownTimestamp: DateTime.utc(2001, 1, 2, 3, 1, 1, 1, {
        zone: "utc",
      }).toISO(),
      choiceTimestamp: DateTime.utc(2001, 1, 2, 4, 1, 1, 1, {
        zone: "utc",
      }).toISO(),
      choiceTimeSec: 1,
    });
    const answers = [answer1, answer2];
    const result = convertToCSV(answers);
    expect(result).toBe(
      `participantId,sessionId,studyId,treatmentId,position,viewType,interaction,variableAmount,amountEarlier,timeEarlier,dateEarlier,amountLater,timeLater,dateLater,maxAmount,maxTime,verticalPixels,horizontalPixels,leftMarginWidthIn,bottomMarginHeightIn,graphWidthIn,graphHeightIn,widthIn,heightIn,showMinorTicks,choice,dragAmount,shownTimestamp,choiceTimestamp,choiceTimeSec\n1,2,3,4,5,word,none,earlierAmount,6,7,2001-01-01T00:00:00.000Z,8,9,2001-01-02T00:00:00.000Z,10,11,12,13,14,15,16,17,18,19,false,earlierAmount,,2001-01-03T00:00:00.000Z,2001-01-04T00:00:00.000Z,1\r\n22,23,24,25,26,barchart,drag,earlierAmount,27,28,2001-01-02T01:01:01.001Z,29,30,2001-01-02T02:01:01.001Z,31,32,33,34,35,36,37,38,39,40,false,laterAmount,,2001-01-02T03:01:01.001Z,2001-01-02T04:01:01.001Z,1\r\n`
    );
  });

  test("flattenState one treatment.", () => {
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
        // eslint-disable-next-line no-restricted-globals
        screenColorDepth: screen.colorDepth,
        // eslint-disable-next-line no-restricted-globals
        screenWidth: screen.width,
        // eslint-disable-next-line no-restricted-globals
        screenHeight: screen.height,
        screenOrientationAngle: "100",
        screenOrientationType: "type",
        // eslint-disable-next-line no-restricted-globals
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
        purposeSurveyAwareQuestionsShownTimestamp: null,
        purposeSurveyAwareQuestionsCompletedTimestamp: null,
        purposeSurveyAwareTimeSec: null,
        purposeSurveyWorthQuestionsShownTimestamp: null,
        purposeSurveyWorthQuestionsCompletedTimestamp: null,
        purposeSurveyWorthTimeSec: null,
        debriefShownTimestamp: null,
        debriefCompletedTimestamp: null,
        debriefTimeSec: null,
      },
      attentionCheck: ["agree", "agree"],
      feedback: "",
      treatments: [
        createQuestionNoTitrate(1, 1),
        create2ndQuestionNoTitrate(1, 2),
        createQuestionNoTitrate(2, 1),
        create2ndQuestionNoTitrate(2, 2),
      ],
      instructionTreatment: null,
      currentAnswerIdx: 0,
      treatmentIds: [1, 2],
      status: "status",
      error: null,
      userAgent: null,
    };
    const result = setAllPropertiesEmpty(flattenState(state));
    expect(JSON.stringify(result)).toBe(
      `{\"participantId\":\"\",\"sessionId\":\"\",\"studyId\":\"\",\"treatmentId\":\"\",\"consentShownTimestamp\":\"\",\"consentCompletedTimestamp\":\"\",\"consentTimeSec\":\"\",\"demographicShownTimestamp\":\"\",\"demographicCompletedTimestamp\":\"\",\"demographicTimeSec\":\"\",\"instructionsShownTimestamp\":\"\",\"instructionsCompletedTimestamp\":\"\",\"instructionsTimeSec\":\"\",\"experienceSurveyQuestionsShownTimestamp\":\"\",\"experienceSurveyQuestionsCompletedTimestamp\":\"\",\"experienceSurveyTimeSec\":\"\",\"financialLitSurveyQuestionsShownTimestamp\":\"\",\"financialLitSurveyQuestionsCompletedTimestamp\":\"\",\"financialLitSurveyTimeSec\":\"\",\"purposeSurveyQuestionsShownTimestamp\":\"\",\"purposeSurveyQuestionsCompletedTimestamp\":\"\",\"purposeSurveyTimeSec\":\"\",\"debriefShownTimestamp\":\"\",\"debriefCompletedTimestamp\":\"\",\"debriefTimeSec\":\"\",\"attentionCheckTimeSec_undefined\":\"\",\"consentChecked\":\"\",\"countryOfResidence\":\"\",\"vizFamiliarity\":\"\",\"age\":\"\",\"gender\":\"\",\"selfDescribeGender\":\"\",\"profession\":\"\",\"employment\":\"\",\"selfDescribeEmployment\":\"\",\"timezone\":\"\",\"userAgent\":\"\",\"screenAvailHeight\":\"\",\"screenAvailWidth\":\"\",\"screenColorDepth\":\"\",\"screenWidth\":\"\",\"screenHeight\":\"\",\"screenOrientationAngle\":\"\",\"screenOrientationType\":\"\",\"screenPixelDepth\":\"\",\"windowDevicePixelRatio\":\"\",\"windowInnerHeight\":\"\",\"windowInnerWidth\":\"\",\"windowOuterHeight\":\"\",\"windowOuterWidth\":\"\",\"windowScreenLeft\":\"\",\"windowScreenTop\":\"\",\"treatmentId_1_1\":\"\",\"position_1_1\":\"\",\"viewType_1_1\":\"\",\"interaction_1_1\":\"\",\"variableAmount_1_1\":\"\",\"amountEarlier_1_1\":\"\",\"timeEarlier_1_1\":\"\",\"dateEarlier_1_1\":\"\",\"amountLater_1_1\":\"\",\"timeLater_1_1\":\"\",\"dateLater_1_1\":\"\",\"maxAmount_1_1\":\"\",\"maxTime_1_1\":\"\",\"verticalPixels_1_1\":\"\",\"horizontalPixels_1_1\":\"\",\"leftMarginWidthIn_1_1\":\"\",\"bottomMarginHeightIn_1_1\":\"\",\"graphWidthIn_1_1\":\"\",\"graphHeightIn_1_1\":\"\",\"widthIn_1_1\":\"\",\"heightIn_1_1\":\"\",\"showMinorTicks_1_1\":\"\",\"instructionGifPrefix_1_1\":\"\",\"comment_1_1\":\"\",\"shownTimestamp_1_1\":\"\",\"dragAmount_1_1\":\"\",\"choice_1_1\":\"\",\"choiceTimestamp_1_1\":\"\",\"choiceTimeSec_1_1\":\"\",\"treatmentId_1_2\":\"\",\"position_1_2\":\"\",\"viewType_1_2\":\"\",\"interaction_1_2\":\"\",\"variableAmount_1_2\":\"\",\"amountEarlier_1_2\":\"\",\"timeEarlier_1_2\":\"\",\"dateEarlier_1_2\":\"\",\"amountLater_1_2\":\"\",\"timeLater_1_2\":\"\",\"dateLater_1_2\":\"\",\"maxAmount_1_2\":\"\",\"maxTime_1_2\":\"\",\"verticalPixels_1_2\":\"\",\"horizontalPixels_1_2\":\"\",\"leftMarginWidthIn_1_2\":\"\",\"bottomMarginHeightIn_1_2\":\"\",\"graphWidthIn_1_2\":\"\",\"graphHeightIn_1_2\":\"\",\"widthIn_1_2\":\"\",\"heightIn_1_2\":\"\",\"showMinorTicks_1_2\":\"\",\"instructionGifPrefix_1_2\":\"\",\"comment_1_2\":\"\",\"shownTimestamp_1_2\":\"\",\"dragAmount_1_2\":\"\",\"choice_1_2\":\"\",\"choiceTimestamp_1_2\":\"\",\"choiceTimeSec_1_2\":\"\",\"treatmentId_2_1\":\"\",\"position_2_1\":\"\",\"viewType_2_1\":\"\",\"interaction_2_1\":\"\",\"variableAmount_2_1\":\"\",\"amountEarlier_2_1\":\"\",\"timeEarlier_2_1\":\"\",\"dateEarlier_2_1\":\"\",\"amountLater_2_1\":\"\",\"timeLater_2_1\":\"\",\"dateLater_2_1\":\"\",\"maxAmount_2_1\":\"\",\"maxTime_2_1\":\"\",\"verticalPixels_2_1\":\"\",\"horizontalPixels_2_1\":\"\",\"leftMarginWidthIn_2_1\":\"\",\"bottomMarginHeightIn_2_1\":\"\",\"graphWidthIn_2_1\":\"\",\"graphHeightIn_2_1\":\"\",\"widthIn_2_1\":\"\",\"heightIn_2_1\":\"\",\"showMinorTicks_2_1\":\"\",\"instructionGifPrefix_2_1\":\"\",\"comment_2_1\":\"\",\"shownTimestamp_2_1\":\"\",\"dragAmount_2_1\":\"\",\"choice_2_1\":\"\",\"choiceTimestamp_2_1\":\"\",\"choiceTimeSec_2_1\":\"\",\"treatmentId_2_2\":\"\",\"position_2_2\":\"\",\"viewType_2_2\":\"\",\"interaction_2_2\":\"\",\"variableAmount_2_2\":\"\",\"amountEarlier_2_2\":\"\",\"timeEarlier_2_2\":\"\",\"dateEarlier_2_2\":\"\",\"amountLater_2_2\":\"\",\"timeLater_2_2\":\"\",\"dateLater_2_2\":\"\",\"maxAmount_2_2\":\"\",\"maxTime_2_2\":\"\",\"verticalPixels_2_2\":\"\",\"horizontalPixels_2_2\":\"\",\"leftMarginWidthIn_2_2\":\"\",\"bottomMarginHeightIn_2_2\":\"\",\"graphWidthIn_2_2\":\"\",\"graphHeightIn_2_2\":\"\",\"widthIn_2_2\":\"\",\"heightIn_2_2\":\"\",\"showMinorTicks_2_2\":\"\",\"instructionGifPrefix_2_2\":\"\",\"comment_2_2\":\"\",\"shownTimestamp_2_2\":\"\",\"dragAmount_2_2\":\"\",\"choice_2_2\":\"\",\"choiceTimestamp_2_2\":\"\",\"choiceTimeSec_2_2\":\"\",\"attentionCheck\":\"\",\"feedback\":\"\"}`
    );
  });

  test("flattenTimestamp", () => {
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

  // This test uses the write only creds to try and read from the bucket.  I need to figure out how to check
  // for the AccessDenied error that was retruned.
  // describe("S3 bucket write only credentials should not be allowed to read.", () => {
  //   AWS.config.update({
  //     accessKeyId: process.env.REACT_APP_accessKeyId,
  //     secretAccessKey: process.env.REACT_APP_secretAccessKey,
  //   });

  //   const myBucket = new AWS.S3({
  //     params: { Bucket: "vizsurvey-data-test" },
  //     region: "us-east-2",
  //   });

  //   myBucket
  //     .listObjectsV2({ Bucket: "vizsurvey-data-test" })
  //     .promise()
  //     .then((response) => {
  //       const files = response.Contents;
  //       expect(files.length);
  //     });
  // });
});
