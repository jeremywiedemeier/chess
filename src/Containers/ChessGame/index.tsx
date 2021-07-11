import React from "react";
import Chessboard from "chessboardjsx";
import "./ChessGame.css";
import { useDispatch, useSelector } from "react-redux";
import { selectGameState, setGameState } from "../../AppSlice";
import { startingFen } from "../../resources";

const maxBoardWidth = 800;

const ChessGame: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  const fen = gameState.game.fen();

  const getCompMove = (
    gameFen: string,
    lastMove: { fen: string; move: string } | null
  ) => {
    fetch(`http://localhost:5000/api/comp-move?fen=${gameFen}`)
      .then((response) => response.json())
      .then((compMove) => {
        const move = gameState.game.move({
          from: compMove.compMove.substr(0, 2),
          to: compMove.compMove.substr(2, 2),
          promotion: "q",
        });
        if (move !== null) {
          dispatch(
            setGameState({
              ...gameState,
              playerTurn: true,
              history: lastMove
                ? [
                    ...gameState.history,
                    lastMove,
                    {
                      fen: gameState.game.fen(),
                      move: gameState.game.history().slice(-1)[0],
                    },
                  ]
                : [
                    ...gameState.history,
                    {
                      fen: gameState.game.fen(),
                      move: gameState.game.history().slice(-1)[0],
                    },
                  ],
            })
          );
        }
      });
  };

  if (fen === startingFen && gameState.playerColor === "black") {
    getCompMove(fen, null);
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
              dispatch(
                setGameState({
                  ...gameState,
                  playerTurn: false,
                  history: [
                    ...gameState.history,
                    {
                      fen: gameState.game.fen(),
                      move: gameState.game.history().slice(-1)[0],
                    },
                  ],
                })
              );
              getCompMove(gameState.game.fen(), {
                fen: gameState.game.fen(),
                move: gameState.game.history().slice(-1)[0],
              });
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
