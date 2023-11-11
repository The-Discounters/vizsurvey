import { stateToDate } from "./ConversionUtil";
//import { getRandomIntInclusive } from "./QuestionSliceUtil";

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

  test("flattenState test.", () => {
    const input = {
      participantId: null,
      sessionId: null,
      studyId: null,
      treatmentId: null,
      experienceSurvey: { experienceAnswer: "experience answer" },
      financialLitSurvey: { financialLitAnswer: "financial answer" },
      purposeSurvey: { purposeAnswer: "purpose answer" },
      screenAttributes: {
        // screen properties
        screenAvailHeight: null,
        screenAvailWidth: null,
        screenColorDepth: null,
        screenWidth: null,
        screenHeight: null,
        screenOrientationAngle: null,
        screenOrientationType: null,
        screenPixelDepth: null,
        // window properties
        windowDevicePixelRatio: null,
        windowInnerHeight: null,
        windowInnerWidth: null,
        windowOuterHeight: null,
        windowOuterWidth: null,
        windowScreenLeft: null,
        windowScreenTop: null,
      },
      countryOfResidence: null,
      vizFamiliarity: null,
      age: null,
      gender: null,
      selfDescribeGender: null,
      profession: null,
      consentChecked: null,
      timezone: null,
      timestamps: {
        consentShownTimestamp: null,
        consentCompletedTimestamp: null,
        consentTimeSec: null,
        demographicShownTimestamp: null,
        demographicCompletedTimestamp: null,
        demographicTimeSec: null,
        introductionShownTimestamp: null,
        introductionCompletedTimestamp: null,
        introductionTimeSec: null,
        instructionsShownTimestamp: null,
        instructionsCompletedTimestamp: null,
        instructionsTimeSec: null,
        attentionCheckShownTimestamp: null,
        attentionCheckCompletedTimestamp: null,
        attentionCheckTimeSec: null,
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
      attentionCheck: null,
      feedback: null,
      answers: [],
      highup: null,
      lowdown: null,
      status: null,
      error: null,
      userAgent: null,
    };
  });

  // test("Test getRandomIntInclusive.", () => {
  //   let value = getRandomIntInclusive(0, 0);
  //   expect(value).toBe(0);
  //   expect(Number.isInteger(value)).toBe(true);
  //   value = getRandomIntInclusive(0, 1);
  //   expect(value).toBeGreaterThanOrEqual(0);
  //   expect(value).toBeLessThanOrEqual(1);
  //   value = getRandomIntInclusive(3, 3);
  //   expect(value).toBeGreaterThanOrEqual(3);
  //   expect(value).toBeLessThanOrEqual(3);
  // });
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
