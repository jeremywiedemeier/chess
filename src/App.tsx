import React from "react";

import Menu from "./Containers/Menu";
import ChessGame from "./Containers/ChessGame";

import "./App.css";
import { useViewport } from "./resources";

const App: React.FC = () => {
  const { width } = useViewport();

  return width > 1100 ? (
    <div id="flex-wrapper">
      <div id="menu-wrapper" style={{ justifyContent: "flex-end" }}>
        <Menu
          content={{
            navbar: true,
            engine: true,
            gameControls: true,
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
                  engine: false,
                  gameControls: false,
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
          engine: true,
          gameControls: true,
          engineLogs: false,
          records: true,
        }}
      />
    </>
  );
};

export default App;
