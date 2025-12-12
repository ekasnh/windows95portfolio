import React from 'react';
import { Window } from '../win95/Window';
import { ExternalLink } from 'lucide-react';

export const YouTubeWindow: React.FC = () => {
  const channelUrl = 'https://www.youtube.com/@ekanshagarwal1562';

  return (
    <Window 
      id="youtube" 
      icon={<span>📺</span>}
      menuBar={
        <div className="flex gap-4 px-2 py-1 bg-[#c0c0c0] border-b border-[#808080] text-sm">
          <span className="cursor-pointer hover:underline">File</span>
          <span className="cursor-pointer hover:underline">Edit</span>
          <span className="cursor-pointer hover:underline">View</span>
          <span className="cursor-pointer hover:underline">Favorites</span>
          <span className="cursor-pointer hover:underline">Help</span>
        </div>
      }
    >
      <div className="flex flex-col h-full bg-[#c0c0c0]">
        {/* Address Bar */}
        <div className="flex items-center gap-2 p-1 bg-[#c0c0c0] border-b border-[#808080]">
          <span className="text-xs font-bold">Address:</span>
          <div className="flex-1 win95-border-inset bg-white px-1 py-0.5">
            <span className="text-xs">{channelUrl}</span>
          </div>
          <button 
            className="win95-button px-2 py-0.5 text-xs"
            onClick={() => window.open(channelUrl, '_blank')}
          >
            Go
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-4 overflow-auto">
          <div className="text-center">
            {/* YouTube Logo styled */}
            <div className="inline-block bg-red-600 text-white px-4 py-2 rounded mb-4">
              <span className="text-2xl font-bold">You</span>
              <span className="text-2xl font-bold bg-white text-red-600 px-1 rounded">Tube</span>
            </div>
            
            <h2 className="text-lg font-bold mb-4">Ekansh Agarwal's Channel</h2>
            
            <div className="win95-border-outset p-4 bg-[#c0c0c0] max-w-md mx-auto">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-2">
                  <span className="text-4xl">📺</span>
                </div>
                <p className="font-bold">@ekanshagarwal1562</p>
              </div>

              <div className="win95-border-inset bg-white p-3 mb-4">
                <p className="text-sm text-gray-700">
                  Welcome to my YouTube channel! Here I share content about programming, 
                  technology, and more. Subscribe to stay updated!
                </p>
              </div>

              <button 
                className="win95-button w-full py-2 flex items-center justify-center gap-2 hover:bg-[#d0d0d0]"
                onClick={() => window.open(channelUrl, '_blank')}
              >
                <ExternalLink size={16} />
                <span className="font-bold">Visit My Channel</span>
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-600">
              Click the button above to open YouTube in your browser
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="win95-border-inset bg-[#c0c0c0] px-2 py-0.5 text-xs">
          Ready
        </div>
      </div>
    </Window>
  );
};
