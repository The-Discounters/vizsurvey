// TODO move this into a utility class for manimulating objects.
import _ from "lodash";

export const convertKeysToUnderscore = (obj) => {
  return _.mapKeys(obj, function (value, key) {
    return [...key].reduce((accu, x) => {
      const result =
        x >= "A" && x <= "Z" ? accu + "_" + x.toLowerCase() : accu + x;
      return result;
    }, "");
  });
};

export const setAllPropertiesEmpty = (obj) => {
  return _.mapValues(obj, function () {
    return "";
  });
};

export const convertAnswersAryToObj = (answersAry) => {
  const result = answersAry.reduce((acc, current) => {
    // eslint-disable-next-line no-undef
    const answerObj = _.mapKeys(current, (value, key, object) => {
      if (
        key === "participant_id" ||
        key === "participantId" ||
        key === "session_id" ||
        key === "sessionId" ||
        key === "study_id" ||
        key === "studyId"
      ) {
        return key;
      } else {
        return `${key}_${object.treatmentId}_${object.position}`;
      }
    });
    const mappedObj = {
      ...acc,
      ...answerObj,
    };
    return mappedObj;
  }, {});
  return result;
};
