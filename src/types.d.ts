import { ChessInstance } from "chess.js";

export type GameState = {
  game: ChessInstance;
  playerColor: "white" | "black";
  playerTurn: boolean;
  history: { fen: string; move: string }[];
  engineLogs: string[];
};
