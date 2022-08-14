/* eslint-disable no-undef */
/// <reference types="cypress" />

let baseURL = "http://localhost:3000/start";

let participantId = 1;

let fetching = true;
let fetching1 = true;
function postsurvey(expects) {
  cy.get("label").contains("Higher for the 15 year mortgage").click();
  cy.get("label").contains("Less than $50,000").click();
  cy.get("label").contains("Less than $120,000").click();
  cy.get("label").contains("Less than 20 years").click();
  cy.get("button").contains("Next").click();
  cy.tick(1000);
  cy.get("#posdiff-strongly-disagree").click();
  cy.get("#carbetplac-strongly-disagree").click();
  cy.get("#servsoc-strongly-disagree").click();
  cy.get("#thinkach-strongly-disagree").click();
  cy.get("#descrpurp-strongly-disagree").click();
  cy.get("#effort-strongly-disagree").click();
  cy.get("button").contains("Next").click();
  cy.tick(1000);
  cy.get("h4").contains("Study Explanation").should("exist");
  cy.get("button").contains("Next").click();
  cy.get("p").contains("You have completed the survey").should("exist");
  cy.get("button")
    .contains("Submit and Exit")
    .click()
    .then(() => {
      cy.wait(1000).then(() => {
        let file = `http://localhost:3001/answers-${participantId}.csv`;
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
              demographics: {
                countryOfResidence: "usa",
                vizFamiliarity: "3",
                age: "26",
                gender: "male",
                selfDescribeGender: "",
                profession: "Software Developer",
              },
              attentioncheck: "strongly-disagree",
              timestamps: {
                consentShownTimestamp: 1000,
                introductionShowTimestamp: 2000,
                introductionCompletedTimestamp: 3000,
                instructionsShownTimestamp: 3000,
                instructionsCompletedTimestamp: 4000,
                postSurveyQuestionsShownTimestamp: 9000,
                debriefShownTimestamp: 10000,
                debriefCompleted: 10000,
                theEndShownTimestamp: 10000,
              },
              postsurvey: {
                fincanialLit: {
                  q15vs30: "v15+",
                  q50k6p: "v<50k",
                  q100k5p: "v<120k",
                  q200k5p: "v<20y",
                },
                senseOfPurpose: {
                  posdiff: "strongly-disagree",
                  carbetplac: "strongly-disagree",
                  servsoc: "strongly-disagree",
                  thinkach: "strongly-disagree",
                  descrpurp: "strongly-disagree",
                  effort: "strongly-disagree",
                },
              },
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
  cy.get("#gender-select-helper").select("Male");
  cy.get("#Current-Profession").type("Software Developer");
  cy.tick(1000);
  cy.get("button").contains("Next").click();
}

function visitTreatment(treatmentId, width = 1200, height = 700) {
  cy.clock();
  cy.viewport(width, height);
  cy.visit(
    baseURL +
      `?treatment_id=${treatmentId}&session_id=1&participant_id=${participantId}`
  );
  cy.tick(1000);
  cy.get("#checkConsent").click();
  cy.get("button").contains("Next").click();
  demographic();

  cy.tick(1000);
  if (treatmentId === 1) {
    cy.get("button").should("be.disabled");
    cy.get("label").contains("First option").click();
    cy.get("button").should("not.be.disabled").click();
  } else {
    cy.get("button").click();
  }

  cy.tick(1000);
  cy.get("button").contains("Start").click();
}
describe("vizsurvey", () => {
  it("word", () => {
    visitTreatment(1);
    function answerMELForm() {
      cy.get("#earlierAmount").should(
        "have.css",
        "backgroundColor", "rgb(70, 130, 180)"
      );
      cy.get("#earlierAmount")
        .realHover()
        .should("have.css", "backgroundColor", "rgb(173, 216, 230)")
        .click();
      cy.get("button").realHover().click();
      cy.tick(1000);
    }
    answerMELForm();
    answerMELForm();

    cy.get("#attention-check-strongly-disagree").click();
    cy.get("button").contains("Next").click();

    answerMELForm();
    cy.tick(1000);

    postsurvey([
      "1,1,word,none,none,500,2,,1000,5",
      "1,2,word,none,none,50,2,,300,7",
      "1,3,word,none,none,250,2,,1000,3",
    ]);
  });
  it("bar", () => {
    visitTreatment(2);
    cy.get("#earlierAmount").click();
    cy.get("button").contains("Next").click();
    cy.tick(4000);
    cy.get("#laterAmount").click();
    cy.get("button").contains("Next").click();
    cy.get("#attention-check-strongly-disagree").click();
    cy.get("button").contains("Next").click();
    cy.get("#laterAmount").click();
    cy.get("button").contains("Next").click();
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
        cy.get("#earlierAmount").click();
        cy.get("button").contains("Next").click();
        cy.get("#earlierAmount").click();
        cy.tick(4000);
        cy.get("#laterAmount").click();
        cy.get("button").contains("Next").click();
        cy.get("#laterAmount").click();
        cy.get("button").contains("Next").click();
        cy.get("#attention-check-strongly-disagree").click();
        cy.get("button").contains("Next").click();
        cy.get("#earlierAmount").click();
        cy.get("button").contains("Next").click();
        cy.get("#earlierAmount").click();
        cy.get("button").contains("Next").click();
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
  /*
  it("calendar bar", () => {
    visitTreatment(4);
    cy.tick(4000);
    calendar("day", "4", "Bar");
  });
  it("calendar word", () => {
    visitTreatment(5);
    cy.tick(4000);
    calendar("day", "5", "Word");
  });
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
  cy.get("#later-" + id).click();
  cy.get("#later-" + id).click();
  cy.get("#later-" + id).click();
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
