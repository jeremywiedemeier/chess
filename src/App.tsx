import React, { useState } from "react";

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
  const gameState = useSelector(selectGameState);
  const { width, height } = useViewport();

  const [tab, setTab] = useState("1");
  const layoutRules = (() => {
    if (height > 800) return { wide: 1500, large: 1200, medium: 800 };
    if (height > 750) return { wide: 1400, large: 1150, medium: 700 };
    if (height > 700) return { wide: 1350, large: 1100, medium: 700 };
    return { wide: 1300, large: 1100, medium: 700 };
  })();
  const layout = (() => {
    if (width > layoutRules.wide) return "wide";
    if (width > layoutRules.large) return "large";
    if (width > layoutRules.medium) return "medium";
    return "small";
  })();

  return layout === "medium" || layout === "small" ? (
    <>
      <NavBar />
      <div id="flex-wrapper" style={{ margin: "0 0 10px 0" }}>
        <div id="chess-game-wrapper">
          <ChessGame />
        </div>
      </div>
      <div id="flex-wrapper">
        {layout === "medium" ? (
          <>
            <div id="menu-wrapper">
              <GameControls gameState={gameState} />
              <EngineSettings gameState={gameState} />
              <Score score={gameState.score} />
            </div>
            <div id="menu-wrapper">
              <EngineLogs engineLogs={gameState.engineLogs} />
              <GameRecord gameState={gameState} />
            </div>
          </>
        ) : (
          <div id="menu-wrapper">
            <GameControls gameState={gameState} />
            <EngineSettings gameState={gameState} />
            <Score score={gameState.score} />
            <EngineLogs engineLogs={gameState.engineLogs} />
            <GameRecord gameState={gameState} />
          </div>
        )}
      </div>
    </>
  ) : (
    <div id="flex-wrapper" style={{ height: "100%" }}>
      {layout === "large" ? (
        <div id="tab-wrapper">
          <button
            aria-label="change tab"
            type="button"
            className={tab === "1" ? "active" : ""}
            onClick={() => {
              setTab("1");
            }}
          />
          <button
            aria-label="change tab"
            type="button"
            className={tab === "2" ? "active" : ""}
            onClick={() => {
              setTab("2");
            }}
          />
        </div>
      ) : null}
      <div id="menu-wrapper">
        {tab === "1" ? (
          <>
            <NavBar />
            <GameControls gameState={gameState} />
            <EngineSettings gameState={gameState} />
            <Score score={gameState.score} />
          </>
        ) : (
          <>
            <EngineLogs engineLogs={gameState.engineLogs} />
            <GameRecord gameState={gameState} />{" "}
          </>
        )}
      </div>
      <div id="chess-game-wrapper">
        <ChessGame />
      </div>
      {layout === "wide" ? (
        <div id="menu-wrapper">
          <EngineLogs engineLogs={gameState.engineLogs} />
          <GameRecord gameState={gameState} />
        </div>
      ) : null}
    </div>
  );
};

export default App;
