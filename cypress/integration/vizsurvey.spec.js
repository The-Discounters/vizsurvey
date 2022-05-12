/// <reference types="cypress" />

describe("vizsurvey", () => {
  it("survey", () => {
    cy.viewport(1200, 700);
    //cy.visit("https://release.d2ptxb5fbsc082.amplifyapp.com");
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
  });
});
