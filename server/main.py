# env FLASK_APP=/projects/chess/server/main.py env FLASK_ENV=development python -m flask run
import time

from flask import Flask, request
from flask_cors import CORS

import sunfish
import tools
from tools import WHITE, BLACK

app = Flask(__name__)
CORS(app)

depth = 1000
movetime = -1
searcher = sunfish.Searcher()
our_time, opp_time = 1000, 1000  # centi-seconds


@app.route('/api/comp-move')
def comp_move():
    if request.args.get("fen"):

        fen = request.args.get("fen")
        try:
            pos = tools.parseFEN(fen)
        except ValueError:
            return "Bad FEN string :S"

        color = WHITE if fen.split()[1] == 'w' else BLACK

        moves_remain = 40
        start = time.time()
        ponder = None

        moves = ""
        log = []

        for sdepth, _move, _score in searcher.search(pos):
            moves = tools.pv(searcher, pos, include_scores=False)

            entry = searcher.tp_score.get((pos, sdepth, True))
            score = int(round((entry.lower + entry.upper) / 2))
            usedtime = int((time.time() - start) * 1000)
            moves_str = moves if len(moves) < 15 else ''
            log.append('depth {} score {} cp time {} nodes {} pv {}'.format(sdepth, score, usedtime,
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
        if s == -sunfish.MATE_UPPER:
            return 'resign'
        else:
            moves = moves.split(' ')
            # if len(moves) > 1:
            #     return f'bestmove {moves[0]} ponder {moves[1]}'
            # else:
            #     return 'bestmove ' + moves[0]
            return {"compMove": moves[0], "log": log}

    else:
        return "No FEN string :("

# board = chess.Board()
#
# print(type(board.legal_moves))
#
# while not board.is_game_over():
#     print("\n   -----------------   \n")
#     print(board)
#     board.push(random.choice([move for move in board.legal_moves]))
