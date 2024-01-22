import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SystemZone } from "luxon";
import { secondsBetween } from "@the-discounters/util";
import { QuestionEngine } from "./QuestionEngine.js";
import { StatusType } from "./StatusType.js";
import { signupParticipant } from "./serviceAPI.js";
import packageFile from "../../package.json";

const qe = new QuestionEngine();

export const initializeSurvey = createAsyncThunk(
  "questions/initialize",
  async (parameters, thunkAPI) => {
    const result = { ...parameters };
    try {
      const data = await signupParticipant(
        process.env.REACT_APP_SERVER_URL,
        parameters.participantId,
        parameters.studyId,
        parameters.sessionId,
        parameters.userAgent
      );
      result.questions = data.survey;
      result.instruction = data.instruction;
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
  purposeSurvey: {},
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
    choiceInstructionShownTimestamp: [],
    choiceInstructionCompletedTimestamp: [],
    choiceInstructionTimeSec: [],
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
  instructionTreatment: [],
  currentAnswerIdx: 0,
  status: StatusType.Unitialized,
  error: null,
  userAgent: null,
};

export const questionSlice = createSlice({
  name: "questions", // I believe the global state is partitioned by the name value thus the terminology "slice"
  initialState: initialState, // the initial state of our global data (under name slice)
  reducers: {
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
      state.status = qe.nextState(state);
    },
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
    MCLInstructionsShown(state, action) {
      state.timestamps.choiceInstructionShownTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload,
      });
    },
    MCLInstructionsCompleted(state, action) {
      state.timestamps.choiceInstructionCompletedTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload,
      });
      const shownTimestamp =
        state.timestamps.choiceInstructionShownTimestamp.find(
          (cv) => cv.treatmentId === qe.currentAnswer(state).treatmentId
        ).timestamp;
      state.timestamps.choiceInstructionTimeSec.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: secondsBetween(shownTimestamp, action.payload),
      });
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
    setFeedback(state, action) {
      state.feedback = action.payload;
    },
    setQuestionShownTimestamp(state, action) {
      qe.setCurrentAnswerShown(state, action.payload);
      return state;
    },
    attentionCheckShown(state, action) {
      state.timestamps.attentionCheckShownTimestamp.push({
        treatmentId: qe.currentAnswer(state).treatmentId,
        value: action.payload,
      });
    },
    answer(state, action) {
      qe.answerCurrentQuestion(state, action.payload);
    },
    // we define our actions on the slice of global store data here.
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
      state.status = qe.nextState(state);
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
  qe.currentAnswer(state.questions);

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
