export const StatusType = {
  Unitialized: "unitialized",
  Fetching: "fetching",
  Consent: "consent",
  Instructions: "instruction",
  ChoiceInstructions: "choiceinstructions",
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

export const nextStatus = (status, onLastQuestion, onLastTreatmentQuestion) => {
  switch (status) {
    case StatusType.Unitialized:
      return StatusType.Fetching;
    case StatusType.Fetching:
      return StatusType.Consent;
    case StatusType.Consent:
      return StatusType.Instructions;
    case StatusType.Instructions:
      return StatusType.ChoiceInstructions;
    case StatusType.ChoiceInstructions:
      return StatusType.Survey;
    case StatusType.Survey:
      if (onLastQuestion) {
        return StatusType.ExperienceQuestionaire;
      } else if (onLastTreatmentQuestion) {
        return StatusType.ChoiceInstructions;
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
