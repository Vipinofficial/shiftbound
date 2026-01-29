
import React, { useRef, useEffect } from 'react';
import { Level, GameState, Reality, Entity, Shard, Platform } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PHYSICS, THEME } from './constants';
import { audio } from './audio';

interface GameCanvasProps {
  level: Level;
  gameState: GameState;
  inputs: React.MutableRefObject<Record<string, boolean>>;
  onWin: () => void;
  onFail: () => void;
  onCollectShard: () => void;
  onRealityChange: () => void;
  onSizeChange: () => void;
}

const SPRITE_SIZE = 64;
const IDLE_FRAMES = 4;
const RUN_FRAMES = 6;

const GameCanvas: React.FC<GameCanvasProps> = ({ level, gameState, inputs, onWin, onFail, onCollectShard, onRealityChange, onSizeChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteSheetRef = useRef<HTMLCanvasElement | null>(null);
  const shardsRef = useRef<Shard[]>([]);
  const platformsRef = useRef<Platform[]>([]);
  
  const playerRef = useRef<Entity & { 
    trail: { x: number, y: number }[],
    animFrame: number,
    animTimer: number,
    lastVx: number
  }>({
    id: 'player',
    x: level.playerStart.x,
    y: level.playerStart.y,
    width: 28,
    height: 42,
    vx: 0,
    vy: 0,
    color: THEME.NORMAL.player,
    trail: [],
    animFrame: 0,
    animTimer: 0,
    lastVx: 1
  });
  
  const realityRef = useRef<Reality>(gameState.reality);
  const playerSizeRef = useRef(gameState.playerSize);
  const statusRef = useRef<GameState['status']>(gameState.status);
  const isGroundedRef = useRef<boolean>(false);
  const coyoteTimeRef = useRef<number>(0);
  const shiftCooldownRef = useRef<number>(0);
  const particlesRef = useRef<{x: number, y: number, vx: number, vy: number, life: number, color: string}[]>([]);

  useEffect(() => {
    const sheet = document.createElement('canvas');
    sheet.width = SPRITE_SIZE * 10;
    sheet.height = SPRITE_SIZE * 2;
    const sctx = sheet.getContext('2d');
    if (!sctx) return;

    const drawFrame = (x: number, y: number, r: Reality, type: 'idle' | 'run' | 'jump', frame: number) => {
      const theme = THEME[r];
      const cx = x + SPRITE_SIZE / 2;
      const cy = y + SPRITE_SIZE / 2;
      sctx.save();
      sctx.translate(cx, cy);
      sctx.fillStyle = theme.player;
      sctx.shadowBlur = 10;
      sctx.shadowColor = theme.player;

      let bodyW = 24, bodyH = 36, bodyY = -18;
      if (type === 'idle') {
        const bounce = Math.sin(frame * (Math.PI / 2)) * 2;
        bodyH += bounce; bodyY -= bounce;
      } else if (type === 'run') {
        const swing = Math.sin(frame * (Math.PI / 3)) * 4;
        sctx.rotate(swing * 0.05);
      } else if (type === 'jump') {
        bodyW -= 4; bodyH += 6; bodyY -= 6;
      }

      sctx.fillRect(-bodyW/2, bodyY, bodyW, bodyH);
      sctx.strokeStyle = 'white'; sctx.lineWidth = 2;
      sctx.strokeRect(-bodyW/2, bodyY, bodyW, bodyH);
      sctx.fillStyle = 'black';
      sctx.fillRect(4, bodyY + (r === 'NORMAL' ? 8 : bodyH - 14), 6, 6);
      sctx.restore();
    };

    ['NORMAL', 'SHIFTED'].forEach((r, row) => {
      for (let i = 0; i < 4; i++) drawFrame(i * SPRITE_SIZE, row * SPRITE_SIZE, r as Reality, 'idle', i);
      for (let i = 0; i < 6; i++) drawFrame((i + 4) * SPRITE_SIZE, row * SPRITE_SIZE, r as Reality, 'run', i);
    });

    spriteSheetRef.current = sheet;
  }, []);

  useEffect(() => {
    realityRef.current = gameState.reality;
    playerSizeRef.current = gameState.playerSize;
    statusRef.current = gameState.status;
  }, [gameState.reality, gameState.playerSize, gameState.status]);

  useEffect(() => {
    playerRef.current = {
      ...playerRef.current,
      x: level.playerStart.x,
      y: level.playerStart.y,
      vx: 0, vy: 0,
      trail: []
    };
    shardsRef.current = level.shards.map(s => ({ ...s }));
    platformsRef.current = level.platforms.map(p => ({
      ...p,
      initialX: p.x,
      initialY: p.y
    }));
    isGroundedRef.current = false;
    coyoteTimeRef.current = 0;
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== 'PLAYING') return;
      inputs.current[e.code] = true;
      if (e.code === 'Space' && shiftCooldownRef.current <= 0) {
        onRealityChange();
        shiftCooldownRef.current = 25;
      }
      if ((e.code === 'ShiftLeft' || e.code === 'ControlLeft') && shiftCooldownRef.current <= 0) {
        onSizeChange();
        shiftCooldownRef.current = 25;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { inputs.current[e.code] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    let animationFrameId: number;

    const createBurst = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) particlesRef.current.push({
        x, y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 1.0, color
      });
    };

    const update = () => {
      if (statusRef.current !== 'PLAYING') return;

      const player = playerRef.current;
      const currentReality = realityRef.current;
      const curInputs = inputs.current;
      const sizeMultiplier = playerSizeRef.current === 'SMALL' ? 0.5 : 1;

      // Update Player Dimensions
      player.width = 28 * sizeMultiplier;
      player.height = 42 * sizeMultiplier;
      
      const moveLeft = curInputs['KeyA'] || curInputs['ArrowLeft'] || curInputs['TOUCH_LEFT'];
      const moveRight = curInputs['KeyD'] || curInputs['ArrowRight'] || curInputs['TOUCH_RIGHT'];
      const jumpInput = curInputs['KeyW'] || curInputs['ArrowUp'] || curInputs['TOUCH_JUMP'];

      const moveSpeed = PHYSICS.MOVE_SPEED * (playerSizeRef.current === 'SMALL' ? 1.4 : 1);
      if (moveLeft) { player.vx -= moveSpeed; player.lastVx = -1; }
      else if (moveRight) { player.vx += moveSpeed; player.lastVx = 1; }
      else { player.vx *= PHYSICS.FRICTION; }
      
      if (jumpInput && (isGroundedRef.current || coyoteTimeRef.current > 0)) {
        player.vy = currentReality === 'NORMAL' ? PHYSICS.JUMP_FORCE : PHYSICS.SHIFTED_JUMP_FORCE;
        isGroundedRef.current = false;
        coyoteTimeRef.current = 0;
        audio.playJump();
        createBurst(player.x + player.width/2, currentReality === 'NORMAL' ? player.y + player.height : player.y, THEME[currentReality].player);
      }

      player.vy += currentReality === 'NORMAL' ? PHYSICS.GRAVITY : PHYSICS.SHIFTED_GRAVITY;
      player.vx = Math.max(Math.min(player.vx, PHYSICS.MAX_SPEED), -PHYSICS.MAX_SPEED);
      player.x += player.vx;
      player.y += player.vy;

      // Update Moving Platforms
      const time = Date.now();
      platformsRef.current.forEach(p => {
        if (p.isMoving) {
          const oldX = p.x;
          const oldY = p.y;
          if (p.moveRangeX) p.x = (p.initialX ?? p.x) + Math.sin(time * (p.moveSpeed ?? 0.02)) * p.moveRangeX;
          if (p.moveRangeY) p.y = (p.initialY ?? p.y) + Math.sin(time * (p.moveSpeed ?? 0.02)) * p.moveRangeY;
          p.vx = p.x - oldX;
          p.vy = p.y - oldY;
        }
      });

      player.animTimer++;
      const isMoving = Math.abs(player.vx) > 0.5;
      if (player.animTimer >= (isMoving ? 5 : 12)) {
        player.animTimer = 0;
        player.animFrame = (player.animFrame + 1) % (isMoving ? RUN_FRAMES : IDLE_FRAMES);
      }

      player.trail.unshift({ x: player.x, y: player.y });
      if (player.trail.length > 8) player.trail.pop();

      isGroundedRef.current = false;
      const activePlatforms = platformsRef.current.filter(p => p.reality === 'BOTH' || p.reality === currentReality);

      for (const p of activePlatforms) {
        if (player.x < p.x + p.width && player.x + player.width > p.x &&
            player.y < p.y + p.height && player.y + player.height > p.y) {
          
          if (p.isHazard) { onFail(); return; }

          const overlapX = Math.min(player.x + player.width - p.x, p.x + p.width - player.x);
          const overlapY = Math.min(player.y + player.height - p.y, p.y + p.height - player.y);

          if (overlapX < overlapY) {
            player.x = player.x < p.x ? p.x - player.width : p.x + p.width;
            player.vx = p.vx ?? 0;
          } else {
            if (player.y < p.y) {
              player.y = p.y - player.height;
              if (currentReality === 'NORMAL') isGroundedRef.current = true;
            } else {
              player.y = p.y + p.height;
              if (currentReality === 'SHIFTED') isGroundedRef.current = true;
            }
            player.vy = p.vy ?? 0;
            if (p.isMoving) {
              player.x += p.vx ?? 0;
            }
          }
        }
      }

      shardsRef.current.forEach(s => {
        if (!s.collected && Math.abs(player.x + player.width/2 - s.x) < 30 && Math.abs(player.y + player.height/2 - s.y) < 30) {
          s.collected = true;
          onCollectShard();
          createBurst(s.x, s.y, '#facc15');
        }
      });

      if (!isGroundedRef.current && coyoteTimeRef.current > 0) coyoteTimeRef.current--;
      if (isGroundedRef.current) coyoteTimeRef.current = PHYSICS.COYOTE_TIME;

      particlesRef.current.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.02; });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      const goal = level.goal;
      if (Math.abs(player.x + player.width/2 - (goal.x + goal.width/2)) < goal.width && Math.abs(player.y + player.height/2 - (goal.y + goal.height/2)) < goal.height) {
        onWin(); return;
      }

      if (player.y > CANVAS_HEIGHT + 200 || player.y < -200) onFail();
      if (shiftCooldownRef.current > 0) shiftCooldownRef.current--;
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
      const curReality = realityRef.current;
      const theme = THEME[curReality];
      const stability = gameState.stability;

      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (stability < 30 && Math.random() < (1 - stability/30) * 0.3) {
        ctx.save();
        ctx.translate((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15);
      }

      ctx.strokeStyle = theme.grid; ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke(); }
      for (let y = 0; y < CANVAS_HEIGHT; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke(); }

      platformsRef.current.forEach(p => {
        const active = p.reality === 'BOTH' || p.reality === curReality;
        if (p.isHazard) {
          ctx.fillStyle = theme.hazard;
          const segs = 15, w = p.width / segs;
          ctx.beginPath();
          for (let i = 0; i < segs; i++) {
            const h = 15 + Math.sin(Date.now()/150 + i) * 5;
            ctx.moveTo(p.x + (i * w), p.y + p.height);
            ctx.lineTo(p.x + (i * w) + (w/2), p.y + p.height - h);
            ctx.lineTo(p.x + ((i+1) * w), p.y + p.height);
          }
          ctx.fill();
        } else if (active) {
          if (stability < 25 && Math.random() < 0.08) return;
          ctx.fillStyle = theme.platform; ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.strokeStyle = theme.activePlatform; ctx.lineWidth = 2; ctx.strokeRect(p.x, p.y, p.width, p.height);
        } else {
          ctx.strokeStyle = theme.platform; ctx.setLineDash([8, 4]); ctx.strokeRect(p.x, p.y, p.width, p.height); ctx.setLineDash([]);
        }
      });

      shardsRef.current.forEach(s => {
        if (s.collected) return;
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(Date.now() / 400);
        ctx.fillStyle = '#facc15'; ctx.shadowBlur = 15; ctx.shadowColor = '#facc15';
        ctx.fillRect(-10, -10, 20, 20); ctx.restore();
      });

      const goal = level.goal;
      ctx.save(); ctx.translate(goal.x + goal.width/2, goal.y + goal.height/2); ctx.rotate(Date.now() / 600);
      ctx.fillStyle = goal.color; ctx.shadowBlur = 25; ctx.shadowColor = goal.color; ctx.fillRect(-goal.width/2, -goal.height/2, goal.width, goal.height); ctx.restore();

      particlesRef.current.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 4, 4); });
      ctx.globalAlpha = 1.0;

      const p = playerRef.current;
      const sizeMultiplier = playerSizeRef.current === 'SMALL' ? 0.5 : 1;
      if (spriteSheetRef.current) {
        const sheet = spriteSheetRef.current;
        const row = curReality === 'NORMAL' ? 0 : 1;
        const jumping = !isGroundedRef.current;
        let frameIdx = 0;
        if (jumping) frameIdx = (p.vy * (curReality === 'NORMAL' ? 1 : -1) < 0) ? 4 : 5;
        else if (Math.abs(p.vx) > 0.5) frameIdx = 4 + (p.animFrame % RUN_FRAMES);
        else frameIdx = p.animFrame % IDLE_FRAMES;

        ctx.save();
        const drawX = p.x - (18 * sizeMultiplier);
        const drawY = p.y - (12 * sizeMultiplier);
        const drawSize = SPRITE_SIZE * sizeMultiplier;
        
        p.trail.forEach((pos, i) => {
          ctx.globalAlpha = (1 - i / 8) * 0.15;
          ctx.drawImage(sheet, frameIdx * SPRITE_SIZE, row * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, pos.x - (18 * sizeMultiplier), pos.y - (12 * sizeMultiplier), drawSize, drawSize);
        });
        ctx.globalAlpha = 1.0;
        if (p.lastVx < 0) { ctx.translate(p.x + p.width/2, 0); ctx.scale(-1, 1); ctx.translate(-(p.x + p.width/2), 0); }
        ctx.drawImage(sheet, frameIdx * SPRITE_SIZE, row * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, drawX, drawY, drawSize, drawSize);
        ctx.restore();
      }

      if (stability < 30) ctx.restore();
    };

    const render = () => {
      update();
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) draw(ctx);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [level, onWin, onFail, onRealityChange, onSizeChange, inputs, gameState.stability, onCollectShard]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="border-[6px] md:border-[12px] border-slate-900/50 rounded-lg md:rounded-2xl overflow-hidden shadow-2xl bg-black backdrop-blur-xl max-w-full max-h-full aspect-[3/2] flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className={`transition-all duration-300 ${gameState.reality === 'SHIFTED' ? 'brightness-110 contrast-110' : ''}`}
        />
        {shiftCooldownRef.current > 15 && (
          <div className="absolute inset-0 bg-white/20 reality-shift-overlay pointer-events-none mix-blend-overlay" />
        )}
      </div>
    </div>
  );
};

export default GameCanvas;
