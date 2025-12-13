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
import { FileExplorerWindow } from './windows/FileExplorerWindow';
import { MusicPlayerWindow } from './windows/MusicPlayerWindow';
import { RecycleBinWindow } from './windows/RecycleBinWindow';
import { CommandPromptWindow } from './windows/CommandPromptWindow';
import { InternetExplorerWindow } from './windows/InternetExplorerWindow';
import { MinesweeperGame } from './games/MinesweeperGame';
import { TetrisGame } from './games/TetrisGame';
import { SolitaireGame } from './games/SolitaireGame';
import { PongGame } from './games/PongGame';
import { ChessGame } from './games/ChessGame';
import { User, Mail, FileText, Monitor, Folder, Music, Trash2, Terminal, Globe } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { openWindow, wallpaper, windows } = useWindows();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

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
        {/* Desktop Icons - Two Columns */}
        <div className="absolute top-3 left-3 flex gap-1">
          {/* First Column */}
          <div className="flex flex-col gap-1">
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
            <DesktopIcon
              icon={<Folder size={28} className="text-yellow-400 drop-shadow-lg" />}
              label="My Computer"
              onDoubleClick={() => openWindow('explorer', 'My Computer', { width: 500, height: 400 })}
            />
            <DesktopIcon
              icon={<Music size={28} className="text-purple-400 drop-shadow-lg" />}
              label="Media Player"
              onDoubleClick={() => openWindow('musicplayer', 'Media Player', { width: 320, height: 380 })}
            />
          </div>
          
          {/* Second Column */}
          <div className="flex flex-col gap-1">
            <DesktopIcon
              icon={<Trash2 size={28} className="text-gray-300 drop-shadow-lg" />}
              label="Recycle Bin"
              onDoubleClick={() => openWindow('recycle-bin', 'Recycle Bin', { width: 400, height: 350 })}
            />
            <DesktopIcon
              icon={<Terminal size={28} className="text-green-400 drop-shadow-lg" />}
              label="Command Prompt"
              onDoubleClick={() => openWindow('cmd', 'Command Prompt', { width: 500, height: 350 })}
            />
            <DesktopIcon
              icon={<Globe size={28} className="text-blue-400 drop-shadow-lg" />}
              label="Internet Explorer"
              onDoubleClick={() => openWindow('ie', 'Internet Explorer - Resume', { width: 600, height: 500 })}
            />
          </div>
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
        {windows.find(w => w.id === 'explorer') && <FileExplorerWindow />}
        {windows.find(w => w.id === 'musicplayer') && <MusicPlayerWindow />}
        {windows.find(w => w.id === 'recycle-bin') && <RecycleBinWindow />}
        {windows.find(w => w.id === 'cmd') && <CommandPromptWindow />}
        {windows.find(w => w.id === 'ie') && <InternetExplorerWindow />}
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
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      </div>
    </>
  );
};
