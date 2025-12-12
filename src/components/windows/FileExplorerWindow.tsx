import React, { useState } from 'react';
import { Window } from '../win95/Window';
import { Folder, FileText, Image, Music, ArrowUp, Home } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'file' | 'image' | 'music';
  size?: string;
  modified?: string;
  children?: FileItem[];
}

const fileSystem: FileItem = {
  name: 'My Computer',
  type: 'folder',
  children: [
    {
      name: 'C:',
      type: 'folder',
      children: [
        {
          name: 'Windows',
          type: 'folder',
          children: [
            { name: 'System32', type: 'folder', children: [] },
            { name: 'Fonts', type: 'folder', children: [] },
            { name: 'win.ini', type: 'file', size: '2 KB' },
          ]
        },
        {
          name: 'Program Files',
          type: 'folder',
          children: [
            { name: 'Internet Explorer', type: 'folder', children: [] },
            { name: 'Microsoft Office', type: 'folder', children: [] },
          ]
        },
        {
          name: 'My Documents',
          type: 'folder',
          children: [
            { name: 'Resume.pdf', type: 'file', size: '156 KB' },
            { name: 'Projects.txt', type: 'file', size: '4 KB' },
            { name: 'Notes.txt', type: 'file', size: '1 KB' },
          ]
        },
        {
          name: 'My Pictures',
          type: 'folder',
          children: [
            { name: 'wallpaper1.jpg', type: 'image', size: '245 KB' },
            { name: 'wallpaper2.png', type: 'image', size: '189 KB' },
            { name: 'screenshot.bmp', type: 'image', size: '1.2 MB' },
          ]
        },
        {
          name: 'My Music',
          type: 'folder',
          children: [
            { name: 'startup.wav', type: 'music', size: '892 KB' },
            { name: 'tada.wav', type: 'music', size: '156 KB' },
          ]
        },
      ]
    },
    {
      name: 'D:',
      type: 'folder',
      children: [
        { name: 'Games', type: 'folder', children: [] },
        { name: 'Backup', type: 'folder', children: [] },
      ]
    },
  ]
};

export const FileExplorerWindow: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['My Computer']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const getCurrentFolder = (): FileItem[] => {
    let current: FileItem = fileSystem;
    for (let i = 1; i < currentPath.length; i++) {
      const found = current.children?.find(c => c.name === currentPath[i]);
      if (found) current = found;
    }
    return current.children || [];
  };

  const navigateTo = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
      setSelectedItem(null);
    }
  };

  const goUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedItem(null);
    }
  };

  const goHome = () => {
    setCurrentPath(['My Computer']);
    setSelectedItem(null);
  };

  const getIcon = (item: FileItem) => {
    switch (item.type) {
      case 'folder': return <Folder size={32} className="text-yellow-500" />;
      case 'image': return <Image size={32} className="text-green-600" />;
      case 'music': return <Music size={32} className="text-purple-600" />;
      default: return <FileText size={32} className="text-gray-600" />;
    }
  };

  return (
    <Window 
      id="explorer" 
      icon={<Folder size={16} />}
      menuBar={
        <div className="flex gap-4 px-2 py-1 bg-[#c0c0c0] border-b border-[#808080] text-sm">
          <span className="cursor-pointer hover:underline">File</span>
          <span className="cursor-pointer hover:underline">Edit</span>
          <span className="cursor-pointer hover:underline">View</span>
          <span className="cursor-pointer hover:underline">Help</span>
        </div>
      }
    >
      <div className="flex flex-col h-full bg-[#c0c0c0]">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-1 border-b border-[#808080]">
          <button 
            className="win95-button p-1 min-w-0"
            onClick={goUp}
            disabled={currentPath.length <= 1}
            title="Up"
          >
            <ArrowUp size={16} />
          </button>
          <button 
            className="win95-button p-1 min-w-0"
            onClick={goHome}
            title="Home"
          >
            <Home size={16} />
          </button>
          <div className="flex-1 win95-border-inset bg-white px-2 py-0.5 ml-2">
            <span className="text-xs">{currentPath.join(' \\ ')}</span>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 bg-white win95-border-inset m-1 overflow-auto">
          <div className="grid grid-cols-4 gap-2 p-2">
            {getCurrentFolder().map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-2 cursor-pointer rounded ${
                  selectedItem === item.name ? 'bg-[#000080] text-white' : 'hover:bg-[#c0c0c0]'
                }`}
                onClick={() => setSelectedItem(item.name)}
                onDoubleClick={() => navigateTo(item)}
              >
                {getIcon(item)}
                <span className="text-xs text-center mt-1 break-all">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="win95-border-inset bg-[#c0c0c0] px-2 py-0.5 text-xs flex gap-4">
          <span>{getCurrentFolder().length} object(s)</span>
          {selectedItem && <span>Selected: {selectedItem}</span>}
        </div>
      </div>
    </Window>
  );
};
