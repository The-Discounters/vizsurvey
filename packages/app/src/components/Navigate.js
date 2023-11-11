import { StatusType } from "../features/StatusType.js";

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
    case StatusType.MCLInstructions:
      return "/mclinstructions";
    case StatusType.Instructions:
      return "/instruction";
    case StatusType.Survey:
      return "/survey";
    case StatusType.Attention:
      return "/attentioncheck";
    case StatusType.ExperienceQuestionaire:
      return "/experiencequestionaire";
    case StatusType.FinancialQuestionaire:
      return "/financialquestionaire";
    case StatusType.PurposeAwareQuestionaire:
      return "/purposeawarequestionaire";
    case StatusType.PurposeWorthQuestionaire:
      return "/purposeworthquestionaire";
    case StatusType.Debrief:
      return "/debrief";
    case StatusType.Finished:
      return null;
    case StatusType.Error:
      return "/invalidlink";
    default:
      return "/invalidlink";
  }
};
