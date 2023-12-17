import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SystemZone } from "luxon";
import {
  loadAllTreatmentsConfiguration,
  loadTreatmentConfiguration,
} from "./TreatmentUtil.js";
import { QuestionEngine } from "./QuestionEngine.js";
import { StatusType } from "./StatusType.js";
import { secondsBetween } from "@the-discounters/util";
import { getRandomIntInclusive, writeStateAsCSV } from "./QuestionSliceUtil.js";
import { LATIN_SQUARE } from "./TreatmentUtil.js";

const qe = new QuestionEngine();

export const initializeSurvey = createAsyncThunk(
  "survey/initialize",
  async (parameters, thunkAPI) => {
    const result = { ...parameters };
    try {
      if (isNaN(parameters.treatmentId)) {
        const allTreatments = loadAllTreatmentsConfiguration();
        if (parameters.treatmentId === "assigned") {
          result.serverSequenceId = 1;
          const latinSquareIndex =
            result.serverSequenceId % LATIN_SQUARE.length;
          result.treatmentIds = LATIN_SQUARE[latinSquareIndex];
        } else {
          const min = allTreatments.reduce((pv, cv) => {
            return cv.treatmentId < pv ? cv.treatmentId : pv;
          }, allTreatments[0].treatmentId);
          const max = allTreatments.reduce(
            (pv, cv) => (cv.treatmentId > pv ? cv.treatmentId : pv),
            allTreatments[0].treatmentId
          );
          result.treatmentIds = [getRandomIntInclusive(min, max)];
        }
      } else {
        result.treatmentIds = [+parameters.treatmentId];
      }
      return result;
    } catch (err) {
      const { rejectWithValue } = thunkAPI;
      return rejectWithValue(err.toString());
    }
  }
);

// Define the initial state of the store for this slicer.
export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: {
    allTreatments: null,
    treatmentIds: [],
    participantId: null,
    serverSequenceId: null,
    sessionId: null,
    studyId: null,
    experienceSurvey: {},
    financialLitSurvey: {},
    purposeSurvey: {},
    screenAttributes: {
      // screen properties
      screenAvailHeight: null,
      screenAvailWidth: null,
      screenColorDepth: null,
      screenWidth: null,
      screenHeight: null,
      screenOrientationAngle: null,
      screenOrientationType: null,
      screenPixelDepth: null,
      // window properties
      windowDevicePixelRatio: null,
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
    employment: "",
    selfDescribeEmployment: "",
    consentChecked: null,
    timezone: null,
    timestamps: {
      consentShownTimestamp: null,
      consentCompletedTimestamp: null,
      consentTimeSec: null,
      demographicShownTimestamp: null,
      demographicCompletedTimestamp: null,
      demographicTimeSec: null,
      introductionShownTimestamp: [], // TODO rename this ot MCLInstructionShownTimestamp
      introductionCompletedTimestamp: [], // TODO rename this ot MCLInstructionConpletedTimestamp
      introductionTimeSec: [], // TODO rename this ot MCLIntroductionTimeSec
      instructionsShownTimestamp: null,
      instructionsCompletedTimestamp: null,
      instructionsTimeSec: null,
      attentionCheckShownTimestamp: [],
      attentionCheckCompletedTimestamp: [],
      attentionCheckTimeSec: [],
      experienceSurveyQuestionsShownTimestamp: null,
      experienceSurveyQuestionsCompletedTimestamp: null,
      experienceSurveyTimeSec: null,
      financialLitSurveyQuestionsShownTimestamp: null,
      financialLitSurveyQuestionsCompletedTimestamp: null,
      financialLitSurveyTimeSec: null,
      purposeSurveyAwareQuestionsShownTimestamp: null,
      purposeSurveyAwareQuestionsCompletedTimestamp: null,
      purposeSurveyAwareTimeSec: null,
      purposeSurveyWorthQuestionsShownTimestamp: null,
      purposeSurveyWorthQuestionsCompletedTimestamp: null,
      purposeSurveyWorthTimeSec: null,
      debriefShownTimestamp: null,
      debriefCompletedTimestamp: null,
      debriefTimeSec: null,
    },
    attentionCheck: [],
    feedback: "",
    treatments: [],
    instructionTreatment: [],
    answers: [],
    currentAnswerIdx: 0,
    status: StatusType.Unitialized,
    error: null,
    userAgent: null,
  }, // the initial state of our global data (under name slice)
  reducers: {
    setWindowAttributes(state, action) {
      state.screenAttributes.screenAvailHeight =
        action.payload.screen.availHeight;
      state.screenAttributes.screenAvailWidth =
        action.payload.screen.availWidth;
      state.screenAttributes.screenColorDepth =
        action.payload.screen.colorDepth;
      state.screenAttributes.screenWidth = action.payload.screen.width;
      state.screenAttributes.screenHeight = action.payload.screen.height;
      state.screenAttributes.screenOrientationAngle =
        action.payload.screen.orientation.angle;
      state.screenAttributes.screenOrientationType =
        action.payload.screen.orientation.type;
      state.screenAttributes.screenPixelDepth =
        action.payload.screen.pixelDepth;
      state.screenAttributes.windowDevicePixelRatio =
        action.payload.window.devicePixelRatio;
      state.screenAttributes.windowInnerHeight =
        action.payload.windowInnerHeight;
      state.screenAttributes.windowInnerWidth = action.payload.windowInnerWidth;
      state.screenAttributes.windowOuterHeight =
        action.payload.windowOuterHeight;
      state.screenAttributes.windowOuterWidth = action.payload.windowOuterWidth;
      state.screenAttributes.windowScreenLeft = action.payload.windowScreenLeft;
      state.screenAttributes.windowScreenTop = action.payload.windowScreenTop;
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
    initExperienceSurveyQuestion(state, action) {
      if (state.experienceSurvey[action.payload] === undefined) {
        state.experienceSurvey[action.payload] = "";
      }
    },
    setExperienceSurveyQuestion(state, action) {
      state.experienceSurvey[action.payload.key] = action.payload.value;
    },
    initFinancialLitSurveyQuestion(state, action) {
      if (state.financialLitSurvey[action.payload] === undefined) {
        state.financialLitSurvey[action.payload] = "";
      }
    },
    setFinancialLitSurveyQuestion(state, action) {
      state.financialLitSurvey[action.payload.key] = action.payload.value;
    },
    initPurposeSurveyQuestion(state, action) {
      if (state.purposeSurvey[action.payload] === undefined) {
        state.purposeSurvey[action.payload] = "";
      }
    },
    setPurposeSurveyQuestion(state, action) {
      state.purposeSurvey[action.payload.key] = action.payload.value;
    },
    setAttentionCheck(state, action) {
      state.attentionCheck.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload.value,
      });
      state.timestamps.attentionCheckCompletedTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload.timestamp,
      });
      const shownTimestamp = state.timestamps.attentionCheckShownTimestamp.find(
        (cv) => cv.treatmentId === qe.currentAnswer(state).treatmentId
      ).timestamp;
      state.timestamps.attentionCheckTimeSec.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: secondsBetween(shownTimestamp, action.payload.timestamp),
      });
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
    },
    loadAllTreatments(state) {
      state.status = StatusType.Fetching;
      state.allTreatments = loadAllTreatmentsConfiguration();
      return state;
    },
    consentShown(state, action) {
      state.timestamps.consentShownTimestamp = action.payload;
      writeStateAsCSV(state);
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
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
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
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
    },
    MCLInstructionsShown(state, action) {
      state.timestamps.introductionShownTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload,
      });
    },
    MCLInstructionsCompleted(state, action) {
      state.timestamps.introductionCompletedTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload,
      });
      const shownTimestamp = state.timestamps.introductionShownTimestamp.find(
        (cv) => cv.treatmentId === qe.currentAnswer(state).treatmentId
      ).timestamp;
      state.timestamps.introductionTimeSec.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: secondsBetween(shownTimestamp, action.payload),
      });
      writeStateAsCSV(state);
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
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
    },
    setFeedback(state, action) {
      state.feedback = action.payload;
    },
    setQuestionShownTimestamp(state, action) {
      qe.setCurrentAnswerShown(state, action.payload);
      return state;
    },
    attentionCheckShown(state, action) {
      state.timestamps.attentionCheckShownTimestamp.push({
        treatmentId: qe.currentTreatment(state).treatmentId,
        value: action.payload,
      });
    },
    // we define our actions on the slice of global store data here.
    answer(state, action) {
      qe.answerCurrentQuestion(state, action.payload);
      writeStateAsCSV(state);
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
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
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
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
    },
    purposeSurveyQuestionsShown(state, action) {
      if (state.status === StatusType.PurposeAwareQuestionaire) {
        state.timestamps.purposeSurveyAwareQuestionsShownTimestamp =
          action.payload;
      } else if (state.status === StatusType.PurposeWorthQuestionaire) {
        state.timestamps.purposeSurveyWorthQuestionsShownTimestamp =
          action.payload;
      }
    },
    purposeSurveyQuestionsCompleted(state, action) {
      if (state.status === StatusType.PurposeAwareQuestionaire) {
        state.timestamps.purposeSurveyAwareQuestionsCompletedTimestamp =
          action.payload;
        state.timestamps.purposeSurveyAwareTimeSec = secondsBetween(
          state.timestamps.purposeSurveyAwareQuestionsShownTimestamp,
          state.timestamps.purposeSurveyAwareQuestionsCompletedTimestamp
        );
      } else if (state.status === StatusType.PurposeWorthQuestionaire) {
        state.timestamps.purposeSurveyWorthQuestionsCompletedTimestamp =
          action.payload;
        state.timestamps.purposeSurveyWorthTimeSec = secondsBetween(
          state.timestamps.purposeSurveyWorthQuestionsShownTimestamp,
          state.timestamps.purposeSurveyWorthQuestionsCompletedTimestamp
        );
      }
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
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
      writeStateAsCSV(state);
      state.status = qe.nextState(state);
    },
    clearState(state) {
      state.allTreatments = null;
      state.treatmentIds = [];
      state.participantId = null;
      state.serverSequenceId = null;
      state.sessionId = null;
      state.studyId = null;
      state.experienceSurvey = {};
      state.financialLitSurvey = {};
      state.purposeSurvey = {};
      state.screenAttributes = {
        // screen properties
        screenAvailHeight: null,
        screenAvailWidth: null,
        screenColorDepth: null,
        screenWidth: null,
        screenHeight: null,
        screenOrientationAngle: null,
        screenOrientationType: null,
        screenPixelDepth: null,
        // window properties
        windowDevicePixelRatio: null,
        windowInnerHeight: null,
        windowInnerWidth: null,
        windowOuterHeight: null,
        windowOuterWidth: null,
        windowScreenLeft: null,
        windowScreenTop: null,
      };
      state.countryOfResidence = "";
      state.vizFamiliarity = "";
      state.age = "";
      state.gender = "";
      state.selfDescribeGender = "";
      state.profession = "";
      state.employment = "";
      state.selfDescribeEmployment = "";
      state.timezone = null;
      state.timestamps = {
        consentShownTimestamp: null,
        consentCompletedTimestamp: null,
        consentTimeSec: null,
        demographicShownTimestamp: null,
        demographicCompletedTimestamp: null,
        demographicTimeSec: null,
        introductionShownTimestamp: [],
        introductionCompletedTimestamp: [],
        introductionTimeSec: [],
        instructionsShownTimestamp: null,
        instructionsCompletedTimestamp: null,
        instructionsTimeSec: null,
        attentionCheckShownTimestamp: [],
        attentionCheckCompletedTimestamp: [],
        attentionCheckTimeSec: [],
        experienceSurveyQuestionsShownTimestamp: null,
        experienceSurveyQuestionsCompletedTimestamp: null,
        experienceSurveyTimeSec: null,
        financialLitSurveyQuestionsShownTimestamp: null,
        financialLitSurveyQuestionsCompletedTimestamp: null,
        financialLitSurveyTimeSec: null,
        purposeSurveyAwareQuestionsShownTimestamp: null,
        purposeSurveyAwareQuestionsCompletedTimestamp: null,
        purposeSurveyAwareTimeSec: null,
        purposeSurveyWorthQuestionsShownTimestamp: null,
        purposeSurveyWorthQuestionsCompletedTimestamp: null,
        purposeSurveyWorthTimeSec: null,
        debriefShownTimestamp: null,
        debriefCompletedTimestamp: null,
        debriefTimeSec: null,
      };
      state.attentionCheck = [];
      state.consentChecked = false;
      state.feedback = "";
      state.treatments = [];
      state.instructionTreatment = null;
      state.answers = [];
      state.currentAnswerIdx = 0;
      state.status = StatusType.Unitialized;
      state.error = null;
      state.userAgent = null;
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
        state.treatmentIds = action.payload.treatmentIds;
        const { questions, instructions } = loadTreatmentConfiguration(
          state.treatmentIds
        );
        state.treatments = questions;
        state.instructionTreatment = instructions;
        // create an answer for each treatment question up front
        qe.createAnswersForTreatments(state);

        state.status = qe.nextState(state);
      })
      .addCase(initializeSurvey.rejected, (state, action) => {
        state.error = action.error;
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

export const getExperienceSurveyQuestion = (questionId) => (state) => {
  return state.questions.experienceSurvey[questionId];
};

export const getFinancialLitSurveyQuestion = (questionId) => (state) => {
  return state.questions.financialLitSurvey[questionId];
};

export const getPurposeSurveyAnswers = (state) => {
  return state.questions.purposeSurvey;
};

export const getFinancialLitSurveyAnswers = (state) =>
  state.questions.financialLitSurvey;

export const getExperienceSurveyAnswers = (state) => {
  return state.questions.experienceSurvey;
};

export const getAttentionCheck = (state) => state.questions.attentionCheck;

export const getCurrentQuestionIndex = (state) =>
  state.questions.currentAnswerIdx;

export const fetchCurrentTreatment = (state) =>
  qe.currentTreatment(state.questions);

export const getInstructionTreatment = (state) =>
  qe.currentInstructions(state.questions);

export const fetchAllTreatments = (state) => state.questions.allTreatments;

export const getCurrentQuestion = (state) => qe.currentAnswer(state.questions);

export const getCurrentChoice = (state) =>
  qe.currentAnswer(state.questions).choice;

export const getStatus = (state) => state.questions.status;

export const getStudyId = (state) => state.questions.studyId;

export const getConsentChecked = (state) => state.questions.consentChecked;

// Action creators are generated for each case reducer function
export const {
  loadAllTreatments,
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
  MCLInstructionsShown,
  MCLInstructionsCompleted,
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
  nextStatus,
  setUserAgent,
  setWindowAttributes,
} = questionSlice.actions;

export default questionSlice.reducer;
