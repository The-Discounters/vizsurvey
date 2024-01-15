import { ViewType, setAllPropertiesEmpty } from "@the-discounters/types";
import { initFirestore } from "@the-discounters/firebase-shared";
import {
  flattenTreatmentValueAry,
  flattenState,
  exportParticipantsToJSON,
} from "./FileIOAdapter.js";
import {
  createQuestionNoTitrate,
  create2ndQuestionNoTitrate,
} from "@the-discounters/test-shared";

import ADMIN_CREDS from "../../../admin-credentials-dev.json" assert { type: "json" };
// this needs to match the value that is passed to firebase emulators:start --project=
const PROJECT_ID = "vizsurvey-test";

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
  const re = new RegExp("answer-timestamps-\\d+-\\d+-\\d+\\.csv");
  files.forEach((file) => {
    if (re.test(file)) {
      result.push(file);
    }
  });
  expect(result.length).toBe(2);
});

describe("FileIOAdapter non firestore integration tests", () => {
  test("flattenState two treatments two questions each.", () => {
    const state = {
      participantId: 2,
      sessionId: 3,
      studyId: 4,
      experienceSurvey: {},
      financialLitSurvey: {},
      purposeSurvey: {},
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
        MCLInstructionShownTimestamp: [],
        MCLInstructionCompletedTimestamp: [],
        MCLInstructionTimeSec: [],
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
      questions: [
        createQuestionNoTitrate(1, 1),
        create2ndQuestionNoTitrate(1, 2),
        createQuestionNoTitrate(2, 1),
        create2ndQuestionNoTitrate(2, 2),
      ],
      instructionTreatment: null,
      currentAnswerIdx: 0,
      status: "status",
      error: null,
      userAgent: null,
    };
    const result = setAllPropertiesEmpty(flattenState(state));
    expect(JSON.stringify(result)).toBe(
      `{\"participantId\":\"\",\"sessionId\":\"\",\"studyId\":\"\",\"treatmentId\":\"\",\"consentShownTimestamp\":\"\",\"consentCompletedTimestamp\":\"\",\"consentTimeSec\":\"\",\"demographicShownTimestamp\":\"\",\"demographicCompletedTimestamp\":\"\",\"demographicTimeSec\":\"\",\"instructionsShownTimestamp\":\"\",\"instructionsCompletedTimestamp\":\"\",\"instructionsTimeSec\":\"\",\"experienceSurveyQuestionsShownTimestamp\":\"\",\"experienceSurveyQuestionsCompletedTimestamp\":\"\",\"experienceSurveyTimeSec\":\"\",\"financialLitSurveyQuestionsShownTimestamp\":\"\",\"financialLitSurveyQuestionsCompletedTimestamp\":\"\",\"financialLitSurveyTimeSec\":\"\",\"purposeSurveyQuestionsShownTimestamp\":\"\",\"purposeSurveyQuestionsCompletedTimestamp\":\"\",\"purposeSurveyTimeSec\":\"\",\"debriefShownTimestamp\":\"\",\"debriefCompletedTimestamp\":\"\",\"debriefTimeSec\":\"\",\"attentionCheckTimeSec_undefined\":\"\",\"consentChecked\":\"\",\"countryOfResidence\":\"\",\"vizFamiliarity\":\"\",\"age\":\"\",\"gender\":\"\",\"selfDescribeGender\":\"\",\"profession\":\"\",\"employment\":\"\",\"selfDescribeEmployment\":\"\",\"timezone\":\"\",\"userAgent\":\"\",\"screenAvailHeight\":\"\",\"screenAvailWidth\":\"\",\"screenColorDepth\":\"\",\"screenWidth\":\"\",\"screenHeight\":\"\",\"screenOrientationAngle\":\"\",\"screenOrientationType\":\"\",\"screenPixelDepth\":\"\",\"windowDevicePixelRatio\":\"\",\"windowInnerHeight\":\"\",\"windowInnerWidth\":\"\",\"windowOuterHeight\":\"\",\"windowOuterWidth\":\"\",\"windowScreenLeft\":\"\",\"windowScreenTop\":\"\",\"treatmentQuestionId_1_1\":\"\",\"treatmentId_1_1\":\"\",\"questionId_1_1\":\"\",\"sequenceId_1_1\":\"\",\"viewType_1_1\":\"\",\"interaction_1_1\":\"\",\"variableAmount_1_1\":\"\",\"amountEarlier_1_1\":\"\",\"timeEarlier_1_1\":\"\",\"dateEarlier_1_1\":\"\",\"amountLater_1_1\":\"\",\"timeLater_1_1\":\"\",\"dateLater_1_1\":\"\",\"maxAmount_1_1\":\"\",\"maxTime_1_1\":\"\",\"verticalPixels_1_1\":\"\",\"horizontalPixels_1_1\":\"\",\"leftMarginWidthIn_1_1\":\"\",\"bottomMarginHeightIn_1_1\":\"\",\"graphWidthIn_1_1\":\"\",\"graphHeightIn_1_1\":\"\",\"widthIn_1_1\":\"\",\"heightIn_1_1\":\"\",\"showMinorTicks_1_1\":\"\",\"instructionGifPrefix_1_1\":\"\",\"comment_1_1\":\"\",\"shownTimestamp_1_1\":\"\",\"dragAmount_1_1\":\"\",\"choice_1_1\":\"\",\"choiceTimestamp_1_1\":\"\",\"choiceTimeSec_1_1\":\"\",\"treatmentQuestionId_1_2\":\"\",\"treatmentId_1_2\":\"\",\"questionId_1_2\":\"\",\"sequenceId_1_2\":\"\",\"viewType_1_2\":\"\",\"interaction_1_2\":\"\",\"variableAmount_1_2\":\"\",\"amountEarlier_1_2\":\"\",\"timeEarlier_1_2\":\"\",\"dateEarlier_1_2\":\"\",\"amountLater_1_2\":\"\",\"timeLater_1_2\":\"\",\"dateLater_1_2\":\"\",\"maxAmount_1_2\":\"\",\"maxTime_1_2\":\"\",\"verticalPixels_1_2\":\"\",\"horizontalPixels_1_2\":\"\",\"leftMarginWidthIn_1_2\":\"\",\"bottomMarginHeightIn_1_2\":\"\",\"graphWidthIn_1_2\":\"\",\"graphHeightIn_1_2\":\"\",\"widthIn_1_2\":\"\",\"heightIn_1_2\":\"\",\"showMinorTicks_1_2\":\"\",\"instructionGifPrefix_1_2\":\"\",\"comment_1_2\":\"\",\"shownTimestamp_1_2\":\"\",\"dragAmount_1_2\":\"\",\"choice_1_2\":\"\",\"choiceTimestamp_1_2\":\"\",\"choiceTimeSec_1_2\":\"\",\"treatmentQuestionId_2_1\":\"\",\"treatmentId_2_1\":\"\",\"questionId_2_1\":\"\",\"sequenceId_2_1\":\"\",\"viewType_2_1\":\"\",\"interaction_2_1\":\"\",\"variableAmount_2_1\":\"\",\"amountEarlier_2_1\":\"\",\"timeEarlier_2_1\":\"\",\"dateEarlier_2_1\":\"\",\"amountLater_2_1\":\"\",\"timeLater_2_1\":\"\",\"dateLater_2_1\":\"\",\"maxAmount_2_1\":\"\",\"maxTime_2_1\":\"\",\"verticalPixels_2_1\":\"\",\"horizontalPixels_2_1\":\"\",\"leftMarginWidthIn_2_1\":\"\",\"bottomMarginHeightIn_2_1\":\"\",\"graphWidthIn_2_1\":\"\",\"graphHeightIn_2_1\":\"\",\"widthIn_2_1\":\"\",\"heightIn_2_1\":\"\",\"showMinorTicks_2_1\":\"\",\"instructionGifPrefix_2_1\":\"\",\"comment_2_1\":\"\",\"shownTimestamp_2_1\":\"\",\"dragAmount_2_1\":\"\",\"choice_2_1\":\"\",\"choiceTimestamp_2_1\":\"\",\"choiceTimeSec_2_1\":\"\",\"treatmentQuestionId_2_2\":\"\",\"treatmentId_2_2\":\"\",\"questionId_2_2\":\"\",\"sequenceId_2_2\":\"\",\"viewType_2_2\":\"\",\"interaction_2_2\":\"\",\"variableAmount_2_2\":\"\",\"amountEarlier_2_2\":\"\",\"timeEarlier_2_2\":\"\",\"dateEarlier_2_2\":\"\",\"amountLater_2_2\":\"\",\"timeLater_2_2\":\"\",\"dateLater_2_2\":\"\",\"maxAmount_2_2\":\"\",\"maxTime_2_2\":\"\",\"verticalPixels_2_2\":\"\",\"horizontalPixels_2_2\":\"\",\"leftMarginWidthIn_2_2\":\"\",\"bottomMarginHeightIn_2_2\":\"\",\"graphWidthIn_2_2\":\"\",\"graphHeightIn_2_2\":\"\",\"widthIn_2_2\":\"\",\"heightIn_2_2\":\"\",\"showMinorTicks_2_2\":\"\",\"instructionGifPrefix_2_2\":\"\",\"comment_2_2\":\"\",\"shownTimestamp_2_2\":\"\",\"dragAmount_2_2\":\"\",\"choice_2_2\":\"\",\"choiceTimestamp_2_2\":\"\",\"choiceTimeSec_2_2\":\"\",\"attentionCheck\":\"\",\"feedback\":\"\"}`
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
});

describe("FileIOAdapter firestore integration tests", () => {
  let app, db;

  beforeAll(() => {
    const result = initFirestore(
      PROJECT_ID,
      "https://vizsurvey-test.firebaseio.com/",
      ADMIN_CREDS
    );
    app = result.app;
    db = result.db;
  });

  test("exportParticipantsToJSON test", async () => {
    const json = await exportParticipantsToJSON(db, "testbetween");
    expect(json).not.toBeNull();
    const parsed = JSON.parse(json);
    expect(parsed).not.toBeNull();
    expect(parsed.prolificStudyId).toBe("testbetween");
  });
});
