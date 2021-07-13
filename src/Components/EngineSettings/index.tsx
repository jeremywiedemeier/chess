import React from "react";
import "./EngineSettings.css";

const EngineSettings: React.FC = () => {
  return (
    <div id="engine-settings">
      <h3>Centipawn values</h3>
      <div className="piece-value-wrapper">
        <img alt="pawn value" src="chess_pieces/pawn.svg" />
        <img alt="knight value" src="chess_pieces/knight.svg" />
        <img alt="bishop value" src="chess_pieces/bishop.svg" />
        <img alt="rook value" src="chess_pieces/rook.svg" />
        <img alt="queen value" src="chess_pieces/queen.svg" />
        <img alt="king value" src="chess_pieces/king.svg" />
      </div>
      <div className="piece-value-wrapper">
        <input type="text" value="100" />
        <input type="text" value="280" />
        <input type="text" value="320" />
        <input type="text" value="479" />
        <input type="text" value="929" />
        <input type="text" value="60000" />
      </div>
    </div>
  );
};

export default EngineSettings;
