import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setTreatmentId,
  setSessionId,
  setParticipantId,
} from "../features/questionSlice";

export function QueryParam() {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const searchParam = new URLSearchParams(search);
  const treatmentId = searchParam.get("treatment_id");
  dispatch(setTreatmentId(treatmentId));
  const sessionId = searchParam.get("session_id");
  dispatch(setSessionId(sessionId));
  const participantId = searchParam.get("participant_id");
  dispatch(setParticipantId(participantId));

  return "";
}

export default QueryParam;
