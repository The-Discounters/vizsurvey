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
    case StatusType.Introduction:
      return "/introduction";
    case StatusType.Instructions:
      return "/instruction";
    case StatusType.Survey:
      if (process.env.REACT_APP_FULLSCREEN === "enabled")
        document.body.requestFullscreen();
      return "/survey";
    case StatusType.Attention:
      return "/attentioncheck";
    case StatusType.ExperienceQuestionaire:
      if (process.env.REACT_APP_FULLSCREEN === "enabled")
        document.exitFullscreen();
      return "/experiencequestionaire";
    case StatusType.FinancialQuestionaire:
      return "/financialquestionaire";
    case StatusType.PurposeQuestionaire:
      return "/purposequestionaire";
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
