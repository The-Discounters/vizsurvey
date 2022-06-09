/// <reference types="cypress" />

describe("vizsurvey", () => {
  it("survey", () => {
    cy.viewport(1200, 700);
    cy.visit(
      "http://localhost:3000/?treatment_id=1&session_id=1&participant_id=1"
    );
    cy.wait(150);
    cy.get("#country-select-helper").select("United States of America");
    cy.get("[name=familiarity-with-viz]").select("3");
    cy.get("#Age").type("26");
    cy.get("#Gender").type("Male");
    cy.get("#Current-Profession").type("Software Developer");
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Start").click();
    cy.get("button").contains("Start").click();
    cy.get("label").contains("$500 in 2 weeks").click();
    cy.get("#submit").click();
    cy.get("label").contains("$50 in 2 weeks").click();
    cy.get("#submit").click();
    cy.get("label").contains("$250 in 2 weeks").click();
    cy.get("#submit").click();
    cy.wait(1000);
    cy.get("label").contains("Higher for the 15 year mortgage").click();
    cy.get("label").contains("Less than $50,000").click();
    cy.get("label").contains("Less than $120,000").click();
    cy.get("label").contains("Less than 20 years").click();
    cy.get("button").contains("Next").click();
    cy.wait(1000);
    cy.get("p")
      .contains("Thank you")
      .should("exist")
      .then(() => {
        fetch("http://localhost:3001/answers-1.csv").then((response) => {
          console.log(response.status);
          response.text().then((text) => {
            console.log("Logging: answers file from cypress");
            console.log(text);
            //treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,vertical_pixels,horizontal_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,choice,shown_timestamp,choice_timestamp,highup,lowdown,participant_code
            expect(text).to.contain("1,1,word,none,none,500,2,,1000,5");
            expect(text).to.contain("1,2,word,none,none,50,2,,300,7");
            expect(text).to.contain("1,3,word,none,none,250,2,,1000,3");
          });
        });
        //1,1,word,none,none,500,2,,1000,5,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,4,4,earlier,,2022-05-26T20:25:19.243Z,1000,undefined,undefined
        //1,2,word,none,none,50,2,,300,7,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,8,8,earlier,,2022-05-26T20:25:19.781Z,undefined,undefined,undefined
        //1,3,word,none,none,250,2,,1000,3,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,8,8,earlier,,2022-05-26T20:25:20.314Z,undefined,undefined,undefined
        fetch("http://localhost:3001/post-survey-answers-1.json").then(
          (response) => {
            console.log(response.status);
            response.text().then((text) => {
              console.log("Logging post survey answers file from cypress");
              console.log(text);
              expect(JSON.parse(text)).to.deep.equal({
                q15vs30: "15+",
                q50k6p: "<50k",
                q100k5p: "<120k",
                q200k5p: "<20y",
              });
            });
          }
        );
      });
  });
  it("survey invalid", () => {
    cy.viewport(1200, 700);
    cy.visit(
      "http://localhost:3000/?treatment_id=100&session_id=1&participant_id=1"
    );
    cy.wait(150);
    cy.get("#country-select-helper").select("United States of America");
    cy.get("[name=familiarity-with-viz]").select("3");
    cy.get("#Age").type("26");
    cy.get("#Gender").type("Male");
    cy.get("#Current-Profession").type("Software Developer");
    cy.get("button").contains("Next").click();
    cy.get("p")
      .contains("You have been provided an invalid survey link")
      .should("exist");
  });
  it("survey random", () => {
    for( let i = 0; i < 10; i++) {
    cy.viewport(1200, 700);
    cy.visit(
      "http://localhost:3000/"
    );
    cy.wait(150);
    cy.get("#country-select-helper").select("United States of America");
    cy.get("[name=familiarity-with-viz]").select("3");
    cy.get("#Age").type("26");
    cy.get("#Gender").type("Male");
    cy.get("#Current-Profession").type("Software Developer");
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Start")
      .should("exist");
    cy.get("button").contains("Start")
      .should("exist");
    }
  });
});
