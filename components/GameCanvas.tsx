
import React, { useRef, useEffect, useState } from 'react';
import { Level, GameState, Reality, Entity, Platform } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PHYSICS, THEME } from '../constants';

interface GameCanvasProps {
  level: Level;
  gameState: GameState;
  onWin: () => void;
  onFail: (reason: 'TIME' | 'HAZARD') => void;
  onRealityChange: (reality: Reality) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ level, gameState, onWin, onFail, onRealityChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Entity>({
    id: 'player',
    x: level.playerStart.x,
    y: level.playerStart.y,
    width: 24,
    height: 38,
    vx: 0,
    vy: 0,
    color: THEME.NORMAL.player,
  });

  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const realityRef = useRef<Reality>('NORMAL');
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isGroundedRef = useRef<boolean>(false);
  const shiftCooldownRef = useRef<number>(0);

  // Sync reality
  useEffect(() => {
    realityRef.current = gameState.reality;
  }, [gameState.reality]);

  // Initial Level Setup
  useEffect(() => {
    playerRef.current = {
      ...playerRef.current,
      x: level.playerStart.x,
      y: level.playerStart.y,
      vx: 0,
      vy: 0
    };
    onRealityChange('NORMAL');
  }, [level, onRealityChange]);

  const handleKeyDown = (e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.code]: true }));
    if (e.code === 'Space' && shiftCooldownRef.current <= 0) {
      const nextR = realityRef.current === 'NORMAL' ? 'SHIFTED' : 'NORMAL';
      onRealityChange(nextR);
      shiftCooldownRef.current = 15; // frames cooldown
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.code]: false }));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onRealityChange]);

  const update = () => {
    const player = playerRef.current;
    const currentReality = realityRef.current;
    
    // 1. Movement Input
    if (keys['KeyA'] || keys['ArrowLeft']) player.vx -= PHYSICS.MOVE_SPEED;
    if (keys['KeyD'] || keys['ArrowRight']) player.vx += PHYSICS.MOVE_SPEED;
    
    // 2. Jump Input
    if ((keys['KeyW'] || keys['ArrowUp']) && isGroundedRef.current) {
      player.vy = currentReality === 'NORMAL' ? PHYSICS.JUMP_FORCE : PHYSICS.SHIFTED_JUMP_FORCE;
      isGroundedRef.current = false;
    }

    // 3. Apply Physics
    player.vy += currentReality === 'NORMAL' ? PHYSICS.GRAVITY : PHYSICS.SHIFTED_GRAVITY;
    player.vx *= PHYSICS.FRICTION;
    
    // Clamp Speed
    player.vx = Math.max(Math.min(player.vx, PHYSICS.MAX_SPEED), -PHYSICS.MAX_SPEED);

    // 4. Update Position
    player.x += player.vx;
    player.y += player.vy;

    // 5. Collision Detection
    isGroundedRef.current = false;
    
    const activePlatforms = level.platforms.filter(p => 
      p.reality === 'BOTH' || p.reality === currentReality
    );

    activePlatforms.forEach(p => {
      if (
        player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y < p.y + p.height &&
        player.y + player.height > p.y
      ) {
        if (p.isHazard) {
          onFail('HAZARD');
          return;
        }

        // Resolving collisions
        const overlapX = Math.min(player.x + player.width - p.x, p.x + p.width - player.x);
        const overlapY = Math.min(player.y + player.height - p.y, p.y + p.height - player.y);

        if (overlapX < overlapY) {
          if (player.x < p.x) player.x = p.x - player.width;
          else player.x = p.x + p.width;
          player.vx = 0;
        } else {
          if (player.y < p.y) {
            player.y = p.y - player.height;
            if (currentReality === 'NORMAL') isGroundedRef.current = true;
          } else {
            player.y = p.y + p.height;
            if (currentReality === 'SHIFTED') isGroundedRef.current = true;
          }
          player.vy = 0;
        }
      }
    });

    // 6. Goal Check
    const goal = level.goal;
    if (
      player.x < goal.x + goal.width &&
      player.x + player.width > goal.x &&
      player.y < goal.y + goal.height &&
      player.y + player.height > goal.y
    ) {
      onWin();
    }

    // 7. Bounds Check
    if (player.y > CANVAS_HEIGHT + 100 || player.y < -100) {
      onFail('HAZARD');
    }

    // Cooldown decrement
    if (shiftCooldownRef.current > 0) shiftCooldownRef.current--;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const currentReality = realityRef.current;
    const theme = THEME[currentReality];

    // Clear background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid effect
    ctx.strokeStyle = currentReality === 'NORMAL' ? 'rgba(100, 150, 255, 0.05)' : 'rgba(255, 100, 100, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw Platforms
    level.platforms.forEach(p => {
      const isActive = p.reality === 'BOTH' || p.reality === currentReality;
      
      if (p.isHazard) {
        ctx.fillStyle = theme.hazard;
        // Animated spikes
        const segments = 10;
        const segWidth = p.width / segments;
        ctx.beginPath();
        for (let i = 0; i < segments; i++) {
          ctx.moveTo(p.x + (i * segWidth), p.y + p.height);
          ctx.lineTo(p.x + (i * segWidth) + (segWidth / 2), p.y);
          ctx.lineTo(p.x + ((i + 1) * segWidth), p.y + p.height);
        }
        ctx.fill();
      } else {
        if (isActive) {
          ctx.fillStyle = theme.activePlatform;
          ctx.shadowBlur = 10;
          ctx.shadowColor = theme.activePlatform;
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = theme.platform;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(p.x, p.y, p.width, p.height);
          ctx.setLineDash([]);
        }
      }
    });

    // Draw Goal
    const goal = level.goal;
    ctx.fillStyle = goal.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    // Rotating core effect
    ctx.save();
    ctx.translate(goal.x + goal.width / 2, goal.y + goal.height / 2);
    ctx.rotate(Date.now() / 1000);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(-goal.width / 1.5, -goal.height / 1.5, goal.width * 1.3, goal.height * 1.3);
    ctx.restore();
    ctx.shadowBlur = 0;

    // Draw Player
    const player = playerRef.current;
    ctx.fillStyle = theme.player;
    ctx.shadowBlur = 15;
    ctx.shadowColor = theme.player;
    
    // Trail effect
    ctx.globalAlpha = 0.5;
    ctx.fillRect(player.x - player.vx, player.y - player.vy, player.width, player.height);
    ctx.globalAlpha = 1.0;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player "eye" based on velocity
    ctx.fillStyle = 'white';
    const eyeX = player.x + (player.vx > 0 ? 15 : (player.vx < 0 ? 5 : 10));
    const eyeY = player.y + (currentReality === 'NORMAL' ? 10 : 25);
    ctx.fillRect(eyeX, eyeY, 4, 4);
    
    ctx.shadowBlur = 0;

    // Post processing - Scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < CANVAS_HEIGHT; i += 4) {
      ctx.fillRect(0, i, CANVAS_WIDTH, 1);
    }
  };

  const gameLoop = (time: number) => {
    if (gameState.status === 'PLAYING') {
      update();
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) draw(ctx);
    }
    
    frameRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gameState.status, level]);

  return (
    <div className="relative border-4 border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className={`transition-all duration-300 ${gameState.reality === 'SHIFTED' ? 'scale-[1.01] brightness-125' : ''}`}
      />
      {/* Reality Shift Visual Distortion */}
      {shiftCooldownRef.current > 10 && (
        <div className="absolute inset-0 bg-white/20 reality-shift-overlay pointer-events-none mix-blend-overlay" />
      )}
    </div>
  );
};

export default GameCanvas;
