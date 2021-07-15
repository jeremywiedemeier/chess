import re
import sys
import time

import sunfish

################################################################################
# This module contains functions used by test.py and xboard.py.
# Nothing from here is imported into sunfish.py which is entirely self-sufficient
################################################################################

# Sunfish doesn't have to know about colors, but for more advanced things, such
# as xboard support, we have to.
WHITE, BLACK = range(2)

FEN_INITIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

default_piece = {'P': 100, 'N': 280, 'B': 320, 'R': 479, 'Q': 929, 'K': 60000}
default_pst = {
    'P': (0, 0, 0, 0, 0, 0, 0, 0,
          78, 83, 86, 73, 102, 82, 85, 90,
          7, 29, 21, 44, 40, 31, 44, 7,
          -17, 16, -2, 15, 14, 0, 15, -13,
          -26, 3, 10, 9, 6, 1, 0, -23,
          -22, 9, 5, -11, -10, -2, 3, -19,
          -31, 8, -7, -37, -36, -14, 3, -31,
          0, 0, 0, 0, 0, 0, 0, 0),
    'N': (-66, -53, -75, -75, -10, -55, -58, -70,
          -3, -6, 100, -36, 4, 62, -4, -14,
          10, 67, 1, 74, 73, 27, 62, -2,
          24, 24, 45, 37, 33, 41, 25, 17,
          -1, 5, 31, 21, 22, 35, 2, 0,
          -18, 10, 13, 22, 18, 15, 11, -14,
          -23, -15, 2, 0, 2, 0, -23, -20,
          -74, -23, -26, -24, -19, -35, -22, -69),
    'B': (-59, -78, -82, -76, -23, -107, -37, -50,
          -11, 20, 35, -42, -39, 31, 2, -22,
          -9, 39, -32, 41, 52, -10, 28, -14,
          25, 17, 20, 34, 26, 25, 15, 10,
          13, 10, 17, 23, 17, 16, 0, 7,
          14, 25, 24, 15, 8, 25, 20, 15,
          19, 20, 11, 6, 7, 6, 20, 16,
          -7, 2, -15, -12, -14, -15, -10, -10),
    'R': (35, 29, 33, 4, 37, 33, 56, 50,
          55, 29, 56, 67, 55, 62, 34, 60,
          19, 35, 28, 33, 45, 27, 25, 15,
          0, 5, 16, 13, 18, -4, -9, -6,
          -28, -35, -16, -21, -13, -29, -46, -30,
          -42, -28, -42, -25, -25, -35, -26, -46,
          -53, -38, -31, -26, -29, -43, -44, -53,
          -30, -24, -18, 5, -2, -18, -31, -32),
    'Q': (6, 1, -8, -104, 69, 24, 88, 26,
          14, 32, 60, -10, 20, 76, 57, 24,
          -2, 43, 32, 60, 72, 63, 43, 2,
          1, -16, 22, 17, 25, 20, -13, -6,
          -14, -15, -2, -5, -1, -10, -20, -22,
          -30, -6, -13, -11, -16, -11, -16, -27,
          -36, -18, 0, -19, -15, -15, -21, -38,
          -39, -30, -31, -13, -31, -36, -34, -42),
    'K': (4, 54, 47, -99, -99, 60, 83, -62,
          -32, 10, 55, 56, 56, 55, 10, 3,
          -62, 12, -57, 44, -67, 28, 37, -31,
          -55, 50, 11, -4, -19, 13, 0, -49,
          -55, -43, -52, -28, -51, -47, -8, -50,
          -47, -42, -43, -79, -64, -32, -29, -32,
          -4, 3, -14, -50, -57, -18, 13, 4,
          17, 30, -3, -14, 6, -1, 40, 18),
}


def search(searcher, pos, secs, history=()):
    """ This used to be in the Searcher class """
    start = time.time()
    for depth, move, score in searcher.search(pos, history):
        if time.time() - start > secs:
            break
    return move, score, depth


################################################################################
# Parse and Render moves
################################################################################

def gen_legal_moves(pos, pst):
    ''' pos.gen_moves(), but without those that leaves us in check.
        Also the position after moving is included. '''
    for move in pos.gen_moves():
        pos1 = pos.move(move)
        if not can_kill_king(pos1, pst):
            yield move, pos1


def can_kill_king(pos, pst, MATE_LOWER):
    # If we just checked for opponent moves capturing the king, we would miss
    # captures in case of illegal castling.
    return any(pos.value(m, pst) >= MATE_LOWER for m in pos.gen_moves())


def mrender(pos, m):
    # Sunfish always assumes promotion to queen
    p = 'q' if sunfish.A8 <= m[1] <= sunfish.H8 and pos.board[m[0]] == 'P' else ''
    m = m if get_color(pos) == WHITE else (119 - m[0], 119 - m[1])
    return sunfish.render(m[0]) + sunfish.render(m[1]) + p


################################################################################
# Parse and Render positions
################################################################################

def get_color(pos):
    ''' A slightly hacky way to to get the color from a sunfish position '''
    return BLACK if pos.board.startswith('\n') else WHITE


def parseFEN(fen, pst):
    """ Parses a string in Forsyth-Edwards Notation into a Position """
    board, color, castling, enpas, _hclock, _fclock = fen.split()
    board = re.sub(r'\d', (lambda m: '.' * int(m.group(0))), board)
    board = list(21 * ' ' + '  '.join(board.split('/')) + 21 * ' ')
    board[9::10] = ['\n'] * 12
    # if color == 'w': board[::10] = ['\n']*12
    # if color == 'b': board[9::10] = ['\n']*12
    board = ''.join(board)
    wc = ('Q' in castling, 'K' in castling)
    bc = ('k' in castling, 'q' in castling)
    ep = sunfish.parse(enpas) if enpas != '-' else 0
    score = sum(pst[p][i] for i, p in enumerate(board) if p.isupper())
    score -= sum(pst[p.upper()][119 - i] for i, p in enumerate(board) if p.islower())
    pos = sunfish.Position(board, score, wc, bc, ep, 0)
    return pos if color == 'w' else pos.rotate()


################################################################################
# Pretty print
################################################################################

def pv(searcher, pos, pst, MATE_LOWER, include_scores=True, include_loop=False):
    res = []
    seen_pos = set()
    color = get_color(pos)
    origc = color
    if include_scores:
        res.append(str(pos.score))
    while True:
        move = searcher.tp_move.get(pos)
        # The tp may have illegal moves, given lower depths don't detect king killing
        if move is None or can_kill_king(pos.move(move, pst), pst, MATE_LOWER):
            break
        res.append(mrender(pos, move))
        pos, color = pos.move(move, pst), 1 - color
        if pos in seen_pos:
            if include_loop:
                res.append('loop')
            break
        seen_pos.add(pos)
        if include_scores:
            res.append(str(pos.score if color == origc else -pos.score))
    return ' '.join(res)


################################################################################
# Bulk move generation
################################################################################

def collect_tree_depth(tree, depth):
    ''' Yields positions exactly at depth '''
    root = next(tree)
    if depth == 0:
        yield root
    else:
        for subtree in tree:
            for pos in collect_tree_depth(subtree, depth - 1):
                yield pos


def flatten_tree(tree, depth):
    ''' Yields positions exactly at less than depth '''
    if depth == 0:
        return
    yield next(tree)
    for subtree in tree:
        for pos in flatten_tree(subtree, depth - 1):
            yield pos


################################################################################
# Non chess related tools
################################################################################

# Disable buffering
class Unbuffered(object):
    def __init__(self, stream):
        self.stream = stream

    def write(self, data):
        self.stream.write(data)
        self.stream.flush()
        sys.stderr.write(data)
        sys.stderr.flush()

    def __getattr__(self, attr):
        return getattr(self.stream, attr)
