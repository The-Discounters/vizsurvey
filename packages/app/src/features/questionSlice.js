import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SystemZone } from "luxon";
import { secondsBetween } from "@the-discounters/util";
import { QuestionEngine } from "./QuestionEngine.js";
import { StatusType } from "@the-discounters/types";
import { initFirestore, signupParticipant } from "./serviceAPI.js";
import packageFile from "../../package.json";

const qe = new QuestionEngine();

export const initializeSurvey = createAsyncThunk(
  "questions/initialize",
  async (parameters, thunkAPI) => {
    const result = { ...parameters };
    try {
      initFirestore({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
      });
      const data = await signupParticipant(
        process.env.REACT_APP_FIREBASE_SERVER_URL,
        parameters.participantId,
        parameters.studyId,
        parameters.sessionId,
        parameters.userAgent,
        parameters.treatmentIds
      );
      result.questions = data.survey;
      result.instruction = data.instruction;
      result.experiment = data.experiment;
      return result;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        status: err.reason ? err.reason : null,
        message: err.message,
      });
    }
  }
);

const initialState = {
  appVersion: packageFile.version,
  participantId: null,
  serverSequenceId: null,
  sessionId: null,
  studyId: null,
  experienceSurvey: {},
  financialLitSurvey: {},
  countryOfResidence: "",
  vizFamiliarity: "",
  age: "",
  gender: "",
  selfDescribeGender: "",
  profession: "",
  employment: "",
  selfDescribeEmployment: "",
  householdIncome: "",
  selfDescribeHouseholdIncome: "",
  educationLevel: "",
  selfDescribeEducationLevel: "",
  consentChecked: null,
  timezone: null,
  timestamps: {
    consentShownTimestamp: null,
    consentCompletedTimestamp: null,
    consentTimeSec: null,
    demographicShownTimestamp: null,
    demographicCompletedTimestamp: null,
    demographicTimeSec: null,
    choiceInstructionShownTimestamp: null,
    choiceInstructionCompletedTimestamp: null,
    choiceInstructionTimeSec: null,
    instructionsShownTimestamp: null,
    instructionsCompletedTimestamp: null,
    instructionsTimeSec: null,
    breakShownTimestamp: [],
    breakCompletedTimestamp: [],
    breakTimeSec: [],
    experienceSurveyQuestionsShownTimestamp: null,
    experienceSurveyQuestionsCompletedTimestamp: null,
    experienceSurveyTimeSec: null,
    financialLitSurveyQuestionsShownTimestamp: null,
    financialLitSurveyQuestionsCompletedTimestamp: null,
    financialLitSurveyTimeSec: null,
    debriefShownTimestamp: null,
    debriefCompletedTimestamp: null,
    debriefTimeSec: null,
    finishedShownTimestamp: null,
  },
  feedback: "",
  instructionTreatment: [],
  questions: [],
  experiment: null,
  currentAnswerIdx: 0,
  status: StatusType.Unitialized,
  error: null,
  userAgent: null,
};

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: initialState, // the initial state of our global data (under name slice)
  reducers: {
    consentShown(state, action) {
      state.timestamps.consentShownTimestamp = action.payload;
    },
    consentCompleted(state, action) {
      //TODO we should refactor all these timestamp set methods into QuestionEngine.
      //One reason is we won't be calling nexStatus from the slice and in QuestionEngine (we call it in at lesat two methods there)
      state.consentChecked = true;
      state.timestamps.consentCompletedTimestamp = action.payload;
      state.timestamps.consentTimeSec = secondsBetween(
        state.timestamps.consentShownTimestamp,
        state.timestamps.consentCompletedTimestamp
      );
      state.timezone = SystemZone.instance.name;
      state.status = qe.nextState(state);
    },
    instructionsShown(state, action) {
      state.timestamps.instructionsShownTimestamp = action.payload;
    },
    instructionsCompleted(state, action) {
      state.timestamps.instructionsCompletedTimestamp = action.payload;
      state.timestamps.instructionsTimeSec = secondsBetween(
        state.timestamps.instructionsShownTimestamp,
        state.timestamps.instructionsCompletedTimestamp
      );
      state.status = qe.nextState(state);
    },
    MCLInstructionsShown(state, action) {
      state.timestamps.choiceInstructionShownTimestamp = action.payload;
    },
    MCLInstructionsCompleted(state, action) {
      state.timestamps.choiceInstructionCompletedTimestamp = action.payload;
      state.timestamps.choiceInstructionTimeSec = secondsBetween(
        state.timestamps.choiceInstructionShownTimestamp,
        state.timestamps.choiceInstructionCompletedTimestamp
      );
      state.status = qe.nextState(state);
    },
    breakShown(state, action) {
      state.timestamps.breakShownTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload,
      });
    },
    breakCompleted(state, action) {
      state.timestamps.breakCompletedTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload,
      });
      const shownTimestamp = state.timestamps.breakShownTimestamp.find(
        (cv) => cv.treatmentId === qe.currentAnswer(state).treatmentId
      ).value;
      state.timestamps.breakTimeSec.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: secondsBetween(shownTimestamp, action.payload),
      });
      state.status = qe.nextState(state);
    },
    experienceSurveyQuestionsShown(state, action) {
      state.timestamps.experienceSurveyQuestionsShownTimestamp = action.payload;
    },
    experienceSurveyQuestionsCompleted(state, action) {
      state.timestamps.experienceSurveyQuestionsCompletedTimestamp =
        action.payload;
      state.timestamps.experienceSurveyTimeSec = secondsBetween(
        state.timestamps.experienceSurveyQuestionsShownTimestamp,
        state.timestamps.experienceSurveyQuestionsCompletedTimestamp
      );
      state.status = qe.nextState(state);
    },
    initExperienceSurveyQuestion(state, action) {
      state.experienceSurvey = action.payload;
    },
    setExperienceSurveyQuestion(state, action) {
      state.experienceSurvey[action.payload.key] = action.payload.value;
    },
    financialLitSurveyQuestionsShown(state, action) {
      state.timestamps.financialLitSurveyQuestionsShownTimestamp =
        action.payload;
    },
    financialLitSurveyQuestionsCompleted(state, action) {
      state.timestamps.financialLitSurveyQuestionsCompletedTimestamp =
        action.payload;
      state.timestamps.financialLitSurveyTimeSec = secondsBetween(
        state.timestamps.financialLitSurveyQuestionsShownTimestamp,
        state.timestamps.financialLitSurveyQuestionsCompletedTimestamp
      );
      state.status = qe.nextState(state);
    },
    initFinancialLitSurveyQuestion(state, action) {
      state.financialLitSurvey = action.payload;
    },
    setFinancialLitSurveyQuestion(state, action) {
      state.financialLitSurvey[action.payload.key] = action.payload.value;
    },
    demographicShown(state, action) {
      state.timestamps.demographicShownTimestamp = action.payload;
    },
    demographicCompleted(state, action) {
      state.timestamps.demographicCompletedTimestamp = action.payload;
      state.timestamps.demographicTimeSec = secondsBetween(
        state.timestamps.demographicShownTimestamp,
        state.timestamps.demographicCompletedTimestamp
      );
      state.status = qe.nextState(state);
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
    setEmployment(state, action) {
      state.employment = action.payload;
    },
    setSelfDescribeEmployment(state, action) {
      state.selfDescribeEmployment = action.payload;
    },
    setHouseholdIncome(state, action) {
      state.householdIncome = action.payload;
    },
    setSelfDescribeHouseholdIncome(state, action) {
      state.selfDescribeHouseholdIncome = action.payload;
    },
    setEducationLevel(state, action) {
      state.educationLevel = action.payload;
    },
    setSelfDescribeEducationLevel(state, action) {
      state.selfDescribeEducationLevel = action.payload;
    },
    setFeedback(state, action) {
      state.feedback = action.payload;
    },
    setQuestionShownTimestamp(state, action) {
      qe.setCurrentAnswerShown(state, action.payload);
      return state;
    },
    answer(state, action) {
      qe.answerCurrentQuestion(state, action.payload);
    },
    // we define our actions on the slice of global store data here.
    nextQuestion(state) {
      qe.incNextQuestion(state);
    },
    debriefShownTimestamp(state, action) {
      state.timestamps.debriefShownTimestamp = action.payload;
    },
    debriefCompleted(state, action) {
      state.timestamps.debriefCompletedTimestamp = action.payload;
      state.timestamps.debriefTimeSec = secondsBetween(
        state.timestamps.debriefShownTimestamp,
        state.timestamps.debriefCompletedTimestamp
      );
      state.status = qe.nextState(state);
    },
    finishedShownTimestamp(state, action) {
      state.timestamps.finishedShownTimestamp = action.payload;
    },
    clearState(state) {
      state = initialState;
    },
    nextStatus(state) {
      state.status = qe.nextState(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(initializeSurvey.pending, (state) => {
        state.status = StatusType.Fetching;
      })
      .addCase(initializeSurvey.fulfilled, (state, action) => {
        state.participantId = action.payload.participantId;
        state.sessionId = action.payload.sessionId;
        state.studyId = action.payload.studyId;
        state.userAgent = action.payload.userAgent;
        state.serverSequenceId = action.payload.serverSequenceId;
        state.questions = action.payload.questions;
        state.instructionTreatment = action.payload.instruction;
        state.experiment = action.payload.experiment;

        state.status = qe.nextState(state);
      })
      .addCase(initializeSurvey.rejected, (state, action) => {
        state.error = action.payload.status;
        state.status = StatusType.Error;
      });
  },
});

export const getParticipant = (state) => state.questions.participantId;

export const getState = (state) => state;

export const getCountryOfResidence = (state) =>
  state.questions.countryOfResidence;

export const getVizFamiliarity = (state) => state.questions.vizFamiliarity;

export const getAge = (state) => state.questions.age;

export const getFeedback = (state) => state.questions.feedback;

export const getGender = (state) => state.questions.gender;

export const getSelfDescribeGender = (state) =>
  state.questions.selfDescribeGender;

export const getProfession = (state) => state.questions.profession;

export const getEmployment = (state) => state.questions.employment;

export const getSelfDescribeEmployment = (state) =>
  state.questions.selfDescribeEmployment;

export const getHouseholdIncome = (state) => state.questions.householdIncome;

export const getSelfDescribeHouseholdIncome = (state) =>
  state.questions.selfDescribeHouseholdIncome;

export const getEducationLevel = (state) => state.questions.educationLevel;

export const getSelfDescribeEducationLevel = (state) =>
  state.questions.selfDescribeEducationLevel;

export const getExperienceSurveyQuestion = (questionId) => (state) =>
  state.questions.experienceSurvey[questionId];

export const getFinancialLitSurveyQuestion = (questionId) => (state) =>
  state.questions.financialLitSurvey[questionId];

export const getFinancialLitSurveyAnswers = (state) =>
  state.questions.financialLitSurvey;

export const getExperienceSurveyAnswers = (state) =>
  state.questions.experienceSurvey;

export const getCurrentQuestionIndex = (state) =>
  state.questions.currentAnswerIdx;

export const getInstructionTreatment = (state) =>
  qe.currentInstructions(state.questions);

export const getCurrentQuestion = (state) => qe.currentAnswer(state.questions);

export const getCurrentChoice = (state) =>
  qe.currentAnswer(state.questions).choice;

export const getCurrentDragAmount = (state) =>
  qe.currentAnswer(state.questions).dragAmount;

export const getStatus = (state) => state.questions.status;

export const getStudyId = (state) => state.questions.studyId;

export const getConsentChecked = (state) => state.questions.consentChecked;

export const getExperiment = (state) => state.questions.experiment;

export const getRemainingTreatmentCount = (state) => {
  return qe.remainingTreatmentCount(state.questions);
};

export const getCompletedTreatmentCount = (state) => {
  return qe.completedTreatmentCount(state.questions);
};

// Action creators are generated for each case reducer function
export const {
  setQuestionShownTimestamp,
  answer,
  previousQuestion,
  nextQuestion,
  consentShown,
  consentCompleted,
  demographicShown,
  demographicCompleted,
  setCountryOfResidence,
  setVizFamiliarity,
  setAge,
  setGender,
  setSelfDescribeGender,
  setProfession,
  setEmployment,
  setSelfDescribeEmployment,
  setHouseholdIncome,
  setSelfDescribeHouseholdIncome,
  setEducationLevel,
  setSelfDescribeEducationLevel,
  initExperienceSurveyQuestion,
  setExperienceSurveyQuestion,
  initFinancialLitSurveyQuestion,
  setFinancialLitSurveyQuestion,
  setSurveyQuestion,
  instructionsShown,
  setFeedback,
  instructionsCompleted,
  MCLInstructionsShown,
  MCLInstructionsCompleted,
  breakShown,
  breakCompleted,
  experienceSurveyQuestionsShown,
  experienceSurveyQuestionsCompleted,
  financialLitSurveyQuestionsShown,
  financialLitSurveyQuestionsCompleted,
  debriefShownTimestamp,
  debriefCompleted,
  finishedShownTimestamp,
  clearState,
  nextStatus,
  setUserAgent,
  setWindowAttributes,
} = questionSlice.actions;

export default questionSlice.reducer;
