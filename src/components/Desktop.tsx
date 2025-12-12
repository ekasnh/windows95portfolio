import React, { useState } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { DesktopIcon } from './win95/DesktopIcon';
import { Taskbar } from './win95/Taskbar';
import { ContextMenu } from './win95/ContextMenu';
import { LockScreen } from './win95/LockScreen';
import { ErrorDialog } from './win95/ErrorDialog';
import { ShutdownScreen } from './ShutdownScreen';
import { PortfolioWindow } from './windows/PortfolioWindow';
import { AboutWindow } from './windows/AboutWindow';
import { ContactWindow } from './windows/ContactWindow';
import { WallpaperWindow } from './windows/WallpaperWindow';
import { NotepadWindow } from './windows/NotepadWindow';
import { PaintWindow } from './windows/PaintWindow';
import { GalleryWindow } from './windows/GalleryWindow';
import { GamesFolderWindow } from './windows/GamesFolderWindow';
import { CalculatorWindow } from './windows/CalculatorWindow';
import { YouTubeWindow } from './windows/YouTubeWindow';
import { MinesweeperGame } from './games/MinesweeperGame';
import { TetrisGame } from './games/TetrisGame';
import { SolitaireGame } from './games/SolitaireGame';
import { PongGame } from './games/PongGame';
import { ChessGame } from './games/ChessGame';
import { User, Mail, FileText, Monitor } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { openWindow, wallpaper, windows } = useWindows();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Ekansh_Agarwal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Only show context menu when clicking on the desktop background
    const target = e.target as HTMLElement;
    if (target.closest('.win95-desktop-icon') || target.closest('.win95-window')) {
      return;
    }
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleShutdown = () => {
    setIsShuttingDown(true);
  };

  const handleShutdownComplete = () => {
    // Reload the page to simulate restart
    window.location.reload();
  };

  return (
    <>
      {isShuttingDown && <ShutdownScreen onComplete={handleShutdownComplete} />}
      {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
      {errorMessage && (
        <ErrorDialog 
          message={errorMessage} 
          onClose={() => setErrorMessage(null)} 
        />
      )}
      
      <div 
        className="fixed inset-0 overflow-hidden"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onContextMenu={handleContextMenu}
      >
        {/* Desktop Icons - Single Column, Vertical Alignment */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <DesktopIcon
            icon={<User size={28} className="text-white drop-shadow-lg" />}
            label="Portfolio"
            onDoubleClick={() => openWindow('portfolio', 'Portfolio - Ekansh Agarwal', { width: 600, height: 500 })}
          />
          <DesktopIcon
            icon={<User size={28} className="text-white drop-shadow-lg" />}
            label="About Me"
            onDoubleClick={() => openWindow('about', 'About Me', { width: 500, height: 450 })}
          />
          <DesktopIcon
            icon={<Mail size={28} className="text-white drop-shadow-lg" />}
            label="Contact"
            onDoubleClick={() => openWindow('contact', 'Contact', { width: 400, height: 350 })}
          />
          <DesktopIcon
            icon={<FileText size={28} className="text-white drop-shadow-lg" />}
            label="Resume"
            onDoubleClick={handleDownloadResume}
          />
          <DesktopIcon
            icon={<span className="text-2xl drop-shadow-lg">📁</span>}
            label="Games"
            onDoubleClick={() => openWindow('games-folder', 'Games', { width: 400, height: 350 })}
          />
          <DesktopIcon
            icon={<span className="text-2xl drop-shadow-lg">📝</span>}
            label="Notepad"
            onDoubleClick={() => openWindow('notepad', 'Untitled - Notepad', { width: 500, height: 400 })}
          />
          <DesktopIcon
            icon={<span className="text-2xl drop-shadow-lg">🎨</span>}
            label="Paint"
            onDoubleClick={() => openWindow('paint', 'untitled - Paint', { width: 550, height: 450 })}
          />
          <DesktopIcon
            icon={<span className="text-2xl drop-shadow-lg">🖼️</span>}
            label="Gallery"
            onDoubleClick={() => openWindow('gallery', 'My Pictures', { width: 450, height: 400 })}
          />
          <DesktopIcon
            icon={<span className="text-2xl drop-shadow-lg">🧮</span>}
            label="Calculator"
            onDoubleClick={() => openWindow('calculator', 'Calculator', { width: 240, height: 280 })}
          />
          <DesktopIcon
            icon={<span className="text-2xl drop-shadow-lg">📺</span>}
            label="YouTube"
            onDoubleClick={() => openWindow('youtube', 'YouTube - Ekansh Agarwal', { width: 450, height: 400 })}
          />
          <DesktopIcon
            icon={<Monitor size={28} className="text-white drop-shadow-lg" />}
            label="Easter Egg"
            onDoubleClick={() => setErrorMessage("Fatal Exception: You must hire me! Contact: ekanshagarwal9090@gmail.com")}
          />
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu 
            x={contextMenu.x} 
            y={contextMenu.y} 
            onClose={() => setContextMenu(null)} 
          />
        )}

        {/* Windows */}
        {windows.find(w => w.id === 'portfolio') && <PortfolioWindow />}
        {windows.find(w => w.id === 'about') && <AboutWindow />}
        {windows.find(w => w.id === 'contact') && <ContactWindow />}
        {windows.find(w => w.id === 'wallpaper') && <WallpaperWindow />}
        {windows.find(w => w.id === 'notepad') && <NotepadWindow />}
        {windows.find(w => w.id === 'paint') && <PaintWindow />}
        {windows.find(w => w.id === 'gallery') && <GalleryWindow />}
        {windows.find(w => w.id === 'games-folder') && <GamesFolderWindow />}
        {windows.find(w => w.id === 'calculator') && <CalculatorWindow />}
        {windows.find(w => w.id === 'youtube') && <YouTubeWindow />}
        {windows.find(w => w.id === 'minesweeper') && <MinesweeperGame />}
        {windows.find(w => w.id === 'tetris') && <TetrisGame />}
        {windows.find(w => w.id === 'solitaire') && <SolitaireGame />}
        {windows.find(w => w.id === 'pong') && <PongGame />}
        {windows.find(w => w.id === 'chess') && <ChessGame />}

        {/* Taskbar */}
        <Taskbar 
          onLock={() => setIsLocked(true)} 
          onShutdown={handleShutdown}
          onShowError={(msg) => setErrorMessage(msg)}
        />
      </div>
    </>
  );
};
