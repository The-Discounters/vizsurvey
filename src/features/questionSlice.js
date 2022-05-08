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
    treatments: [],
    answers: [],
    currentQuestionIdx: 0,
    highup: undefined,
    lowdown: undefined,
    status: StatusType.Unitialized,
    error: null,
  }, // the initial state of our global data (under name slice)
  reducers: {
    setParticipant(state, action) {
      state.participantId = action.payload;
      return state;
    },
    setTreatmentId(state, action) {
      state.treatmentId = action.payload;
      return state;
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

// Action creators are generated for each case reducer function
export const {
  loadTreatment,
  loadAllTreatments,
  startSurvey,
  setQuestionShownTimestamp,
  answer,
  setParticipant,
  setTreatmentId,
} = questionSlice.actions;

export default questionSlice.reducer;
