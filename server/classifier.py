import chess.engine

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

engine = chess.engine.SimpleEngine.popen_uci("lc0/lc0")


@app.route('/api/comp-move')
def comp_move():
    if request.args.get("fen"):
        board = chess.Board(request.args.get("fen"))
        play = engine.play(board, chess.engine.Limit(nodes=1), info=chess.engine.INFO_ALL)
        log = 'maia1500: depth {} score cp {} time {} nodes {}'.format(play.info["depth"], play.info["score"].relative,
                                                                    play.info["time"],
                                                                    play.info["nodes"])
        return {"compMove": play.move.uci(), "log": [log]}, 200
    return "No FEN :(", 400
