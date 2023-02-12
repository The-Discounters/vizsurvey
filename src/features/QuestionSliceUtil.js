export const participantUniqueKey = (dataObj) => {
  return `${dataObj.participantId}`;
};

export const stateUniqueKey = (dataObj) => {
  return dataObj.studyId;
};

export const CSVDataFilename = (dataObj) => {
  return CSVDataFilenameFromKey(`${participantUniqueKey(dataObj)}`);
};

export const CSVDataFilenameFromKey = (uniqueKey) => {
  return `data-${uniqueKey}.csv`;
};

export const stateFormatFilename = (dataObj) => {
  return `state-format-${stateUniqueKey(dataObj)}.json`;
};
