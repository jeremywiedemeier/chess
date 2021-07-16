import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPieceValues } from "../../AppSlice";
import { defaultPieceValues } from "../../resources";
import { GameState, Piece } from "../../types";
import "./EngineSettings.css";

const chessPieces = Object.keys(defaultPieceValues) as Piece[];

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
            Math.max(
              Math.min(
                typeof unvalidatedPieceValues[piece] === "string"
                  ? parseInt(unvalidatedPieceValues[piece] as string, 10)
                  : (unvalidatedPieceValues[piece] as number),
                99999
              ),
              1
            ) || defaultPieceValues[piece],
        };
        setUnvalidatedPieceValues(validatedPieceValues);
        dispatch(setPieceValues(validatedPieceValues));
      }}
    />
  );

  return (
    <div
      id="engine-settings"
      className={gameState.engine === "sunfish" ? "" : "hidden"}
    >
      <h3 className="module-title">Sunfish Piece Values</h3>
      <div className="piece-value-wrapper">
        {chessPieces.map((piece) => (
          <img
            key={piece}
            alt={`${piece} value`}
            src={`chess_pieces/${piece}.svg`}
          />
        ))}
      </div>
      <div className="piece-value-wrapper">
        {chessPieces.map((piece) => generatePieceValueInput(piece))}
      </div>
    </div>
  );
};

interface Props {
  gameState: GameState;
}

export default EngineSettings;
