import React from "react";

import Menu from "./Containers/Menu";
import ChessGame from "./Containers/ChessGame";

import "./App.css";
import { useViewport } from "./resources";

const App: React.FC = () => {
  const { width } = useViewport();

  return width > 1300 ? (
    <div id="flex-wrapper">
      <div id="menu-wrapper" style={{ justifyContent: "flex-end" }}>
        <Menu
          content={{
            navbar: true,
            gameControls: true,
            engine: true,
            score: true,
            engineLogs: false,
            records: width < 1600,
          }}
        />
      </div>
      <div id="chess-game-wrapper">
        <ChessGame />
      </div>
      {(() => {
        if (width > 1600) {
          return (
            <div id="menu-wrapper">
              <Menu
                content={{
                  navbar: false,
                  gameControls: false,
                  engine: false,
                  score: false,
                  engineLogs: true,
                  records: true,
                }}
              />
            </div>
          );
        }
        return null;
      })()}
    </div>
  ) : (
    <>
      <ChessGame />
      <Menu
        content={{
          navbar: true,
          gameControls: true,
          engine: true,
          score: true,
          engineLogs: true,
          records: true,
        }}
      />
    </>
  );
};

export default App;
