import React, { useState, useEffect } from 'react';
import { Window } from '../win95/Window';
import { Play, Pause, SkipBack, SkipForward, Volume2, Square } from 'lucide-react';

interface Track {
  name: string;
  artist: string;
  duration: string;
  durationSec: number;
}

const playlist: Track[] = [
  { name: 'Windows 95 Startup', artist: 'Brian Eno', duration: '0:06', durationSec: 6 },
  { name: 'The Microsoft Sound', artist: 'Brian Eno', duration: '0:03', durationSec: 3 },
  { name: 'Tada', artist: 'System', duration: '0:02', durationSec: 2 },
  { name: 'Chord', artist: 'System', duration: '0:01', durationSec: 1 },
  { name: 'Ding', artist: 'System', duration: '0:01', durationSec: 1 },
];

export const MusicPlayerWindow: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Move to next track
            if (currentTrack < playlist.length - 1) {
              setCurrentTrack(currentTrack + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + (100 / (playlist[currentTrack].durationSec * 10));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const formatTime = (percentage: number) => {
    const totalSec = playlist[currentTrack].durationSec;
    const currentSec = Math.floor((percentage / 100) * totalSec);
    const min = Math.floor(currentSec / 60);
    const sec = currentSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const playPause = () => setIsPlaying(!isPlaying);
  
  const stop = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack(prev => Math.max(0, prev - 1));
    setProgress(0);
  };

  const nextTrack = () => {
    setCurrentTrack(prev => Math.min(playlist.length - 1, prev + 1));
    setProgress(0);
  };

  return (
    <Window 
      id="musicplayer" 
      icon={<span>🎵</span>}
      menuBar={
        <div className="flex gap-4 px-2 py-1 bg-[#c0c0c0] border-b border-[#808080] text-sm">
          <span className="cursor-pointer hover:underline">File</span>
          <span className="cursor-pointer hover:underline">View</span>
          <span className="cursor-pointer hover:underline">Play</span>
          <span className="cursor-pointer hover:underline">Help</span>
        </div>
      }
    >
      <div className="flex flex-col h-full bg-[#c0c0c0] p-2">
        {/* Display */}
        <div className="win95-border-inset bg-[#000033] p-2 mb-2">
          <div className="text-green-400 font-mono text-xs">
            <div className="flex justify-between mb-1">
              <span>Track {currentTrack + 1}/{playlist.length}</span>
              <span>{formatTime(progress)} / {playlist[currentTrack].duration}</span>
            </div>
            <div className="text-lg truncate">{playlist[currentTrack].name}</div>
            <div className="text-xs text-green-300">{playlist[currentTrack].artist}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="win95-border-inset bg-[#c0c0c0] h-4 mb-2 relative">
          <div 
            className="h-full bg-[#000080]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-1 mb-2">
          <button className="win95-button p-1 min-w-0" onClick={prevTrack} title="Previous">
            <SkipBack size={16} />
          </button>
          <button className="win95-button p-1 min-w-0" onClick={playPause} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="win95-button p-1 min-w-0" onClick={stop} title="Stop">
            <Square size={16} />
          </button>
          <button className="win95-button p-1 min-w-0" onClick={nextTrack} title="Next">
            <SkipForward size={16} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 mb-2 px-2">
          <Volume2 size={16} />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs w-8">{volume}%</span>
        </div>

        {/* Playlist */}
        <div className="flex-1 win95-border-inset bg-white overflow-auto">
          {playlist.map((track, index) => (
            <div
              key={index}
              className={`px-2 py-1 flex justify-between text-xs cursor-pointer ${
                currentTrack === index ? 'bg-[#000080] text-white' : 'hover:bg-[#c0c0c0]'
              }`}
              onClick={() => {
                setCurrentTrack(index);
                setProgress(0);
              }}
              onDoubleClick={() => {
                setCurrentTrack(index);
                setProgress(0);
                setIsPlaying(true);
              }}
            >
              <span>{index + 1}. {track.name}</span>
              <span>{track.duration}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="win95-border-inset bg-[#c0c0c0] px-2 py-0.5 text-xs mt-1">
          {isPlaying ? 'Playing' : 'Stopped'} - {playlist.length} tracks
        </div>
      </div>
    </Window>
  );
};
