# env FLASK_APP=/projects/chess/server/main.py env FLASK_ENV=development python -m flask run
# waitress-serve --listen=0.0.0.0:5000 wsgi:app

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


# engine = chess.engine.SimpleEngine.popen_uci("lc0/lc0.exe")


# @app.route('/api/maia-move')
# def maia_move():
#     if request.args.get("fen"):
#         board = chess.Board(request.args.get("fen"))
#         play = engine.play(board, chess.engine.Limit(nodes=1), info=chess.engine.INFO_ALL)
#         log = 'maia1500: depth {} score cp {} time {} nodes {}'.format(play.info["depth"], play.info["score"].relative,
#                                                                        play.info["time"],
#                                                                        play.info["nodes"])
#         return {"compMove": play.move.uci(), "log": [log]}, 200
#     return "No FEN :(", 400


@app.route('/api/sunfish-move')
def comp_move():
    piece_values = copy.deepcopy(default_piece)
    pst = copy.deepcopy(default_pst)

    if request.args.get("pieceValues"):
        try:
            unvalidated_piece_values = json.loads(request.args.get("pieceValues"))

            piece_values["P"] = max(min(int(unvalidated_piece_values["pawn"]), 1000), 1)
            piece_values["N"] = max(min(int(unvalidated_piece_values["knight"]), 1000), 1)
            piece_values["B"] = max(min(int(unvalidated_piece_values["bishop"]), 1000), 1)
            piece_values["R"] = max(min(int(unvalidated_piece_values["rook"]), 1000), 1)
            piece_values["Q"] = max(min(int(unvalidated_piece_values["queen"]), 1000), 1)
            piece_values["K"] = max(min(int(unvalidated_piece_values["king"]), 99999), piece_values["Q"] * 8 + 5000)

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
            log.append('depth {} score cp {} time {} nodes {} pv {}'.format(sdepth, score, usedtime,
                                                                                     searcher.nodes, moves_str))

            if 0 < movetime < (time.time() - start) * 1000:
                break

            if (time.time() - start) * 1000 > our_time / moves_remain:
                break

            if sdepth >= depth:
                break

        entry = searcher.tp_score.get((pos, sdepth, True))
        m, s = searcher.tp_move.get(pos), entry.lower
        if s == -MATE_UPPER:
            return {"compMove": "resign", "log": log, "score": int(round((entry.lower + entry.upper) / 2))}, 200
        else:
            moves = moves.split(' ')
            return {"compMove": moves[0], "log": log, "score": int(round((entry.lower + entry.upper) / 2))}, 200

    else:
        return "400: No FEN string :(", 400
