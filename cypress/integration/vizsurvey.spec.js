/// <reference types="cypress" />

function testBlah() {
  return new Promise((resolve, reject) => {
    resolve(false);
  });
}

describe("vizsurvey", () => {
  it("survey", async () => {
    cy.viewport(1200, 700);
    //cy.visit("https://release.d2ptxb5fbsc082.amplifyapp.com");
    if (process.env.REACT_APP_AWS_ENABLED) {
      cy.log("AWS ENABLED");
      fetch("HIDE_URL").then((response) => {
        console.log(response.status);
        response.text().then((text) => {
          console.log(text);
          console.log("YAHEL1");
        });
      });
    } else {
      cy.log("AWS DISABLED");
    }
    /*
    if (await testBlah()) {
      cy.visit("http://localhost:3001");
    } else {
      cy.visit("http://localhost:3002");
    }
*/
    cy.visit("http://localhost:3000");
    cy.get("#1").click();
    cy.get("#start-survey").click();
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
    cy.get("#submit").click();
    cy.wait(1000);
    cy.get("p").contains("Thank you").should("exist");
    cy.get("#uuid")
      .invoke("attr", "value")
      .then((sometext) => {
        cy.log(sometext);
        fetch("http://localhost:3001/answers-" + sometext + ".csv").then(
          (response) => {
            console.log(response.status);
            response.text().then((text) => {
              console.log(text);
              //treatment_id,position,view_type,interaction,variable_amount,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,vertical_pixels,horizontal_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,width_in,height_in,choice,shown_timestamp,choice_timestamp,highup,lowdown,participant_code
              expect(text).to.contain("1,1,word,none,none,500,2,,1000,5");
              expect(text).to.contain("1,2,word,none,none,50,2,,300,7");
              expect(text).to.contain("1,3,word,none,none,250,2,,1000,3");
              console.log("YAHEL1");
            });
          }
        );
        //1,1,word,none,none,500,2,,1000,5,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,4,4,earlier,,2022-05-26T20:25:19.243Z,1000,undefined,undefined
        //1,2,word,none,none,50,2,,300,7,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,8,8,earlier,,2022-05-26T20:25:19.781Z,undefined,undefined,undefined
        //1,3,word,none,none,250,2,,1000,3,,undefined,10,undefined,undefined,undefined,undefined,undefined,undefined,8,8,earlier,,2022-05-26T20:25:20.314Z,undefined,undefined,undefined
        fetch(
          "http://localhost:3001/post-survey-answers-" + sometext + ".json"
        ).then((response) => {
          console.log(response.status);
          response.text().then((text) => {
            console.log(text);
            expect(JSON.parse(text)).to.deep.equal({
              choice15vs30: "value15+",
              choice50k6p: "value<50k",
              choice100k5p: "value<120k",
              choice200k5p: "value<20y",
            });
            console.log("YAHEL1");
          });
        });
      });
  });
});
