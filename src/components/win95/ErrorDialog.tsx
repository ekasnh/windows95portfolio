import React from 'react';
import { X } from 'lucide-react';

interface ErrorDialogProps {
  title?: string;
  message: string;
  onClose: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({ 
  title = 'Fatal Exception', 
  message, 
  onClose 
}) => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[99999] animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={onClose}
    >
      <div 
        className="win95-border-outset bg-[#c0c0c0] min-w-[320px] max-w-md animate-window-open"
        onClick={e => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="bg-[#000080] px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">⛔</span>
            <span className="text-white text-sm font-bold">{title}</span>
          </div>
          <button 
            className="win95-button w-4 h-4 flex items-center justify-center p-0"
            onClick={onClose}
          >
            <X size={10} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-4 items-start mb-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-bold mb-2">A fatal exception has occurred!</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-4 p-2 win95-border-inset bg-white font-mono">
            Error Code: 0x8004005E<br />
            Module: HIRE_ME.DLL<br />
            Address: 0x1337CAFE
          </div>

          <div className="flex justify-center gap-2">
            <button 
              className="win95-button px-6 py-1"
              onClick={onClose}
            >
              OK
            </button>
            <button 
              className="win95-button px-4 py-1"
              onClick={() => {
                window.open('mailto:ekanshagarwal9090@gmail.com', '_blank');
                onClose();
              }}
            >
              Hire Ekansh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
