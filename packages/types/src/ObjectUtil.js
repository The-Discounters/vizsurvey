import _ from "lodash";
import { SurveyQuestion } from "./SurveyQuestion.js";

export const convertKeysCamelCaseToUnderscore = (obj) => {
  return _.mapKeys(obj, function (value, key) {
    return [...key].reduce((accu, x) => {
      const result =
        x >= "A" && x <= "Z" ? accu + "_" + x.toLowerCase() : accu + x;
      return result;
    }, "");
  });
};

export const convertKeysUnderscoreToCamelCase = (obj) => {
  return _.mapKeys(obj, function (value, key) {
    return _.camelCase(_.replace(key, "_", " "));
  });
};

export const setAllPropertiesEmpty = (obj) => {
  return _.mapValues(obj, function () {
    return "";
  });
};

export const setUndefinedPropertiesNull = (obj) => {
  return _.mapValues(obj, (value) => (value == undefined ? null : value));
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
        return `${key}_${object.treatmentId}_${object.sequenceId}`;
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

export const injectSurveyQuestionFields = (questions) => {
  const result = questions.map((v) => SurveyQuestion({ ...v }));
  return result;
};
