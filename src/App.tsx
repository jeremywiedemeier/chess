import React from "react";
import ChessGame from "./Containers/ChessGame";
import "./App.css";

const App: React.FC = () => {
  return (
    <div id="app">
      <ChessGame />
    </div>
  );
};

export default App;
