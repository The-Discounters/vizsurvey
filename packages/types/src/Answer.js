export const Answer = ({
  treatmentQuestionId,
  choice,
  shownTimestamp,
  choiceTimestamp,
  choiceTimeSec,
  dragAmount,
}) =>
  Object.freeze({
    treatmentQuestionId,
    choice,
    shownTimestamp,
    choiceTimestamp,
    choiceTimeSec,
    dragAmount,
  });
