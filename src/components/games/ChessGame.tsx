import React, { useState, useCallback } from 'react';
import { Window } from '../win95/Window';

type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | null;
type PieceColor = 'white' | 'black' | null;
type Square = { type: PieceType; color: PieceColor };
type Position = { row: number; col: number };

const PIECES: Record<string, string> = {
  'K-white': '♔', 'Q-white': '♕', 'R-white': '♖', 'B-white': '♗', 'N-white': '♘', 'P-white': '♙',
  'K-black': '♚', 'Q-black': '♛', 'R-black': '♜', 'B-black': '♝', 'N-black': '♞', 'P-black': '♟',
};

const initialBoard = (): Square[][] => {
  const board: Square[][] = Array(8).fill(null).map(() => 
    Array(8).fill(null).map(() => ({ type: null, color: null }))
  );
  
  // Black pieces
  const backRow: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: backRow[i], color: 'black' };
    board[1][i] = { type: 'P', color: 'black' };
    board[6][i] = { type: 'P', color: 'white' };
    board[7][i] = { type: backRow[i], color: 'white' };
  }
  
  return board;
};

export const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Square[][]>(initialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('');
  const [capturedPieces, setCapturedPieces] = useState<{ white: string[]; black: string[] }>({ white: [], black: [] });

  const isInBounds = (row: number, col: number) => row >= 0 && row < 8 && col >= 0 && col < 8;

  const findKing = useCallback((board: Square[][], color: PieceColor): Position | null => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].type === 'K' && board[r][c].color === color) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }, []);

  const getRawMoves = useCallback((board: Square[][], row: number, col: number): Position[] => {
    const piece = board[row][col];
    if (!piece.type || !piece.color) return [];
    
    const moves: Position[] = [];
    const { type, color } = piece;
    const direction = color === 'white' ? -1 : 1;

    const addIfValid = (r: number, c: number, canCapture = true, mustCapture = false) => {
      if (!isInBounds(r, c)) return false;
      const target = board[r][c];
      if (!target.type) {
        if (!mustCapture) moves.push({ row: r, col: c });
        return true;
      }
      if (target.color !== color && canCapture) {
        moves.push({ row: r, col: c });
      }
      return false;
    };

    const addLine = (dr: number, dc: number) => {
      for (let i = 1; i < 8; i++) {
        if (!addIfValid(row + dr * i, col + dc * i)) break;
        if (board[row + dr * i][col + dc * i].type) break;
      }
    };

    switch (type) {
      case 'P':
        addIfValid(row + direction, col, false);
        if ((color === 'white' && row === 6) || (color === 'black' && row === 1)) {
          if (!board[row + direction][col].type) {
            addIfValid(row + direction * 2, col, false);
          }
        }
        if (isInBounds(row + direction, col - 1) && board[row + direction][col - 1].color && board[row + direction][col - 1].color !== color) {
          moves.push({ row: row + direction, col: col - 1 });
        }
        if (isInBounds(row + direction, col + 1) && board[row + direction][col + 1].color && board[row + direction][col + 1].color !== color) {
          moves.push({ row: row + direction, col: col + 1 });
        }
        break;
      case 'R':
        addLine(1, 0); addLine(-1, 0); addLine(0, 1); addLine(0, -1);
        break;
      case 'B':
        addLine(1, 1); addLine(1, -1); addLine(-1, 1); addLine(-1, -1);
        break;
      case 'Q':
        addLine(1, 0); addLine(-1, 0); addLine(0, 1); addLine(0, -1);
        addLine(1, 1); addLine(1, -1); addLine(-1, 1); addLine(-1, -1);
        break;
      case 'N':
        [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dr, dc]) => {
          addIfValid(row + dr, col + dc);
        });
        break;
      case 'K':
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => {
          addIfValid(row + dr, col + dc);
        });
        break;
    }
    
    return moves;
  }, []);

  const isSquareAttacked = useCallback((board: Square[][], row: number, col: number, byColor: PieceColor): boolean => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].color === byColor) {
          const moves = getRawMoves(board, r, c);
          if (moves.some(m => m.row === row && m.col === col)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [getRawMoves]);

  const isInCheck = useCallback((board: Square[][], color: PieceColor): boolean => {
    const king = findKing(board, color);
    if (!king) return false;
    const enemy = color === 'white' ? 'black' : 'white';
    return isSquareAttacked(board, king.row, king.col, enemy);
  }, [findKing, isSquareAttacked]);

  const getValidMoves = useCallback((row: number, col: number): Position[] => {
    const piece = board[row][col];
    if (!piece.type || piece.color !== currentPlayer) return [];
    
    const rawMoves = getRawMoves(board, row, col);
    
    // Filter moves that would leave king in check
    return rawMoves.filter(move => {
      const newBoard = board.map(r => r.map(c => ({ ...c })));
      newBoard[move.row][move.col] = newBoard[row][col];
      newBoard[row][col] = { type: null, color: null };
      return !isInCheck(newBoard, currentPlayer);
    });
  }, [board, currentPlayer, getRawMoves, isInCheck]);

  const hasAnyValidMoves = useCallback((color: PieceColor): boolean => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].color === color) {
          const moves = getValidMoves(r, c);
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  }, [board, getValidMoves]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameStatus.includes('Checkmate') || gameStatus.includes('Stalemate')) return;

    const clickedPiece = board[row][col];

    if (selectedSquare) {
      const moveIsValid = validMoves.some(m => m.row === row && m.col === col);
      
      if (moveIsValid) {
        const newBoard = board.map(r => r.map(c => ({ ...c })));
        const movingPiece = newBoard[selectedSquare.row][selectedSquare.col];
        
        // Handle capture
        if (newBoard[row][col].type) {
          const captured = PIECES[`${newBoard[row][col].type}-${newBoard[row][col].color}`];
          setCapturedPieces(prev => ({
            ...prev,
            [currentPlayer]: [...prev[currentPlayer], captured],
          }));
        }
        
        // Pawn promotion
        if (movingPiece.type === 'P' && (row === 0 || row === 7)) {
          movingPiece.type = 'Q';
        }
        
        newBoard[row][col] = movingPiece;
        newBoard[selectedSquare.row][selectedSquare.col] = { type: null, color: null };
        
        setBoard(newBoard);
        setSelectedSquare(null);
        setValidMoves([]);
        
        const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
        setCurrentPlayer(nextPlayer);
        
        // Check game status
        setTimeout(() => {
          const inCheck = isInCheck(newBoard, nextPlayer);
          const hasMoves = hasAnyValidMoves(nextPlayer);
          
          if (inCheck && !hasMoves) {
            setGameStatus(`Checkmate! ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`);
          } else if (!hasMoves) {
            setGameStatus('Stalemate! Draw!');
          } else if (inCheck) {
            setGameStatus(`${nextPlayer.charAt(0).toUpperCase() + nextPlayer.slice(1)} is in check!`);
          } else {
            setGameStatus('');
          }
        }, 100);
      } else if (clickedPiece.color === currentPlayer) {
        // Select different piece
        setSelectedSquare({ row, col });
        setValidMoves(getValidMoves(row, col));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (clickedPiece.color === currentPlayer) {
      setSelectedSquare({ row, col });
      setValidMoves(getValidMoves(row, col));
    }
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setSelectedSquare(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setGameStatus('');
    setCapturedPieces({ white: [], black: [] });
  };

  return (
    <Window id="chess" icon="♟️">
      <div className="p-2 font-win95 text-foreground">
        {/* Status */}
        <div className="win95-border-inset bg-win95-white p-2 mb-2 flex justify-between items-center">
          <span>Turn: {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}</span>
          <button className="win95-button" onClick={resetGame}>New Game</button>
        </div>

        {gameStatus && (
          <div className="win95-border-inset bg-win95-white p-2 mb-2 text-center font-bold text-destructive">
            {gameStatus}
          </div>
        )}

        {/* Board */}
        <div className="win95-border-inset inline-block">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((square, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);
                
                return (
                  <div
                    key={colIndex}
                    className={`chess-cell cursor-pointer ${isLight ? 'chess-light' : 'chess-dark'} ${isSelected ? 'chess-selected' : ''} ${isValidMove ? 'chess-valid-move' : ''}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {square.type && PIECES[`${square.type}-${square.color}`]}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Captured pieces */}
        <div className="mt-2 flex gap-4 text-sm">
          <div>
            <span className="font-bold">White captured: </span>
            {capturedPieces.white.join(' ')}
          </div>
          <div>
            <span className="font-bold">Black captured: </span>
            {capturedPieces.black.join(' ')}
          </div>
        </div>
      </div>
    </Window>
  );
};
