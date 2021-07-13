import { ChessInstance } from "chess.js";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setGameState } from "../../AppSlice";
import { GameState } from "../../types";
import "./GameControls.css";

const GameControls: React.FC<Props> = ({ gameState }: Props) => {
  const dispatch = useDispatch();
  const [playerColor, setPlayerColor] = useState<"white" | "black" | "random">(
    "random"
  );
  return (
    <div id="game-controls">
      <div id="control-wrapper">
        <div>
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
        <div>
          <img className="suggest" alt="suggest move" src="monitor.png" />
          <button
            type="button"
            onClick={() => {
              fetch(
                `http://localhost:5000/api/comp-move?${new URLSearchParams({
                  fen: gameState.game.fen(),
                })}`
              )
                .then((response) => response.json())
                .then((compMove) => {
                  const move = gameState.game.move({
                    from: compMove.compMove.substr(0, 2),
                    to: compMove.compMove.substr(2, 2),
                    promotion: "q",
                  });
                  if (move !== null) {
                    dispatch(
                      setGameState({
                        ...gameState,
                        playerTurn: true,
                        history: [
                          ...gameState.history,
                          {
                            fen: gameState.game.fen(),
                            move: gameState.game.history().slice(-1)[0],
                          },
                        ],
                      })
                    );
                  }
                });
            }}
          >
            Suggest
          </button>
        </div>
      </div>

      <div id="sides-wrapper">
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
}

export default GameControls;
