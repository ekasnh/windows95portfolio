import React, { useState } from 'react';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      setClickCount(0);
      onDoubleClick();
    } else {
      setIsSelected(true);
      setClickCount(1);
      const timer = setTimeout(() => {
        setClickCount(0);
        setClickTimer(null);
      }, 300);
      setClickTimer(timer);
    }
  };

  return (
    <div
      className={`win95-desktop-icon ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onBlur={() => setIsSelected(false)}
      tabIndex={0}
    >
      <div className="text-4xl mb-1">{icon}</div>
      <span className="text-xs font-win95 leading-tight">{label}</span>
    </div>
  );
};
