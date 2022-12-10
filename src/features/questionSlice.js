import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FileIOAdapter } from "./FileIOAdapter";
import { QuestionEngine } from "./QuestionEngine";
import { StatusType } from "./StatusType";

// Define the initial state of the store for this slicer.
const qe = new QuestionEngine();
const io = new FileIOAdapter();

export const writeAnswers = createAsyncThunk(
  "survey/writeAnswers",
  io.writeAnswers
);

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: {
    allTreatments: null,
    treatmentId: null,
    participantId: null,
    sessionId: null,
    financialLitSurvey: {},
    purposeSurvey: {},
    countryOfResidence: "",
    vizFamiliarity: "",
    age: "",
    gender: "",
    selfDescribeGender: "",
    profession: "",
    attentioncheck: null,
    consentShownTimestamp: null,
    introductionShowTimestamp: null,
    introductionCompletedTimestamp: null,
    instructionsShownTimestamp: null,
    instructionsCompletedTimestamp: null,
    financialLitSurveyQuestionsShownTimestamp: null,
    purposeSurveyQuestionsShownTimestamp: null,
    debriefShownTimestamp: null,
    debriefCompleted: null,
    feedback: null,
    theEndShownTimestamp: null,
    treatments: [],
    answers: [],
    currentQuestionIdx: 0,
    highup: undefined,
    lowdown: undefined,
    status: StatusType.Unitialized,
    error: null,
  }, // the initial state of our global data (under name slice)
  reducers: {
    setParticipantId(state, action) {
      state.participantId = action.payload;
      return state;
    },
    setTreatmentId(state, action) {
      state.treatmentId = action.payload;
      return state;
    },
    setSessionId(state, action) {
      state.sessionId = action.payload;
      return state;
    },
    setDemographic(state, action) {
      state.countryOfResidence = action.payload.countryOfResidence;
      state.vizFamiliarity = action.payload.vizFamiliarity;
      state.age = action.payload.age;
      state.gender = action.payload.gender;
      state.selfDescribeGender = action.payload.selfDescribeGender;
      state.profession = action.payload.profession;
      state.status = qe.nextStatus(state, false);
    },
    setCountryOfResidence(state, action) {
      state.countryOfResidence = action.payload;
    },
    setVizFamiliarity(state, action) {
      state.vizFamiliarity = action.payload;
    },
    setAge(state, action) {
      state.age = action.payload;
    },
    setGender(state, action) {
      state.gender = action.payload;
    },
    setSelfDescribeGender(state, action) {
      state.selfDescribeGender = action.payload;
    },
    setProfession(state, action) {
      state.profession = action.payload;
    },
    initFinancialLitSurveyQuestion(state, action) {
      if (state.financialLitSurvey[action.payload] == undefined) {
        state.financialLitSurvey[action.payload] = "";
      }
    },
    setFinancialLitSurveyQuestion(state, action) {
      state.financialLitSurvey[action.payload.key] = action.payload.value;
    },
    initPurposeSurveyQuestion(state, action) {
      if (state.purposeSurvey[action.payload] == undefined) {
        state.purposeSurvey[action.payload] = "";
      }
    },
    setPurposeSurveyQuestion(state, action) {
      state.purposeSurvey[action.payload.key] = action.payload.value;
    },
    setAttentionCheck(state, action) {
      state.attentioncheck = action.payload;
      state.status = qe.nextStatus(state, false);
    },
    loadTreatment(state) {
      state.status = StatusType.Fetching;
      state.treatments = io.loadTreatment(state.treatmentId);
      state.status = qe.nextStatus(state, false);
      return state;
    },
    loadAllTreatments(state) {
      state.status = StatusType.Fetching;
      state.allTreatments = io.loadAllTreatments();
      state.status = qe.nextStatus(state, false);
      return state;
    },
    consentShown(state, action) {
      state.consentShownTimestamp = action.payload;
    },
    consentCompleted(state, action) {
      state.consentCompletedTimestamp = action.payload;
      state.status = qe.nextStatus(state, false);
    },
    introductionShown(state, action) {
      state.introductionShowTimestamp = action.payload;
    },
    introductionCompleted(state, action) {
      state.introductionCompletedTimestamp = action.payload;
    },
    instructionsShown(state, action) {
      state.instructionsShownTimestamp = action.payload;
    },
    instructionsCompleted(state, action) {
      state.instructionsCompletedTimestamp = action.payload;
      state.status = qe.nextStatus(state, false);
    },
    startSurvey(state) {
      qe.startSurvey(state);
      return state;
    },
    setQuestionShownTimestamp(state, action) {
      qe.setLatestAnswerShown(state, action);
      return state;
    },
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      qe.answerCurrentQuestion(state, action);
    },
    previousQuestion(state) {
      qe.decPreviousQuestion(state);
    },
    nextQuestion(state) {
      qe.incNextQuestion(state);
    },
    financialLitSurveyQuestionsShown(state, action) {
      state.financialLitSurveyQuestionsShownTimestamp = action.payload;
    },
    purposeSurveyQuestionsShown(state, action) {
      state.purposeSurveyQuestionsShownTimestamp = action.payload;
    },
    debriefShownTimestamp(state, action) {
      state.debriefShownTimestamp = action.payload;
    },
    debriefCompleted(state, action) {
      state.debriefCompleted = action.payload;
      state.status = qe.nextStatus(state, false);
    },
    theEndShownTimestamp(state, action) {
      state.theEndShownTimestamp = action.payload;
    },
    clearState(state) {
      state.allTreatments = null;
      state.treatmentId = null;
      state.articipantId = null;
      state.sessionId = null;
      state.financialLitSurvey = {};
      state.purposeSurvey = {};
      state.countryOfResidence = "";
      state.vizFamiliarity = "";
      state.age = "";
      state.gender = "";
      state.selfDescribeGender = "";
      state.profession = "";
      state.attentioncheck = null;
      state.consentShownTimestamp = null;
      state.consentCompletedTimestamp = null;
      state.introductionShowTimestamp = null;
      state.introductionCompletedTimestamp = null;
      state.instructionsShownTimestamp = null;
      state.instructionsCompletedTimestamp = null;
      state.financialLitSurveyQuestionsShownTimestamp = null;
      state.purposeSurveyQuestionsShownTimestamp = null;
      state.debriefShownTimestamp = null;
      state.treatments = [];
      state.answers = [];
      state.currentQuestionIdx = 0;
      state.highup = undefined;
      state.lowdown = undefined;
      state.status = StatusType.Unitialized;
      state.error = null;
    },
    genRandomTreatment(state) {
      // figure out the min and max treatment id
      const allTreatments = io.loadAllTreatments();
      const min = allTreatments.reduce((pv, cv) => {
        return cv.treatmentId < pv ? cv.treatmentId : pv;
      }, allTreatments[0].treatmentId);
      const max = allTreatments.reduce(
        (pv, cv) => (cv.treatmentId > pv ? cv.treatmentId : pv),
        allTreatments[0].treatmentId
      );
      state.treatmentId = getRandomIntInclusive(min, max);
    },
    nextStatus(state) {
      qe.nextStatus(state);
    },
    previousStatus(state) {
      qe.previousStatus(state);
    },
  },
});

export const isFirstTreatment = (state) => qe.isFirstTreatment(state.questions);

export const isLastTreatment = (state) => qe.isLastTreatment(state.questions);

export const selectAllQuestions = (state) => qe.allQuestions(state.questions);

export const getParticipant = (state) => state.questions.participantId;

export const getCountryOfResidence = (state) =>
  state.questions.countryOfResidence;

export const getVizFamiliarity = (state) => state.questions.vizFamiliarity;

export const getAge = (state) => state.questions.age;

export const getGender = (state) => state.questions.gender;

export const getSelfDescribeGender = (state) =>
  state.questions.selfDescribeGender;

export const getProfession = (state) => state.questions.profession;

export const getFinancialLitSurveyQuestion = (questionId) => (state) => {
  return state.questions.financialLitSurvey[questionId];
};

export const getPurposeSurveyQuestion = (questionId) => (state) => {
  return state.questions.purposeSurvey[questionId];
};

export const getFinancialLitSurvey = (state) =>
  state.questions.getFinancialLitSurvey;

export const getPurposeSurvey = (state) => state.questions.getPurposeSurvey;

export const getAttentionCheck = (state) => state.questions.attentioncheck;

export const getTimestamps = (state) => {
  return {
    consentShownTimestamp: state.questions.consentShownTimestamp,
    introductionShowTimestamp: state.questions.introductionShowTimestamp,
    introductionCompletedTimestamp:
      state.questions.introductionCompletedTimestamp,
    instructionsShownTimestamp: state.questions.instructionsShownTimestamp,
    instructionsCompletedTimestamp:
      state.questions.instructionsCompletedTimestamp,
    financialLitSurveyQuestionsShownTimestamp:
      state.questions.financialLitSurveyQuestionsShownTimestamp,
    purposeSurveyQuestionsShownTimestamp:
      state.questions.purposeSurveyQuestionsShownTimestamp,
    debriefShownTimestamp: state.questions.debriefShownTimestamp,
    debriefCompleted: state.questions.debriefCompleted,
    theEndShownTimestamp: state.questions.theEndShownTimestamp,
  };
};

export const getCurrentQuestionIndex = (state) =>
  state.questions.currentQuestionIdx;

export const fetchCurrentTreatment = (state) =>
  qe.currentTreatment(state.questions);

export const fetchAllTreatments = (state) => state.questions.allTreatments;

export const getCurrentQuestion = (state) => qe.latestAnswer(state.questions);

export const getCurrentChoice = (state) =>
  qe.latestAnswer(state.questions).choice;

export const getStatus = (state) => state.questions.status;

export const fetchTreatmentId = (state) => state.questions.treatmentId;

export const fetchParticipantId = (state) => state.questions.participantId;

export const fetchSessionId = (state) => state.questions.sessionId;

export const getFeedback = (state) => state.questions.feedback;

// Action creators are generated for each case reducer function
export const {
  loadTreatment,
  loadAllTreatments,
  startSurvey,
  setQuestionShownTimestamp,
  answer,
  previousQuestion,
  nextQuestion,
  setParticipantId,
  setTreatmentId,
  setSessionId,
  consentShown,
  consentCompleted,
  setDemographic,
  setCountryOfResidence,
  setVizFamiliarity,
  setAge,
  setGender,
  setSelfDescribeGender,
  setProfession,
  initFinancialLitSurveyQuestion,
  setFinancialLitSurveyQuestion,
  initPurposeSurveyQuestion,
  setPurposeSurveyQuestion,
  setAttentionCheck,
  instructionsShown,
  instructionsCompleted,
  introductionShown,
  introductionCompleted,
  financialLitSurveyQuestionsShown,
  purposeSurveyQuestionsShown,
  debriefShownTimestamp,
  debriefCompleted,
  theEndShownTimestamp,
  clearState,
  genRandomTreatment,
} = questionSlice.actions;

export default questionSlice.reducer;
