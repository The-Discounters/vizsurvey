export const StatusType = {
  Unitialized: "unitialized",
  Fetching: "fetching",
  Consent: "consent",
  Instructions: "instruction",
  ChoiceInstructions: "choieinstructions",
  Survey: "survey",
  Attention: "attention",
  ExperienceQuestionaire: "experiencequestionaire",
  FinancialQuestionaire: "financialquestionaire",
  PurposeAwareQuestionaire: "purposeawarequestionaire",
  PurposeWorthQuestionaire: "purposeworthquestionaire",
  Demographic: "demographic",
  Debrief: "debrief",
  Finished: "finished",
  Error: "error",
};

Object.freeze(StatusType);

export const isBeforeStatus = (status) => {};
