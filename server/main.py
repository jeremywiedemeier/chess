# env FLASK_APP=/projects/chess/server/main.py env FLASK_ENV=development python -m flask run
import copy
import json
import time

from flask import Flask, request
from flask_cors import CORS

import sunfish
import tools
from tools import default_piece, default_pst

app = Flask(__name__)
CORS(app)

depth = 1000
movetime = -1
our_time, opp_time = 1000, 1000  # centi-seconds


@app.route('/api/comp-move')
def comp_move():
    piece_values = copy.deepcopy(default_piece)
    pst = copy.deepcopy(default_pst)

    if request.args.get("pieceValues"):
        try:
            unvalidated_piece_values = json.loads(request.args.get("pieceValues"))

            piece_values["P"] = max(min(int(unvalidated_piece_values["pawn"]), 99999), 1)
            piece_values["N"] = max(min(int(unvalidated_piece_values["knight"]), 99999), 1)
            piece_values["B"] = max(min(int(unvalidated_piece_values["bishop"]), 99999), 1)
            piece_values["R"] = max(min(int(unvalidated_piece_values["rook"]), 99999), 1)
            piece_values["Q"] = max(min(int(unvalidated_piece_values["queen"]), 99999), 1)
            piece_values["K"] = max(min(int(unvalidated_piece_values["king"]), 99999), 1)

        except (ValueError, json.decoder.JSONDecodeError):
            return "400: Bad piece value :S", 400

    MATE_UPPER = piece_values['K'] + 10 * piece_values['Q']
    MATE_LOWER = piece_values['K'] - 10 * piece_values['Q']

    for k, table in pst.items():
        def pad_row(row): return (0,) + tuple(x + piece_values[k] for x in row) + (0,)

        pst[k] = sum((pad_row(table[i * 8:i * 8 + 8]) for i in range(8)), ())
        pst[k] = (0,) * 20 + pst[k] + (0,) * 20

    if request.args.get("fen"):

        fen = request.args.get("fen")
        try:
            pos = tools.parseFEN(fen, pst)
        except ValueError:
            return "400: Bad FEN string :S", 400

        moves_remain = 40
        start = time.time()

        moves = ""
        log = []

        searcher = sunfish.Searcher(pst, MATE_UPPER, MATE_LOWER)

        for sdepth, _move, _score in searcher.search(pos):
            moves = tools.pv(searcher, pos, pst, MATE_LOWER, include_scores=False)

            entry = searcher.tp_score.get((pos, sdepth, True))
            score = int(round((entry.lower + entry.upper) / 2))
            usedtime = int((time.time() - start) * 1000)
            moves_str = moves if len(moves) < 15 else ''
            log.append('sunfish: depth {} score cp {} time {} nodes {} pv {}'.format(sdepth, score, usedtime,
                                                                                 searcher.nodes, moves_str))

            if len(moves) > 5:
                ponder = moves[1]

            if 0 < movetime < (time.time() - start) * 1000:
                break

            if (time.time() - start) * 1000 > our_time / moves_remain:
                break

            if sdepth >= depth:
                break

        entry = searcher.tp_score.get((pos, sdepth, True))
        m, s = searcher.tp_move.get(pos), entry.lower
        # We only resign once we are mated.. That's never?
        if s == -MATE_UPPER:
            return {"compMove": "resign", "log": log}, 200
        else:
            moves = moves.split(' ')
            # if len(moves) > 1:
            #     return f'bestmove {moves[0]} ponder {moves[1]}'
            # else:
            #     return 'bestmove ' + moves[0]
            return {"compMove": moves[0], "log": log}, 200

    else:
        return "400: No FEN string :(", 400

# board = chess.Board()
#
# print(type(board.legal_moves))
#
# while not board.is_game_over():
#     print("\n   -----------------   \n")
#     print(board)
#     board.push(random.choice([move for move in board.legal_moves]))
