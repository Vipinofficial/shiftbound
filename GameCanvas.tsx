
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
  const lavaDeathRef = useRef<{ active: boolean; timer: number }>({ active: false, timer: 0 });
  const teleportRef = useRef<{ active: boolean; timer: number; duration: number }>({ active: false, timer: 0, duration: 28 });

  const normalizePlatformsForLevel = (sourcePlatforms: Platform[], levelId: number): Platform[] => {
    const levelIntensity = Math.min(1, Math.max(0, (levelId - 1) / 21));

    return sourcePlatforms.map(platform => {
      const normalized: Platform = {
        ...platform,
        initialX: platform.x,
        initialY: platform.y
      };

      if (!normalized.isHazard) return normalized;

      const isHorizontal = normalized.width >= normalized.height * 3;
      const isVertical = normalized.height >= normalized.width * 3;

      if (isHorizontal) {
        const minHazardHeight = CANVAS_HEIGHT * (0.012 + levelIntensity * 0.01);
        const nextHeight = Math.max(normalized.height, minHazardHeight);
        normalized.height = Math.min(nextHeight, CANVAS_HEIGHT * 0.06);

        if (normalized.y + normalized.height > CANVAS_HEIGHT * 0.82) {
          normalized.y = CANVAS_HEIGHT - normalized.height;
        } else if (normalized.y < CANVAS_HEIGHT * 0.18) {
          normalized.y = 0;
        } else {
          normalized.y = normalized.y + (platform.height - normalized.height) / 2;
        }
      }

      if (isVertical) {
        const minHazardWidth = CANVAS_WIDTH * (0.01 + levelIntensity * 0.007);
        const nextWidth = Math.max(normalized.width, minHazardWidth);
        normalized.width = Math.min(nextWidth, CANVAS_WIDTH * 0.035);

        if (normalized.x + normalized.width > CANVAS_WIDTH * 0.85) {
          normalized.x = CANVAS_WIDTH - normalized.width;
        } else if (normalized.x < CANVAS_WIDTH * 0.15) {
          normalized.x = 0;
        } else {
          normalized.x = normalized.x + (platform.width - normalized.width) / 2;
        }
      }

      normalized.x = Math.max(0, Math.min(CANVAS_WIDTH - normalized.width, normalized.x));
      normalized.y = Math.max(0, Math.min(CANVAS_HEIGHT - normalized.height, normalized.y));
      normalized.initialX = normalized.x;
      normalized.initialY = normalized.y;

      return normalized;
    });
  };

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
      const phase = frame * (Math.PI / 3);

      const palette = r === 'NORMAL'
        ? {
            skin: '#f5d0a7',
            hair: '#111827',
            suit: '#38bdf8',
            suitDark: '#0ea5e9',
            boot: '#0f172a',
            line: '#f8fafc'
          }
        : {
            skin: '#fecdd3',
            hair: '#450a0a',
            suit: '#fb7185',
            suitDark: '#e11d48',
            boot: '#3f0a1b',
            line: '#ffe4e6'
          };

      let bob = 0;
      let torsoTilt = 0;
      let shoulderLift = 0;
      let leftArm = 0;
      let rightArm = 0;
      let leftLeg = 0;
      let rightLeg = 0;

      if (type === 'idle') {
        bob = Math.sin(frame * (Math.PI / 2)) * 1.2;
        shoulderLift = Math.sin(frame * (Math.PI / 2)) * 0.8;
        leftArm = -1;
        rightArm = 1;
        leftLeg = 1;
        rightLeg = -1;
      } else if (type === 'run') {
        bob = Math.sin(phase) * 2.1;
        torsoTilt = Math.sin(phase) * 0.08;
        shoulderLift = Math.sin(phase + Math.PI / 2) * 1.5;
        leftArm = Math.sin(phase) * 9;
        rightArm = -leftArm;
        leftLeg = -Math.sin(phase) * 10;
        rightLeg = -leftLeg;
      } else {
        bob = -2.5;
        torsoTilt = 0.04;
        shoulderLift = -1;
        leftArm = -5;
        rightArm = 5;
        leftLeg = 5;
        rightLeg = 2;
      }

      const drawLimb = (
        startX: number,
        startY: number,
        midX: number,
        midY: number,
        endX: number,
        endY: number,
        color: string,
        width: number
      ) => {
        sctx.strokeStyle = color;
        sctx.lineWidth = width;
        sctx.lineCap = 'round';
        sctx.lineJoin = 'round';
        sctx.beginPath();
        sctx.moveTo(startX, startY);
        sctx.quadraticCurveTo(midX, midY, endX, endY);
        sctx.stroke();
      };

      sctx.save();
      sctx.translate(cx, cy + bob);
      sctx.rotate(torsoTilt);
      sctx.shadowBlur = 12;
      sctx.shadowColor = theme.player;

      const headY = -20;
      const torsoTopY = -11 + shoulderLift;
      const hipY = 9;

      drawLimb(-6, torsoTopY + 2, -12, torsoTopY + 7 + leftArm * 0.35, -11, torsoTopY + 16 + leftArm, palette.skin, 3.6);
      drawLimb(6, torsoTopY + 2, 12, torsoTopY + 7 + rightArm * 0.35, 11, torsoTopY + 16 + rightArm, palette.skin, 3.6);

      const torsoGradient = sctx.createLinearGradient(0, torsoTopY, 0, hipY + 4);
      torsoGradient.addColorStop(0, palette.suit);
      torsoGradient.addColorStop(1, palette.suitDark);
      sctx.fillStyle = torsoGradient;
      sctx.strokeStyle = palette.line;
      sctx.lineWidth = 1.4;

      sctx.beginPath();
      sctx.moveTo(-8, torsoTopY + 1);
      sctx.lineTo(8, torsoTopY + 1);
      sctx.lineTo(9, hipY + 2);
      sctx.lineTo(-9, hipY + 2);
      sctx.closePath();
      sctx.fill();
      sctx.stroke();

      sctx.fillStyle = palette.suitDark;
      sctx.fillRect(-2, torsoTopY + 2, 4, hipY - torsoTopY - 1);

      drawLimb(-4, hipY, -6, hipY + 6 + leftLeg * 0.4, -7, 22 + leftLeg, palette.suitDark, 4.8);
      drawLimb(4, hipY, 6, hipY + 6 + rightLeg * 0.4, 7, 22 + rightLeg, palette.suitDark, 4.8);

      sctx.fillStyle = palette.boot;
      sctx.fillRect(-10, 22 + leftLeg - 1, 6.5, 3.5);
      sctx.fillRect(3.5, 22 + rightLeg - 1, 6.5, 3.5);

      sctx.fillStyle = palette.skin;
      sctx.strokeStyle = palette.line;
      sctx.lineWidth = 1.4;
      sctx.beginPath();
      sctx.arc(0, headY, 7.3, 0, Math.PI * 2);
      sctx.fill();
      sctx.stroke();

      sctx.fillStyle = palette.hair;
      sctx.beginPath();
      sctx.arc(-0.5, headY - 2.5, 5.2, Math.PI, Math.PI * 2);
      sctx.lineTo(4.2, headY - 1.2);
      sctx.quadraticCurveTo(-0.5, headY - 7.8, -5, headY - 1.2);
      sctx.closePath();
      sctx.fill();

      sctx.fillStyle = '#0f172a';
      sctx.beginPath();
      sctx.arc(-2.1, headY - 0.3, 0.8, 0, Math.PI * 2);
      sctx.arc(2.1, headY - 0.3, 0.8, 0, Math.PI * 2);
      sctx.fill();

      sctx.strokeStyle = '#7f1d1d';
      sctx.lineWidth = 1;
      sctx.beginPath();
      sctx.arc(0, headY + 2.4, 1.8, 0.1 * Math.PI, 0.9 * Math.PI);
      sctx.stroke();

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
    platformsRef.current = normalizePlatformsForLevel(level.platforms, level.id);
    isGroundedRef.current = false;
    coyoteTimeRef.current = 0;
    lavaDeathRef.current = { active: false, timer: 0 };
    teleportRef.current = { active: false, timer: 0, duration: 28 };
  }, [level]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== 'PLAYING') return;
      if (teleportRef.current.active || lavaDeathRef.current.active) return;
      inputs.current[e.code] = true;
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && shiftCooldownRef.current <= 0) {
        onRealityChange();
        shiftCooldownRef.current = 25;
      }
      if ((e.code === 'ControlLeft' || e.code === 'ControlRight') && shiftCooldownRef.current <= 0) {
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

    const createLavaSplash = (x: number, y: number) => {
      const colors = ['#fb923c', '#ef4444', '#f97316', '#fde68a'];
      for (let i = 0; i < 24; i++) {
        const speed = 2 + Math.random() * 6;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.7;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
          vy: Math.sin(angle) * speed,
          life: 1.1,
          color: colors[i % colors.length]
        });
      }
    };

    const update = () => {
      if (statusRef.current !== 'PLAYING') return;

      const player = playerRef.current;
      const currentReality = realityRef.current;
      const curInputs = inputs.current;
      const sizeMultiplier = playerSizeRef.current === 'SMALL' ? 0.5 : 1;

      if (lavaDeathRef.current.active) {
        lavaDeathRef.current.timer--;
        player.vx *= 0.85;
        player.vy += currentReality === 'NORMAL' ? 0.7 : -0.7;
        player.x += player.vx;
        player.y += player.vy;

        if (Math.random() < 0.45) {
          particlesRef.current.push({
            x: player.x + player.width / 2 + (Math.random() - 0.5) * player.width,
            y: player.y + player.height / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 1.2) * 2,
            life: 0.6,
            color: Math.random() > 0.5 ? '#fb923c' : '#ef4444'
          });
        }

        if (lavaDeathRef.current.timer <= 0) {
          onFail();
          return;
        }
      }

      if (teleportRef.current.active) {
        teleportRef.current.timer--;
        const goal = level.goal;
        const goalCx = goal.x + goal.width / 2;
        const goalCy = goal.y + goal.height / 2;
        const playerCx = player.x + player.width / 2;
        const playerCy = player.y + player.height / 2;
        const progress = 1 - teleportRef.current.timer / Math.max(1, teleportRef.current.duration);
        const progressEase = Math.min(1, Math.max(0, progress));

        const dx = goalCx - playerCx;
        const dy = goalCy - playerCy;
        const distance = Math.hypot(dx, dy) || 1;
        const nx = dx / distance;
        const ny = dy / distance;
        const tangentX = -ny;
        const tangentY = nx;
        const swirlPhase = Date.now() / 70;
        const swirlMag = (1 - progressEase) * 13;
        const inwardSpeed = 4 + progressEase * 7;

        player.vx *= 0.6;
        player.vy *= 0.6;
        player.x += nx * inwardSpeed + tangentX * Math.sin(swirlPhase) * swirlMag;
        player.y += ny * inwardSpeed + tangentY * Math.cos(swirlPhase) * swirlMag;

        if (Math.random() < 0.55) {
          particlesRef.current.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            vx: (Math.random() - 0.5) * 2.4,
            vy: (Math.random() - 0.5) * 2.4,
            life: 0.7,
            color: Math.random() > 0.5 ? '#d946ef' : '#f0abfc'
          });
        }

        if (teleportRef.current.timer <= 0) {
          onWin();
          return;
        }
      }

      // Update Player Dimensions
      player.width = 28 * sizeMultiplier;
      player.height = 42 * sizeMultiplier;
      
      const moveLeft = curInputs['KeyA'] || curInputs['ArrowLeft'] || curInputs['TOUCH_LEFT'];
      const moveRight = curInputs['KeyD'] || curInputs['ArrowRight'] || curInputs['TOUCH_RIGHT'];
      const jumpInput = curInputs['Space'] || curInputs['KeyW'] || curInputs['ArrowUp'] || curInputs['TOUCH_JUMP'];

      const moveSpeed = PHYSICS.MOVE_SPEED * (playerSizeRef.current === 'SMALL' ? 1.4 : 1);
      if (!lavaDeathRef.current.active) {
        if (moveLeft) { player.vx -= moveSpeed; player.lastVx = -1; }
        else if (moveRight) { player.vx += moveSpeed; player.lastVx = 1; }
        else { player.vx *= PHYSICS.FRICTION; }
      }
      
      if (!lavaDeathRef.current.active && !teleportRef.current.active && jumpInput && (isGroundedRef.current || coyoteTimeRef.current > 0)) {
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

      const leftBoundary = 0;
      const rightBoundary = CANVAS_WIDTH - player.width;
      if (player.x < leftBoundary) {
        player.x = leftBoundary;
        if (player.vx < 0) player.vx *= -0.25;
      }
      if (player.x > rightBoundary) {
        player.x = rightBoundary;
        if (player.vx > 0) player.vx *= -0.25;
      }

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
          
          if (p.isHazard) {
            if (!lavaDeathRef.current.active) {
              lavaDeathRef.current = { active: true, timer: 20 };
              audio.playLavaSplash();
              createLavaSplash(player.x + player.width / 2, player.y + player.height / 2);
            }
            return;
          }

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
        if (!teleportRef.current.active) {
          teleportRef.current = { active: true, timer: 28, duration: 28 };
          audio.playPortalTeleport();
          createBurst(goal.x + goal.width / 2, goal.y + goal.height / 2, '#d946ef');
        }
        return;
      }

      const verticalOutMargin = Math.max(90, CANVAS_HEIGHT * 0.12);
      if (!teleportRef.current.active && (player.y > CANVAS_HEIGHT + verticalOutMargin || player.y + player.height < -verticalOutMargin)) onFail();
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

      const seedFromId = (id: string) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
        return hash;
      };
      const nrand = (seed: number) => {
        const x = Math.sin(seed * 12.9898) * 43758.5453123;
        return x - Math.floor(x);
      };

      platformsRef.current.forEach(p => {
        const active = p.reality === 'BOTH' || p.reality === curReality;
        if (p.isHazard) {
          const time = Date.now() / 1000;
          const topY = p.y;
          const bottomY = p.y + p.height;

          const lavaBody = ctx.createLinearGradient(0, topY, 0, bottomY);
          lavaBody.addColorStop(0, curReality === 'SHIFTED' ? '#fb7185' : '#ffb347');
          lavaBody.addColorStop(0.24, curReality === 'SHIFTED' ? '#f43f5e' : '#ff7a1a');
          lavaBody.addColorStop(0.58, curReality === 'SHIFTED' ? '#be123c' : '#dc2626');
          lavaBody.addColorStop(1, curReality === 'SHIFTED' ? '#2f0815' : '#4a120d');
          ctx.fillStyle = lavaBody;
          ctx.fillRect(p.x, p.y, p.width, p.height);

          const subFlow = ctx.createLinearGradient(0, topY, 0, bottomY);
          subFlow.addColorStop(0, curReality === 'SHIFTED' ? 'rgba(251, 113, 133, 0.32)' : 'rgba(255, 186, 84, 0.34)');
          subFlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = subFlow;
          ctx.fillRect(p.x, p.y, p.width, p.height * 0.75);

          ctx.save();
          ctx.shadowBlur = 28;
          ctx.shadowColor = curReality === 'SHIFTED' ? '#fb7185' : '#ff8a3c';
          const rim = ctx.createLinearGradient(0, topY, 0, topY + Math.max(8, p.height * 0.4));
          rim.addColorStop(0, 'rgba(255, 247, 210, 0.95)');
          rim.addColorStop(1, 'rgba(255, 247, 210, 0)');
          ctx.fillStyle = rim;
          ctx.fillRect(p.x, p.y, p.width, Math.max(8, p.height * 0.42));
          ctx.restore();

          const waveAmp = Math.min(10, Math.max(3, p.height * 0.32));
          const waveStep = Math.max(16, Math.floor(p.width / 18));
          ctx.beginPath();
          ctx.moveTo(p.x, topY + waveAmp);
          for (let x = 0; x <= p.width + waveStep; x += waveStep) {
            const worldX = p.x + x;
            const crestY = topY + Math.sin(time * 3.2 + worldX * 0.035) * waveAmp + Math.sin(time * 6.1 + worldX * 0.011) * (waveAmp * 0.28);
            ctx.lineTo(worldX, crestY);
          }
          ctx.lineTo(p.x + p.width, topY);
          ctx.lineTo(p.x, topY);
          ctx.closePath();
          ctx.fillStyle = curReality === 'SHIFTED' ? 'rgba(255, 228, 230, 0.4)' : 'rgba(255, 237, 213, 0.45)';
          ctx.fill();

          const veinCount = Math.max(3, Math.floor(p.width / 90));
          for (let v = 0; v < veinCount; v++) {
            const baseY = topY + p.height * (0.25 + (v % 4) * 0.14);
            ctx.beginPath();
            for (let x = 0; x <= p.width; x += 14) {
              const worldX = p.x + x;
              const vy = baseY + Math.sin(time * 2.3 + worldX * 0.03 + v) * 3.2;
              if (x === 0) ctx.moveTo(worldX, vy);
              else ctx.lineTo(worldX, vy);
            }
            ctx.strokeStyle = curReality === 'SHIFTED' ? 'rgba(251, 191, 211, 0.28)' : 'rgba(254, 215, 170, 0.3)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          const crustCount = Math.max(2, Math.floor(p.width / 170));
          for (let c = 0; c < crustCount; c++) {
            const cx = p.x + ((Math.sin(time * (0.5 + c * 0.2) + c * 2.3) * 0.5 + 0.5) * p.width);
            const cy = topY + p.height * (0.45 + (Math.sin(time * 1.4 + c) * 0.12));
            const cw = 14 + ((c * 7) % 16);
            const ch = 6 + ((c * 5) % 7);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(Math.sin(time + c) * 0.16);
            ctx.fillStyle = curReality === 'SHIFTED' ? 'rgba(76, 5, 25, 0.58)' : 'rgba(69, 26, 3, 0.52)';
            ctx.beginPath();
            ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 3);
            ctx.fill();
            ctx.restore();
          }

          const bubbleCount = Math.max(3, Math.floor(p.width / 130));
          for (let i = 0; i < bubbleCount; i++) {
            const phase = time * (1.6 + (i % 3) * 0.4) + i * 1.7 + p.x * 0.02;
            const bx = p.x + ((Math.sin(phase * 0.7) * 0.5 + 0.5) * p.width);
            const rise = (Math.sin(phase) * 0.5 + 0.5) * Math.max(6, p.height - 4);
            const by = bottomY - rise;
            const radius = 1.6 + ((Math.sin(phase * 2.1) * 0.5 + 0.5) * 2.1);
            ctx.fillStyle = curReality === 'SHIFTED' ? 'rgba(251, 191, 211, 0.55)' : 'rgba(254, 215, 170, 0.6)';
            ctx.beginPath();
            ctx.arc(bx, by, radius, 0, Math.PI * 2);
            ctx.fill();
          }

          const sparkCount = Math.max(2, Math.floor(p.width / 190));
          for (let sIdx = 0; sIdx < sparkCount; sIdx++) {
            const phase = time * 2.9 + sIdx * 1.9 + p.x * 0.01;
            const sx = p.x + ((Math.sin(phase * 1.1) * 0.5 + 0.5) * p.width);
            const sy = topY - (Math.sin(phase) * 0.5 + 0.5) * 8;
            ctx.fillStyle = curReality === 'SHIFTED' ? 'rgba(255, 228, 230, 0.7)' : 'rgba(255, 237, 213, 0.75)';
            ctx.fillRect(sx, sy, 1.8, 1.8);
          }

          ctx.strokeStyle = curReality === 'SHIFTED' ? 'rgba(251, 113, 133, 0.6)' : 'rgba(251, 146, 60, 0.55)';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.width - 1, p.height - 1);
        } else if (active) {
          if (stability < 25 && Math.random() < 0.08) return;

          const seed = seedFromId(p.id);
          const ridge = Math.min(7, Math.max(2, p.height * 0.3));
          const crackCount = Math.max(1, Math.floor(p.width / 110));

          const bodyGradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
          if (curReality === 'SHIFTED') {
            bodyGradient.addColorStop(0, '#3f1018');
            bodyGradient.addColorStop(0.5, '#2b0d13');
            bodyGradient.addColorStop(1, '#16090d');
          } else {
            bodyGradient.addColorStop(0, '#374151');
            bodyGradient.addColorStop(0.5, '#1f2937');
            bodyGradient.addColorStop(1, '#111827');
          }
          ctx.fillStyle = bodyGradient;
          ctx.fillRect(p.x, p.y, p.width, p.height);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y + ridge);
          const segments = Math.max(6, Math.floor(p.width / 22));
          for (let i = 0; i <= segments; i++) {
            const px = p.x + (i / segments) * p.width;
            const py = p.y + nrand(seed + i * 1.17) * ridge;
            ctx.lineTo(px, py);
          }
          ctx.lineTo(p.x + p.width, p.y);
          ctx.lineTo(p.x, p.y);
          ctx.closePath();
          ctx.fillStyle = curReality === 'SHIFTED' ? 'rgba(251, 113, 133, 0.2)' : 'rgba(203, 213, 225, 0.22)';
          ctx.fill();

          for (let i = 0; i < crackCount; i++) {
            const x0 = p.x + nrand(seed + i * 4.1) * p.width;
            const y0 = p.y + ridge + nrand(seed + i * 6.3) * Math.max(6, p.height - ridge - 2);
            const x1 = x0 + (nrand(seed + i * 9.7) - 0.5) * 24;
            const y1 = y0 + 8 + nrand(seed + i * 2.6) * 10;
            ctx.strokeStyle = curReality === 'SHIFTED' ? 'rgba(255, 228, 230, 0.22)' : 'rgba(15, 23, 42, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo((x0 + x1) / 2 + (nrand(seed + i * 11.2) - 0.5) * 5, (y0 + y1) / 2);
            ctx.lineTo(x1, y1);
            ctx.stroke();
          }

          if (p.isMoving && Math.random() < 0.12) {
            particlesRef.current.push({
              x: p.x + nrand(seed + Date.now() * 0.001) * p.width,
              y: p.y + p.height,
              vx: (Math.random() - 0.5) * 0.8,
              vy: Math.random() * 0.6,
              life: 0.25,
              color: curReality === 'SHIFTED' ? 'rgba(251, 191, 211, 0.35)' : 'rgba(148, 163, 184, 0.35)'
            });
          }

          ctx.strokeStyle = curReality === 'SHIFTED' ? 'rgba(251, 113, 133, 0.65)' : 'rgba(125, 211, 252, 0.45)';
          ctx.lineWidth = 1.4;
          ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.width - 1, p.height - 1);
        } else {
          const seed = seedFromId(p.id);
          ctx.strokeStyle = curReality === 'SHIFTED' ? 'rgba(251, 113, 133, 0.28)' : 'rgba(148, 163, 184, 0.32)';
          ctx.setLineDash([7, 5]);
          ctx.strokeRect(p.x, p.y, p.width, p.height);
          ctx.setLineDash([]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          const segments = Math.max(4, Math.floor(p.width / 34));
          for (let i = 0; i <= segments; i++) {
            const px = p.x + (i / segments) * p.width;
            const py = p.y + nrand(seed + i * 1.9) * 4;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      });

      shardsRef.current.forEach(s => {
        if (s.collected) return;
        const t = Date.now() / 1000;
        const pulse = 1 + Math.sin(t * 4 + s.x * 0.01) * 0.12;
        const bob = Math.sin(t * 3 + s.y * 0.01) * 3;

        ctx.save();
        ctx.translate(s.x, s.y + bob);
        ctx.rotate(Date.now() / 700);

        const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 26 * pulse);
        glow.addColorStop(0, 'rgba(34, 211, 238, 0.48)');
        glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 26 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 22;
        ctx.shadowColor = '#22d3ee';

        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(0, -14 * pulse);
        ctx.lineTo(11 * pulse, 0);
        ctx.lineTo(0, 14 * pulse);
        ctx.lineTo(-11 * pulse, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.moveTo(0, -9 * pulse);
        ctx.lineTo(7 * pulse, 0);
        ctx.lineTo(0, 9 * pulse);
        ctx.lineTo(-7 * pulse, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -11 * pulse);
        ctx.lineTo(0, 11 * pulse);
        ctx.moveTo(-8 * pulse, 0);
        ctx.lineTo(8 * pulse, 0);
        ctx.stroke();

        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = 'rgba(103, 232, 249, 0.9)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 15 + Math.sin(t * 6) * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.restore();
      });

      const goal = level.goal;
      const goalCx = goal.x + goal.width / 2;
      const goalCy = goal.y + goal.height / 2;
      const portalPulse = 1 + Math.sin(Date.now() / 220) * 0.1;

      ctx.save();
      ctx.translate(goalCx, goalCy);

      const portalGlow = ctx.createRadialGradient(0, 0, 8, 0, 0, goal.width * 1.5);
      portalGlow.addColorStop(0, 'rgba(217, 70, 239, 0.35)');
      portalGlow.addColorStop(1, 'rgba(217, 70, 239, 0)');
      ctx.fillStyle = portalGlow;
      ctx.beginPath();
      ctx.arc(0, 0, goal.width * 1.5 * portalPulse, 0, Math.PI * 2);
      ctx.fill();

      for (let ring = 0; ring < 4; ring++) {
        ctx.save();
        const dir = ring % 2 === 0 ? 1 : -1;
        ctx.rotate((Date.now() / (420 + ring * 130)) * dir);
        ctx.strokeStyle = ring === 0 ? '#f0abfc' : ring === 1 ? '#d946ef' : ring === 2 ? '#a855f7' : 'rgba(244, 114, 182, 0.9)';
        ctx.lineWidth = Math.max(1, 3.2 - ring * 0.65);
        ctx.globalAlpha = 0.92 - ring * 0.16;
        ctx.beginPath();
        ctx.arc(0, 0, (goal.width * 0.48 + ring * 8) * portalPulse, 0.25 + ring * 0.9, Math.PI * 1.72 + ring * 0.35);
        ctx.stroke();
        ctx.restore();
      }

      ctx.shadowBlur = 30;
      ctx.shadowColor = '#d946ef';
      const core = ctx.createRadialGradient(0, 0, 2, 0, 0, goal.width * 0.42);
      core.addColorStop(0, '#faf5ff');
      core.addColorStop(0.45, '#d946ef');
      core.addColorStop(1, '#581c87');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, goal.width * 0.42 * portalPulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(250, 245, 255, 0.9)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      const swirl = Date.now() / 360;
      ctx.moveTo(Math.cos(swirl) * goal.width * 0.08, Math.sin(swirl) * goal.height * 0.08);
      ctx.lineTo(Math.cos(swirl + Math.PI) * goal.width * 0.28, Math.sin(swirl + Math.PI) * goal.height * 0.28);
      ctx.moveTo(Math.cos(swirl + Math.PI / 2) * goal.width * 0.08, Math.sin(swirl + Math.PI / 2) * goal.height * 0.08);
      ctx.lineTo(Math.cos(swirl + (Math.PI * 3) / 2) * goal.width * 0.28, Math.sin(swirl + (Math.PI * 3) / 2) * goal.height * 0.28);
      ctx.stroke();

      ctx.restore();

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

        const drawSize = SPRITE_SIZE * sizeMultiplier;
        const drawRelX = -(p.width / 2) - (18 * sizeMultiplier);
        const drawRelY = -(p.height / 2) - (12 * sizeMultiplier);
        const drawSprite = (x: number, y: number, alpha: number, isMain: boolean) => {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(x + p.width / 2, y + p.height / 2);

          if (isMain && teleportRef.current.active) {
            const progress = 1 - teleportRef.current.timer / Math.max(1, teleportRef.current.duration);
            const progressEase = Math.min(1, Math.max(0, progress));
            const spin = progressEase * progressEase * Math.PI * 3.2;
            const shrink = 1 - progressEase * 0.88;
            ctx.rotate(spin);
            ctx.scale(Math.max(0.08, shrink), Math.max(0.08, shrink));
            ctx.globalAlpha *= Math.max(0.1, 1 - progressEase * 0.9);
          }

          if (p.lastVx < 0) ctx.scale(-1, 1);
          if (curReality === 'SHIFTED') ctx.scale(1, -1);
          ctx.drawImage(
            sheet,
            frameIdx * SPRITE_SIZE,
            row * SPRITE_SIZE,
            SPRITE_SIZE,
            SPRITE_SIZE,
            drawRelX,
            drawRelY,
            drawSize,
            drawSize
          );
          ctx.restore();
        };

        p.trail.forEach((pos, i) => {
          drawSprite(pos.x, pos.y, (1 - i / 8) * 0.15, false);
        });

        if (teleportRef.current.active) {
          const t = 1 - (teleportRef.current.timer / Math.max(1, teleportRef.current.duration));
          const px = p.x + p.width / 2;
          const py = p.y + p.height / 2;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(Date.now() / 280);

          for (let ring = 0; ring < 3; ring++) {
            ctx.strokeStyle = ring === 0 ? 'rgba(240, 171, 252, 0.85)' : ring === 1 ? 'rgba(217, 70, 239, 0.75)' : 'rgba(244, 114, 182, 0.65)';
            ctx.lineWidth = 2 - ring * 0.4;
            ctx.beginPath();
            ctx.arc(0, 0, (14 + ring * 7) * (1 + t * 0.6), 0.2 + ring, Math.PI * 1.8 + ring * 0.5);
            ctx.stroke();
          }

          ctx.restore();
        }

        drawSprite(p.x, p.y, 1.0, true);
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
