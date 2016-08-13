# Author: R. C. Howell
# Python 2.7.10
# Generating GLJ textual encodings of board positions
# GLJ for the last names of Debasis Ganguly, Johannes Leveling, and Gareth J. F. Jones
# Textual encoding based upon their 'Retrieval of Similar Chess Positions' paper written at Dublin City University School of Computing

import chess

# Chebyshev Distance is commonly known as 'Chess Distance'
# This is an implementation that takes in Cartesian Coordiantes
# https://en.wikipedia.org/wiki/Chebyshev_distance
def ChebyshevDistance(x1, y1, x2, y2):
    return max(abs(x2 - x1), abs(y2 - y1))

# Weight function from Ganguly, Leveling, and Jones' paper
def GLJweight(orig, dest):
    x1 = chess.file_index(orig)
    y1 = chess.rank_index(orig)
    x2 = chess.file_index(dest)
    y2 = chess.rank_index(dest)
    return 1 - ((7.0 * ChebyshevDistance(x1, y1, x2, y2)) / 64.0)

def generateGLJ(fen):
    # Initialize board with FEN
    board = chess.Board(fen, False)
    # print(board)
    # Loop through moves and add them to a 'moves_indexes' dictionary
    # keys represent the square (0-63) where a movable piece sits
    # values are an array of squares (0-63) where the respective piece can move
    moves_indexes = {}
    for move in board.legal_moves:
        # Get square index because it is much more efficient to reference later for calculations
        orig = chess.SQUARE_NAMES.index(str(move)[:2])
        try:
            dest = chess.SQUARE_NAMES.index(str(move)[2:4])
            if moves_indexes.has_key(orig):
                moves_indexes[orig].append(dest)
            else:
                # If key doesn't exist, then add it with 
                moves_indexes.update({ orig: [dest]})
        except ValueError:
            pass


    moves_weights = {}
    # 'moves_weights' stores the weights of moves calculated by GLJweight
    for orig in moves_indexes:
        moves_weights.update({orig : {}})
        for dest in moves_indexes[orig]:
            weight = "{0:.2f}".format(GLJweight(orig, dest))
            moves_weights[orig].update({ dest : weight })
    
    sanString = getSanString(board)
    moveString = getMoveString(board, moves_weights)
    return sanString + "\n" + moveString

def getSanString(board):
    result = ""
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            result += (str(piece) + chess.SQUARE_NAMES[square] + " ")
    return result

def getMoveString(board, moves):
    result = ""
    for orig in moves:
        for dest in moves[orig]:
            piece = board.piece_at(orig)
            result += (str(piece) + chess.SQUARE_NAMES[dest] + "|" + moves[orig][dest] + " ")
    return result
