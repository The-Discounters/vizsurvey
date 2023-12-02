export const Question = ({
  id,
  exp_id,
  participant_id,
  session_id,
  study_id,
  question_id,
  sequence_id,
  treatment_id,
}) =>
  Object.freeze({
    id,
    exp_id,
    participant_id,
    session_id,
    study_id,
    question_id,
    sequence_id,
    treatment_id,
  });
