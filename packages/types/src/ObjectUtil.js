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

export const flattenArrayToObject = (array, keyFunc, valueFunc) => {
  const result = array.reduce((acc, current) => {
    let obj = _.mapValues(current, (value, key, object) => {
      return valueFunc(key, value, object);
    });
    // eslint-disable-next-line no-undef
    obj = _.mapKeys(current, (value, key, object) => {
      return keyFunc(key, value, object);
    });
    const mappedObj = {
      ...acc,
      ...obj,
    };
    return mappedObj;
  }, {});
  return result;
};

export const injectSurveyQuestionFields = (questions) => {
  const result = questions.map((v) => SurveyQuestion({ ...v }));
  return result;
};

export const removeUndefinedOrNullProperties = (obj) => {
  return _.omitBy(obj, (value) => value === null || value === undefined);
};
