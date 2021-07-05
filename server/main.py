import random
import chess
import time

board = chess.Board()

print(type(board.legal_moves))

while not board.is_game_over():
    print("\n   -----------------   \n")
    print(board)
    board.push(random.choice([move for move in board.legal_moves]))
    time.sleep(1)

print("Finished")
