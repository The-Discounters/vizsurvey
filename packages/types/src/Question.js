//TODO Rename this since it conflicts with Question.js in app/src/features (which should probably be moved to types).
export const Question = ({
  question_id,
  amount_earlier,
  time_earlier,
  date_earlier,
  amount_later,
  time_later,
  date_later,
  max_amount,
  max_time,
  question_comment,
}) =>
  Object.freeze({
    question_id,
    amount_earlier,
    time_earlier,
    date_earlier,
    amount_later,
    time_later,
    date_later,
    max_amount,
    max_time,
    question_comment,
  });
