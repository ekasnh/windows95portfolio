import React, { useState } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { 
  User, 
  FolderOpen, 
  Settings, 
  Gamepad2, 
  FileText, 
  Mail, 
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Pencil,
  Image,
  Lock,
  Power
} from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLock: () => void;
  onShutdown: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onLock, onShutdown }) => {
  const { openWindow } = useWindows();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenWindow = (id: string, title: string, size?: { width: number; height: number }) => {
    openWindow(id, title, size);
    onClose();
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Ekansh_Agarwal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
    onClose();
  };

  const handleLock = () => {
    onLock();
    onClose();
  };

  const handleShutdown = () => {
    onShutdown();
    onClose();
  };

  return (
    <div 
      className="win95-start-menu absolute bottom-10 left-0 w-56 animate-slide-up"
      style={{ zIndex: 9999 }}
    >
      {/* Windows 95 side banner */}
      <div className="flex">
        <div className="bg-gradient-to-b from-[#000080] to-[#1084d0] w-7 flex items-end justify-center pb-2">
          <span className="text-white text-[10px] font-bold transform -rotate-90 whitespace-nowrap origin-center tracking-wide">
            Windows<span className="font-normal">95</span>
          </span>
        </div>
        
        <div className="flex-1 py-1">
          {/* Programs with submenu */}
          <div 
            className="win95-start-item relative"
            onMouseEnter={() => setActiveSubmenu('programs')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <FolderOpen size={18} />
            <span className="flex-1 text-sm">Programs</span>
            <ChevronRight size={14} />
            
            {activeSubmenu === 'programs' && (
              <div className="win95-start-menu absolute left-full top-0 w-44 animate-fade-in">
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('games-folder', 'Games', { width: 400, height: 350 })}
                >
                  <Gamepad2 size={16} />
                  <span className="text-sm">Games</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('notepad', 'Untitled - Notepad', { width: 500, height: 400 })}
                >
                  <FileText size={16} />
                  <span className="text-sm">Notepad</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('paint', 'untitled - Paint', { width: 550, height: 450 })}
                >
                  <Pencil size={16} />
                  <span className="text-sm">Paint</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('gallery', 'My Pictures', { width: 450, height: 400 })}
                >
                  <Image size={16} />
                  <span className="text-sm">Gallery</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('calculator', 'Calculator', { width: 240, height: 280 })}
                >
                  <span className="text-sm">🧮</span>
                  <span className="text-sm">Calculator</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('youtube', 'YouTube - Ekansh Agarwal', { width: 450, height: 400 })}
                >
                  <span className="text-sm">📺</span>
                  <span className="text-sm">YouTube</span>
                </div>
              </div>
            )}
          </div>

          {/* Documents submenu */}
          <div 
            className="win95-start-item relative"
            onMouseEnter={() => setActiveSubmenu('documents')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <FolderOpen size={18} />
            <span className="flex-1 text-sm">Documents</span>
            <ChevronRight size={14} />
            
            {activeSubmenu === 'documents' && (
              <div className="win95-start-menu absolute left-full top-0 w-44 animate-fade-in">
                <div className="win95-start-item" onClick={handleDownloadResume}>
                  <FileText size={16} />
                  <span className="text-sm">Download Resume</span>
                </div>
              </div>
            )}
          </div>

          {/* Settings submenu */}
          <div 
            className="win95-start-item relative"
            onMouseEnter={() => setActiveSubmenu('settings')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <Settings size={18} />
            <span className="flex-1 text-sm">Settings</span>
            <ChevronRight size={14} />
            
            {activeSubmenu === 'settings' && (
              <div className="win95-start-menu absolute left-full top-0 w-44 animate-fade-in">
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('wallpaper', 'Display Properties', { width: 400, height: 380 })}
                >
                  <Settings size={16} />
                  <span className="text-sm">Display</span>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-[#808080] mx-1 my-1" />

          {/* Portfolio */}
          <div 
            className="win95-start-item"
            onClick={() => handleOpenWindow('portfolio', 'Portfolio - Ekansh Agarwal', { width: 600, height: 500 })}
          >
            <User size={18} />
            <span className="text-sm">Portfolio</span>
          </div>

          {/* About */}
          <div 
            className="win95-start-item"
            onClick={() => handleOpenWindow('about', 'About Me', { width: 500, height: 450 })}
          >
            <User size={18} />
            <span className="text-sm">About Me</span>
          </div>

          {/* Contact */}
          <div 
            className="win95-start-item"
            onClick={() => handleOpenWindow('contact', 'Contact', { width: 400, height: 300 })}
          >
            <Mail size={18} />
            <span className="text-sm">Contact</span>
          </div>

          <div className="h-px bg-[#808080] mx-1 my-1" />

          {/* External Links */}
          <div 
            className="win95-start-item"
            onClick={() => handleExternalLink('https://github.com/ekasnh')}
          >
            <ExternalLink size={18} />
            <span className="text-sm">GitHub</span>
          </div>

          <div 
            className="win95-start-item"
            onClick={() => handleExternalLink('https://www.linkedin.com/in/ekansh-agarwal01/')}
          >
            <ExternalLink size={18} />
            <span className="text-sm">LinkedIn</span>
          </div>

          <div 
            className="win95-start-item"
            onClick={() => handleExternalLink('https://scholar.google.com/citations?user=xDg34AYAAAAJ&hl=en&authuser=1')}
          >
            <GraduationCap size={18} />
            <span className="text-sm">Google Scholar</span>
          </div>

          <div className="h-px bg-[#808080] mx-1 my-1" />

          {/* Lock */}
          <div 
            className="win95-start-item"
            onClick={handleLock}
          >
            <Lock size={18} />
            <span className="text-sm">Lock</span>
          </div>

          {/* Shut Down */}
          <div 
            className="win95-start-item"
            onClick={handleShutdown}
          >
            <Power size={18} />
            <span className="text-sm">Shut Down...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
