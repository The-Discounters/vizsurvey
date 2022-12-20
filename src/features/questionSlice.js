import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FileIOAdapter } from "./FileIOAdapter";
import { QuestionEngine } from "./QuestionEngine";
import { StatusType } from "./StatusType";

// Define the initial state of the store for this slicer.
const qe = new QuestionEngine();
const io = new FileIOAdapter();

export const writeAnswers = createAsyncThunk(
  "survey/writeAnswers",
  async (arg, { getState }) => {
    const state = getState();
    const demographic = {
      participantId: state.questions.participantId,
      countryOfResidence: state.questions.countryOfResidence,
      vizFamiliarity: state.questions.vizFamiliarity,
      age: state.questions.age,
      gender: state.questions.gender,
      selfDescribeGender: state.questions.selfDescribeGender,
      profession: state.questions.profession,
    };
    const timestamps = {
      participantId: state.questions.participantId,
      consentShownTimestamp: state.questions.consentShownTimestamp,
      consentCompletedTimestamp: state.questions.consentCompletedTimestamp,
      introductionShowTimestamp: state.questions.introductionShowTimestamp,
      introductionCompletedTimestamp:
        state.questions.introductionCompletedTimestamp,
      instructionsShownTimestamp: state.questions.instructionsShownTimestamp,
      instructionsCompletedTimestamp:
        state.questions.instructionsCompletedTimestamp,
      attentionCheckShownTimestamp:
        state.questions.attentionCheckShownTimestamp,
      attentionCheckCompletedTimestamp:
        state.questions.attentionCheckCompletedTimestamp,
      financialLitSurveyQuestionsShownTimestamp:
        state.questions.financialLitSurveyQuestionsShownTimestamp,
      financialLitSurveyQuestionsCompletedTimestamp:
        state.questions.financialLitSurveyQuestionsCompletedTimestamp,
      purposeSurveyQuestionsShownTimestamp:
        state.questions.purposeSurveyQuestionsShownTimestamp,
      purposeSurveyQuestionsCompletedTimestamp:
        state.questions.purposeSurveyQuestionsCompletedTimestamp,
      theEndShownTimestamp: state.questions.theEndShownTimestamp,
      theEndCompletedTimestamp: state.questions.theEndCompletedTimestamp,
    };
    const legal = {
      participantId: state.questions.participantId,
      consentChecked: state.questions.consentChecked,
      attentionCheck: state.questions.attentioncheck,
    };
    await io.writeAnswers(
      state.questions.participantId,
      state.questions.answers,
      timestamps,
      state.questions.financialLitSurvey,
      state.questions.purposeSurvey,
      demographic,
      legal
    );
  }
);

export const writeFeedback = createAsyncThunk(
  "survey/writeFeedback",
  async (arg, { getState }) => {
    const state = getState();
    const feedback = {
      participantId: state.questions.participantId,
      feedback: state.questions.feedback,
    };

    const timestamps = {
      participantId: state.questions.participantId,
      debriefShownTimestamp: state.questions.debriefShownTimestamp,
      debriefCompletedTimestamp: state.questions.debriefCompletedTimestamp,
    };
    io.writeFeedback(state.questions.participantId, feedback, timestamps);
  }
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
    financialLitSurvey: { participantId: null },
    purposeSurvey: { participantId: null },
    countryOfResidence: "",
    vizFamiliarity: "",
    age: "",
    gender: "",
    selfDescribeGender: "",
    profession: "",
    consentChecked: null,
    consentCompletedTimestamp: false,
    attentioncheck: null,
    attentionCheckShownTimestamp: null,
    attentionCheckCompletedTimestamp: null,
    consentShownTimestamp: null,
    introductionShowTimestamp: null,
    introductionCompletedTimestamp: null,
    instructionsShownTimestamp: null,
    feedback: "",
    instructionsCompletedTimestamp: null,
    financialLitSurveyQuestionsShownTimestamp: null,
    financialLitSurveyQuestionsCompletedTimestamp: null,
    purposeSurveyQuestionsShownTimestamp: null,
    purposeSurveyQuestionsCompletedTimestamp: null,
    debriefShownTimestamp: null,
    debriefCompletedTimestamp: null,
    theEndShownTimestamp: null,
    theEndCompletedTimestamp: null,
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
      state.financialLitSurvey.participantId = action.payload;
      state.purposeSurvey.participantId = action.payload;
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
      state.attentioncheck = action.payload.value;
      state.attentionCheckCompletedTimestamp = action.payload.timestamp;
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
      state.consentChecked = true;
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
    setFeedback(state, action) {
      state.feedback = action.payload;
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
    attentionCheckShown(state, action) {
      state.attentionCheckShownTimestamp = action.payload;
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
    financialLitSurveyQuestionsCompleted(state, action) {
      state.financialLitSurveyQuestionsCompletedTimestamp = action.payload;
    },
    purposeSurveyQuestionsShown(state, action) {
      state.purposeSurveyQuestionsShownTimestamp = action.payload;
    },
    purposeSurveyQuestionsCompleted(state, action) {
      state.purposeSurveyQuestionsCompletedTimestamp = action.payload;
    },
    debriefShownTimestamp(state, action) {
      state.debriefShownTimestamp = action.payload;
    },
    debriefCompleted(state, action) {
      state.debriefCompletedTimestamp = action.payload;
      const feedback = {
        participantId: state.participantId,
        feedback: state.feedback,
      };
      const timestamps = {
        participantId: state.participantId,
        debriefShownTimestamp: state.debriefShownTimestamp,
        debriefCompletedTimestamp: state.debriefCompletedTimestamp,
      };
      io.writeFeedback(state.participantId, feedback, timestamps);
      state.status = qe.nextStatus(state, false);
    },
    theEndShownTimestamp(state, action) {
      state.theEndShownTimestamp = action.payload;
    },
    theEndCompleted(state, action) {
      state.theEndCompletedTimestamp = action.payload;
      const demographic = {
        participantId: state.participantId,
        countryOfResidence: state.countryOfResidence,
        vizFamiliarity: state.vizFamiliarity,
        age: state.age,
        gender: state.gender,
        selfDescribeGender: state.selfDescribeGender,
        profession: state.profession,
      };
      const timestamps = {
        participantId: state.participantId,
        consentShownTimestamp: state.consentShownTimestamp,
        consentCompletedTimestamp: state.consentCompletedTimestamp,
        introductionShowTimestamp: state.introductionShowTimestamp,
        introductionCompletedTimestamp: state.introductionCompletedTimestamp,
        instructionsShownTimestamp: state.instructionsShownTimestamp,
        instructionsCompletedTimestamp: state.instructionsCompletedTimestamp,
        attentionCheckShownTimestamp: state.attentionCheckShownTimestamp,
        attentionCheckCompletedTimestamp:
          state.attentionCheckCompletedTimestamp,
        financialLitSurveyQuestionsShownTimestamp:
          state.financialLitSurveyQuestionsShownTimestamp,
        financialLitSurveyQuestionsCompletedTimestamp:
          state.financialLitSurveyQuestionsCompletedTimestamp,
        purposeSurveyQuestionsShownTimestamp:
          state.purposeSurveyQuestionsShownTimestamp,
        purposeSurveyQuestionsCompletedTimestamp:
          state.purposeSurveyQuestionsCompletedTimestamp,
        theEndShownTimestamp: state.theEndShownTimestamp,
        theEndCompletedTimestamp: state.theEndCompletedTimestamp,
      };
      const legal = {
        participantId: state.participantId,
        consentChecked: state.consentChecked,
        attentionCheck: state.attentioncheck,
      };
      io.writeAnswers(
        state.participantId,
        state.answers,
        timestamps,
        state.financialLitSurvey,
        state.purposeSurvey,
        demographic,
        legal
      );
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
      state.attentionCheckShownTimestamp = null;
      state.attentionCheckCompletedTimestamp = null;
      state.consentShownTimestamp = null;
      state.consentChecked = false;
      state.consentCompletedTimestamp = null;
      state.introductionShowTimestamp = null;
      state.introductionCompletedTimestamp = null;
      state.instructionsShownTimestamp = null;
      state.feedback = "";
      state.instructionsCompletedTimestamp = null;
      state.financialLitSurveyQuestionsShownTimestamp = null;
      state.financialLitSurveyQuestionsCompletedTimestamp = null;
      state.purposeSurveyQuestionsShownTimestamp = null;
      state.purposeSurveyQuestionsCompletedTimestamp = null;
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

export const getConsentChecked = (state) => state.questions.consentChecked;

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
  setFeedback,
  instructionsCompleted,
  introductionShown,
  introductionCompleted,
  attentionCheckShown,
  financialLitSurveyQuestionsShown,
  financialLitSurveyQuestionsCompleted,
  purposeSurveyQuestionsShown,
  debriefShownTimestamp,
  debriefCompleted,
  theEndShownTimestamp,
  theEndCompleted,
  clearState,
  genRandomTreatment,
} = questionSlice.actions;

export default questionSlice.reducer;
