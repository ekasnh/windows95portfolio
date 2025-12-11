import React, { useState, useCallback } from 'react';
import { Window } from '../win95/Window';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const GRID_SIZE = 9;
const MINE_COUNT = 10;

const createEmptyGrid = (): CellState[][] => {
  return Array(GRID_SIZE).fill(null).map(() =>
    Array(GRID_SIZE).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
};

const placeMines = (grid: CellState[][], firstClickRow: number, firstClickCol: number): CellState[][] => {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  let minesPlaced = 0;
  
  while (minesPlaced < MINE_COUNT) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    
    if (!newGrid[row][col].isMine && !(row === firstClickRow && col === firstClickCol)) {
      newGrid[row][col].isMine = true;
      minesPlaced++;
    }
  }
  
  // Calculate adjacent mines
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!newGrid[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[r][c].adjacentMines = count;
      }
    }
  }
  
  return newGrid;
};

export const MinesweeperGame: React.FC = () => {
  const [grid, setGrid] = useState<CellState[][]>(createEmptyGrid());
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'ready'>('ready');
  const [flagCount, setFlagCount] = useState(0);

  const revealCell = useCallback((grid: CellState[][], row: number, col: number): CellState[][] => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return grid;
    if (grid[row][col].isRevealed || grid[row][col].isFlagged) return grid;
    
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].isRevealed = true;
    
    if (newGrid[row][col].adjacentMines === 0 && !newGrid[row][col].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            const result = revealCell(newGrid, row + dr, col + dc);
            for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                newGrid[r][c] = result[r][c];
              }
            }
          }
        }
      }
    }
    
    return newGrid;
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    if (grid[row][col].isFlagged) return;
    
    let newGrid = grid;
    
    if (gameState === 'ready') {
      newGrid = placeMines(grid, row, col);
      setGameState('playing');
    }
    
    if (newGrid[row][col].isMine) {
      // Reveal all mines
      newGrid = newGrid.map(r => r.map(c => ({
        ...c,
        isRevealed: c.isMine ? true : c.isRevealed,
      })));
      setGrid(newGrid);
      setGameState('lost');
      return;
    }
    
    newGrid = revealCell(newGrid, row, col);
    setGrid(newGrid);
    
    // Check win condition
    const unrevealedSafeCells = newGrid.flat().filter(c => !c.isRevealed && !c.isMine).length;
    if (unrevealedSafeCells === 0) {
      setGameState('won');
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing' && gameState !== 'ready') return;
    if (grid[row][col].isRevealed) return;
    
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
    setFlagCount(prev => newGrid[row][col].isFlagged ? prev + 1 : prev - 1);
  };

  const resetGame = () => {
    setGrid(createEmptyGrid());
    setGameState('ready');
    setFlagCount(0);
  };

  const getCellContent = (cell: CellState) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines === 0) return '';
    return cell.adjacentMines;
  };

  const getCellColor = (cell: CellState) => {
    if (!cell.isRevealed || cell.isMine) return '';
    const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-800', 'text-red-800', 'text-cyan-600', 'text-black', 'text-gray-500'];
    return colors[cell.adjacentMines] || '';
  };

  return (
    <Window id="minesweeper" icon="💣">
      <div className="p-2 font-win95 text-foreground">
        {/* Status bar */}
        <div className="win95-border-inset bg-win95-black p-2 mb-2 flex justify-between items-center">
          <div className="bg-red-900 text-red-500 px-2 font-mono">
            {String(MINE_COUNT - flagCount).padStart(3, '0')}
          </div>
          <button
            className="win95-button text-2xl !p-1 !min-w-0"
            onClick={resetGame}
          >
            {gameState === 'lost' ? '😵' : gameState === 'won' ? '😎' : '🙂'}
          </button>
          <div className="bg-red-900 text-red-500 px-2 font-mono">000</div>
        </div>

        {/* Grid */}
        <div className="win95-border-inset inline-block">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => (
                <button
                  key={colIndex}
                  className={`minesweeper-cell ${cell.isRevealed ? 'revealed' : 'unrevealed'} ${getCellColor(cell)}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                >
                  {getCellContent(cell)}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Game state message */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="mt-2 text-center text-sm">
            {gameState === 'won' ? '🎉 You Win!' : '💥 Game Over!'}
          </div>
        )}
      </div>
    </Window>
  );
};
