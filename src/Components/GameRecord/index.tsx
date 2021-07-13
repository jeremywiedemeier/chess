import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { setGameState } from "../../AppSlice";
import { startingFen } from "../../resources";
import { GameState } from "../../types";
import "./GameRecord.css";

const GameRecord: React.FC<Props> = ({ gameState, shorten }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    document
      .querySelector(".record-cell:last-child")
      ?.scrollIntoView({ behavior: "smooth", block: "end" });
  });
  return (
    <div
      id="game-record"
      style={{ maxHeight: shorten ? "35.9%" : "calc(100% - 20px)" }}
    >
      {gameState.history.map((record, i) => {
        return (
          <button
            type="button"
            className="record-cell"
            key={record.fen}
            onClick={() => {
              if (
                (gameState.playerColor === "white" && i % 2 === 0) ||
                (gameState.playerColor === "black" && !(i % 2 === 0))
              ) {
                gameState.game.load(
                  gameState.history[i - 1]?.fen || startingFen
                );
              } else {
                gameState.game.load(
                  gameState.history[i - 2]?.fen || startingFen
                );
              }
              dispatch(
                setGameState({
                  ...gameState,
                  history:
                    (gameState.playerColor === "white" && i % 2 === 0) ||
                    (gameState.playerColor === "black" && !(i % 2 === 0))
                      ? gameState.history.slice(0, i)
                      : gameState.history.slice(0, Math.max(i - 1, 0)),
                })
              );
            }}
          >
            {record.move}
          </button>
        );
      })}
    </div>
  );
};

interface Props {
  gameState: GameState;
  shorten: boolean;
}

export default GameRecord;
