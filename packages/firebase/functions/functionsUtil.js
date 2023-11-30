/* Example latin square below.
[
  [1, 2, 3],
  [1, 3, 2],
  [3, 1, 2],
  [3, 2, 1],
  [2, 3, 1],
  [2, 1, 3],
]
*/
export const calcTreatmentIds = (latinSquare, participantCount) => {
  const latinSquareAry = JSON.parse(latinSquare);
  const index = participantCount % latinSquareAry.length;
  return latinSquareAry[index];
};

export const createQuestions = (parentPath, treatmentQuestions) => {
  let result = [...treatmentQuestions];
  result.forEach((e) => (e.path = `${parentPath}/${e.id}`));
  return result;
};

export const orderQuestions = (q, latinSquare) => {
  // order the questions by treatment dicated by the latin square array and sequence number.
};
