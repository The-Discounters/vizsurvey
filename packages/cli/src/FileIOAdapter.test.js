import admin from "firebase-admin";
import { DateTime } from "luxon";
import {
  ViewType,
  setAllPropertiesEmpty,
  convertFields,
} from "@the-discounters/types";
import { initFirestore } from "@the-discounters/firebase-shared";
import {
  flattenState,
  flattenTreatmentValueAry,
  exportParticipantsToJSON,
  exportAuditToJSON,
  convertValue,
} from "./FileIOAdapter.js";
// TODO can we fix this import so that it comes from an env var?
import ADMIN_CREDS from "../../firebase/functions/admin-credentials-staging.json" assert { type: "json" };
// this needs to match the value that is passed to firebase emulators:start --project=
const PROJECT_ID = "vizsurvey-staging";
import TEST_BETWEEN_ALL_JSON from "@the-discounters/test-shared";

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
  test("flattenState single treatment.", () => {
    const result = flattenState(TEST_BETWEEN_ALL_JSON);
    expect(JSON.stringify(result)).toBe(
      '{"appVersion":"1.1","gender":"self-describe","timezone":"America/New_York","debriefTimeSec":0,"instructionsShownTimestamp":"2024-01-17T13:51:28.211-05:00","demographicCompletedTimestamp":"2024-01-17T13:53:05.412-05:00","demographicTimeSec":33.278,"demographicShownTimestamp":"2024-01-17T13:52:32.134-05:00","consentShownTimestamp":"2024-01-17T13:51:25.043-05:00","instructionsTimeSec":1.405,"debriefShownTimestamp":"2024-01-17T13:53:05.468-05:00","debriefCompletedTimestamp":"2024-01-17T13:53:05.468-05:00","instructionsCompletedTimestamp":"2024-01-17T13:51:29.616-05:00","financialLitSurveyQuestionsCompletedTimestamp":"2024-01-17T13:52:13.836-05:00","financialLitSurveyTimeSec":5.165,"financialLitSurveyQuestionsShownTimestamp":"2024-01-17T13:52:08.671-05:00","consentCompletedTimestamp":"2024-01-17T13:51:28.150-05:00","experienceSurveyQuestionsCompletedTimestamp":"2024-01-17T13:52:08.551-05:00","experienceSurveyTimeSec":19.199,"consentTimeSec":3.107,"experienceSurveyQuestionsShownTimestamp":"2024-01-17T13:51:49.352-05:00","choiceInstructionCompletedTimestamp_2":"2024-01-17T13:51:33.250-05:00","choiceInstructionShownTimestamp_2":"2024-01-17T13:51:29.648-05:00","choiceInstructionTimeSec_2":3,"maxTime_2_1":14,"questionId_2_1":1,"leftMarginWidthIn_2_1":null,"graphHeightIn_2_1":null,"amountEarlier_2_1":350,"sequenceId_2_1":1,"bottomMarginHeightIn_2_1":null,"treatmentId_2_1":2,"instructionGifPrefix_2_1":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_1":197,"showMinorTicks_2_1":false,"maxAmount_2_1":430,"widthIn_2_1":null,"timeLater_2_1":13,"dateLater_2_1":null,"amountLater_2_1":430,"graphWidthIn_2_1":null,"horizontalPixels_2_1":600,"choiceTimestamp_2_1":"2024-01-17T13:51:35.182-05:00","timeEarlier_2_1":4,"heightIn_2_1":null,"verticalPixels_2_1":300,"variableAmount_2_1":"none","choiceTimeSec_2_1":1.905,"viewType_2_1":"barchart","interaction_2_1":"none","comment_2_1":null,"choice_2_1":"earlierAmount","dateEarlier_2_1":null,"shownTimestamp_2_1":"2024-01-17T13:51:33.277-05:00","maxTime_2_2":19,"questionId_2_2":2,"leftMarginWidthIn_2_2":null,"graphHeightIn_2_2":null,"amountEarlier_2_2":490,"sequenceId_2_2":2,"bottomMarginHeightIn_2_2":null,"treatmentId_2_2":2,"instructionGifPrefix_2_2":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_2":198,"showMinorTicks_2_2":false,"maxAmount_2_2":700,"widthIn_2_2":null,"timeLater_2_2":18,"dateLater_2_2":null,"amountLater_2_2":700,"graphWidthIn_2_2":null,"horizontalPixels_2_2":600,"choiceTimestamp_2_2":"2024-01-17T13:51:37.065-05:00","timeEarlier_2_2":2,"heightIn_2_2":null,"verticalPixels_2_2":300,"variableAmount_2_2":"none","choiceTimeSec_2_2":0.829,"viewType_2_2":"barchart","interaction_2_2":"none","comment_2_2":null,"choice_2_2":"laterAmount","dateEarlier_2_2":null,"shownTimestamp_2_2":"2024-01-17T13:51:36.236-05:00","maxTime_2_3":25,"questionId_2_3":3,"leftMarginWidthIn_2_3":null,"graphHeightIn_2_3":null,"amountEarlier_2_3":720,"sequenceId_2_3":3,"bottomMarginHeightIn_2_3":null,"treatmentId_2_3":2,"instructionGifPrefix_2_3":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_3":199,"showMinorTicks_2_3":false,"maxAmount_2_3":1390,"widthIn_2_3":null,"timeLater_2_3":24,"dateLater_2_3":null,"amountLater_2_3":1390,"graphWidthIn_2_3":null,"horizontalPixels_2_3":600,"choiceTimestamp_2_3":"2024-01-17T13:51:38.648-05:00","timeEarlier_2_3":6,"heightIn_2_3":null,"verticalPixels_2_3":300,"variableAmount_2_3":"none","choiceTimeSec_2_3":0.743,"viewType_2_3":"barchart","interaction_2_3":"none","comment_2_3":null,"choice_2_3":"earlierAmount","dateEarlier_2_3":null,"shownTimestamp_2_3":"2024-01-17T13:51:37.905-05:00","maxTime_2_4":17,"questionId_2_4":4,"leftMarginWidthIn_2_4":null,"graphHeightIn_2_4":null,"amountEarlier_2_4":840,"sequenceId_2_4":4,"bottomMarginHeightIn_2_4":null,"treatmentId_2_4":2,"instructionGifPrefix_2_4":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_4":200,"showMinorTicks_2_4":false,"maxAmount_2_4":1120,"widthIn_2_4":null,"timeLater_2_4":16,"dateLater_2_4":null,"amountLater_2_4":1120,"graphWidthIn_2_4":null,"horizontalPixels_2_4":600,"choiceTimestamp_2_4":"2024-01-17T13:51:40.150-05:00","timeEarlier_2_4":3,"heightIn_2_4":null,"verticalPixels_2_4":300,"variableAmount_2_4":"none","choiceTimeSec_2_4":0.73,"viewType_2_4":"barchart","interaction_2_4":"none","comment_2_4":null,"choice_2_4":"laterAmount","dateEarlier_2_4":null,"shownTimestamp_2_4":"2024-01-17T13:51:39.420-05:00","maxTime_2_5":14,"questionId_2_5":5,"leftMarginWidthIn_2_5":null,"graphHeightIn_2_5":null,"amountEarlier_2_5":32,"sequenceId_2_5":5,"bottomMarginHeightIn_2_5":null,"treatmentId_2_5":2,"instructionGifPrefix_2_5":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_5":201,"showMinorTicks_2_5":false,"maxAmount_2_5":40,"widthIn_2_5":null,"timeLater_2_5":13,"dateLater_2_5":null,"amountLater_2_5":39,"graphWidthIn_2_5":null,"horizontalPixels_2_5":600,"choiceTimestamp_2_5":"2024-01-17T13:51:41.732-05:00","timeEarlier_2_5":4,"heightIn_2_5":null,"verticalPixels_2_5":300,"variableAmount_2_5":"none","choiceTimeSec_2_5":0.794,"viewType_2_5":"barchart","interaction_2_5":"none","comment_2_5":null,"choice_2_5":"earlierAmount","dateEarlier_2_5":null,"shownTimestamp_2_5":"2024-01-17T13:51:40.938-05:00","maxTime_2_6":19,"questionId_2_6":6,"leftMarginWidthIn_2_6":null,"graphHeightIn_2_6":null,"amountEarlier_2_6":45,"sequenceId_2_6":6,"bottomMarginHeightIn_2_6":null,"treatmentId_2_6":2,"instructionGifPrefix_2_6":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_6":202,"showMinorTicks_2_6":false,"maxAmount_2_6":70,"widthIn_2_6":null,"timeLater_2_6":18,"dateLater_2_6":null,"amountLater_2_6":70,"graphWidthIn_2_6":null,"horizontalPixels_2_6":600,"choiceTimestamp_2_6":"2024-01-17T13:51:43.615-05:00","timeEarlier_2_6":2,"heightIn_2_6":null,"verticalPixels_2_6":300,"variableAmount_2_6":"none","choiceTimeSec_2_6":1.178,"viewType_2_6":"barchart","interaction_2_6":"none","comment_2_6":null,"choice_2_6":"laterAmount","dateEarlier_2_6":null,"shownTimestamp_2_6":"2024-01-17T13:51:42.437-05:00","maxTime_2_7":25,"questionId_2_7":7,"leftMarginWidthIn_2_7":null,"graphHeightIn_2_7":null,"amountEarlier_2_7":66,"sequenceId_2_7":7,"bottomMarginHeightIn_2_7":null,"treatmentId_2_7":2,"instructionGifPrefix_2_7":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_7":203,"showMinorTicks_2_7":false,"maxAmount_2_7":110,"widthIn_2_7":null,"timeLater_2_7":24,"dateLater_2_7":null,"amountLater_2_7":110,"graphWidthIn_2_7":null,"horizontalPixels_2_7":600,"choiceTimestamp_2_7":"2024-01-17T13:51:46.553-05:00","timeEarlier_2_7":6,"heightIn_2_7":null,"verticalPixels_2_7":300,"variableAmount_2_7":"none","choiceTimeSec_2_7":1.979,"viewType_2_7":"barchart","interaction_2_7":"none","comment_2_7":null,"choice_2_7":"earlierAmount","dateEarlier_2_7":null,"shownTimestamp_2_7":"2024-01-17T13:51:44.574-05:00","maxTime_2_8":17,"questionId_2_8":8,"leftMarginWidthIn_2_8":null,"graphHeightIn_2_8":null,"amountEarlier_2_8":77,"sequenceId_2_8":8,"bottomMarginHeightIn_2_8":null,"treatmentId_2_8":2,"instructionGifPrefix_2_8":"introduction-barchart-no-ticks-none-right","treatmentQuestionId_2_8":204,"showMinorTicks_2_8":false,"maxAmount_2_8":120,"widthIn_2_8":null,"timeLater_2_8":16,"dateLater_2_8":null,"amountLater_2_8":118,"graphWidthIn_2_8":null,"horizontalPixels_2_8":600,"choiceTimestamp_2_8":"2024-01-17T13:51:48.319-05:00","timeEarlier_2_8":3,"heightIn_2_8":null,"verticalPixels_2_8":300,"variableAmount_2_8":"none","choiceTimeSec_2_8":0.929,"viewType_2_8":"barchart","interaction_2_8":"none","comment_2_8":null,"choice_2_8":"laterAmount","dateEarlier_2_8":null,"shownTimestamp_2_8":"2024-01-17T13:51:47.390-05:00","countryOfResidence":"usa","error":null,"selfDescribeGender":"Self Describe Gender","participantId":"563268","feedback":"Feedback","selfDescribeEmployment":"Self Describe Employment","financial_lit_survey_risk":"dont-know","financial_lit_survey_numeracy":"gt102","financial_lit_survey_inflation":"exactly-same","browserTimestamp":"2024-01-17T13:53:10.422-05:00","profession":"Profession","serverTimestamp":{"_seconds":1705517590,"_nanoseconds":588000000},"consentChecked":true,"userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36","sessionId":"3","employment":"self-describe","vizFamiliarity":"6","currentAnswerIdx":7,"purpose_survey_worth_doneall":"somewhat-disagree","purpose_survey_aware_certain":"disagree","purpose_survey_aware_describe":"somewhat-disagree","purpose_survey_aware_confident":"neither-agree-nor-disagree","purpose_survey_aware_understand":"agree","purpose_survey_worth_dayatatime":"disagree","purpose_survey_aware_clear":"strongly-disagree","purpose_survey_worth_wander":"strongly-disagree","experience_survey_easy":"quite-a-bit","experience_survey_mental":"not-at-all","experience_survey_understand":"a-little","experience_survey_imagine":"to-some-extent","experience_survey_clear":"very-slightly","experience_survey_enjoy":"not-at-all","experience_survey_present":"moderately","experience_survey_format":"extremely","studyId":"testbetween","age":"55","status":"debrief"}'
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

describe("convertFields tests", () => {
  const timestamp = admin.firestore.Timestamp.fromDate(
    DateTime.fromISO("1974-11-08T00:00:00.199-05:00").toJSDate()
  );
  const nestedTimestampsInput = {
    serverTimestamp: timestamp,
    nested: {
      browserTimestamp: timestamp,
    },
  };
  expect(JSON.stringify(nestedTimestampsInput)).toBe(
    '{"serverTimestamp":{"_seconds":153118800,"_nanoseconds":199000000},"nested":{"browserTimestamp":{"_seconds":153118800,"_nanoseconds":199000000}}}'
  );
  let result = convertFields(nestedTimestampsInput, convertValue);
  expect(JSON.stringify(result)).toBe(
    '{"serverTimestamp":"1974-11-08T00:00:00.199000000-05:00","nested":{"browserTimestamp":"1974-11-08T00:00:00.199000000-05:00"}}'
  );

  const convertInputState = {
    prolificCode: "C1KQNGZK",
    participants: [
      {
        participantId: "96485",
        experiment: {
          prolificStudyId: "testbetween",
        },
        instructionTreatment: [
          {
            questionId: 9,
          },
        ],
        questions: [
          {
            screenAttributes: {
              availWidth: 1728,
            },
            windowAttributes: {
              innerWidth: 1728,
            },
            choice: "laterAmount",
            dateEarlier: null,
            shownTimestamp: "2024-03-04T13:52:38.163-05:00",
          },
          {
            screenAttributes: {
              availWidth: 1728,
            },
            windowAttributes: {
              innerWidth: 1728,
            },
            choice: "earlierAmount",
            dateEarlier: null,
            shownTimestamp: "2024-03-04T13:52:41.193-05:00",
          },
        ],
        experienceSurvey: {
          experience_survey_easy: "extremely",
          experience_survey_mental: "extremely",
        },
        financialLitSurvey: {
          financial_lit_survey_risk: "dont-know",
          financial_lit_survey_numeracy: "dont-know",
        },
        serverTimestamp: timestamp,
        timestamps: {
          debriefTimeSec: 5.076,
          instructionsShownTimestamp: "2024-03-04T13:52:34.949-05:00",
          demographicCompletedTimestamp: "2024-03-04T13:53:42.658-05:00",
          demographicTimeSec: 34.38,
          demographicShownTimestamp: "2024-03-04T13:53:08.278-05:00",
          consentShownTimestamp: "2024-03-04T13:52:32.740-05:00",
          instructionsTimeSec: 1.282,
          debriefShownTimestamp: "2024-03-04T13:53:42.668-05:00",
          debriefCompletedTimestamp: "2024-03-04T13:53:47.744-05:00",
          finishedShownTimestamp: "2024-03-04T13:53:47.750-05:00",
          instructionsCompletedTimestamp: "2024-03-04T13:52:36.231-05:00",
          financialLitSurveyQuestionsCompletedTimestamp:
            "2024-03-04T13:53:08.247-05:00",
          financialLitSurveyTimeSec: 4.233,
          financialLitSurveyQuestionsShownTimestamp:
            "2024-03-04T13:53:04.014-05:00",
          choiceInstructionTimeSec: [{ value: "", treatmentId: 2 }],
          consentCompletedTimestamp: "2024-03-04T13:52:34.930-05:00",
          choiceInstructionShownTimestamp: [
            { value: "2024-03-04T13:52:36.248-05:00", treatmentId: 2 },
          ],
          experienceSurveyQuestionsCompletedTimestamp:
            "2024-03-04T13:53:03.984-05:00",
          experienceSurveyTimeSec: 17.823,
          consentTimeSec: 2.19,
          choiceInstructionCompletedTimestamp: [
            { value: "2024-03-04T13:52:38.154-05:00", treatmentId: 2 },
          ],
          experienceSurveyQuestionsShownTimestamp:
            "2024-03-04T13:52:46.161-05:00",
        },
        browserTimestamp: timestamp,
      },
      {
        participantId: "992909",
        experiment: {
          prolificStudyId: "testbetween",
        },
        instructionTreatment: [
          {
            questionId: 9,
          },
        ],
        studyId: "testbetween",
        questions: [
          {
            maxTime: 14,
            screenAttributes: {
              availWidth: 1728,
            },
            windowAttributes: {
              innerWidth: 1728,
            },
            choice: "laterAmount",
            dateEarlier: null,
            shownTimestamp: "2024-03-04T13:51:22.958-05:00",
          },
        ],
        experienceSurvey: {
          experience_survey_easy: "quite-a-bit",
        },
        financialLitSurvey: {
          financial_lit_survey_risk: "dont-know",
        },
        countryOfResidence: "usa",
        vizFamiliarity: "6",
        age: "55",
        profession: "Senior Software Engineering Manager",
        gender: "male",
        employment: "full-time",
        feedback: "Feedback",
        status: "finished",
        requestSequence: 62,
        serverTimestamp: timestamp,
        timestamps: {
          debriefTimeSec: 4.493,
          instructionsShownTimestamp: "2024-03-04T13:51:20.325-05:00",
          demographicCompletedTimestamp: "2024-03-04T13:52:22.013-05:00",
          demographicTimeSec: 31.227,
          demographicShownTimestamp: "2024-03-04T13:51:50.786-05:00",
          consentShownTimestamp: "2024-03-04T13:51:17.798-05:00",
          instructionsTimeSec: 1.025,
          debriefShownTimestamp: "2024-03-04T13:52:22.022-05:00",
          debriefCompletedTimestamp: "2024-03-04T13:52:26.515-05:00",
          finishedShownTimestamp: "2024-03-04T13:52:26.521-05:00",
          instructionsCompletedTimestamp: "2024-03-04T13:51:21.350-05:00",
          financialLitSurveyQuestionsCompletedTimestamp:
            "2024-03-04T13:51:50.753-05:00",
          financialLitSurveyTimeSec: 4.789,
          financialLitSurveyQuestionsShownTimestamp:
            "2024-03-04T13:51:45.964-05:00",
          choiceInstructionTimeSec: [{ value: "", treatmentId: 1 }],
          consentCompletedTimestamp: "2024-03-04T13:51:20.309-05:00",
          choiceInstructionShownTimestamp: [
            { value: "2024-03-04T13:51:21.372-05:00", treatmentId: 1 },
          ],
          experienceSurveyQuestionsCompletedTimestamp:
            "2024-03-04T13:51:45.932-05:00",
          experienceSurveyTimeSec: 15.544,
          consentTimeSec: 2.511,
          choiceInstructionCompletedTimestamp: [
            { value: "2024-03-04T13:51:22.939-05:00", treatmentId: 1 },
          ],
          experienceSurveyQuestionsShownTimestamp:
            "2024-03-04T13:51:30.388-05:00",
        },
        browserTimestamp: timestamp,
      },
    ],
  };
  result = convertFields(convertInputState, convertValue);
  expect(JSON.stringify(result)).toBe(
    '{"prolificCode":"C1KQNGZK","participants":[{"participantId":"96485","experiment":{"prolificStudyId":"testbetween"},"instructionTreatment":[{"questionId":9}],"questions":[{"screenAttributes":{"availWidth":1728},"windowAttributes":{"innerWidth":1728},"choice":"laterAmount","dateEarlier":null,"shownTimestamp":"2024-03-04T13:52:38.163-05:00"},{"screenAttributes":{"availWidth":1728},"windowAttributes":{"innerWidth":1728},"choice":"earlierAmount","dateEarlier":null,"shownTimestamp":"2024-03-04T13:52:41.193-05:00"}],"experienceSurvey":{"experience_survey_easy":"extremely","experience_survey_mental":"extremely"},"financialLitSurvey":{"financial_lit_survey_risk":"dont-know","financial_lit_survey_numeracy":"dont-know"},"serverTimestamp":"1974-11-08T00:00:00.199000000-05:00","timestamps":{"debriefTimeSec":5.076,"instructionsShownTimestamp":"2024-03-04T13:52:34.949-05:00","demographicCompletedTimestamp":"2024-03-04T13:53:42.658-05:00","demographicTimeSec":34.38,"demographicShownTimestamp":"2024-03-04T13:53:08.278-05:00","consentShownTimestamp":"2024-03-04T13:52:32.740-05:00","instructionsTimeSec":1.282,"debriefShownTimestamp":"2024-03-04T13:53:42.668-05:00","debriefCompletedTimestamp":"2024-03-04T13:53:47.744-05:00","finishedShownTimestamp":"2024-03-04T13:53:47.750-05:00","instructionsCompletedTimestamp":"2024-03-04T13:52:36.231-05:00","financialLitSurveyQuestionsCompletedTimestamp":"2024-03-04T13:53:08.247-05:00","financialLitSurveyTimeSec":4.233,"financialLitSurveyQuestionsShownTimestamp":"2024-03-04T13:53:04.014-05:00","choiceInstructionTimeSec":[{"value":"","treatmentId":2}],"consentCompletedTimestamp":"2024-03-04T13:52:34.930-05:00","choiceInstructionShownTimestamp":[{"value":"2024-03-04T13:52:36.248-05:00","treatmentId":2}],"experienceSurveyQuestionsCompletedTimestamp":"2024-03-04T13:53:03.984-05:00","experienceSurveyTimeSec":17.823,"consentTimeSec":2.19,"choiceInstructionCompletedTimestamp":[{"value":"2024-03-04T13:52:38.154-05:00","treatmentId":2}],"experienceSurveyQuestionsShownTimestamp":"2024-03-04T13:52:46.161-05:00"},"browserTimestamp":"1974-11-08T00:00:00.199000000-05:00"},{"participantId":"992909","experiment":{"prolificStudyId":"testbetween"},"instructionTreatment":[{"questionId":9}],"studyId":"testbetween","questions":[{"maxTime":14,"screenAttributes":{"availWidth":1728},"windowAttributes":{"innerWidth":1728},"choice":"laterAmount","dateEarlier":null,"shownTimestamp":"2024-03-04T13:51:22.958-05:00"}],"experienceSurvey":{"experience_survey_easy":"quite-a-bit"},"financialLitSurvey":{"financial_lit_survey_risk":"dont-know"},"countryOfResidence":"usa","vizFamiliarity":"6","age":"55","profession":"Senior Software Engineering Manager","gender":"male","employment":"full-time","feedback":"Feedback","status":"finished","requestSequence":62,"serverTimestamp":"1974-11-08T00:00:00.199000000-05:00","timestamps":{"debriefTimeSec":4.493,"instructionsShownTimestamp":"2024-03-04T13:51:20.325-05:00","demographicCompletedTimestamp":"2024-03-04T13:52:22.013-05:00","demographicTimeSec":31.227,"demographicShownTimestamp":"2024-03-04T13:51:50.786-05:00","consentShownTimestamp":"2024-03-04T13:51:17.798-05:00","instructionsTimeSec":1.025,"debriefShownTimestamp":"2024-03-04T13:52:22.022-05:00","debriefCompletedTimestamp":"2024-03-04T13:52:26.515-05:00","finishedShownTimestamp":"2024-03-04T13:52:26.521-05:00","instructionsCompletedTimestamp":"2024-03-04T13:51:21.350-05:00","financialLitSurveyQuestionsCompletedTimestamp":"2024-03-04T13:51:50.753-05:00","financialLitSurveyTimeSec":4.789,"financialLitSurveyQuestionsShownTimestamp":"2024-03-04T13:51:45.964-05:00","choiceInstructionTimeSec":[{"value":"","treatmentId":1}],"consentCompletedTimestamp":"2024-03-04T13:51:20.309-05:00","choiceInstructionShownTimestamp":[{"value":"2024-03-04T13:51:21.372-05:00","treatmentId":1}],"experienceSurveyQuestionsCompletedTimestamp":"2024-03-04T13:51:45.932-05:00","experienceSurveyTimeSec":15.544,"consentTimeSec":2.511,"choiceInstructionCompletedTimestamp":[{"value":"2024-03-04T13:51:22.939-05:00","treatmentId":1}],"experienceSurveyQuestionsShownTimestamp":"2024-03-04T13:51:30.388-05:00"},"browserTimestamp":"1974-11-08T00:00:00.199000000-05:00"}]}'
  );
});

describe("FileIOAdapter firestore integration tests", () => {
  let app, db;

  // beforeAll(() => {
  //   const result = initFirestore(
  //     PROJECT_ID,
  //     "https://vizsurvey-staging.firebaseio.com/",
  //     ADMIN_CREDS
  //   );
  //   app = result.app;
  //   db = result.db;
  // });

  // test("exportParticipantsToJSON test", async () => {
  //   const json = await exportParticipantsToJSON(db, "testbetween");
  //   expect(json).not.toBeNull();
  //   const parsed = JSON.parse(json);
  //   expect(parsed).not.toBeNull();
  //   expect(parsed.prolificStudyId).toBe("testbetween");
  // });

  // test("exportAuditToJSON test", async () => {
  //   const json = await exportAuditToJSON(db, "testbetween");
  //   expect(json).not.toBeNull();
  //   const parsed = JSON.parse(json);
  //   expect(parsed).not.toBeNull();
  //   expect(parsed.prolificStudyId).toBe("testbetween");
  // });

  // test("participantToCSV", async () => {
  //   const csv = participantToCSV(TEST_BETWEEN_ALL_JSON, db, true);
  //   expect(csv).toBe(
  //     'app_version,gender,timezone,purpose_survey_worth_questions_completed_timestamp,debrief_time_sec,instructions_shown_timestamp,demographic_completed_timestamp,demographic_time_sec,purpose_survey_worth_time_sec,demographic_shown_timestamp,consent_shown_timestamp,instructions_time_sec,debrief_shown_timestamp,debrief_completed_timestamp,instructions_completed_timestamp,financial_lit_survey_questions_completed_timestamp,purpose_survey_worth_questions_shown_timestamp,financial_lit_survey_time_sec,financial_lit_survey_questions_shown_timestamp,purpose_survey_aware_time_sec,purpose_survey_aware_questions_completed_timestamp,consent_completed_timestamp,purpose_survey_aware_questions_shown_timestamp,experience_survey_questions_completed_timestamp,experience_survey_time_sec,consent_time_sec,experience_survey_questions_shown_timestamp,choice_instruction_completed_timestamp_2,choice_instruction_shown_timestamp_2,choice_instruction_time_sec_2,max_time_2_1,question_id_2_1,left_margin_width_in_2_1,graph_height_in_2_1,amount_earlier_2_1,sequence_id_2_1,bottom_margin_height_in_2_1,treatment_id_2_1,instruction_gif_prefix_2_1,treatment_question_id_2_1,show_minor_ticks_2_1,max_amount_2_1,width_in_2_1,time_later_2_1,date_later_2_1,amount_later_2_1,graph_width_in_2_1,horizontal_pixels_2_1,choice_timestamp_2_1,time_earlier_2_1,height_in_2_1,vertical_pixels_2_1,variable_amount_2_1,choice_time_sec_2_1,view_type_2_1,interaction_2_1,comment_2_1,choice_2_1,date_earlier_2_1,shown_timestamp_2_1,max_time_2_2,question_id_2_2,left_margin_width_in_2_2,graph_height_in_2_2,amount_earlier_2_2,sequence_id_2_2,bottom_margin_height_in_2_2,treatment_id_2_2,instruction_gif_prefix_2_2,treatment_question_id_2_2,show_minor_ticks_2_2,max_amount_2_2,width_in_2_2,time_later_2_2,date_later_2_2,amount_later_2_2,graph_width_in_2_2,horizontal_pixels_2_2,choice_timestamp_2_2,time_earlier_2_2,height_in_2_2,vertical_pixels_2_2,variable_amount_2_2,choice_time_sec_2_2,view_type_2_2,interaction_2_2,comment_2_2,choice_2_2,date_earlier_2_2,shown_timestamp_2_2,max_time_2_3,question_id_2_3,left_margin_width_in_2_3,graph_height_in_2_3,amount_earlier_2_3,sequence_id_2_3,bottom_margin_height_in_2_3,treatment_id_2_3,instruction_gif_prefix_2_3,treatment_question_id_2_3,show_minor_ticks_2_3,max_amount_2_3,width_in_2_3,time_later_2_3,date_later_2_3,amount_later_2_3,graph_width_in_2_3,horizontal_pixels_2_3,choice_timestamp_2_3,time_earlier_2_3,height_in_2_3,vertical_pixels_2_3,variable_amount_2_3,choice_time_sec_2_3,view_type_2_3,interaction_2_3,comment_2_3,choice_2_3,date_earlier_2_3,shown_timestamp_2_3,max_time_2_4,question_id_2_4,left_margin_width_in_2_4,graph_height_in_2_4,amount_earlier_2_4,sequence_id_2_4,bottom_margin_height_in_2_4,treatment_id_2_4,instruction_gif_prefix_2_4,treatment_question_id_2_4,show_minor_ticks_2_4,max_amount_2_4,width_in_2_4,time_later_2_4,date_later_2_4,amount_later_2_4,graph_width_in_2_4,horizontal_pixels_2_4,choice_timestamp_2_4,time_earlier_2_4,height_in_2_4,vertical_pixels_2_4,variable_amount_2_4,choice_time_sec_2_4,view_type_2_4,interaction_2_4,comment_2_4,choice_2_4,date_earlier_2_4,shown_timestamp_2_4,max_time_2_5,question_id_2_5,left_margin_width_in_2_5,graph_height_in_2_5,amount_earlier_2_5,sequence_id_2_5,bottom_margin_height_in_2_5,treatment_id_2_5,instruction_gif_prefix_2_5,treatment_question_id_2_5,show_minor_ticks_2_5,max_amount_2_5,width_in_2_5,time_later_2_5,date_later_2_5,amount_later_2_5,graph_width_in_2_5,horizontal_pixels_2_5,choice_timestamp_2_5,time_earlier_2_5,height_in_2_5,vertical_pixels_2_5,variable_amount_2_5,choice_time_sec_2_5,view_type_2_5,interaction_2_5,comment_2_5,choice_2_5,date_earlier_2_5,shown_timestamp_2_5,max_time_2_6,question_id_2_6,left_margin_width_in_2_6,graph_height_in_2_6,amount_earlier_2_6,sequence_id_2_6,bottom_margin_height_in_2_6,treatment_id_2_6,instruction_gif_prefix_2_6,treatment_question_id_2_6,show_minor_ticks_2_6,max_amount_2_6,width_in_2_6,time_later_2_6,date_later_2_6,amount_later_2_6,graph_width_in_2_6,horizontal_pixels_2_6,choice_timestamp_2_6,time_earlier_2_6,height_in_2_6,vertical_pixels_2_6,variable_amount_2_6,choice_time_sec_2_6,view_type_2_6,interaction_2_6,comment_2_6,choice_2_6,date_earlier_2_6,shown_timestamp_2_6,max_time_2_7,question_id_2_7,left_margin_width_in_2_7,graph_height_in_2_7,amount_earlier_2_7,sequence_id_2_7,bottom_margin_height_in_2_7,treatment_id_2_7,instruction_gif_prefix_2_7,treatment_question_id_2_7,show_minor_ticks_2_7,max_amount_2_7,width_in_2_7,time_later_2_7,date_later_2_7,amount_later_2_7,graph_width_in_2_7,horizontal_pixels_2_7,choice_timestamp_2_7,time_earlier_2_7,height_in_2_7,vertical_pixels_2_7,variable_amount_2_7,choice_time_sec_2_7,view_type_2_7,interaction_2_7,comment_2_7,choice_2_7,date_earlier_2_7,shown_timestamp_2_7,max_time_2_8,question_id_2_8,left_margin_width_in_2_8,graph_height_in_2_8,amount_earlier_2_8,sequence_id_2_8,bottom_margin_height_in_2_8,treatment_id_2_8,instruction_gif_prefix_2_8,treatment_question_id_2_8,show_minor_ticks_2_8,max_amount_2_8,width_in_2_8,time_later_2_8,date_later_2_8,amount_later_2_8,graph_width_in_2_8,horizontal_pixels_2_8,choice_timestamp_2_8,time_earlier_2_8,height_in_2_8,vertical_pixels_2_8,variable_amount_2_8,choice_time_sec_2_8,view_type_2_8,interaction_2_8,comment_2_8,choice_2_8,date_earlier_2_8,shown_timestamp_2_8,country_of_residence,error,self_describe_gender,participant_id,feedback,self_describe_employment,financial_lit_survey_risk,financial_lit_survey_numeracy,financial_lit_survey_inflation,browser_timestamp,profession,server_timestamp,consent_checked,user_agent,session_id,employment,viz_familiarity,current_answer_idx,purpose_survey_worth_doneall,purpose_survey_aware_certain,purpose_survey_aware_describe,purpose_survey_aware_confident,purpose_survey_aware_understand,purpose_survey_worth_dayatatime,purpose_survey_aware_clear,purpose_survey_worth_wander,experience_survey_easy,experience_survey_mental,experience_survey_understand,experience_survey_imagine,experience_survey_clear,experience_survey_enjoy,experience_survey_present,experience_survey_format,study_id,attention_check,age,status\n1.1,self-describe,America/New_York,2024-01-17T13:52:32.035-05:00,0,2024-01-17T13:51:28.211-05:00,2024-01-17T13:53:05.412-05:00,33.278,6.585,2024-01-17T13:52:32.134-05:00,2024-01-17T13:51:25.043-05:00,1.405,2024-01-17T13:53:05.468-05:00,2024-01-17T13:53:05.468-05:00,2024-01-17T13:51:29.616-05:00,2024-01-17T13:52:13.836-05:00,2024-01-17T13:52:25.450-05:00,5.165,2024-01-17T13:52:08.671-05:00,11.134,2024-01-17T13:52:25.090-05:00,2024-01-17T13:51:28.150-05:00,2024-01-17T13:52:13.956-05:00,2024-01-17T13:52:08.551-05:00,19.199,3.107,2024-01-17T13:51:49.352-05:00,2024-01-17T13:51:33.250-05:00,2024-01-17T13:51:29.648-05:00,3,14,1,,,350,1,,2,introduction-barchart-no-ticks-none-right,197,false,430,,13,,430,,600,2024-01-17T13:51:35.182-05:00,4,,300,none,1.905,barchart,none,,earlierAmount,,2024-01-17T13:51:33.277-05:00,19,2,,,490,2,,2,introduction-barchart-no-ticks-none-right,198,false,700,,18,,700,,600,2024-01-17T13:51:37.065-05:00,2,,300,none,0.829,barchart,none,,laterAmount,,2024-01-17T13:51:36.236-05:00,25,3,,,720,3,,2,introduction-barchart-no-ticks-none-right,199,false,1390,,24,,1390,,600,2024-01-17T13:51:38.648-05:00,6,,300,none,0.743,barchart,none,,earlierAmount,,2024-01-17T13:51:37.905-05:00,17,4,,,840,4,,2,introduction-barchart-no-ticks-none-right,200,false,1120,,16,,1120,,600,2024-01-17T13:51:40.150-05:00,3,,300,none,0.73,barchart,none,,laterAmount,,2024-01-17T13:51:39.420-05:00,14,5,,,32,5,,2,introduction-barchart-no-ticks-none-right,201,false,40,,13,,39,,600,2024-01-17T13:51:41.732-05:00,4,,300,none,0.794,barchart,none,,earlierAmount,,2024-01-17T13:51:40.938-05:00,19,6,,,45,6,,2,introduction-barchart-no-ticks-none-right,202,false,70,,18,,70,,600,2024-01-17T13:51:43.615-05:00,2,,300,none,1.178,barchart,none,,laterAmount,,2024-01-17T13:51:42.437-05:00,25,7,,,66,7,,2,introduction-barchart-no-ticks-none-right,203,false,110,,24,,110,,600,2024-01-17T13:51:46.553-05:00,6,,300,none,1.979,barchart,none,,earlierAmount,,2024-01-17T13:51:44.574-05:00,17,8,,,77,8,,2,introduction-barchart-no-ticks-none-right,204,false,120,,16,,118,,600,2024-01-17T13:51:48.319-05:00,3,,300,none,0.929,barchart,none,,laterAmount,,2024-01-17T13:51:47.390-05:00,usa,,Self Describe Gender,563268,Feedback,Self Describe Employment,dont-know,gt102,exactly-same,2024-01-17T13:53:10.422-05:00,Profession,[object Object],true,"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",3,self-describe,6,7,somewhat-disagree,disagree,somewhat-disagree,neither-agree-nor-disagree,agree,disagree,strongly-disagree,strongly-disagree,quite-a-bit,not-at-all,a-little,to-some-extent,very-slightly,not-at-all,moderately,extremely,testbetween,,55,debrief\r\n'
  //   );
  // });

  // test("exportParticipantsToCSV", async () => {
  //   const csv = await exportParticipantsToCSV(db, "testbetween");
  //   expect(csv).toBe("");
  // });
});
