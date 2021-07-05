import React, { useState } from "react";
import Chessboard, { Position } from "chessboardjsx";
import "./ChessGame.css";
import { startingObj } from "../../resources";

const maxBoardWidth = 800;

const ChessGame: React.FC = () => {
  const [position, setPosition] = useState<Position>(startingObj);
  return (
    <div id="chess-board">
      <Chessboard
        position={position}
        getPosition={(pos) => {
          setPosition(pos);
        }}
        calcWidth={(size) =>
          size.screenWidth > maxBoardWidth && size.screenHeight > maxBoardWidth
            ? maxBoardWidth - 20
            : Math.min(size.screenWidth, size.screenHeight) - 20
        }
        boardStyle={{
          borderRadius: "5px",
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
          margin: "0 auto",
        }}
        darkSquareStyle={{ backgroundColor: "#caa98f" }}
        lightSquareStyle={{ backgroundColor: "#f9eadd" }}
        dropSquareStyle={{ boxShadow: "inset 0 0 1px 4px #BE9474" }}
      />
    </div>
  );
};

export default ChessGame;
