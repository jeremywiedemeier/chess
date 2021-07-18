import { Position } from "chessboardjsx";

export const COLUMNS = "abcdefgh".split("");

function isString(s: unknown) {
  return typeof s === "string";
}

function validSquare(square: string) {
  if (isString(square)) {
    if (square.search(/^[a-h][1-8]$/) !== -1) return true;
  }
  return false;
}

function validPieceCode(code: string) {
  if (isString(code)) {
    if (code.search(/^[bw][KQRNBP]$/) !== -1) return true;
  }
  return false;
}

export function validPositionObject(pos: Position): boolean {
  let result = true;
  if (pos === null || typeof pos !== "object") result = false;

  Object.entries(pos).forEach(([square, piece]) => {
    if (piece === undefined) {
      result = false;
    } else if (!validSquare(square) || !validPieceCode(piece)) {
      result = false;
    }
  });
  return result;
}

function squeezeFenEmptySquares(fen: string) {
  return fen
    .replace(/11111111/g, "8")
    .replace(/1111111/g, "7")
    .replace(/111111/g, "6")
    .replace(/11111/g, "5")
    .replace(/1111/g, "4")
    .replace(/111/g, "3")
    .replace(/11/g, "2");
}

// convert bP, wK, etc code to FEN structure
function pieceCodeToFen(piece: string) {
  const pieceCodeLetters = piece.split("");

  // white piece
  if (pieceCodeLetters[0] === "w") {
    return pieceCodeLetters[1].toUpperCase();
  }

  // black piece
  return pieceCodeLetters[1].toLowerCase();
}

// position object to FEN string
// returns false if the obj is not a valid position object
export function objToFen(obj: { [key: string]: string }): false | string {
  if (!validPositionObject(obj)) return false;

  let fen = "";

  let currentRow = 8;
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      const square = COLUMNS[j] + currentRow;

      // piece exists
      if (Object.prototype.hasOwnProperty.call(obj, square)) {
        fen += pieceCodeToFen(obj[square] || "err");
      } else {
        // empty space
        fen += "1";
      }
    }

    if (i !== 7) {
      fen += "/";
    }

    currentRow -= 1;
  }

  // squeeze the empty numbers together
  fen = squeezeFenEmptySquares(fen);

  return fen;
}
