import { createSlice } from "@reduxjs/toolkit";
import { FileIOAdapter } from "./FileIOAdapter";
import { QuestionEngine } from "./QuestionEngine";
import { StatusType } from "./StatusType";
import { secondsBetween } from "./ConversionUtil";

const qe = new QuestionEngine();
const io = new FileIOAdapter();

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const writeTimestamps = (state) => {
  io.writeCSV(
    state.participantId,
    state.studyId,
    state.sessionId,
    "timestamps",
    {
      ...{
        participantId: state.participantId,
        sessionId: state.sessionId,
        studyId: state.studyId,
        treatmentId: state.treatmentId,
      },
      ...state.timestamps,
    }
  );
};

// Define the initial state of the store for this slicer.
export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: {
    allTreatments: null,
    treatmentId: null,
    participantId: null,
    sessionId: null,
    studyId: null,
    financialLitSurvey: {
      participantId: null,
      sessionId: null,
      studyId: null,
      treatmentId: null,
    },
    purposeSurvey: {
      participantId: null,
      sessionId: null,
      studyId: null,
      treatmentId: null,
    },
    screenAttributes: {
      // screen properties
      screenAvailHeight: null,
      screenAvailWidth: null,
      screenColorDepth: screen.colorDepth,
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenOrientationAngle: screen.orientation.angle,
      screenOrientationType: screen.orientation.type,
      screenPixelDepth: screen.pixelDepth,
      // window properties
      windowDevicePixelRatio: window.devicePixelRatio,
      windowInnerHeight: null,
      windowInnerWidth: null,
      windowOuterHeight: null,
      windowOuterWidth: null,
      windowScreenLeft: null,
      windowScreenTop: null,
    },
    countryOfResidence: "",
    vizFamiliarity: "",
    age: "",
    gender: "",
    selfDescribeGender: "",
    profession: "",
    consentChecked: null,
    timestamps: {
      consentShownTimestamp: null,
      consentCompletedTimestamp: null,
      consentTimeSec: null,
      demographicShownTimestamp: null,
      demographicCompletedTimestamp: null,
      demographicTimeSec: null,
      introductionShownTimestamp: null,
      introductionCompletedTimestamp: null,
      introductionTimeSec: null,
      instructionsShownTimestamp: null,
      instructionsCompletedTimestamp: null,
      instructionsTimeSec: null,
      attentionCheckShownTimestamp: null,
      attentionCheckCompletedTimestamp: null,
      attentionCheckTimeSec: null,
      experienceSurveyQuestionsShownTimestamp: null,
      experienceSurveyQuestionsCompletedTimestamp: null,
      experienceSurveyTimeSec: null,
      financialLitSurveyQuestionsShownTimestamp: null,
      financialLitSurveyQuestionsCompletedTimestamp: null,
      financialLitSurveyTimeSec: null,
      purposeSurveyQuestionsShownTimestamp: null,
      purposeSurveyQuestionsCompletedTimestamp: null,
      purposeSurveyTimeSec: null,
      debriefShownTimestamp: null,
      debriefCompletedTimestamp: null,
      debriefTimeSec: null,
    },
    attentioncheck: null,
    feedback: "",
    treatments: [],
    instructionTreatment: null,
    answers: [],
    currentQuestionIdx: 0,
    highup: undefined,
    lowdown: undefined,
    status: StatusType.Unitialized,
    error: null,
    userAgen: null,
  }, // the initial state of our global data (under name slice)
  reducers: {
    setUserAgent(state, action) {
      state.userAgent = action.payload;
    },
    setParticipantId(state, action) {
      state.participantId = action.payload;
      state.experienceSurvey.participantId = action.payload;
      state.financialLitSurvey.participantId = action.payload;
      state.purposeSurvey.participantId = action.payload;
      return state;
    },
    setTreatmentId(state, action) {
      state.treatmentId = action.payload;
      state.experienceSurvey.treatmentId = action.payload;
      state.financialLitSurvey.treatmentId = action.payload;
      state.purposeSurvey.treatmentId = action.payload;
      return state;
    },
    setSessionId(state, action) {
      state.sessionId = action.payload;
      state.experienceSurvey.sessionId = action.payload;
      state.financialLitSurvey.sessionId = action.payload;
      state.purposeSurvey.sessionId = action.payload;
      return state;
    },
    setStudyId(state, action) {
      state.studyId = action.payload;
      state.experienceSurvey.studyId = action.payload;
      state.financialLitSurvey.studyId = action.payload;
      state.purposeSurvey.studyId = action.payload;
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
    initExperienceSurveyQuestion(state, action) {
      if (state.experienceSurvey[action.payload] == undefined) {
        state.experienceSurvey[action.payload] = "";
      }
    },
    setExperienceSurveyQuestion(state, action) {
      state.experienceSurvey[action.payload.key] = action.payload.value;
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
      state.timestamps.attentionCheckCompletedTimestamp =
        action.payload.timestamp;
      state.timestamps.attentionCheckTimeSec = secondsBetween(
        state.timestamps.attentionCheckShownTimestamp,
        state.timestamps.attentionCheckCompletedTimestamp
      );
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
    },
    loadTreatment(state) {
      state.status = StatusType.Fetching;
      const { questions, instructions } = io.loadTreatment(state.treatmentId);
      state.treatments = questions;
      state.instructionTreatment = instructions[0];
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
      state.timestamps.consentShownTimestamp = action.payload;
    },
    consentCompleted(state, action) {
      state.consentChecked = true;
      state.timestamps.consentCompletedTimestamp = action.payload;
      state.timestamps.consentTimeSec = secondsBetween(
        state.timestamps.consentShownTimestamp,
        state.timestamps.consentCompletedTimestamp
      );
      io.writeCSV(
        state.participantId,
        state.studyId,
        state.sessionId,
        "legal",
        {
          participantId: state.participantId,
          sessionId: state.sessionId,
          studyId: state.studyId,
          treatmentId: state.treatmentId,
          consentChecked: state.consentChecked,
        }
      );
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
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
      io.writeCSV(
        state.participantId,
        state.studyId,
        state.sessionId,
        "demographic",
        {
          ...{
            participantId: state.participantId,
            sessionId: state.sessionId,
            studyId: state.studyId,
            treatmentId: state.treatmentId,
            countryOfResidence: state.countryOfResidence,
            vizFamiliarity: state.vizFamiliarity,
            age: state.age,
            gender: state.gender,
            selfDescribeGender: state.selfDescribeGender,
            profession: state.profession,
            userAgent: state.userAgent,
          },
          ...state.screenAttributes,
        }
      );
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
    },
    introductionShown(state, action) {
      state.timestamps.introductionShownTimestamp = action.payload;
    },
    introductionCompleted(state, action) {
      state.timestamps.introductionCompletedTimestamp = action.payload;
      state.timestamps.introductionTimeSec = secondsBetween(
        state.timestamps.introductionShownTimestamp,
        state.timestamps.introductionCompletedTimestamp
      );
      // TODO I could record the participants choice on the instructions
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
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
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
    },
    setFeedback(state, action) {
      state.feedback = action.payload;
    },
    startSurvey(state) {
      qe.startSurvey(state);
      return state;
    },
    setQuestionShownTimestamp(state, action) {
      qe.setLatestAnswerShown(state, action.payload);
      return state;
    },
    attentionCheckShown(state, action) {
      state.timestamps.attentionCheckShownTimestamp = action.payload;
    },
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      qe.answerCurrentQuestion(state, action.payload);
      io.writeCSV(
        state.participantId,
        state.studyId,
        state.sessionId,
        "answers",
        state.answers
      );
    },
    previousQuestion(state) {
      qe.decPreviousQuestion(state);
    },
    nextQuestion(state) {
      qe.incNextQuestion(state);
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
      io.writeCSV(
        state.participantId,
        state.studyId,
        state.sessionId,
        "experience-survey",
        state.experienceSurvey
      );
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
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
      io.writeCSV(
        state.participantId,
        state.studyId,
        state.sessionId,
        "financial-lit-survey",
        state.financialLitSurvey
      );
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
    },
    purposeSurveyQuestionsShown(state, action) {
      state.timestamps.purposeSurveyQuestionsShownTimestamp = action.payload;
    },
    purposeSurveyQuestionsCompleted(state, action) {
      state.timestamps.purposeSurveyQuestionsCompletedTimestamp =
        action.payload;
      state.timestamps.purposeSurveyTimeSec = secondsBetween(
        state.timestamps.purposeSurveyQuestionsShownTimestamp,
        state.timestamps.purposeSurveyQuestionsCompletedTimestamp
      );
      io.writeCSV(
        state.participantId,
        state.studyId,
        state.sessionId,
        "purpose-survey",
        state.purposeSurvey
      );
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
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
      io.writeCSV(
        state.participantId,
        state.studyId,
        state.sessionId,
        "feedback",
        {
          participantId: state.participantId,
          sessionId: state.sessionId,
          studyId: state.studyId,
          treatmentId: state.treatmentId,
          feedback: state.feedback,
        }
      );
      writeTimestamps(state);
      state.status = qe.nextStatus(state, false);
    },
    clearState(state) {
      state.allTreatments = null;
      state.treatmentId = null;
      state.participantId = null;
      state.sessionId = null;
      state.studyId = null;
      state.experienceSurvey = {
        participantId: null,
        sessionId: null,
        studyId: null,
        treatmentId: null,
      };
      state.financialLitSurvey = {
        participantId: null,
        sessionId: null,
        studyId: null,
        treatmentId: null,
      };
      state.purposeSurvey = {
        participantId: null,
        sessionId: null,
        studyId: null,
        treatmentId: null,
      };
      state.countryOfResidence = "";
      state.vizFamiliarity = "";
      state.age = "";
      state.gender = "";
      state.selfDescribeGender = "";
      state.profession = "";
      state.timestamps = {
        consentShownTimestamp: null,
        consentCompletedTimestamp: null,
        consentTimeSec: null,
        demographicShownTimestamp: null,
        demographicCompletedTimestamp: null,
        demographicTimeSec: null,
        introductionShownTimestamp: null,
        introductionCompletedTimestamp: null,
        introductionTimeSec: null,
        instructionsShownTimestamp: null,
        instructionsCompletedTimestamp: null,
        instructionsTimeSec: null,
        attentionCheckShownTimestamp: null,
        attentionCheckCompletedTimestamp: null,
        attentionCheckTimeSec: null,
        experienceSurveyQuestionsShownTimestamp: null,
        experienceSurveyQuestionsCompletedTimestamp: null,
        experienceSurveyTimeSec: null,
        financialLitSurveyQuestionsShownTimestamp: null,
        financialLitSurveyQuestionsCompletedTimestamp: null,
        financialLitSurveyTimeSec: null,
        purposeSurveyQuestionsShownTimestamp: null,
        purposeSurveyQuestionsCompletedTimestamp: null,
        purposeSurveyTimeSec: null,
        debriefShownTimestamp: null,
        debriefCompletedTimestamp: null,
        debriefTimeSec: null,
      };
      state.attentioncheck = null;
      state.consentChecked = false;
      state.feedback = "";
      state.treatments = [];
      state.instructionTreatment = null;
      state.answers = [];
      state.currentQuestionIdx = 0;
      state.highup = undefined;
      state.lowdown = undefined;
      state.status = StatusType.Unitialized;
      state.error = null;
      state.userAgent = null;
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

export const getExperienceSurveyQuestion = (questionId) => (state) => {
  return state.questions.experienceSurvey[questionId];
};

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

export const getInstructionTreatment = (state) =>
  state.questions.instructionTreatment;

export const fetchAllTreatments = (state) => state.questions.allTreatments;

export const getCurrentQuestion = (state) => qe.latestAnswer(state.questions);

export const getCurrentChoice = (state) =>
  qe.latestAnswer(state.questions).choice;

export const getStatus = (state) => state.questions.status;

export const fetchTreatmentId = (state) => state.questions.treatmentId;

export const fetchParticipantId = (state) => state.questions.participantId;

export const fetchSessionId = (state) => state.questions.sessionId;

export const getStudyId = (state) => state.questions.studyId;

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
  setStudyId,
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
  initExperienceSurveyQuestion,
  setExperienceSurveyQuestion,
  initFinancialLitSurveyQuestion,
  setFinancialLitSurveyQuestion,
  setSurveyQuestion,
  initPurposeSurveyQuestion,
  setPurposeSurveyQuestion,
  setAttentionCheck,
  instructionsShown,
  setFeedback,
  instructionsCompleted,
  introductionShown,
  introductionCompleted,
  attentionCheckShown,
  experienceSurveyQuestionsShown,
  experienceSurveyQuestionsCompleted,
  financialLitSurveyQuestionsShown,
  financialLitSurveyQuestionsCompleted,
  purposeSurveyQuestionsShown,
  purposeSurveyQuestionsCompleted,
  debriefShownTimestamp,
  debriefCompleted,
  clearState,
  genRandomTreatment,
  nextStatus,
  setUserAgent,
} = questionSlice.actions;

export default questionSlice.reducer;
