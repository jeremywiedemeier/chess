import { ChessInstance } from "chess.js";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setGameState } from "../../AppSlice";
import { GameState } from "../../types";
import "./GameControls.css";

const GameControls: React.FC<Props> = ({
  gameState,
  verticalLayout,
}: Props) => {
  const dispatch = useDispatch();
  const [playerColor, setPlayerColor] = useState<"white" | "black" | "random">(
    "random"
  );
  return (
    <div id="game-controls">
      <div id="reset-wrapper">
        <img className="reset" alt="reset game" src="reset.png" />
        <button
          type="button"
          onClick={() => {
            const resetGame: ChessInstance = gameState.game;
            resetGame.reset();
            dispatch(
              setGameState({
                ...gameState,
                game: resetGame,
                history: [],
                playerColor:
                  playerColor === "random"
                    ? (() => (Math.random() > 0.5 ? "white" : "black"))()
                    : playerColor,
              })
            );
          }}
        >
          Reset
        </button>
      </div>

      <div
        id="sides-wrapper"
        style={{ flexDirection: verticalLayout ? "column" : "initial" }}
      >
        <img alt="change sides" src="sides.png" />
        <button
          type="button"
          onClick={() => {
            setPlayerColor("white");
          }}
          className={
            playerColor === "white" ? "sides-label active" : "sides-label"
          }
        >
          White
        </button>
        <button
          type="button"
          onClick={() => {
            setPlayerColor("black");
          }}
          className={
            playerColor === "black" ? "sides-label active" : "sides-label"
          }
        >
          Black
        </button>
        <button
          type="button"
          onClick={() => {
            setPlayerColor("random");
          }}
          className={
            playerColor === "random" ? "sides-label active" : "sides-label"
          }
        >
          Random
        </button>
      </div>
    </div>
  );
};

interface Props {
  gameState: GameState;
  verticalLayout: boolean;
}

export default GameControls;
