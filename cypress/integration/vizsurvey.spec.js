/* eslint-disable no-undef */
/// <reference types="cypress" />

let baseURL = "http://localhost:3000/start";

function postsurvey(expects) {
  cy.wait(1000);
  cy.get("label").contains("Higher for the 15 year mortgage").click();
  cy.get("label").contains("Less than $50,000").click();
  cy.get("label").contains("Less than $120,000").click();
  cy.get("label").contains("Less than 20 years").click();
  cy.get("#posdiff-strongly-disagree").click();
  cy.get("#carbetplac-strongly-disagree").click();
  cy.get("#servsoc-strongly-disagree").click();
  cy.get("#thinkach-strongly-disagree").click();
  cy.get("#descrpurp-strongly-disagree").click();
  cy.get("#effort-strongly-disagree").click();
  cy.get("button").contains("Next").click();
  cy.wait(1000);
  cy.get("p")
    .contains("This experiment seeks to examine")
    .should("exist")
    .then(() => {
      fetch("http://localhost:3001/answers-1.csv").then((response) => {
        response.text().then((text) => {
          //treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,vertical_pixels,horizontal_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,choice,shown_timestamp,choice_timestamp,highup,lowdown,participant_code
          expects.forEach((expectStr) => {
            expect(text).to.contain(expectStr);
          });
        });
      });
      fetch("http://localhost:3001/post-survey-answers-1.json").then(
        (response) => {
          response.text().then((text) => {
            expect(JSON.parse(text)).to.deep.equal({
              demographics: {
                countryOfResidence: "usa",
                vizFamiliarity: "3",
                age: "26",
                gender: "male",
                selfDescribeGender: "",
                profession: "Software Developer",
              },
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
            });
          });
        }
      );
    });
  cy.get("button").contains("Next").click();
  cy.get("p").contains("You have completed the survey").should("exist");
}

function demographic() {
  cy.get("#country-select-helper").select("United States of America");
  cy.get("[name=familiarity-with-viz]").select("3");
  cy.get("#Age").type("26");
  cy.get("#gender-select-helper").select("Male");
  cy.get("#Current-Profession").type("Software Developer");
  cy.get("button").contains("Next").click();
}

describe("vizsurvey", () => {
  it("word", () => {
    cy.viewport(1200, 700);
    cy.visit(baseURL + "?treatment_id=1&session_id=1&participant_id=1");
    cy.wait(150);
    cy.get("button").contains("Next").click();
    demographic();
    cy.get("button").should("be.disabled");
    cy.get("label").contains("First option").click();
    cy.get("button").should("not.be.disabled").click();
    cy.get("button").contains("Start").click();
    function answerMELForm() {
      cy.wait(1000);
      cy.get("#earlier").should('have.css', 'borderColor', 'rgb(255, 255, 255)');
      cy.get("#earlier").realHover().should('have.css', 'borderColor', 'rgb(0, 0, 0)').click();
      cy.wait(1000);
      cy.get("button").realHover().click();
    }
    answerMELForm();
    answerMELForm();

    answerMELForm();
    answerMELForm();

    postsurvey([
      "1,1,word,none,none,500,2,,1000,5",
      "1,2,word,none,none,50,2,,300,7",
      "1,3,word,none,none,250,2,,1000,3",
    ]);
  });
  it("bar", () => {
    cy.viewport(1200, 700);
    cy.visit(baseURL + "?treatment_id=2&session_id=1&participant_id=1");
    cy.wait(150);
    cy.get("button").contains("Next").click();
    demographic();
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Start").click();
    cy.get("#id5").click();
    cy.get("#id7").click();
    cy.get("#id7").click();
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
        cy.viewport(width, height);
        cy.visit(baseURL + "?treatment_id=3&session_id=1&participant_id=1");
        cy.wait(150);
        cy.get("button").contains("Next").click();
        demographic();
        cy.get("button").contains("Next").click();
        cy.get("button").contains("Start").click();
        cy.get("#id5").click();
        cy.get("#id5").click();
        cy.get("#id7").click();
        cy.get("#id7").click();
        cy.get("#id2").click();
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
    cy.viewport(1200, 700);
    cy.visit(baseURL + "?treatment_id=4&session_id=1&participant_id=1");
    cy.wait(150);
    cy.get("button").contains("Next").click();
    demographic();
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Start").click();
    calendar("day", "4", "Bar");
  });
  it("calendar word", () => {
    cy.viewport(1200, 700);
    cy.visit(baseURL + "?treatment_id=5&session_id=1&participant_id=1");
    cy.wait(150);
    cy.get("button").contains("Next").click();
    demographic();
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Start").click();
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
      cy.viewport(1200, 700);
      cy.visit(baseURL + "?session_id=1&participant_id=1");
      cy.wait(150);
      cy.get("button").contains("Next").click();
      demographic();
      cy.get("button").contains("Next").should("exist");
    }
  });
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
