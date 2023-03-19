/* eslint-disable no-undef */
/// <reference types="cypress" />

let baseURL = "http://localhost:3000/start";

let participantId = 1;
let studyId = 1;

let fetching = true;
let fetching1 = true;
function postsurveyaboutsurvey() {
  cy.get("#experience_survey_enjoy-moderately").click();
  cy.get("#experience_survey_clear-moderately").click();
  cy.get("#experience_survey_understand-moderately").click();
  cy.get("#experience_survey_present-moderately").click();
  cy.get("#experience_survey_imagine-moderately").click();
  cy.get("#experience_survey_easy-moderately").click();
  cy.get("#experience_survey_format-moderately").click();
  cy.get("#experience_survey_mental-moderately").click();
  cy.tick(1000);
  cy.get("button").contains("Next").click();
  cy.tick(1000);
}

function postsurveyfinancial() {
  cy.get("#financial_lit_survey_numeracy-gt102").click();
  cy.get("button").contains("Next").click();
  cy.tick(1000);
}

function postsurveysenseofpurpose() {
  cy.get("#purpose_survey_difference-strongly-disagree").click();
  cy.get("button").contains("Next").click();
  cy.tick(1000);
}

function postsurvey(expects) {
  cy.wait(1000);
  cy.get("h4").contains("Submit Your Answers").should("exist");
  cy.get("button").contains("Submit Your Answers").click();
  cy.get("h4").contains("Study Explanation").should("exist");
  cy.get("#Feedback").type("had trouble seeing numbers");
  cy.get("button")
    .contains("Exit")
    .click()
    .then(() => {
      cy.wait(1000).then(() => {
        let file = `http://localhost:3001/answers-${participantId}-${studyId}-.csv`;
        console.log("fetching file: " + file);
        fetch(file).then((response) => {
          response.text().then((text) => {
            console.log("file text: " + text);
            expects.forEach((expectStr) => {
              expect(text).to.contain(expectStr);
              fetching = false;
            });
          });
        });
        let file1 = `http://localhost:3001/post-survey-answers-${participantId}.json`;
        console.log("fetching file1: " + file1);
        fetch(file1).then((response) => {
          response.text().then((text) => {
            console.log("file1 text: " + text);
            expect(JSON.parse(text)).to.deep.equal({
              financialLitSurvey: {
                qdoublediscount: "v1360",
                qsinglediscount: "v1350",
                qfinddiscount: "v20p",
              },

              purposeSurvey: {
                posdiff: "strongly-disagree",
                carbetplac: "strongly-disagree",
                servsoc: "strongly-disagree",
                thinkach: "strongly-disagree",
                descrpurp: "strongly-disagree",
                effort: "strongly-disagree",
              },
              demographics: {
                countryOfResidence: "usa",
                vizFamiliarity: "3",
                age: "26",
                gender: "male",
                selfDescribeGender: "",
                profession: "Software Developer",
              },
              consentChecked: true,
              attentionCheck: "strongly-disagree",
              timestamps: {
                consentShownTimestamp: 500,
                consentCompletedTimestamp: 1000,
                introductionShownTimestamp: 1500,
                introductionCompletedTimestamp: 2000,
                demographicShownTimestamp: 2000,
                demographicCompletedTimestamp: 4000,
                instructionsShownTimestamp: 4000,
                instructionsCompletedTimestamp: 5000,
                attentionCheckShownTimestamp: 5000,
                attentionCheckCompletedTimestamp: 6000,
                financialLitSurveyQuestionsShownTimestamp: 6000,
                purposeSurveyQuestionsShownTimestamp: 9000,
                debriefShownTimestamp: null, // TODO
                debriefCompletedTimestamp: null, // TODO
                theEndShownTimestamp: 10000,
              },
              feedback: "",
              // feedback: "had trouble seeing numbers",
            });
            fetching1 = false;
          });
        });
      });
    });
  waitingForFetch();
}

function waitingForFetch(waitTime = 1000) {
  cy.wait(waitTime).then(() => {
    if (fetching || fetching1) {
      waitingForFetch(waitTime * 2);
    }
    fetching = true;
    fetching1 = true;
    participantId++;
  });
}

function demographic() {
  cy.get("#country-select-helper").select("United States of America");
  cy.get("[name=familiarity-with-viz]").select("3");
  cy.get("#Age").type("26");
  cy.get("#Current-Profession").type("Software Developer");
  cy.get("#gender-select-helper").select("Male");
  cy.get("#employment-select-helper").select("Full Time");
  cy.tick(500);
  cy.get("button").contains("Next").click();
}

let steelblueRGB = "rgb(70, 130, 180)";
let lightblueRGB = "rgb(173, 216, 230)";
let waitAmount = 10;

function checkMELFormBeforeClickOrHover(word, id = "#earlierAmount") {
  if (word) {
    cy.get(id).should("have.css", "backgroundColor", steelblueRGB);
  } else {
    // bar
    cy.get(id).should("have.attr", "fill", "steelblue");
  }
  cy.wait(waitAmount);
  /*
  cy.get("#earlierAmount").should(
    "have.css",
    "borderColor",
    "rgb(255, 255, 255)"
  );
*/
  cy.wait(waitAmount);
}

function checkMELFormDuringClickOrHover(word, id = "#earlierAmount") {
  if (word) {
    cy.get(id)
      //.realHover()
      //.should("have.css", "backgroundColor", "rgb(173, 216, 230)")
      .click();
  } else {
    // bar
    cy.get(id).click();
    cy.get(id).should("have.attr", "fill", "lightblue");
  }
  cy.wait(waitAmount);
  if (word) {
    cy.get(id)
      //.realHover()
      .should("have.css", "backgroundColor", lightblueRGB);
  }
  //cy.get("#earlierAmount").should("have.css", "borderColor", "rgb(0, 0, 0)");
  cy.wait(waitAmount);
}

function clickMELFormNextButton(
  word,
  id = "#earlierAmount",
  tickAmount = 1000
) {
  cy.get("button").contains("Next").realHover();
  if (word) {
    cy.get(id)
      //.realHover()
      .should("have.css", "backgroundColor", lightblueRGB);
  }
  cy.get("button")
    .contains("Next")
    .realHover()
    .should("not.be.disabled")
    .click();
  cy.tick(tickAmount);
}

function answerMELForm(word = true, tickAmount = 1000) {
  cy.get("#buttonNext").should("be.disabled");
  cy.tick(500);

  cy.get("#earlierAmount").should("have.css", "backgroundColor", steelblueRGB);
  checkMELFormBeforeClickOrHover(word);
  checkMELFormDuringClickOrHover(word);

  cy.get("#laterAmount").should("have.css", "backgroundColor", steelblueRGB);
  checkMELFormBeforeClickOrHover(word, "#laterAmount");
  checkMELFormDuringClickOrHover(word, "#laterAmount");
  cy.get("#earlierAmount").should("have.css", "backgroundColor", steelblueRGB);
  cy.get("#earlierAmount").realHover();
  cy.get("#earlierAmount").should("have.css", "backgroundColor", steelblueRGB);

  clickMELFormNextButton(word, "#laterAmount", tickAmount);
}

function introduction(treatmentId) {
  answerMELForm(treatmentId === 1 || treatmentId === 20 || treatmentId === 5);
}

function instruction() {
  cy.tick(1000);
  cy.get("button").contains("Next").click();
}

function visitTreatment(treatmentId, width = 1280, height = 720) {
  let participantId = 1;
  cy.clock();
  cy.viewport(width, height);
  cy.visit(
    baseURL +
      `?treatment_id=${treatmentId}&session_id=1&participant_id=${participantId}`
  );
  cy.tick(500);
  cy.get("#checkConsent").click();
  cy.tick(500);
  cy.get("button").contains("Next").click();
  instruction();

  function simpleEarlierAmount(buttonText = "Next") {
    cy.get("#buttonNext").should("be.disabled");
    cy.tick(500);

    cy.get("#earlierAmount").click({ force: true });
    // cy.get("#laterAmount").should("have.css", "backgroundColor", steelblueRGB);
    cy.get("button").contains(buttonText).should("not.be.disabled").click();
  }
  simpleEarlierAmount("Start");
  for (let i = 0; i < 4; i++) {
    simpleEarlierAmount();
  }
  cy.get("#attention-check-strongly-disagree").click();
  cy.get("button").contains("Next").click();
  for (let i = 0; i < 4; i++) {
    simpleEarlierAmount();
  }
  postsurveyaboutsurvey();
  postsurveyfinancial();
  postsurveysenseofpurpose();
  demographic();
  cy.get("#Feedback").type("survey was good");
  cy.get("button").contains("Submit Feedback & Exit").click();
}
describe("vizsurvey", () => {
  /*
  it("word dev", () => {
    visitTreatment(1);
    answerMELForm();

    cy.get("#attention-check-strongly-disagree").click();
    cy.get("button").contains("Next").click();

    answerMELForm();
    answerMELForm();
    cy.tick(1000);

    postsurvey([
      "1,1,word,none,none,500,2,,1000,5",
      "1,2,word,none,none,50,2,,300,7",
      "1,3,word,none,none,250,2,,1000,3",
    ]);
  });
  it("bar dev", () => {
    visitTreatment(2);
    answerMELForm(false); // bar

    cy.get("#attention-check-strongly-disagree").click();
    cy.get("button").contains("Next").click();

    answerMELForm(false); // bar
    answerMELForm(false); // bar
    cy.tick(1000);

    postsurvey([
      "2,1,barchart,none,none,300,2,,700,5",
      "2,2,barchart,none,none,500,2,,800,7",
      "2,3,barchart,none,none,300,2,,1000,7",
    ]);
  });
  [
    {
      width: 800,
      height: 600,
    },
    {
      width: 1280,
      height: 720,
    },
    {
      width: 1920,
      height: 1080,
    },
    {
      width: 2560,
      height: 1440,
    },
  ].forEach(({ width, height }) => {
    it(
      "bar very wide but short in height (" + width + ", " + height + ")",
      () => {
        visitTreatment(3, width, height);

        answerMELForm(false); // bar
        answerMELForm(false, 980); // bar

        cy.get("#attention-check-strongly-disagree").click();
        cy.get("button").contains("Next").click();

        answerMELForm(false, 10); // bar
        answerMELForm(false, 10); // bar
        answerMELForm(false, 10); // bar

        // TODO: fix timing
        postsurvey([
          "3,1,barchart,none,none,300,2,,700,5",
          "3,2,barchart,none,none,300,2,,700,5",
          "3,3,barchart,none,none,500,2,,800,7",
          "3,4,barchart,none,none,500,2,,800,7",
          "3,5,barchart,none,none,300,2,,1000,7",
        ]);
      }
    );
  });
  it("calendar bar", () => {
    visitTreatment(4);
    cy.tick(4000);
    calendar("day", "4", "Bar");
  });*/
  /*
  it("random", () => {
    let calendarWordChartCount = 0;
    let radioButtonsCount = 0;
    let otherCount = 0;
    for (let j = 0; j < 100; j++) {
      let width = 1280;
      let height = 720;
      let participantId = 1;
      cy.clock();
      cy.viewport(width, height);
      cy.visit(baseURL + `?session_id=1&participant_id=${participantId}`);
      cy.tick(500);
      cy.get("#checkConsent").click();
      cy.tick(500);
      cy.get("button").contains("Next").click();
      instruction();

      function checkForParagraphText(regex, tCallback, fCallback) {
        cy.get("body").then((body) => {
          let res = body.find("p");
          let resB = false;
          //cy.log("reslen: " + res.length);
          for (let i = 0; i < res.length; i++) {
            let one = res[i];
            //cy.log('innerhtml: ' + i + " " + one.innerHTML);
            resB = resB || one.innerHTML.match(regex);
          }
          if (resB) {
            tCallback();
          } else {
            fCallback();
          }
        });
      }
      checkForParagraphText(
        /calendar word chart/,
        () => {
          calendarWordChartCount = calendarWordChartCount + 1;
          //cy.log("increment");
          cy.log("calworchar: " + calendarWordChartCount);
        },
        () => {
          checkForParagraphText(
            /radio buttons/,
            () => {
              radioButtonsCount++;
              cy.log("radiobutton: " + radioButtonsCount);
            },
            () => {
              otherCount++;
              cy.log("other: " + otherCount);
            }
          );
        }
      );
    }
    cy.wait(10000);
  });
*/
  it("calendar word single year", () => {
    visitTreatment(5);
  });
  it("word date", () => {
    visitTreatment(7);
  });
  it("calendar word single month", () => {
    //visitTreatment(5, 1280, 720);
    //cy.tick(4000);
    //answerMELForm();
    let width = 1280;
    let height = 720;
    let treatmentId = 4;
    let participantId = 1;
    cy.clock();
    cy.viewport(width, height);
    cy.visit(
      baseURL +
        `?treatment_id=${treatmentId}&session_id=1&participant_id=${participantId}`
    );
    cy.tick(500);
    cy.get("#checkConsent").click();
    cy.tick(500);
    cy.get("button").contains("Next").click();
    demographic();

    function simpleEarlierAmount() {
      cy.get("#buttonNext").should("be.disabled");
      cy.tick(500);

      cy.get("#earlierAmount").click();
      // cy.get("#laterAmount").should("have.css", "backgroundColor", steelblueRGB);
      cy.get("button").contains("Next").should("not.be.disabled").click();
    }
    simpleEarlierAmount();
    instruction();
    for (let i = 0; i < 4; i++) {
      simpleEarlierAmount();
    }
    cy.get("#attention-check-strongly-disagree").click();
    cy.get("button").contains("Next").click();
    for (let i = 0; i < 4; i++) {
      simpleEarlierAmount();
    }
    /*
    postsurvey([
      "5,1,calendarWord,none,none,500,2,,1000,5",
      "5,2,calendarWord,none,none,50,2,,300,7",
      "5,3,calendarWord,none,none,250,2,,1000,3",
    ]);
*/
  });
  it("calendar word dual year", () => {
    //visitTreatment(5, 1280, 720);
    //cy.tick(4000);
    //answerMELForm();
    let width = 1280;
    let height = 720;
    let treatmentId = 6;
    let participantId = 1;
    cy.clock();
    cy.viewport(width, height);
    cy.visit(
      baseURL +
        `?treatment_id=${treatmentId}&session_id=1&participant_id=${participantId}`
    );
    cy.tick(500);
    cy.get("#checkConsent").click();
    cy.tick(500);
    cy.get("button").contains("Next").click();
    demographic();

    function simpleEarlierAmount() {
      cy.get("#buttonNext").should("be.disabled");
      cy.tick(500);

      cy.get("#earlierAmount").click();
      // cy.get("#laterAmount").should("have.css", "backgroundColor", steelblueRGB);
      cy.get("button").contains("Next").should("not.be.disabled").click();
    }
    simpleEarlierAmount();
    instruction();
    for (let i = 0; i < 4; i++) {
      simpleEarlierAmount();
    }
    cy.get("#attention-check-strongly-disagree").click();
    cy.get("button").contains("Next").click();
    for (let i = 0; i < 4; i++) {
      simpleEarlierAmount();
    }
  });
  it("word prod", () => {
    visitTreatment(1);

    answerMELForm();
    answerMELForm(true, 500);

    answerMELForm(true, 100);
    answerMELForm(true, 100);

    answerMELForm(true, 100);
    answerMELForm(true, 100);

    answerMELForm(true, 100);
    answerMELForm(true, 100);

    // TODO    cy.get("#attention-check-strongly-disagree").click();
    // TODO   cy.get("button").contains("Next").click();

    cy.tick(1000);

    // TODO: fix timing
    postsurvey([
      "20,1,word,none,none,350,4,,430,13",
      "20,2,word,none,none,490,2,,700,18",
      "20,3,word,none,none,720,6,,1390,24",
      "20,4,word,none,none,840,3,,1120,16",
      "20,5,word,none,none,32,4,,39,13",
      "20,6,word,none,none,45,2,,70,18",
      "20,7,word,none,none,66,6,,110,24",
      "20,8,word,none,none,77,3,,118,16",
    ]);
  });
  it("bar prod", () => {
    visitTreatment(2);
    answerMELForm(false); // bar

    cy.get("#attention-check-strongly-disagree").click();
    cy.get("button").contains("Next").click();

    answerMELForm(false); // bar
    answerMELForm(false); // bar
    cy.tick(1000);

    postsurvey([
      "2,1,barchart,none,none,300,2,,700,5",
      "2,2,barchart,none,none,500,2,,800,7",
      "2,3,barchart,none,none,300,2,,1000,7",
    ]);
  });
  /*
  it("survey invalid", () => {
    cy.viewport(1200, 700);
    cy.visit(baseURL + "?treatment_id=100&session_id=1&participant_id=1");
    cy.wait(150);
    cy.get("button").contains("Next").click();
    demographic();
    cy.get("p")
      .contains("You have been provided an invalid survey link")
      .should("exist");
  });
  it("survey random", () => {
    for (let i = 0; i < 10; i++) {
      cy.clock();
      cy.viewport(1200, 700);
      cy.visit(baseURL + "?session_id=1&participant_id=1");
      cy.tick(1000);
      cy.wait(1000);
      cy.get("#checkConsent").click();
      cy.get("button").contains("Next").click();
      demographic();
      cy.get("button").contains("Next").should("exist");
    }
  });
*/
});

function calendar(id, treatmentNum, treatmentName) {
  cy.get("#earlierAmount").click();
  cy.get("#laterAmount").click();
  postsurvey([
    treatmentNum +
      ",1,calendar" +
      treatmentName +
      ",none,none,300,undefined,2022-02-01T00:00:00.000Z,700,undefined,2022-02-22T00:00:00.000Z,1100",
    treatmentNum +
      ",2,calendar" +
      treatmentName +
      ",none,none,500,undefined,2022-03-01T00:00:00.000Z,800,undefined,2022-03-12T00:00:00.000Z,1100",
    treatmentNum +
      ",3,calendar" +
      treatmentName +
      ",none,none,300,undefined,2022-04-01T00:00:00.000Z,1000,undefined,2022-04-15T00:00:00.000Z,1100",
  ]);
}
