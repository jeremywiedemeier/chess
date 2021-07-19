import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { setGameState } from "../../AppSlice";
import { startingFen } from "../../resources";
import { GameState } from "../../types";
import recall from "./recall.png";
import "./GameRecord.css";

const GameRecord: React.FC<Props> = ({ gameState }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const records = document.querySelector("#game-record");
    if (records) records.scrollTop = records.scrollHeight;
  });
  return (
    <div id="record-wrapper">
      <div className="label-wrapper">
        <img alt="recall" src={recall} />
        <h3 className="module-title">Recall Position</h3>
      </div>
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
    </div>
  );
};

interface Props {
  gameState: GameState;
}

export default GameRecord;
