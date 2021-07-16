import React from "react";
import { useDispatch } from "react-redux";
import { setGameState } from "../../AppSlice";
import { GameState } from "../../types";
import "./NavBar.css";

const NavBar: React.FC<Props> = ({ gameState }: Props) => {
  const dispatch = useDispatch();
  return (
    <div id="navbar">
      <a href="https://jeremywiedemeier.com/">
        <button type="button">Home</button>
      </a>
      <a
        href="https://github.com/jeremywiedemeier/chess"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button type="button" className="dark">
          Code
        </button>
      </a>
      <button
        type="button"
        className={gameState.engine === "sunfish" ? "dark" : ""}
        onClick={() => {
          dispatch(setGameState({ ...gameState, engine: "sunfish" }));
        }}
      >
        Sunfish
      </button>
      <button
        type="button"
        className={gameState.engine === "maia" ? "dark" : ""}
        onClick={() => {
          dispatch(setGameState({ ...gameState, engine: "maia" }));
        }}
      >
        Maia
      </button>
    </div>
  );
};

interface Props {
  gameState: GameState;
}

export default NavBar;
