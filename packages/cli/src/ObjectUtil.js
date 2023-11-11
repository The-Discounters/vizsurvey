// TODO TOTAL HACK.  I HAD TO COPY THIS FILE FROM VIZSURVEY SOURCE BEACUSE WHEN I ADD type: "module" TO PACKAGE.JSON
// I GET PROBLEMS WITH REACT 17.  CLI NEEDS TO BE MOVED TO ITS OWN PROJECT AND THEN SHARED CODE IMPORTED.
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

export const convertAnswersAryToObj = (answersAry) => {
  const result = answersAry.reduce((acc, current) => {
    // eslint-disable-next-line no-undef
    const answerObj = _.mapKeys(current, (value, key, object) => {
      if (
        key === "participant_id" ||
        key === "participantId" ||
        key === "session_id" ||
        key === "sessionId" ||
        key === "treatment_id" ||
        key === "treatmentId" ||
        key === "study_id" ||
        key === "studyId"
      ) {
        return key;
      } else {
        return `${key}_${object.position}`;
      }
    });
    return {
      ...acc,
      ...answerObj,
    };
  }, {});
  return result;
};

export const setAllPropertiesEmpty = (obj) => {
  return _.mapValues(obj, function () {
    return "";
  });
};
