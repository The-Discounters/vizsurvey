import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  setTreatmentId,
  setSessionId,
  setParticipantId,
} from "../features/questionSlice";

export function QueryParam() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const treatmentId = searchParams.get("treatment_id");
  dispatch(setTreatmentId(treatmentId));
  const sessionId = searchParams.get("session_id");
  dispatch(setSessionId(sessionId));
  const participantId = searchParams.get("participant_id");
  dispatch(setParticipantId(participantId));

  return "";
}

export default QueryParam;
