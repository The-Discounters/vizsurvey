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

export const createQuestions = (parentPath, exp) => {
  return [...exp.treatmentQuestions].forEach(
    (e) => (e.path = `${parentPath}/`)
  );
};

export const orderQuestions = (q) => {};
