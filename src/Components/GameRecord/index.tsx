import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGameState, setGameState } from "../../AppSlice";
import "./GameRecord.css";

const GameRecord: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  return (
    <div id="game-record">
      {gameState.history.map((record, i) => {
        return (
          <button
            type="button"
            className="record-cell"
            onClick={() => {
              if (
                (gameState.playerColor === "white" && i % 2 === 0) ||
                (gameState.playerColor === "black" && !(i % 2 === 0))
              ) {
                gameState.game.load(gameState.history[i - 1].fen);
              } else {
                gameState.game.load(gameState.history[i - 2].fen);
              }
              dispatch(
                setGameState({
                  ...gameState,
                  history:
                    (gameState.playerColor === "white" && i % 2 === 0) ||
                    (gameState.playerColor === "black" && !(i % 2 === 0))
                      ? gameState.history.slice(0, i)
                      : gameState.history.slice(0, i - 1),
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
