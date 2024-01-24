import { configureStore } from "@reduxjs/toolkit";
import questionReducer from "../features/questionSlice.js";
import { updateState } from "../features/serviceAPI.js";
import { StatusType } from "../features/StatusType.js";

export const saveStateAsync = async (state) => {
  try {
    updateState(
      process.env.REACT_APP_SERVER_URL,
      state.participantId,
      state.studyId,
      state.sessionId,
      state
    );
  } catch (err) {
    // TODO how do we want to handle this error?
    // TODO write the error to google analytics.
    console.error(err);
  }
};

export const store = configureStore({
  reducer: {
    questions: questionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

store.subscribe(() => {
  const state = store.getState();
  if (
    state.questions.status !== StatusType.Unitialized &&
    state.questions.status !== StatusType.Fetching
  ) {
    saveStateAsync(store.getState().questions);
  }
});
