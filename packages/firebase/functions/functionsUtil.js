export const calcTreatmentIds = (latinSquare, numParticipantsCompleted) => {
  const latinSquareAry = JSON.parse(latinSquare);
  const index = numParticipantsCompleted % latinSquareAry.length;
  return latinSquareAry[index];
};


