/* eslint-disable react/prop-types */
import React from "react";
import Chessboard from "chessboardjsx";
import "./ChessGame.css";
import { useDispatch, useSelector } from "react-redux";
import { selectGameState, setGameState } from "../../AppSlice";
import { getResourceUrl, startingFen } from "../../resources";

const maxBoardWidth = 800;

const ChessGame: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);

  const getCompMove = (currentGameState: typeof gameState) => {
    fetch(
      `${getResourceUrl(`/api/sunfish-move`)}?${new URLSearchParams({
        fen: currentGameState.game.fen(),
        pieceValues: JSON.stringify(currentGameState.pieceValues),
      })}`
    )
      .then((response) => {
        return response.json();
      })
      .then((compMove) => {
        const newEngineLogs = [...currentGameState.engineLogs, ...compMove.log];
        const newHistory = [...currentGameState.history];
        const newScore = [...currentGameState.score];

        if (compMove.compMove === "resign") {
          newEngineLogs.push("Good game!");
        } else {
          const move = currentGameState.game.move({
            from: compMove.compMove.substr(0, 2),
            to: compMove.compMove.substr(2, 2),
            promotion: "q",
          });
          if (move !== null) {
            newHistory.push({
              fen: currentGameState.game.fen(),
              move: currentGameState.game.history().slice(-1)[0],
            });
            newScore.push(compMove.score);
            if (currentGameState.game.in_checkmate()) {
              newEngineLogs.push("Checkmate!");
            } else if (currentGameState.game.in_check()) {
              newEngineLogs.push("Check!");
            }
            dispatch(
              setGameState({
                ...currentGameState,
                history: newHistory,
                engineLogs: newEngineLogs,
                playerTurn: true,
                score: newScore,
              })
            );
          }
        }
      });
  };

  if (
    gameState.game.fen() === startingFen &&
    gameState.playerColor === "black"
  ) {
    getCompMove(gameState);
  }

  return (
    <div id="chess-board">
      <Chessboard
        pieces={{
          bQ: ({ squareWidth }) => (
            <img
              style={{
                width: squareWidth,
                height: squareWidth,
              }}
              src="chess_pieces/bqueen.svg"
              alt="queen"
            />
          ),
          bB: ({ squareWidth }) => (
            <img
              style={{
                width: squareWidth,
                height: squareWidth,
              }}
              src="chess_pieces/bbishop.svg"
              alt="bishop"
            />
          ),
          bK: ({ squareWidth }) => (
            <img
              style={{
                width: squareWidth,
                height: squareWidth,
              }}
              src="chess_pieces/bking.svg"
              alt="bking"
            />
          ),
          bN: ({ squareWidth }) => (
            <img
              style={{
                width: squareWidth,
                height: squareWidth,
              }}
              src="chess_pieces/bknight.svg"
              alt="knight"
            />
          ),
          bR: ({ squareWidth }) => (
            <img
              style={{
                width: squareWidth,
                height: squareWidth,
              }}
              src="chess_pieces/brook.svg"
              alt="rook"
            />
          ),
          bP: ({ squareWidth }) => (
            <img
              style={{
                width: squareWidth,
                height: squareWidth,
              }}
              src="chess_pieces/bpawn.svg"
              alt="pawn"
            />
          ),
        }}
        orientation={gameState.playerColor}
        position={gameState.game.fen()}
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
