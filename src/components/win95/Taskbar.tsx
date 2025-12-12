import React, { useState, useEffect } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { StartMenu } from './StartMenu';
import { Wifi, Bluetooth } from 'lucide-react';

interface TaskbarProps {
  onLock: () => void;
  onShutdown: () => void;
  onShowError: (message: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ onLock, onShutdown, onShowError }) => {
  const { windows, activeWindowId, restoreWindow, focusWindow, minimizeWindow } = useWindows();
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.start-menu-container')) {
        setIsStartMenuOpen(false);
      }
    };

    if (isStartMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isStartMenuOpen]);

  const handleTaskbarButtonClick = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (window) {
      if (window.isMinimized) {
        restoreWindow(windowId);
      } else if (activeWindowId === windowId) {
        minimizeWindow(windowId);
      } else {
        focusWindow(windowId);
      }
    }
  };

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] win95-border-outset flex items-center px-1 gap-1"
        style={{ zIndex: 9998 }}
      >
        {/* Start Button */}
        <div className="start-menu-container relative">
          <button
            className={`win95-button flex items-center gap-1 h-7 font-bold ${isStartMenuOpen ? 'win95-border-inset' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsStartMenuOpen(!isStartMenuOpen);
            }}
          >
            <span className="text-base">🪟</span>
            <span className="text-sm font-bold">Start</span>
          </button>
          <StartMenu 
            isOpen={isStartMenuOpen} 
            onClose={() => setIsStartMenuOpen(false)} 
            onLock={onLock}
            onShutdown={onShutdown}
          />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#808080] mx-1" />

        {/* Task buttons */}
        <div className="flex-1 flex gap-1 overflow-hidden">
          {windows.filter(w => w.isOpen).map(window => (
            <button
              key={window.id}
              className={`win95-button h-7 px-2 flex items-center gap-1 max-w-[140px] truncate text-left ${
                activeWindowId === window.id && !window.isMinimized ? 'win95-border-inset' : ''
              }`}
              onClick={() => handleTaskbarButtonClick(window.id)}
              title={window.title}
            >
              <span className="truncate text-xs">{window.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="win95-border-inset px-2 h-6 flex items-center gap-2 bg-[#c0c0c0]">
          <button
            className="hover:bg-[#d0d0d0] p-0.5 rounded-sm"
            onClick={() => window.open('https://github.com/ekasnh', '_blank')}
            title="Bluetooth - Connected to Devices"
          >
            <Bluetooth size={12} />
          </button>
          <button
            className="hover:bg-[#d0d0d0] p-0.5 rounded-sm"
            onClick={() => window.open('https://www.linkedin.com/in/ekansh-agarwal01/', '_blank')}
            title="Connected to Ekansh's Network"
          >
            <Wifi size={12} />
          </button>
          <span className="text-xs">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </>
  );
};
