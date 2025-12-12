import React, { useEffect, useState } from 'react';

interface ShutdownScreenProps {
  onComplete: () => void;
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'message' | 'black'>('message');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('black');
    }, 2500);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (stage === 'black') {
    return (
      <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
        <p className="text-white text-xl font-bold animate-fade-in">
          It's now safe to turn off your computer.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ backgroundColor: '#008080' }}>
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <div className="text-6xl mb-4">🪟</div>
          <h1 className="text-white text-3xl font-bold tracking-wide">
            Windows<span className="font-normal">95</span>
          </h1>
        </div>
        <p className="text-white text-xl">Windows is shutting down...</p>
        <div className="mt-6 w-64 mx-auto h-4 bg-[#000080] rounded-sm overflow-hidden win95-border-inset">
          <div 
            className="h-full bg-[#000080]"
            style={{
              background: 'repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #0000ff 8px, #0000ff 16px)',
              animation: 'shutdown-progress 2s linear forwards'
            }}
          />
        </div>
      </div>
    </div>
  );
};
