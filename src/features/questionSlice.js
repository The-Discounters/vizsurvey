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

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: {
    allTreatments: null,
    treatmentId: null,
    participantId: null,
    sessionId: null,
    countryOfResidence: null,
    firstLanguage: null,
    secondLanguage: null,
    vizFamiliarity: null,
    age: null,
    gender: null,
    profession: null,
    consentShownTimestamp: null,
    introductionShowTimestamp: null,
    introductionCompletedTimestamp: null,
    instructionsShowTimestamp: null,
    instructionsCompletedTimestamp: null,
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
      state.firstLanguage = action.payload.firstLanguage;
      state.secondLanguage = action.payload.secondLanguage;
      state.vizFamiliarity = action.payload.vizFamiliarity;
      state.age = action.payload.age;
      state.gender = action.payload.gender;
      state.profession = action.payload.profession;
      state.status = StatusType.Introduction;
    },
    loadTreatment(state) {
      state.treatments = io.loadTreatment(state.treatmentId);
      state.status = StatusType.Fetched;
      return state;
    },
    loadAllTreatments(state) {
      state.allTreatments = io.loadAllTreatments();
      state.status = StatusType.Fetched;
      return state;
    },
    consentShown(state, action) {
      state.consentShownTimestamp = action.payload;
    },
    introductionShown(state, action) {
      state.introductionShowTimestamp = action.payload;
    },
    introductionCompleted(state, action) {
      state.introductionCompletedTimestamp = action.payload;
    },
    instructionsShown(state, action) {
      state.instructionsShowTimestamp = action.payload;
    },
    instructionsCompleted(state, action) {
      state.intructionsCompletedTimestamp = action.payload;
      state.status = StatusType.Survey;
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
    clearState(state) {
      state.allTreatments = null;
      state.treatmentId = null;
      state.articipantId = null;
      state.sessionId = null;
      state.countryOfResidence = null;
      state.firstLanguage = null;
      state.secondLanguage = null;
      state.vizFamiliarity = null;
      state.age = null;
      state.gender = null;
      state.profession = null;
      state.consentShownTimestamp = null;
      state.introductionShowTimestamp = null;
      state.introductionCompletedTimestamp = null;
      state.instructionsShowTimestamp = null;
      state.instructionsCompletedTimestamp = null;
      state.treatments = [];
      state.answers = [];
      state.currentQuestionIdx = 0;
      state.highup = undefined;
      state.lowdown = undefined;
      state.status = StatusType.Unitialized;
      state.error = null;
    },
  },
});

export const selectAllQuestions = (state) => {
  return qe.allQuestions(state.questions);
};

export const fetchCurrentTreatment = (state) => {
  const result = qe.currentTreatment(state.questions);
  return result;
};

export const fetchAllTreatments = (state) => {
  return state.questions.allTreatments;
};

export const selectCurrentQuestion = (state) => {
  return qe.latestAnswer(state.questions);
};

export const fetchStatus = (state) => {
  return state.questions.status;
};

export const fetchTreatmentId = (state) => {
  return state.questions.treatmentId;
};

export const fetchParticipantId = (state) => {
  return state.questions.participantId;
};

export const fetchSessionId = (state) => {
  return state.questions.sessionId;
};

// Action creators are generated for each case reducer function
export const {
  loadTreatment,
  loadAllTreatments,
  startSurvey,
  setQuestionShownTimestamp,
  answer,
  setParticipantId,
  setTreatmentId,
  setSessionId,
  consentShown,
  setDemographic,
  instructionsShown,
  instructionsCompleted,
  introductionShown,
  introductionCompleted,
  clearState,
} = questionSlice.actions;

export default questionSlice.reducer;
