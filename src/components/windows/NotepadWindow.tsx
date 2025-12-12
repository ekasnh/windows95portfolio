import React, { useState } from 'react';
import { Window } from '../win95/Window';

export const NotepadWindow: React.FC = () => {
  const [content, setContent] = useState(`Welcome to Notepad!

This is a Windows 95 style notepad application.
You can type anything here.

Contact: ekanshagarwal9090@gmail.com
`);

  return (
    <Window id="notepad" icon="📝">
      <div className="flex flex-col h-full">
        {/* Menu Bar */}
        <div className="win95-menubar flex gap-4 text-sm">
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">File</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">Edit</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">Search</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">Help</span>
        </div>
        
        {/* Text Area */}
        <div className="flex-1 p-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full win95-input resize-none font-mono text-sm focus:outline-none"
            style={{ minHeight: '300px' }}
            spellCheck={false}
          />
        </div>
        
        {/* Status Bar */}
        <div className="win95-statusbar text-xs text-muted-foreground">
          Ln 1, Col 1
        </div>
      </div>
    </Window>
  );
};
