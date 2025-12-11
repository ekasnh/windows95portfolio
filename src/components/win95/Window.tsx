import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { Minus, Square, X } from 'lucide-react';

interface WindowProps {
  id: string;
  children: ReactNode;
  icon?: ReactNode;
  menuBar?: ReactNode;
}

export const Window: React.FC<WindowProps> = ({ id, children, icon, menuBar }) => {
  const { windows, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition } = useWindows();
  const windowState = windows.find(w => w.id === id);
  
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowState && !windowState.isMaximized) {
        updateWindowPosition(id, {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, updateWindowPosition, windowState]);

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y,
    });
  };

  const isActive = activeWindowId === id;

  const style: React.CSSProperties = windowState.isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 40px)',
        zIndex: windowState.zIndex,
      }
    : {
        position: 'absolute',
        left: windowState.position.x,
        top: windowState.position.y,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="win95-window flex flex-col"
      style={style}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={`win95-titlebar ${!isActive ? 'win95-titlebar-inactive' : ''} cursor-move`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-sm font-win95">{windowState.title}</span>
        </div>
        <div className="flex gap-[2px]">
          <button
            className="win95-button !min-w-[16px] !p-0 w-4 h-4 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
          >
            <Minus size={10} />
          </button>
          <button
            className="win95-button !min-w-[16px] !p-0 w-4 h-4 flex items-center justify-center"
            onClick={(e) => { 
              e.stopPropagation(); 
              windowState.isMaximized ? restoreWindow(id) : maximizeWindow(id); 
            }}
          >
            <Square size={8} />
          </button>
          <button
            className="win95-button !min-w-[16px] !p-0 w-4 h-4 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
          >
            <X size={10} />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      {menuBar && (
        <div className="win95-menubar">
          {menuBar}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto bg-secondary win95-scrollbar p-1">
        {children}
      </div>
    </div>
  );
};
