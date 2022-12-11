import { StatusType } from "../features/StatusType";

export const navigateFromStatus = (navigate, status) => {
  switch (status) {
    case StatusType.Unitialized:
      navigate("/invalidlink");
      break;
    case StatusType.Fetching:
      break;
    case StatusType.Consent:
      navigate("/consent");
      break;
    case StatusType.Demographic:
      navigate("/demographic");
      break;
    case StatusType.Introduction:
      navigate("/introduction");
      break;
    case StatusType.Instructions:
      navigate("/instruction");
      break;
    case StatusType.Survey:
      navigate("/survey");
      break;
    case StatusType.Attention:
      navigate("/attentioncheck");
      break;
    case StatusType.FinancialQuestionaire:
      navigate("/financialquestionaire");
      break;
    case StatusType.PurposeQuestionaire:
      navigate("/purposequestionaire");
      break;
    case StatusType.Done:
      navigate("/theend");
      break;
    case StatusType.Debrief:
      navigate("/debrief");
      break;
    case StatusType.Finished:
      setTimeout(() => {
        window.open("about:blank", "_self");
        window.close();
      }, 400);
      break;
    case StatusType.Error:
      navigate("/invalidlink");
      break;
    default:
      navigate("/invalidlink");
  }
};
