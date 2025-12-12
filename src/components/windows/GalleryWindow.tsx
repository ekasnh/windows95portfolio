import React, { useState } from 'react';
import { Window } from '../win95/Window';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/wallpapers/default.png', title: 'Windows 95 Logo' },
  { src: '/wallpapers/wallpaper1.jpg', title: 'Wallpaper 1' },
  { src: '/wallpapers/wallpaper2.png', title: 'Wallpaper 2' },
  { src: '/wallpapers/clouds.jpg', title: 'Clouds' },
  { src: '/wallpapers/forest.jpg', title: 'Forest' },
  { src: '/wallpapers/bubbles.jpg', title: 'Bubbles' },
];

export const GalleryWindow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');

  const handlePrev = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : GALLERY_IMAGES.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < GALLERY_IMAGES.length - 1 ? prev + 1 : 0);
  };

  return (
    <Window id="gallery" icon="🖼️">
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="win95-menubar flex items-center gap-2 p-1">
          <button
            className={`win95-button text-xs ${viewMode === 'grid' ? 'win95-border-inset' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button
            className={`win95-button text-xs ${viewMode === 'single' ? 'win95-border-inset' : ''}`}
            onClick={() => setViewMode('single')}
          >
            Single
          </button>
        </div>

        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="flex-1 p-2 overflow-auto win95-border-inset bg-white m-1">
            <div className="grid grid-cols-3 gap-2">
              {GALLERY_IMAGES.map((img, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer p-1 ${currentIndex === index ? 'bg-primary' : 'hover:bg-secondary'}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setViewMode('single');
                  }}
                >
                  <div className="win95-border-inset bg-background">
                    <img 
                      src={img.src} 
                      alt={img.title}
                      className="w-full h-16 object-cover"
                    />
                  </div>
                  <p className={`text-xs text-center mt-1 truncate ${currentIndex === index ? 'text-primary-foreground' : ''}`}>
                    {img.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Single View */
          <div className="flex-1 flex flex-col p-1">
            <div className="flex-1 win95-border-inset bg-black flex items-center justify-center relative">
              <img 
                src={GALLERY_IMAGES[currentIndex].src}
                alt={GALLERY_IMAGES[currentIndex].title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <button className="win95-button" onClick={handlePrev}>
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-win95">
                {currentIndex + 1} / {GALLERY_IMAGES.length}
              </span>
              <button className="win95-button" onClick={handleNext}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="win95-statusbar text-xs flex justify-between">
          <span>{GALLERY_IMAGES[currentIndex].title}</span>
          <span>{GALLERY_IMAGES.length} images</span>
        </div>
      </div>
    </Window>
  );
};
