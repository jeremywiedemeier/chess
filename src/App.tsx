import React from "react";

import { useSelector } from "react-redux";
import { selectGameState } from "./AppSlice";
import NavBar from "./Components/NavBar";
import GameRecord from "./Components/GameRecord";
import GameControls from "./Components/GameControls";
import Score from "./Components/Score";
import EngineSettings from "./Components/EngineSettings";
import EngineLogs from "./Components/EngineLogs";
import ChessGame from "./Components/ChessGame";

import "./App.css";
import { useViewport } from "./resources";

const App: React.FC = () => {
  const { width } = useViewport();
  const gameState = useSelector(selectGameState);

  return (
    <div id="flex-wrapper">
      <div
        id="menu-wrapper"
        style={{ flexBasis: width < 1500 && width > 500 ? "auto" : "300px" }}
      >
        <NavBar />
        <GameControls gameState={gameState} />
        <EngineSettings gameState={gameState} />
        <Score score={gameState.score} />
      </div>
      <div id="chess-game-wrapper">
        <ChessGame />
      </div>
      {width > 1500 ? (
        <div
          id="menu-wrapper"
          style={{ flexBasis: width < 1500 && width > 500 ? "auto" : "300px" }}
        >
          <EngineLogs engineLogs={gameState.engineLogs} />
          <GameRecord gameState={gameState} />
        </div>
      ) : null}
    </div>
  );
};

export default App;
