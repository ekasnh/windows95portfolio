import React, { useRef, useState, useEffect } from 'react';
import { Window } from '../win95/Window';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
];

const TOOLS = ['pencil', 'brush', 'eraser', 'fill', 'line', 'rectangle', 'ellipse'] as const;
type Tool = typeof TOOLS[number];

export const PaintWindow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<Tool>('pencil');
  const [brushSize, setBrushSize] = useState(2);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    
    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);

    if (tool === 'pencil' || tool === 'brush') {
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === 'brush' ? brushSize * 3 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 4;
      ctx.lineCap = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) {
      setIsDrawing(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);

    if (tool === 'line') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    } else if (tool === 'ellipse') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      const radiusX = Math.abs(pos.x - startPos.x) / 2;
      const radiusY = Math.abs(pos.y - startPos.y) / 2;
      const centerX = (startPos.x + pos.x) / 2;
      const centerY = (startPos.y + pos.y) / 2;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }

    setIsDrawing(false);
    setStartPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const getToolIcon = (t: Tool) => {
    switch (t) {
      case 'pencil': return '✏️';
      case 'brush': return '🖌️';
      case 'eraser': return '🧽';
      case 'fill': return '🪣';
      case 'line': return '📏';
      case 'rectangle': return '⬜';
      case 'ellipse': return '⭕';
    }
  };

  return (
    <Window id="paint" icon="🎨">
      <div className="flex flex-col h-full">
        {/* Menu Bar */}
        <div className="win95-menubar flex gap-4 text-sm">
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">File</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">Edit</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">View</span>
          <span className="px-2 hover:bg-primary hover:text-primary-foreground cursor-pointer" onClick={clearCanvas}>Clear</span>
        </div>

        <div className="flex flex-1">
          {/* Tool Palette */}
          <div className="win95-border-inset p-1 flex flex-col gap-1 mr-1">
            {TOOLS.map(t => (
              <button
                key={t}
                className={`w-8 h-8 flex items-center justify-center text-sm ${tool === t ? 'win95-border-inset bg-secondary' : 'win95-border-outset'}`}
                onClick={() => setTool(t)}
                title={t}
              >
                {getToolIcon(t)}
              </button>
            ))}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 win95-border-inset bg-white overflow-auto">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            {/* Color Palette */}
            <div className="win95-border-inset p-1 mt-1 flex gap-1">
              <div 
                className="w-8 h-8 win95-border-inset"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-wrap gap-0.5 ml-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className={`w-4 h-4 ${color === c ? 'ring-1 ring-foreground' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="win95-statusbar text-xs text-muted-foreground">
          Tool: {tool} | Color: {color}
        </div>
      </div>
    </Window>
  );
};
