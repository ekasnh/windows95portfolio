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
      className="win95-window flex flex-col animate-window-open"
      style={style}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={`win95-titlebar ${!isActive ? 'win95-titlebar-inactive' : ''} cursor-move select-none`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          {icon && <span className="text-xs">{icon}</span>}
          <span className="text-xs font-bold truncate">{windowState.title}</span>
        </div>
        <div className="flex gap-px">
          <button
            className="win95-button !min-w-[14px] !p-0 w-[14px] h-[14px] flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
          >
            <Minus size={8} strokeWidth={3} />
          </button>
          <button
            className="win95-button !min-w-[14px] !p-0 w-[14px] h-[14px] flex items-center justify-center"
            onClick={(e) => { 
              e.stopPropagation(); 
              windowState.isMaximized ? restoreWindow(id) : maximizeWindow(id); 
            }}
          >
            <Square size={7} strokeWidth={2} />
          </button>
          <button
            className="win95-button !min-w-[14px] !p-0 w-[14px] h-[14px] flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
          >
            <X size={9} strokeWidth={3} />
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
      <div className="flex-1 overflow-auto bg-secondary win95-scrollbar">
        {children}
      </div>
    </div>
  );
};
