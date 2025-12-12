import React, { useEffect, useState } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'black' | 'logo' | 'loading'>('black');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Black screen
    const blackTimer = setTimeout(() => setPhase('logo'), 500);
    
    return () => clearTimeout(blackTimer);
  }, []);

  useEffect(() => {
    if (phase === 'logo') {
      const loadingTimer = setTimeout(() => setPhase('loading'), 1000);
      return () => clearTimeout(loadingTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 300);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
      
      return () => clearInterval(interval);
    }
  }, [phase, onComplete]);

  if (phase === 'black') {
    return <div className="fixed inset-0 bg-black z-[10000]" />;
  }

  return (
    <div className="fixed inset-0 bg-[#008080] z-[10000] flex flex-col items-center justify-center">
      {/* Windows 95 Logo */}
      <div className="flex flex-col items-center animate-fade-in">
        {/* Flag Logo */}
        <div className="relative mb-4">
          <svg width="200" height="160" viewBox="0 0 200 160">
            {/* Pixelated flying squares effect */}
            <g className="animate-pulse">
              <rect x="20" y="40" width="8" height="8" fill="#c0c0c0" opacity="0.4"/>
              <rect x="35" y="30" width="8" height="8" fill="#008080" opacity="0.5"/>
              <rect x="50" y="45" width="8" height="8" fill="#c0c0c0" opacity="0.3"/>
              <rect x="45" y="60" width="8" height="8" fill="#ff0000" opacity="0.6"/>
              <rect x="30" y="55" width="8" height="8" fill="#008080" opacity="0.4"/>
              <rect x="60" y="35" width="8" height="8" fill="#c0c0c0" opacity="0.5"/>
              <rect x="55" y="50" width="8" height="8" fill="#00ff00" opacity="0.4"/>
              <rect x="70" y="45" width="8" height="8" fill="#c0c0c0" opacity="0.3"/>
            </g>
            
            {/* Main Windows Flag */}
            <g transform="translate(70, 30)">
              {/* Black outline/wave shape */}
              <path d="M0,0 Q30,-15 60,0 L60,80 Q30,95 0,80 Z" fill="#000" stroke="#000" strokeWidth="3"/>
              
              {/* Red square */}
              <rect x="5" y="5" width="22" height="32" fill="#ff0000"/>
              
              {/* Green square */}
              <rect x="32" y="5" width="22" height="32" fill="#00ff00"/>
              
              {/* Blue square */}
              <rect x="5" y="42" width="22" height="32" fill="#0000ff"/>
              
              {/* Yellow square */}
              <rect x="32" y="42" width="22" height="32" fill="#ffff00"/>
            </g>
          </svg>
        </div>

        {/* Microsoft Windows 95 Text */}
        <div className="text-center mb-8">
          <p className="text-white text-lg font-thin tracking-wide mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
            Microsoft<sup className="text-xs">®</sup>
          </p>
          <h1 className="text-white text-5xl font-bold tracking-tight" style={{ fontFamily: 'Arial Black, sans-serif' }}>
            Windows<span className="font-normal align-super text-3xl ml-1">95</span>
          </h1>
        </div>

        {/* Loading Bar */}
        {phase === 'loading' && (
          <div className="w-64">
            <div className="win95-border-inset bg-[#c0c0c0] p-1">
              <div className="h-4 bg-[#c0c0c0] relative overflow-hidden">
                <div 
                  className="h-full transition-all duration-100"
                  style={{ 
                    width: `${progress}%`,
                    background: 'repeating-linear-gradient(90deg, #000080 0px, #000080 8px, transparent 8px, transparent 10px)'
                  }}
                />
              </div>
            </div>
            <p className="text-white text-center mt-4 text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
              Starting Windows 95...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
