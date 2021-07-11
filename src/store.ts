import { configureStore } from "@reduxjs/toolkit";

/* eslint-disable import/no-cycle */
import AppReducer from "./AppSlice";

export const store = configureStore({
  reducer: {
    app: AppReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.game"],
        // Ignore these paths in the state
        ignoredPaths: ["app.chess.game"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
