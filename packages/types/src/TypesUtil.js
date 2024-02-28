export const participantUniqueKey = (dataObj) => {
  return `${dataObj.participantId}`;
};

export const stateUniqueKey = (dataObj) => {
  return `${dataObj.participantId}-${dataObj.sessionId}-${dataObj.studyId}`;
};

export const CSVDataFilename = (dataObj) => {
  return CSVDataFilenameFromKey(`${participantUniqueKey(dataObj)}`);
};

export const CSVDataFilenameFromKey = (uniqueKey) => {
  return `data-${uniqueKey}.csv`;
};

export const stateFilename = (dataObj) => {
  return `state-${stateUniqueKey(dataObj)}.json`;
};

export const stateFormatFilename = (dataObj) => {
  return `state-format-${stateUniqueKey(dataObj)}.json`;
};

export const injectKey = (key, data) => {
  return { ...key, ...data };
};
