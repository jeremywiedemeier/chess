/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "./store";

interface AppState {
  UI: {
    darkTheme: boolean;
  };
}

const initialState: AppState = {
  UI: {
    darkTheme: false,
  },
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateUI: (state: AppState, action: PayloadAction<AppState["UI"]>) => {
      state.UI = action.payload;
    },
  },
});

export const { updateUI } = AppSlice.actions;

export const selectUI = (state: RootState): AppState["UI"] => state.app.UI;

export default AppSlice.reducer;
