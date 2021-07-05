import { configureStore } from "@reduxjs/toolkit";

/* eslint-disable import/no-cycle */
import AppReducer from "./AppSlice";

export const store = configureStore({
  reducer: {
    app: AppReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
