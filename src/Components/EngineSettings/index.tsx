import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPieceValues } from "../../AppSlice";
import { defaultPieceValues } from "../../resources";
import { GameState, Piece } from "../../types";
import "./EngineSettings.css";

const chessPieces = Object.keys(defaultPieceValues) as Piece[];

const constrainValue = (val: number, piece: string) => {
  if (piece === "king") return Math.max(Math.min(val, 99999), 10000);
  return Math.max(Math.min(val, 1000), 1);
};

const EngineSettings: React.FC<Props> = ({ gameState }: Props) => {
  const dispatch = useDispatch();
  const [unvalidatedPieceValues, setUnvalidatedPieceValues] = useState<{
    [key: string]: string | number;
  }>(gameState.pieceValues);

  const generatePieceValueInput = (piece: Piece) => (
    <input
      type="text"
      key={piece}
      value={unvalidatedPieceValues[piece]}
      onKeyPress={(env) => {
        if (env.key === "Enter") (env.target as HTMLInputElement).blur();
      }}
      onChange={(inp) => {
        setUnvalidatedPieceValues({
          ...unvalidatedPieceValues,
          [piece]: inp.target.value,
        });
      }}
      onBlur={() => {
        const validatedPieceValues = {
          ...unvalidatedPieceValues,
          [piece]:
            constrainValue(
              typeof unvalidatedPieceValues[piece] === "string"
                ? parseInt(unvalidatedPieceValues[piece] as string, 10)
                : (unvalidatedPieceValues[piece] as number),
              piece
            ) || defaultPieceValues[piece],
        };
        setUnvalidatedPieceValues(validatedPieceValues);
        dispatch(setPieceValues(validatedPieceValues));
      }}
    />
  );
  return (
    <div id="engine-settings">
      <h3 className="module-title" style={{ flex: "0 1 20px", minHeight: "0" }}>
        Piece Values
      </h3>
      <div
        className="piece-value-wrapper"
        style={{ flex: "0 1 45px", minHeight: "0" }}
      >
        {chessPieces.map((piece) => (
          <img
            key={piece}
            alt={`${piece} value`}
            src={`chess_pieces/${piece}.svg`}
          />
        ))}
      </div>
      <div
        className="piece-value-wrapper"
        style={{ flex: "0 1 25px", minHeight: "0" }}
      >
        {chessPieces.map((piece) => generatePieceValueInput(piece))}
      </div>
    </div>
  );
};

interface Props {
  gameState: GameState;
}

export default EngineSettings;
