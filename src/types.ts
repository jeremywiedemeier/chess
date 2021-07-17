import { ChessInstance } from "chess.js";

export type GameState = {
  game: ChessInstance;
  score: number[];
  playerColor: "white" | "black";
  playerTurn: boolean;
  pieceValues: { [key: string]: number | string };
  history: { fen: string; move: string }[];
  engineLogs: string[];
};

export type Piece = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
