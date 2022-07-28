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
    postsurvey: null,
    countryOfResidence: null,
    firstLanguage: null,
    secondLanguage: null,
    vizFamiliarity: null,
    age: null,
    gender: null,
    selfDescribeGender: null,
    profession: null,
    attentioncheck: null,
    consentShownTimestamp: null,
    introductionShowTimestamp: null,
    introductionCompletedTimestamp: null,
    instructionsShownTimestamp: null,
    instructionsCompletedTimestamp: null,
    postSurveyQuestionsShownTimestamp: null,
    debriefShownTimestamp: null,
    debriefCompleted: null,
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
      state.countryOfResidence = action.payload.country;
      state.vizFamiliarity = action.payload.vizFamiliarity;
      state.age = action.payload.age;
      state.gender = action.payload.gender;
      state.selfDescribeGender = action.payload.selfDescribeGender;
      state.profession = action.payload.profession;
      state.status = StatusType.Introduction;
    },
    setPostSurvey(state, action) {
      state.postsurvey = action.payload;
    },
    setAttentionCheck(state, action) {
      console.log("here " + action.payload);
      state.attentioncheck = action.payload;
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
    consentCompleted(state, action) {
      state.consentCompletedTimestamp = action.payload;
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
    postSurveyQuestionsShown(state, action) {
      state.postSurveyQuestionsShownTimestamp = action.payload;
    },
    debriefShownTimestamp(state, action) {
      state.debriefShownTimestamp = action.payload;
    },
    debriefCompleted(state, action) {
      state.debriefCompleted = action.payload;
    },
    theEndShownTimestamp(state, action) {
      state.theEndShownTimestamp = action.payload;
    },
    clearState(state) {
      state.allTreatments = null;
      state.treatmentId = null;
      state.articipantId = null;
      state.sessionId = null;
      state.postsurvey = null;
      state.countryOfResidence = null;
      state.attentioncheck = null;
      state.vizFamiliarity = null;
      state.age = null;
      state.gender = null;
      state.selfDescribeGender = null;
      state.profession = null;
      state.consentShownTimestamp = null;
      state.consentCompletedTimestamp = null;
      state.introductionShowTimestamp = null;
      state.introductionCompletedTimestamp = null;
      state.instructionsShownTimestamp = null;
      state.instructionsCompletedTimestamp = null;
      state.postSurveyQuestionsShownTimestamp = null;
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
  },
});

export const isLastTreatment = (state) => {
  return qe.isLastTreatment(state.questions);
};

export const isMiddleTreatment = (state) => {
  return qe.isMiddleTreatment(state.questions);
};

export const selectAllQuestions = (state) => {
  return qe.allQuestions(state.questions);
};

export const getParticipant = (state) => {
  return state.questions.participantId;
};

export const getDemographics = (state) => {
  return {
    countryOfResidence: state.questions.countryOfResidence,
    vizFamiliarity: state.questions.vizFamiliarity,
    age: state.questions.age,
    gender: state.questions.gender,
    selfDescribeGender: state.questions.selfDescribeGender,
    profession: state.questions.profession,
  };
};

export const getPostSurvey = (state) => {
  return state.questions.postsurvey;
};

export const getAttentionCheck = (state) => {
  console.log("here2 " + state.questions.attentioncheck);
  return state.questions.attentioncheck;
};

export const getTimestamps = (state) => {
  return {
    consentShownTimestamp: state.questions.consentShownTimestamp,
    introductionShowTimestamp: state.questions.introductionShowTimestamp,
    introductionCompletedTimestamp:
      state.questions.introductionCompletedTimestamp,
    instructionsShownTimestamp: state.questions.instructionsShownTimestamp,
    instructionsCompletedTimestamp:
      state.questions.instructionsCompletedTimestamp,
    postSurveyQuestionsShownTimestamp:
      state.questions.postSurveyQuestionsShownTimestamp,
    debriefShownTimestamp: state.questions.debriefShownTimestamp,
    debriefCompleted: state.questions.debriefCompleted,
    theEndShownTimestamp: state.questions.theEndShownTimestamp,
  };
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
  consentCompleted,
  setDemographic,
  setPostSurvey,
  setAttentionCheck,
  instructionsShown,
  instructionsCompleted,
  introductionShown,
  introductionCompleted,
  postSurveyQuestionsShown,
  debriefShownTimestamp,
  debriefCompleted,
  theEndShownTimestamp,
  clearState,
  genRandomTreatment,
} = questionSlice.actions;

export default questionSlice.reducer;
