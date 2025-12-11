import React from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { DesktopIcon } from './win95/DesktopIcon';
import { Taskbar } from './win95/Taskbar';
import { PortfolioWindow } from './windows/PortfolioWindow';
import { AboutWindow } from './windows/AboutWindow';
import { ContactWindow } from './windows/ContactWindow';
import { WallpaperWindow } from './windows/WallpaperWindow';
import { MinesweeperGame } from './games/MinesweeperGame';
import { TetrisGame } from './games/TetrisGame';
import { SolitaireGame } from './games/SolitaireGame';
import { PongGame } from './games/PongGame';
import { ChessGame } from './games/ChessGame';
import { User, FolderOpen, Mail, Gamepad2, FileText } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { openWindow, wallpaper, windows } = useWindows();

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Ekansh_Agarwal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <DesktopIcon
          icon={<User size={32} />}
          label="Portfolio"
          onDoubleClick={() => openWindow('portfolio', 'Portfolio - Ekansh Agarwal', { width: 600, height: 500 })}
        />
        <DesktopIcon
          icon={<User size={32} />}
          label="About Me"
          onDoubleClick={() => openWindow('about', 'About Me', { width: 500, height: 450 })}
        />
        <DesktopIcon
          icon={<Mail size={32} />}
          label="Contact"
          onDoubleClick={() => openWindow('contact', 'Contact', { width: 400, height: 350 })}
        />
        <DesktopIcon
          icon={<FileText size={32} />}
          label="Resume"
          onDoubleClick={handleDownloadResume}
        />
      </div>

      {/* Games column */}
      <div className="absolute top-4 left-28 flex flex-col gap-2">
        <DesktopIcon
          icon={<span className="text-3xl">💣</span>}
          label="Minesweeper"
          onDoubleClick={() => openWindow('minesweeper', 'Minesweeper', { width: 300, height: 380 })}
        />
        <DesktopIcon
          icon={<span className="text-3xl">🎮</span>}
          label="Tetris"
          onDoubleClick={() => openWindow('tetris', 'Tetris', { width: 340, height: 560 })}
        />
        <DesktopIcon
          icon={<span className="text-3xl">🃏</span>}
          label="Solitaire"
          onDoubleClick={() => openWindow('solitaire', 'Solitaire', { width: 700, height: 550 })}
        />
        <DesktopIcon
          icon={<span className="text-3xl">🏓</span>}
          label="Pong"
          onDoubleClick={() => openWindow('pong', 'Pong', { width: 500, height: 420 })}
        />
        <DesktopIcon
          icon={<span className="text-3xl">♟️</span>}
          label="Chess"
          onDoubleClick={() => openWindow('chess', 'Chess', { width: 450, height: 520 })}
        />
      </div>

      {/* Windows */}
      {windows.find(w => w.id === 'portfolio') && <PortfolioWindow />}
      {windows.find(w => w.id === 'about') && <AboutWindow />}
      {windows.find(w => w.id === 'contact') && <ContactWindow />}
      {windows.find(w => w.id === 'wallpaper') && <WallpaperWindow />}
      {windows.find(w => w.id === 'minesweeper') && <MinesweeperGame />}
      {windows.find(w => w.id === 'tetris') && <TetrisGame />}
      {windows.find(w => w.id === 'solitaire') && <SolitaireGame />}
      {windows.find(w => w.id === 'pong') && <PongGame />}
      {windows.find(w => w.id === 'chess') && <ChessGame />}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};
