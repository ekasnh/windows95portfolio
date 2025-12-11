import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Window } from '../win95/Window';

const CANVAS_WIDTH = 450;
const CANVAS_HEIGHT = 300;
const PADDLE_HEIGHT = 60;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;

export const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState({ player: 0, cpu: 0 });
  
  const gameStateRef = useRef({
    player: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    cpu: { y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: BALL_SPEED, vy: BALL_SPEED },
    keys: { up: false, down: false },
  });

  const resetBall = useCallback(() => {
    const state = gameStateRef.current;
    state.ball.x = CANVAS_WIDTH / 2;
    state.ball.y = CANVAS_HEIGHT / 2;
    state.ball.vx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    state.ball.vy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Update player paddle
    if (state.keys.up && state.player.y > 0) {
      state.player.y -= PADDLE_SPEED;
    }
    if (state.keys.down && state.player.y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
      state.player.y += PADDLE_SPEED;
    }

    // Simple CPU AI
    const cpuCenter = state.cpu.y + PADDLE_HEIGHT / 2;
    if (cpuCenter < state.ball.y - 20) {
      state.cpu.y += PADDLE_SPEED * 0.7;
    } else if (cpuCenter > state.ball.y + 20) {
      state.cpu.y -= PADDLE_SPEED * 0.7;
    }
    state.cpu.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.cpu.y));

    // Update ball
    state.ball.x += state.ball.vx;
    state.ball.y += state.ball.vy;

    // Ball collision with top/bottom
    if (state.ball.y <= 0 || state.ball.y >= CANVAS_HEIGHT - BALL_SIZE) {
      state.ball.vy = -state.ball.vy;
    }

    // Ball collision with paddles
    // Player paddle
    if (
      state.ball.x <= PADDLE_WIDTH + 10 &&
      state.ball.y + BALL_SIZE >= state.player.y &&
      state.ball.y <= state.player.y + PADDLE_HEIGHT
    ) {
      state.ball.vx = Math.abs(state.ball.vx);
      const hitPos = (state.ball.y - state.player.y) / PADDLE_HEIGHT;
      state.ball.vy = (hitPos - 0.5) * 10;
    }

    // CPU paddle
    if (
      state.ball.x >= CANVAS_WIDTH - PADDLE_WIDTH - 10 - BALL_SIZE &&
      state.ball.y + BALL_SIZE >= state.cpu.y &&
      state.ball.y <= state.cpu.y + PADDLE_HEIGHT
    ) {
      state.ball.vx = -Math.abs(state.ball.vx);
      const hitPos = (state.ball.y - state.cpu.y) / PADDLE_HEIGHT;
      state.ball.vy = (hitPos - 0.5) * 10;
    }

    // Score
    if (state.ball.x < 0) {
      setScores(prev => ({ ...prev, cpu: prev.cpu + 1 }));
      resetBall();
    } else if (state.ball.x > CANVAS_WIDTH) {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
      resetBall();
    }

    // Draw
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(10, state.player.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH - 10, state.cpu.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(state.ball.x, state.ball.y, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = '32px VT323';
    ctx.textAlign = 'center';
    ctx.fillText(String(scores.player), CANVAS_WIDTH / 4, 40);
    ctx.fillText(String(scores.cpu), (CANVAS_WIDTH * 3) / 4, 40);
  }, [resetBall, scores]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameStarted, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        gameStateRef.current.keys.up = true;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        gameStateRef.current.keys.down = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        gameStateRef.current.keys.up = false;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        gameStateRef.current.keys.down = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setScores({ player: 0, cpu: 0 });
    resetBall();
    setGameStarted(true);
  };

  return (
    <Window id="pong" icon="🏓">
      <div className="p-2 font-win95 text-foreground">
        <div className="win95-border-inset bg-win95-black">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block"
          />
        </div>

        <div className="mt-2 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-bold">Player: {scores.player}</span>
            <span className="mx-4">|</span>
            <span className="font-bold">CPU: {scores.cpu}</span>
          </div>
          <button className="win95-button" onClick={startGame}>
            {gameStarted ? 'Restart' : 'Start'}
          </button>
        </div>

        <div className="mt-2 text-xs text-muted">
          Controls: ↑/W = Up, ↓/S = Down
        </div>
      </div>
    </Window>
  );
};
