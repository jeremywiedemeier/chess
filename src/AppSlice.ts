/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultPieceValues } from "./resources";
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

const initialPlayerColor = Math.random() > 0.5 ? "white" : "black";

const initialState: AppState = {
  UI: {
    darkTheme: false,
  },
  chess: {
    game: new Chess(),
    playerColor: initialPlayerColor,
    pieceValues: defaultPieceValues,
    playerTurn: initialPlayerColor === "white",
    history: [],
    engineLogs: [],
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
    resetGame: (state: AppState, action: PayloadAction<"white" | "black">) => {
      state.chess = {
        ...initialState.chess,
        game: new Chess(),
        pieceValues: state.chess.pieceValues,
        playerColor: action.payload,
        playerTurn: action.payload === "white",
      };
    },
    setPieceValues: (
      state: AppState,
      action: PayloadAction<{ [key: string]: number | string }>
    ) => {
      state.chess.pieceValues = action.payload;
    },
  },
});

export const {
  updateUI,
  setGameState,
  resetGame,
  setPieceValues,
} = AppSlice.actions;

export const selectUI = (state: RootState): AppState["UI"] => state.app.UI;
export const selectGameState = (state: RootState): GameState => state.app.chess;

export default AppSlice.reducer;
