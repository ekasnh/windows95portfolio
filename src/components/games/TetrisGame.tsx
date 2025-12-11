import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Window } from '../win95/Window';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 500;

type Piece = {
  shape: number[][];
  color: string;
  x: number;
  y: number;
};

const PIECES = [
  { shape: [[1,1,1,1]], color: '#00FFFF' }, // I
  { shape: [[1,1],[1,1]], color: '#FFFF00' }, // O
  { shape: [[0,1,0],[1,1,1]], color: '#800080' }, // T
  { shape: [[1,0,0],[1,1,1]], color: '#0000FF' }, // J
  { shape: [[0,0,1],[1,1,1]], color: '#FFA500' }, // L
  { shape: [[0,1,1],[1,1,0]], color: '#00FF00' }, // S
  { shape: [[1,1,0],[0,1,1]], color: '#FF0000' }, // Z
];

const createEmptyBoard = () => 
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));

const getRandomPiece = (): Piece => {
  const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
  return {
    shape: piece.shape.map(row => [...row]),
    color: piece.color,
    x: Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2),
    y: 0,
  };
};

export const TetrisGame: React.FC = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const isValidMove = useCallback((piece: Piece, board: string[][], offsetX = 0, offsetY = 0): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return false;
          if (newY >= 0 && board[newY][newX]) return false;
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece: Piece, board: string[][]): string[][] => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] && piece.y + y >= 0) {
          newBoard[piece.y + y][piece.x + x] = piece.color;
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((board: string[][]): { newBoard: string[][], linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => !cell));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    return { newBoard, linesCleared };
  }, []);

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  }, []);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    if (isValidMove(currentPiece, board, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      // Place piece and get new one
      let newBoard = placePiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      setBoard(clearedBoard);
      setScore(prev => prev + linesCleared * 100 + 10);

      const newPiece = getRandomPiece();
      if (!isValidMove(newPiece, clearedBoard)) {
        setGameOver(true);
        setCurrentPiece(null);
      } else {
        setCurrentPiece(newPiece);
      }
    }
  }, [currentPiece, board, gameOver, isPaused, isValidMove, placePiece, clearLines]);

  useEffect(() => {
    if (!gameOver && !isPaused && currentPiece) {
      gameLoopRef.current = setInterval(moveDown, INITIAL_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, isPaused, currentPiece, moveDown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentPiece || gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(currentPiece, board, -1, 0)) {
            setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
          }
          break;
        case 'ArrowRight':
          if (isValidMove(currentPiece, board, 1, 0)) {
            setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          const rotated = rotatePiece(currentPiece);
          if (isValidMove(rotated, board)) {
            setCurrentPiece(rotated);
          }
          break;
        case ' ':
          // Hard drop
          let dropY = 0;
          while (isValidMove(currentPiece, board, 0, dropY + 1)) dropY++;
          setCurrentPiece(prev => prev ? { ...prev, y: prev.y + dropY } : null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, board, gameOver, isPaused, isValidMove, moveDown, rotatePiece]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] && currentPiece.y + y >= 0) {
            displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
          }
        }
      }
    }

    return displayBoard;
  };

  return (
    <Window id="tetris" icon="🎮">
      <div className="p-2 font-win95 text-foreground">
        <div className="flex gap-4">
          {/* Game board */}
          <div className="win95-border-inset bg-win95-black p-1">
            {renderBoard().map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => (
                  <div
                    key={x}
                    className="tetris-cell"
                    style={{ backgroundColor: cell || '#1a1a1a' }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="win95-border-inset bg-win95-white p-2">
              <p className="text-sm font-bold">Score</p>
              <p className="text-lg">{score}</p>
            </div>

            <div className="space-y-2">
              {!currentPiece && !gameOver && (
                <button className="win95-button w-full" onClick={startGame}>
                  Start
                </button>
              )}
              {gameOver && (
                <button className="win95-button w-full" onClick={startGame}>
                  New Game
                </button>
              )}
              {currentPiece && !gameOver && (
                <button 
                  className="win95-button w-full" 
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>

            <div className="win95-border-inset bg-win95-white p-2 text-xs">
              <p className="font-bold mb-1">Controls:</p>
              <p>← → Move</p>
              <p>↑ Rotate</p>
              <p>↓ Drop</p>
              <p>Space Hard Drop</p>
            </div>

            {gameOver && (
              <div className="text-center font-bold text-destructive">
                Game Over!
              </div>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};
