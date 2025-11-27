/* eslint-disable no-undef */
/// <reference types="cypress" />
const BASE_URL = "https://localhost:3000/start";
const WAIT_TIME_SIGNUP = 5000;
const WAIT_TIME = 1000;
const PARTICIPANT_NUM_MAX = 1000000;
const PARTICIPANT_NUM_MIN = 1;
const BETWEEN_STUDY_ID = "testbetween";

const SELECTED_BG_COLOR = "rgb(173, 216, 230)";
const UNSELECTED_BG_COLOR = "rgba(0, 0, 0, 0)";

// TODO can we reuse type from common package
export const SelectionType = {
  none: "none",
  earlierAmount: "earlierAmount",
  laterAmount: "laterAmount",
};

Object.freeze(SelectionType);

const MEL_ANSWER = [
  SelectionType.earlierAmount,
  SelectionType.laterAmount,
  SelectionType.earlierAmount,
  SelectionType.laterAmount,
  SelectionType.earlierAmount,
  SelectionType.laterAmount,
  SelectionType.earlierAmount,
  SelectionType.laterAmount,
];

// needs to match treatment ids in experiment configuration.  TODO maybe we should type this.
const TreatmentType = {
  word: 1,
  barChart: 2,
  barChartExtended: 3,
};
Object.freeze(TreatmentType);

function answerMELForm(treatmentType, choice) {
  if (choice === SelectionType.earlierAmount) {
    cy.get("#earlierAmount").type("{leftArrow}");
    if (treatmentType === TreatmentType.word) {
      cy.get("#earlierAmount").should(
        "have.css",
        "backgroundColor",
        SELECTED_BG_COLOR
      );
    } else {
      // bar
      cy.get("#earlierAmount").should("have.attr", "fill", SELECTED_BG_COLOR);
    }
  } else if (choice === SelectionType.laterAmount) {
    cy.get("#laterAmount").type("{rightArrow}");
    if (treatmentType === TreatmentType.word) {
      cy.get("#laterAmount").should(
        "have.css",
        "backgroundColor",
        SELECTED_BG_COLOR
      );
    } else {
      // bar
      cy.get("#laterAmount").should("have.attr", "fill", SELECTED_BG_COLOR);
    }
  }
}

function visitConsent() {
  cy.get("#checkConsent").click();
  cy.get("button").contains("Next").click();
}

function visitGeneralInstruction() {
  cy.get("button").contains("Next").click();
}

function visitMCLInstructions(treatmentType) {
  visitMELQuestion(treatmentType, SelectionType.earlierAmount);
  cy.wait(WAIT_TIME);
  cy.realPress("Enter");
}

function visitMELQuestion(treatmentType, choice) {
  function checkMELFormBeforeClickOrHover(treatmentType, id) {
    if (treatmentType === TreatmentType.word) {
      cy.get(id).should("have.css", "backgroundColor", UNSELECTED_BG_COLOR);
    } else {
      // bar
      cy.get(id).should("have.attr", "fill", UNSELECTED_BG_COLOR);
    }
  }

  function checkMELFormDuringHover(id, treatmentType) {
    cy.get(id).realHover();
    cy.get(
      treatmentType === TreatmentType.word
        ? "#tooltip-earlierAmount"
        : "#vg-tooltip-element"
    ).should("be.visible");
  }

  function checkMELFormClick(id, errorText) {
    cy.get(id).click();
    cy.get("#errorMessage").contains(new RegExp(errorText, "g"));
  }

  checkMELFormBeforeClickOrHover(treatmentType, "#earlierAmount");
  cy.wait(WAIT_TIME);
  checkMELFormBeforeClickOrHover(treatmentType, "#laterAmount");
  cy.wait(WAIT_TIME);
  checkMELFormDuringHover("#earlierAmount", treatmentType);
  cy.wait(WAIT_TIME);
  checkMELFormDuringHover("#laterAmount", treatmentType);
  cy.wait(WAIT_TIME);
  checkMELFormClick(
    "#earlierAmount",
    "Press the left arrow key to choose the left option."
  );
  cy.wait(WAIT_TIME);
  checkMELFormClick(
    "#laterAmount",
    "Press the right arrow key to choose the right option."
  );
  cy.wait(WAIT_TIME);
  answerMELForm(treatmentType, choice);
  cy.realPress("Enter");
}

function visitMELQuestions(treatmentType) {
  MEL_ANSWER.forEach((choice) => {
    visitMELQuestion(treatmentType, choice);
    cy.wait(WAIT_TIME);
  });
}

function visitExperience(answerOptional) {
  if (answerOptional) {
    cy.get("#experience_survey_enjoy-moderately").click();
    cy.get("#experience_survey_clear-moderately").click();
    cy.get("#experience_survey_understand-moderately").click();
    cy.get("#experience_survey_present-moderately").click();
    cy.get("#experience_survey_imagine-moderately").click();
    cy.get("#experience_survey_easy-moderately").click();
    cy.get("#experience_survey_format-moderately").click();
    cy.get("#experience_survey_mental-moderately").click();
  }
  cy.wait(WAIT_TIME);
  cy.get("button").contains("Next").click();
}

function visitFinancial(answerOptional) {
  if (answerOptional) {
    cy.get("#gt102").click();
  }
  cy.get("button").contains("Next").click();
}

function answerDemographicCommon() {
  cy.get("#country-select-helper").select("United States of America");
  cy.get("#familiarity-with-viz").select("3");
  cy.get("#age").type("26");
  cy.get("#current-profession").type("Software Developer");
}

function answerDemographicSelfDescribeFieldsSelectOption() {
  cy.get("#gender-select-helper").select("Male");
  cy.get("#employment-select-helper").select("Full Time");
  cy.get("#household-income-select-helper").select("$50,000 - $59,999");
  cy.get("#education-level-select-helper").select("Master's degree");
}

function answerDemographicSelfDescribeFieldsSelfDescribe() {
  cy.get("#gender-select-helper").select("Prefer to Self-Describe");
  cy.get("#self-describe-gender").type("Self Described");
  cy.get("#employment-select-helper").select("Prefer to Self-Describe");
  cy.get("#self-describe-employment").type("Self Described");
  cy.get("#household-income-select-helper").select("Prefer to Self-Describe");
  cy.get("#self-describe-household-income").type("Self Described");
  cy.get("#education-level-select-helper").select("Prefer to Self-Describe");
  cy.get("#self-describe-education-level").type("Self Described");
}

function answerDemographicNonSelfDescribe() {
  answerDemographicCommon();
  answerDemographicSelfDescribeFieldsSelectOption();
}

function answerDemographicSelfDescribe() {
  answerDemographicCommon();
  answerDemographicSelfDescribeFieldsSelfDescribe();
}

function visitDemographic(answer, selfDescribe) {
  if (answer) {
    if (selfDescribe) {
      answerDemographicSelfDescribe();
    } else {
      answerDemographicNonSelfDescribe();
    }
  }
  cy.get("button").contains("Next").click();
}

function visitStudyExplanation(answerOptional) {
  if (answerOptional) {
    cy.get("#Feedback").type("survey was good");
  }
  cy.get("button").contains("Next").click();
}

function visitFinished() {
  cy.contains("h4", "Finished");
}

function vaidateAnswers(expects) {}

function visitStudy(
  studyId,
  treatmentType,
  answerOptional,
  answerSelfDescribe = false,
  width = 1280,
  height = 720
) {
  const participantId = Math.floor(
    Math.random() * (PARTICIPANT_NUM_MAX - PARTICIPANT_NUM_MIN + 1) +
      PARTICIPANT_NUM_MIN
  );
  cy.viewport(width, height);
  cy.visit(
    BASE_URL +
      `?participant_id=${participantId}&study_id=${studyId}&session_id=1&treatment_ids=%5B${treatmentType}%5D`
  );
  cy.wait(WAIT_TIME_SIGNUP);
  visitConsent();
  cy.wait(WAIT_TIME);
  visitGeneralInstruction();
  cy.wait(WAIT_TIME);
  visitMCLInstructions(treatmentType);
  cy.wait(WAIT_TIME);
  visitMELQuestions(treatmentType);
  cy.wait(WAIT_TIME);
  visitExperience(answerOptional);
  cy.wait(WAIT_TIME);
  visitFinancial(answerOptional);
  cy.wait(WAIT_TIME);
  visitDemographic(answerOptional, answerSelfDescribe);
  cy.wait(WAIT_TIME);
  visitStudyExplanation(answerOptional);
  cy.wait(WAIT_TIME);
  visitFinished();
  cy.wait(WAIT_TIME);
  vaidateAnswers();
}

describe("vizsurvey", () => {
  // it("test worded treatment answer optional questions with no self describe on demographics.", () => {
  //   visitStudy(BETWEEN_STUDY_ID, TreatmentType.word, true, false);
  // });

  it("test bar chart treatment answer optional questions with no self describe on demographics.", () => {
    visitStudy(BETWEEN_STUDY_ID, TreatmentType.barChart, true, false);
  });

  // it("test bar chart with extended axis treatment answer optional questions with no self describe on demographics.", () => {
  //   visitStudy(BETWEEN_STUDY_ID, TreatmentType.barChart, true, false);
  // });
});
