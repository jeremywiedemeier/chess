import { Position } from "chessboardjsx";
import React from "react";

export const useViewport = (): { width: number; height: number } => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width, height };
};

export const getResourceUrl = (resource: string): string =>
  process.env.NODE_ENV === "production"
    ? `/chess${resource}`
    : `http://localhost:5000${resource}`;

export const startingFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const defaultPieceValues = {
  pawn: 100,
  knight: 280,
  bishop: 320,
  rook: 479,
  queen: 929,
  king: 60000,
};

export const startingObj: Position = {
  a1: "wR",
  a2: "wP",
  a7: "bP",
  a8: "bR",
  b1: "wN",
  b2: "wP",
  b7: "bP",
  b8: "bN",
  c1: "wB",
  c2: "wP",
  c7: "bP",
  c8: "bB",
  d1: "wQ",
  d2: "wP",
  d7: "bP",
  d8: "bQ",
  e1: "wK",
  e2: "wP",
  e7: "bP",
  e8: "bK",
  f1: "wB",
  f2: "wP",
  f7: "bP",
  f8: "bB",
  g1: "wN",
  g2: "wP",
  g7: "bP",
  g8: "bN",
  h1: "wR",
  h2: "wP",
  h7: "bP",
  h8: "bR",
};
