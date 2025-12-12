import React from 'react';
import { Window } from '../win95/Window';
import { useWindows } from '@/contexts/WindowContext';

const GAMES = [
  { id: 'minesweeper', title: 'Minesweeper', icon: '💣', size: { width: 300, height: 380 } },
  { id: 'tetris', title: 'Tetris', icon: '🎮', size: { width: 340, height: 560 } },
  { id: 'solitaire', title: 'Solitaire', icon: '🃏', size: { width: 700, height: 550 } },
  { id: 'pong', title: 'Pong', icon: '🏓', size: { width: 500, height: 420 } },
  { id: 'chess', title: 'Chess', icon: '♟️', size: { width: 450, height: 520 } },
];

export const GamesFolderWindow: React.FC = () => {
  const { openWindow, closeWindow } = useWindows();

  const handleOpenGame = (game: typeof GAMES[0]) => {
    openWindow(game.id, game.title, game.size);
  };

  return (
    <Window id="games-folder" icon="📁">
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="win95-menubar flex gap-4 text-sm">
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">File</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">Edit</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">View</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">Help</span>
        </div>

        {/* Address Bar */}
        <div className="flex items-center gap-2 p-1 border-b border-border">
          <span className="text-sm">Address:</span>
          <div className="flex-1 win95-input text-sm">C:\Games</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 win95-border-inset bg-white m-1 p-2 overflow-auto">
          <div className="flex flex-wrap gap-4">
            {GAMES.map(game => (
              <div
                key={game.id}
                className="flex flex-col items-center p-2 cursor-pointer hover:bg-primary hover:text-primary-foreground w-20 text-center"
                onDoubleClick={() => handleOpenGame(game)}
              >
                <span className="text-4xl mb-1">{game.icon}</span>
                <span className="text-xs break-words">{game.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="win95-statusbar text-xs flex justify-between">
          <span>{GAMES.length} object(s)</span>
          <span>Games Folder</span>
        </div>
      </div>
    </Window>
  );
};
