import React from "react";
import Chessboard from "chessboardjsx";
import "./ChessGame.css";
import { useDispatch, useSelector } from "react-redux";
import { ChessInstance } from "chess.js";
import { selectGameState, setGameState } from "../../AppSlice";
import { startingFen } from "../../resources";

const maxBoardWidth = 800;

const ChessGame: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  const fen = gameState.game.fen();

  const getCompMove = (currentGameState: typeof gameState) => {
    fetch(
      `http://localhost:5000/api/comp-move?${new URLSearchParams({
        fen: currentGameState.game.fen(),
      })}`
    )
      .then((response) => response.json())
      .then((compMove) => {
        const move = currentGameState.game.move({
          from: compMove.compMove.substr(0, 2),
          to: compMove.compMove.substr(2, 2),
          promotion: "q",
        });
        if (move !== null) {
          dispatch(
            setGameState({
              ...currentGameState,
              playerTurn: true,
              history: [
                ...currentGameState.history,
                {
                  fen: currentGameState.game.fen(),
                  move: currentGameState.game.history().slice(-1)[0],
                },
              ],
            })
          );
        }
      });
  };

  if (fen === startingFen && gameState.playerColor === "black") {
    getCompMove(gameState);
  }

  return (
    <div id="chess-board">
      <Chessboard
        orientation={gameState.playerColor}
        position={fen}
        onDrop={({ sourceSquare, targetSquare }) => {
          if (gameState.playerTurn) {
            const move = gameState.game.move({
              from: sourceSquare,
              to: targetSquare,
              promotion: "q",
            });
            if (move !== null) {
              const currentGameState = {
                ...gameState,
                playerTurn: false,
                history: [
                  ...gameState.history,
                  {
                    fen: gameState.game.fen(),
                    move: gameState.game.history().slice(-1)[0],
                  },
                ],
              };
              dispatch(setGameState(currentGameState));
              getCompMove(currentGameState);
            }
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
