import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (id: string, title: string, defaultSize?: { width: number; height: number }) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  wallpaper: string;
  setWallpaper: (wallpaper: string) => void;
  wallpapers: string[];
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

const WALLPAPERS = [
  '/wallpapers/default.png',
  '/wallpapers/wallpaper1.jpg',
  '/wallpapers/wallpaper2.png',
  '/wallpapers/clouds.jpg',
  '/wallpapers/forest.jpg',
  '/wallpapers/bubbles.jpg',
];

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);

  const openWindow = (id: string, title: string, defaultSize = { width: 500, height: 400 }) => {
    const existingWindow = windows.find(w => w.id === id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        restoreWindow(id);
      }
      focusWindow(id);
      return;
    }

    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);

    const offsetX = (windows.length % 5) * 30;
    const offsetY = (windows.length % 5) * 30;

    setWindows(prev => [...prev, {
      id,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZIndex,
      position: { x: 100 + offsetX, y: 50 + offsetY },
      size: defaultSize,
    }]);
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id && !w.isMinimized);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: true } : w
    ));
  };

  const restoreWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: false, isMaximized: false } : w
    ));
    focusWindow(id);
  };

  const focusWindow = (id: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: newZIndex } : w
    ));
    setActiveWindowId(id);
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  };

  return (
    <WindowContext.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      wallpaper,
      setWallpaper,
      wallpapers: WALLPAPERS,
    }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
};
