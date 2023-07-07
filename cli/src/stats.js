let stats;
let numberTreatments;

export const createStat = (numTreatments) => {
  numberTreatments = numTreatments;
  stats = {
    surveysComplete: new Array(numberTreatments).fill(0),
    surveysInProgress: new Array(numberTreatments).fill(0),
    countryUSA: 0,
    countryOther: 0,
    laterChoice: new Array(numberTreatments).fill(0),
    consentInProgress: new Array(numberTreatments).fill(0),
    consentComplete: new Array(numberTreatments).fill(0),
    demographicsInProgress: new Array(numberTreatments).fill(0),
    demographicsComplete: new Array(numberTreatments).fill(0),
    introductionInProgress: new Array(numberTreatments).fill(0),
    introductionComplete: new Array(numberTreatments).fill(0),
    instructionsInProgress: new Array(numberTreatments).fill(0),
    instructionsComplete: new Array(numberTreatments).fill(0),
    choicesInProgress: new Array(numberTreatments).fill(0),
    choicesComplete: new Array(numberTreatments).fill(0),
    experienceInProgress: new Array(numberTreatments).fill(0),
    attentionCheckCompleted: new Array(numberTreatments).fill(0),
    attentionCheckInProgress: new Array(numberTreatments).fill(0),
    experienceComplete: new Array(numberTreatments).fill(0),
    financialInProgress: new Array(numberTreatments).fill(0),
    financialComplete: new Array(numberTreatments).fill(0),
    purposeInProgress: new Array(numberTreatments).fill(0),
    purposeComplete: new Array(numberTreatments).fill(0),
    debriefInProgress: new Array(numberTreatments).fill(0),
    debriefComplete: new Array(numberTreatments).fill(0),
    feedback: new Array(numberTreatments),
  };
  stats.feedback = new Array();
  return stats;
};

export const updateStats = (CSVData) => {
  if (CSVData.country_of_residence === "usa") {
    stats.countryUSA++;
  } else if (CSVData.country_of_residence) {
    stats.countryOther++;
  }
  if (CSVData.consent_completed_timestamp) {
    stats.consentComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.consent_shown_timestamp) {
    stats.consentInProgress[CSVData.treatment_id - 1]++;
  }
  if (!CSVData.purpose_survey_questions_completed_timestamp) {
    stats.surveysInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.demographic_completed_timestamp) {
    stats.demographicsComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.demographic_shown_timestamp) {
    stats.demographicsInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.introduction_completed_timestamp) {
    stats.introductionComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.introduction_shown_timestamp) {
    stats.introductionInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.instructions_completed_timestamp) {
    stats.instructionsComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.instructions_shown_timestamp) {
    stats.instructionsInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.attention_check_completed_timestamp) {
    stats.attentionCheckCompleted[CSVData.treatment_id - 1]++;
  } else if (CSVData.attention_check_shown_timestamp) {
    stats.attentionCheckInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_timestamp_8) {
    stats.choicesComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.shown_timestamp_1) {
    stats.choicesInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_1 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_2 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_3 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_4 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_5 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_6 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_7 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.choice_8 === "laterAmount") {
    stats.laterChoice[CSVData.treatment_id - 1]++;
  }
  if (CSVData.experience_survey_questions_completed_timestamp) {
    stats.experienceComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.experience_survey_questions_shown_timestamp) {
    stats.experienceInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.financial_lit_survey_questions_completed_timestamp) {
    stats.financialComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.financial_lit_survey_questions_shown_timestamp) {
    stats.financialInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.purpose_survey_questions_completed_timestamp) {
    stats.purposeComplete[CSVData.treatment_id - 1]++;
    stats.surveysComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.purpose_survey_questions_shown_timestamp) {
    stats.purposeInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.debrief_completed_timestamp) {
    stats.debriefComplete[CSVData.treatment_id - 1]++;
  } else if (CSVData.debrief_shown_timestamp) {
    stats.debriefInProgress[CSVData.treatment_id - 1]++;
  }
  if (CSVData.feedback) {
    stats.feedback.push({
      treatmentId: CSVData.treatment_id,
      date: CSVData.debrief_completed_timestamp,
      feedback: CSVData.feedback,
    });
  }
  return stats;
};

export const clearStats = () => {
  stats.surveysComplete.fill(0);
  stats.surveysInProgress.fill(0);
  stats.countryUSA = 0;
  stats.countryOther = 0;
  stats.laterChoice.fill(0);
  stats.consentInProgress.fill(0);
  stats.consentComplete.fill(0);
  stats.demographicsInProgress.fill(0);
  stats.demographicsComplete.fill(0);
  stats.introductionInProgress.fill(0);
  stats.introductionComplete.fill(0);
  stats.instructionsInProgress.fill(0);
  stats.instructionsComplete.fill(0);
  stats.choicesInProgress.fill(0);
  stats.choicesComplete.fill(0);
  stats.attentionCheckCompleted.fill(0);
  stats.attentionCheckInProgress.fill(0);
  stats.experienceInProgress.fill(0);
  stats.experienceComplete.fill(0);
  stats.financialInProgress.fill(0);
  stats.financialComplete.fill(0);
  stats.purposeInProgress.fill(0);
  stats.purposeComplete.fill(0);
  stats.debriefInProgress.fill(0);
  stats.debriefComplete.fill(0);
  stats.feedback.length = 0;
  return stats;
};
