import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectGameState, setGameState } from "../../AppSlice";
import { startingFen } from "../../resources";
import "./GameRecord.css";

const GameRecord: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  useEffect(() => {
    document
      .querySelector(".record-cell:last-child")
      ?.scrollIntoView({ behavior: "smooth", block: "end" });
  });
  return (
    <div id="game-record">
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

export default GameRecord;
