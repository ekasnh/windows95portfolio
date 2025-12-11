import React, { useState } from 'react';
import { Window } from '../win95/Window';
import { useWindows } from '@/contexts/WindowContext';
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react';

export const WallpaperWindow: React.FC = () => {
  const { wallpaper, setWallpaper, wallpapers } = useWindows();
  const [selectedIndex, setSelectedIndex] = useState(wallpapers.indexOf(wallpaper));

  const handlePrev = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : wallpapers.length - 1;
    setSelectedIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = selectedIndex < wallpapers.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
  };

  const handleApply = () => {
    setWallpaper(wallpapers[selectedIndex]);
  };

  return (
    <Window id="wallpaper" icon="🖥️">
      <div className="p-4 space-y-4 font-win95 text-foreground">
        <div className="flex items-center gap-2 mb-4">
          <Monitor size={20} />
          <h2 className="font-bold">Display Properties</h2>
        </div>

        {/* Wallpaper Preview */}
        <div className="win95-border-inset bg-win95-black p-2">
          <div className="relative aspect-video">
            <img 
              src={wallpapers[selectedIndex]} 
              alt={`Wallpaper ${selectedIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button className="win95-button" onClick={handlePrev}>
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm">
            Wallpaper {selectedIndex + 1} of {wallpapers.length}
          </span>
          <button className="win95-button" onClick={handleNext}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Wallpaper List */}
        <div className="win95-border-inset bg-win95-white p-2 max-h-32 overflow-y-auto">
          {wallpapers.map((wp, index) => (
            <div 
              key={index}
              className={`p-1 cursor-pointer ${selectedIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
              onClick={() => setSelectedIndex(index)}
            >
              Wallpaper {index + 1}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button className="win95-button" onClick={handleApply}>
            Apply
          </button>
          <button className="win95-button" onClick={handleApply}>
            OK
          </button>
        </div>
      </div>
    </Window>
  );
};
