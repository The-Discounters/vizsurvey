import { configureStore } from "@reduxjs/toolkit";
import questionReducer from "../features/questionSlice.js";

export const store = configureStore({
  reducer: {
    questions: questionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
