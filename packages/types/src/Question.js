export const Question = ({
  questionId,
  amountEarlier,
  timeEarlier,
  dateEarlier,
  amountLater,
  timeLater,
  dateLater,
  maxAmount,
  maxTime,
  questionComment,
}) =>
  Object.freeze({
    questionId,
    amountEarlier,
    timeEarlier,
    dateEarlier,
    amountLater,
    timeLater,
    dateLater,
    maxAmount,
    maxTime,
    questionComment,
  });
