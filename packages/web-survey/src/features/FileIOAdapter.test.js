//import AWS from "aws-sdk";
import { DateTime } from "luxon";
import { InteractionType } from "@the-discounters/domain";
import { AmountType, ViewType } from "@the-discounters/domain";
import { Answer } from "./Answer";
import { convertToCSV } from "@the-discounters/util";

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
      highup: 20,
      lowdown: 21,
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
      highup: 41,
      lowdown: 42,
    });
    const answers = [answer1, answer2];
    const result = convertToCSV(answers);
    expect(result).toBe(
      `participantId,sessionId,studyId,treatmentId,position,viewType,interaction,variableAmount,amountEarlier,timeEarlier,dateEarlier,amountLater,timeLater,dateLater,maxAmount,maxTime,verticalPixels,horizontalPixels,leftMarginWidthIn,bottomMarginHeightIn,graphWidthIn,graphHeightIn,widthIn,heightIn,showMinorTicks,choice,dragAmount,shownTimestamp,choiceTimestamp,choiceTimeSec,highup,lowdown\n1,2,3,4,5,word,none,earlierAmount,6,7,2001-01-01T00:00:00.000Z,8,9,2001-01-02T00:00:00.000Z,10,11,12,13,14,15,16,17,18,19,false,earlierAmount,,2001-01-03T00:00:00.000Z,2001-01-04T00:00:00.000Z,,20,21\r\n22,23,24,25,26,barchart,drag,earlierAmount,27,28,2001-01-02T01:01:01.001Z,29,30,2001-01-02T02:01:01.001Z,31,32,33,34,35,36,37,38,39,40,false,laterAmount,,2001-01-02T03:01:01.001Z,2001-01-02T04:01:01.001Z,,41,42\r\n`
    );
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
