/* eslint-disable no-undef */
/// <reference types="cypress" />

const betweenStudyId = "testbetween";
const withinStudyId = "testwithin";

const betweekSubjectLatinSquare = [[1], [2], [3]]; // this needs to match firestore experiment configuration.
const withinSubjectLatinSquare = [
  // this needs to match firestore experiment configuration.
  [1, 2, 3],
  [1, 3, 2],
  [3, 1, 2],
  [3, 2, 1],
  [2, 3, 1],
  [2, 1, 3],
];

let fetching = true;
let fetching1 = true;

function visitExperienceQuestions() {
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

function visitFinancialQuestions() {
  cy.get("#financial_lit_survey_numeracy-gt102").click();
  cy.get("#financial_lit_survey_numeracy-more-than").click();
  cy.get("#financial_lit_survey_true").click();
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
        let file = `https://localhost:3001/answers-${participantId}-${studyId}-.csv`;
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
        let file1 = `https://localhost:3001/post-survey-answers-${participantId}.json`;
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
                choiceInstructionShownTimestamp: 1500,
                choiceInstructionCompletedTimestamp: 2000,
                demographicShownTimestamp: 2000,
                demographicCompletedTimestamp: 4000,
                instructionsShownTimestamp: 4000,
                instructionsCompletedTimestamp: 5000,
                financialLitSurveyQuestionsShownTimestamp: 6000,
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

function visitDemographicQuestions() {
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
let whiteRGB = "rgb(255, 255, 255)";
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

function introduction(treatmentId) {
  answerMELForm(treatmentId === 1 || treatmentId === 20 || treatmentId === 5);
}

function visitConsent() {
  cy.get("#checkConsent").click();
  cy.tick(500);
  cy.get("button").contains("Next").click();
}

function visitGeneralInstruction() {
  cy.tick(1000);
  cy.get("button").contains("Next").click();
}

function visitMELInstruction() {
  visitMELQuestion("earlier");
}

function triggerKeyPress(keycode) {
  cy.get("body").trigger("keydown", { keyCode: keycode });
  cy.wait(200);
  cy.get("body").trigger("keyup", { keyCode: keycode });
}

function triggerLeftArrowKey() {
  triggerKeyPress(37);
}

function triggerRightArrowKey() {
  triggerKeyPress(39);
}

function triggerEnterKey() {
  triggerKeyPress(10);
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

function visitMELQuestion(
  choiceType,
  buttonText = "Press Enter to start the survey"
) {
  cy.get("#buttonNext").should("be.disabled");
  cy.tick(500);
  cy.get("#laterAmount").should("have.css", "backgroundColor", whiteRGB);
  checkMELFormBeforeClickOrHover(word);
  checkMELFormDuringClickOrHover(word);
  cy.get("#earlierAmount").should("have.css", "backgroundColor", whiteRGB);
  checkMELFormBeforeClickOrHover(word);
  checkMELFormDuringClickOrHover(word);
  cy.get("button").contains(buttonText).should("be.disabled");
  switch (choiceType) {
    case "earlier":
      triggerLeftArrowKey();
      break;
    case "later":
      triggerRightArrowKey();
      break;
    default:
      throw new Error(
        `visitMELQuestion was passed an invalide paramter "${choiceType}".  Was expecting "earlier" or "later".`
      );
  }
  triggerEnterKey();
  cy.get("button").contains(buttonText).should("not.be.disabled").click();
}

function visitStudy(studyId, width = 1280, height = 720) {
  let participantId = Math.random() * (1000000 - 0 + 1) + 0;
  cy.clock();
  cy.viewport(width, height);
  cy.visit(
    `/start?&session_id=1&participant_id=${participantId}&studyId=${studyId}`
  );
  cy.tick(500);
  visitConsent();
  visitGeneralInstruction();
  visitMELInstruction();
  for (let i = 0; i < 8; i++) {
    visitMELQuestion(i % 2 === 0 ? "earlier" : "later");
  }
  visitExperienceQuestions();
  visitFinancialQuestions();
  visitDemographicQuestions();
  cy.get("#Feedback").type("survey was good");
  cy.get("button").contains("Submit Feedback & Exit").click();
}

describe("vizsurvey e2e test", () => {
  it("between study test.", () => {
    visitStudy(betweenStudyId);
  });
  it("within study test", () => {
    visitStudy(withinStudyId);
  });
});
