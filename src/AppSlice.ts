/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import { RootState } from "./store";
import { GameState } from "./types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Chess = require("chess.js");

interface AppState {
  UI: {
    darkTheme: boolean;
  };
  chess: GameState;
}

const initialState: AppState = {
  UI: {
    darkTheme: false,
  },
  chess: {
    game: new Chess(),
    playerColor: Math.random() > 0.5 ? "white" : "black",
    playerTurn: true,
    history: [],
  },
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateUI: (state: AppState, action: PayloadAction<AppState["UI"]>) => {
      state.UI = action.payload;
    },
    setGameState: (
      state: AppState,
      action: PayloadAction<AppState["chess"]>
    ) => {
      state.chess = action.payload;
    },
  },
});

export const { updateUI, setGameState } = AppSlice.actions;

export const selectUI = (state: RootState): AppState["UI"] => state.app.UI;
export const selectGameState = (state: RootState): GameState => state.app.chess;

export default AppSlice.reducer;
