import { StatusType } from "@the-discounters/types";

export const navigateFromStatus = (status) => {
  switch (status) {
    case StatusType.Unitialized:
      return "/invalidlink";
    case StatusType.Fetching:
      return "/invalidlink";
    case StatusType.Consent:
      return "/consent";
    case StatusType.Demographic:
      return "/demographic";
    case StatusType.ChoiceInstructions:
      return "/choiceinstructions";
    case StatusType.Instructions:
      return "/instruction";
    case StatusType.Survey:
      return "/survey";
    case StatusType.ExperienceQuestionaire:
      return "/experiencequestionaire";
    case StatusType.FinancialQuestionaire:
      return "/financialquestionaire";
    case StatusType.Debrief:
      return "/debrief";
    case StatusType.Finished:
      return "/finished";
    case StatusType.Error:
      return "/invalidlink";
    default:
      return "/invalidlink";
  }
};
