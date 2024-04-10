import {
  createQuestionNoTitrate,
  create2ndQuestionNoTitrate,
  mockWindowAttributes,
  mockScreenAttributes,
  mockGlobalWindow,
} from "./src/typesTestUtil.js";
import TEST_WITHIN_SURVEY_QUESTIONS from "./testwithinSurveyQuestions.json" assert { type: "json" };
import TEST_BETWEEN_SURVEY_QUESTIONS from "./testbetweenSurveyQuestions.json" assert { type: "json" };
import TEST_BETWEEN_ALL_JSON from "./testbetweenData.json" assert { type: "json" };
import TEST_WITHIN_ALL_JSON from "./testwithinData.json" assert { type: "json" };

export {
  TEST_WITHIN_SURVEY_QUESTIONS,
  TEST_BETWEEN_SURVEY_QUESTIONS,
  TEST_BETWEEN_ALL_JSON,
  TEST_WITHIN_ALL_JSON,
  createQuestionNoTitrate,
  create2ndQuestionNoTitrate,
  mockWindowAttributes,
  mockScreenAttributes,
  mockGlobalWindow,
};
