import React from "react";
import Chessboard from "chessboardjsx";

const maxBoardWidth = 900;

const ChessGame: React.FC = () => {
  return (
    <Chessboard
      calcWidth={(size) =>
        size.screenWidth > maxBoardWidth && size.screenHeight > maxBoardWidth
          ? maxBoardWidth - 20
          : Math.min(size.screenWidth, size.screenHeight) - 20
      }
      boardStyle={{
        borderRadius: "5px",
        boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        margin: "5px auto 0 auto",
      }}
    />
  );
};

export default ChessGame;
