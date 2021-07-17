import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { resetGame } from "../../AppSlice";
import { getResourceUrl } from "../../resources";
import { GameState } from "../../types";
import "./GameControls.css";

const GameControls: React.FC<Props> = ({ gameState }: Props) => {
  const dispatch = useDispatch();
  const [compSuggestion, setCompSuggestion] = useState("Suggest");
  const [playerColor, setPlayerColor] = useState<"white" | "black" | "random">(
    "random"
  );
  return (
    <div id="game-controls">
      <div id="control-wrapper">
        <div style={{ right: "25px" }}>
          <img className="reset" alt="reset game" src="reset.png" />
          <button
            type="button"
            onClick={() => {
              const newGamePlayerColor =
                playerColor === "random"
                  ? (() => (Math.random() > 0.5 ? "white" : "black"))()
                  : playerColor;
              dispatch(resetGame(newGamePlayerColor));
            }}
          >
            Reset
          </button>
        </div>
        <div style={{ right: "5px" }}>
          <img className="suggest" alt="suggest move" src="monitor.png" />
          <button
            type="button"
            id="comp-suggestion"
            onClick={() => {
              setCompSuggestion("...");
              fetch(
                `${getResourceUrl(`/api/sunfish-move`)}?${new URLSearchParams({
                  fen: gameState.game.fen(),
                  pieceValues: JSON.stringify(gameState.pieceValues),
                })}`
              )
                .then((response) => response.json())
                .then((compMove) => {
                  setCompSuggestion(
                    compMove.compMove !== "resign"
                      ? compMove.compMove
                      : "..reset?"
                  );
                });
            }}
          >
            {compSuggestion}
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
