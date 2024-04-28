export const StatusType = {
  Unitialized: "unitialized",
  Fetching: "fetching",
  Consent: "consent",
  Instructions: "instruction",
  MELQuestionInstructions: "melquestioninstructions",
  Survey: "survey",
  Attention: "attention",
  ExperienceQuestionaire: "experiencequestionaire",
  FinancialQuestionaire: "financialquestionaire",
  Demographic: "demographic",
  Debrief: "debrief",
  Finished: "finished",
  Error: "error",
};

Object.freeze(StatusType);

// TODO: I put this function in types because I needed to use it in cli.  I really should put it in the app and export it from there since it's app specific.
export const nextStatus = (status, onLastQuestion) => {
  switch (status) {
    case StatusType.Unitialized:
      return StatusType.Fetching;
    case StatusType.Fetching:
      return StatusType.Consent;
    case StatusType.Consent:
      return StatusType.Instructions;
    case StatusType.Instructions:
      return StatusType.MELQuestionInstructions;
    case StatusType.MELQuestionInstructions:
      return StatusType.Survey;
    case StatusType.Survey:
      if (onLastQuestion) {
        return StatusType.ExperienceQuestionaire;
      } else {
        return StatusType.Survey;
      }
    case StatusType.ExperienceQuestionaire:
      return StatusType.FinancialQuestionaire;
    case StatusType.FinancialQuestionaire:
      return StatusType.Demographic;
    case StatusType.Demographic:
      return StatusType.Debrief;
    case StatusType.Debrief:
      return StatusType.Finished;
    case StatusType.Error:
      return StatusType.Error;
    default:
      return null;
  }
};
