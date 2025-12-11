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
  GraduationCap
} from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
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

  return (
    <div className="win95-start-menu absolute bottom-10 left-0 w-64" style={{ zIndex: 9999 }}>
      {/* Windows 95 side banner */}
      <div className="flex">
        <div className="bg-gradient-to-b from-primary to-accent w-8 flex items-end justify-center pb-2">
          <span className="text-primary-foreground text-xs font-bold transform -rotate-90 whitespace-nowrap origin-center">
            Windows<span className="font-normal">95</span>
          </span>
        </div>
        
        <div className="flex-1">
          {/* Programs with submenu */}
          <div 
            className="win95-start-item relative"
            onMouseEnter={() => setActiveSubmenu('programs')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <FolderOpen size={20} />
            <span className="flex-1 font-win95">Programs</span>
            <ChevronRight size={16} />
            
            {activeSubmenu === 'programs' && (
              <div className="win95-start-menu absolute left-full top-0 w-48">
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('minesweeper', 'Minesweeper', { width: 300, height: 380 })}
                >
                  <Gamepad2 size={16} />
                  <span className="font-win95">Minesweeper</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('tetris', 'Tetris', { width: 320, height: 500 })}
                >
                  <Gamepad2 size={16} />
                  <span className="font-win95">Tetris</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('solitaire', 'Solitaire', { width: 700, height: 550 })}
                >
                  <Gamepad2 size={16} />
                  <span className="font-win95">Solitaire</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('pong', 'Pong', { width: 500, height: 400 })}
                >
                  <Gamepad2 size={16} />
                  <span className="font-win95">Pong</span>
                </div>
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('chess', 'Chess', { width: 450, height: 500 })}
                >
                  <Gamepad2 size={16} />
                  <span className="font-win95">Chess</span>
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
            <FolderOpen size={20} />
            <span className="flex-1 font-win95">Documents</span>
            <ChevronRight size={16} />
            
            {activeSubmenu === 'documents' && (
              <div className="win95-start-menu absolute left-full top-0 w-48">
                <div className="win95-start-item" onClick={handleDownloadResume}>
                  <FileText size={16} />
                  <span className="font-win95">Download Resume</span>
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
            <Settings size={20} />
            <span className="flex-1 font-win95">Settings</span>
            <ChevronRight size={16} />
            
            {activeSubmenu === 'settings' && (
              <div className="win95-start-menu absolute left-full top-0 w-48">
                <div 
                  className="win95-start-item"
                  onClick={() => handleOpenWindow('wallpaper', 'Display Properties', { width: 400, height: 350 })}
                >
                  <Settings size={16} />
                  <span className="font-win95">Change Wallpaper</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-muted my-1" />

          {/* Portfolio */}
          <div 
            className="win95-start-item"
            onClick={() => handleOpenWindow('portfolio', 'Portfolio - Ekansh Agarwal', { width: 600, height: 500 })}
          >
            <User size={20} />
            <span className="font-win95">Portfolio</span>
          </div>

          {/* About */}
          <div 
            className="win95-start-item"
            onClick={() => handleOpenWindow('about', 'About Me', { width: 500, height: 450 })}
          >
            <User size={20} />
            <span className="font-win95">About Me</span>
          </div>

          {/* Contact */}
          <div 
            className="win95-start-item"
            onClick={() => handleOpenWindow('contact', 'Contact', { width: 400, height: 300 })}
          >
            <Mail size={20} />
            <span className="font-win95">Contact</span>
          </div>

          <div className="border-t border-muted my-1" />

          {/* External Links */}
          <div 
            className="win95-start-item"
            onClick={() => handleExternalLink('https://github.com/ekasnh')}
          >
            <ExternalLink size={20} />
            <span className="font-win95">GitHub</span>
          </div>

          <div 
            className="win95-start-item"
            onClick={() => handleExternalLink('https://www.linkedin.com/in/ekansh-agarwal01/')}
          >
            <ExternalLink size={20} />
            <span className="font-win95">LinkedIn</span>
          </div>

          <div 
            className="win95-start-item"
            onClick={() => handleExternalLink('https://scholar.google.com/citations?user=xDg34AYAAAAJ&hl=en&authuser=1')}
          >
            <GraduationCap size={20} />
            <span className="font-win95">Google Scholar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
