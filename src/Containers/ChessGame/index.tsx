import React, { useState } from "react";
import Chessboard from "chessboardjsx";
import { ChessInstance } from "chess.js";
import "./ChessGame.css";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Chess = require("chess.js");

const maxBoardWidth = 800;

const ChessGame: React.FC = () => {
  const [gameState, setGameState] = useState<{
    game: ChessInstance;
    fen: string;
    history: string[];
  }>({
    game: new Chess(),
    fen: "start",
    history: [],
  });

  const getCompMove = (fen: string) => {
    fetch(`http://localhost:5000/api/comp-move?fen=${fen}`)
      .then((response) => response.json())
      .then((compMove) => {
        const move = gameState.game.move({
          from: compMove.compMove.substr(0, 2),
          to: compMove.compMove.substr(2, 2),
          promotion: "q",
        });
        if (move !== null) {
          setGameState({
            ...gameState,
            fen: gameState.game.fen(),
            history: gameState.game.history(),
          });
        }
      });
  };

  return (
    <div id="chess-board">
      <Chessboard
        position={gameState.game.fen()}
        onDrop={({ sourceSquare, targetSquare }) => {
          const move = gameState.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
          });
          if (move !== null) {
            const fen = gameState.game.fen();
            setGameState({
              ...gameState,
              fen,
              history: gameState.game.history(),
            });
            getCompMove(fen);
          }
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
