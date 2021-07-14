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
