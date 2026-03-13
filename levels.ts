
import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Fracture Begins",
    description: "Your weight is a suggestion. Use SPACE or the Shift button to flip gravity. Shifting costs stability—don't let it reach zero.",
    timeLimit: 40,
    playerStart: { x: 100, y: 650 },
    shards: [{ id: 's1', x: 600, y: 400, collected: false }],
    goal: { id: 'goal', x: 1100, y: 650, width: 40, height: 60, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 720, width: 350, height: 80, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'mid', x: 450, y: 600, width: 300, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'mid-alt', x: 450, y: 200, width: 300, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'end', x: 900, y: 720, width: 350, height: 80, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'hazard', x: 350, y: 780, width: 550, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
    ],
    enemies: []
  },
  {
    id: 2,
    title: "Vertical Echoes",
    description: "Gravity is a choice. Collect memory shards to restore your stability meter and reach the upper levels.",
    timeLimit: 60,
    playerStart: { x: 100, y: 650 },
    shards: [
      { id: 's1', x: 550, y: 480, collected: false },
      { id: 's2', x: 975, y: 300, collected: false }
    ],
    goal: { id: 'goal', x: 100, y: 120, width: 50, height: 50, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'floor1', x: 0, y: 750, width: 400, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'safe-floor', x: 400, y: 750, width: 800, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'p1', x: 450, y: 550, width: 300, height: 25, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'p2-s', x: 800, y: 380, width: 250, height: 25, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'p3', x: 500, y: 280, width: 250, height: 25, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'p4-s', x: 100, y: 200, width: 300, height: 25, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'ceil-haz', x: 0, y: 0, width: 1200, height: 40, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isHazard: true },
    ],
    enemies: []
  },
  {
    id: 3,
    title: "Velocity Shift",
    description: "Momentum is preserved across planes. Leap from the ground and flip mid-air to navigate the void.",
    timeLimit: 50,
    playerStart: { x: 50, y: 400 },
    shards: [{ id: 's1', x: 600, y: 400, collected: false }],
    goal: { id: 'goal', x: 1100, y: 350, width: 60, height: 60, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 450, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'h1', x: 150, y: 780, width: 900, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'h2', x: 150, y: 0, width: 900, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'mid-up', x: 500, y: 200, width: 200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'mid-dn', x: 800, y: 600, width: 200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'end', x: 1050, y: 450, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
    ],
    enemies: []
  },
  {
    id: 4,
    title: "Synchronized Pulse",
    description: "The world is flickering. Platforms appear and disappear as you shift. Time your jumps to the pulse of the void.",
    timeLimit: 60,
    playerStart: { x: 50, y: 700 },
    shards: [{ id: 's1', x: 400, y: 500, collected: false }, { id: 's2', x: 800, y: 300, collected: false }],
    goal: { id: 'goal', x: 1100, y: 100, width: 50, height: 50, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 750, width: 200, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'n1', x: 250, y: 600, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 's1', x: 400, y: 550, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'n2', x: 550, y: 400, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 's2', x: 700, y: 350, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'n3', x: 850, y: 200, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'end', x: 1050, y: 150, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'bottom-haz', x: 0, y: 790, width: 1200, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
    ],
    enemies: []
  },
  {
    id: 5,
    title: "The Mirror Void",
    description: "Sometimes the path is only visible from the other side. Shift mid-air to discover hidden footholds.",
    timeLimit: 70,
    playerStart: { x: 1100, y: 700 },
    shards: [{ id: 's1', x: 600, y: 400, collected: false }, { id: 's2', x: 100, y: 700, collected: false }],
    goal: { id: 'goal', x: 50, y: 100, width: 60, height: 60, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 1000, y: 750, width: 200, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'mid-n', x: 700, y: 600, width: 200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'mid-s', x: 400, y: 450, width: 200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'mid-n2', x: 100, y: 300, width: 200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'final-s', x: 300, y: 150, width: 400, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'goal-p', x: 0, y: 180, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-1', x: 0, y: 780, width: 1000, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-2', x: 0, y: 0, width: 1200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
    ],
    enemies: []
  },
  {
    id: 6,
    title: "The Final Fracture",
    description: "The experiment is failing. The world is collapsing. Speed and stability are your only allies now.",
    timeLimit: 45,
    playerStart: { x: 600, y: 400 },
    shards: [
      { id: 's1', x: 100, y: 100, collected: false },
      { id: 's2', x: 1100, y: 100, collected: false },
      { id: 's3', x: 1100, y: 700, collected: false },
      { id: 's4', x: 100, y: 700, collected: false }
    ],
    goal: { id: 'goal', x: 600, y: 100, width: 40, height: 40, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'center', x: 500, y: 350, width: 200, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'nw', x: 50, y: 150, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'ne', x: 1000, y: 150, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'se', x: 1000, y: 650, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'sw', x: 50, y: 650, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'haz-wall-l', x: 0, y: 0, width: 20, height: 800, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-wall-r', x: 1180, y: 0, width: 20, height: 800, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-ceil', x: 0, y: 0, width: 1200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isHazard: true },
      { id: 'haz-floor', x: 0, y: 780, width: 1200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isHazard: true },
    ],
    enemies: []
  },
  {
    id: 7,
    title: "Kinetic Drift",
    description: "REBALANCED: The foundations are moving slower now. Catch the fragments to cross the abyss.",
    timeLimit: 60,
    playerStart: { x: 50, y: 700 },
    shards: [{ id: 's1', x: 600, y: 400, collected: false }],
    goal: { id: 'goal', x: 1100, y: 700, width: 50, height: 50, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 750, width: 200, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'm1', x: 300, y: 600, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeY: 200, moveSpeed: 0.003 },
      { id: 'm2', x: 550, y: 400, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeX: 200, moveSpeed: 0.004 },
      { id: 'm3', x: 800, y: 600, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeY: -250, moveSpeed: 0.003 },
      { id: 'end', x: 1000, y: 750, width: 200, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz', x: 200, y: 790, width: 800, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
    ],
    enemies: []
  },
  {
    id: 8,
    title: "The Micro-Tunnel",
    description: "New Protocol: Size Shift. Toggle size to fit through tight shafts. (SHIFT/CTRL to toggle size)",
    timeLimit: 80,
    playerStart: { x: 50, y: 700 },
    shards: [{ id: 's1', x: 1100, y: 350, collected: false }],
    goal: { id: 'goal', x: 50, y: 150, width: 40, height: 40, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'floor', x: 0, y: 750, width: 1200, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'wall1', x: 300, y: 550, width: 600, height: 200, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'shaft1', x: 300, y: 510, width: 600, height: 40, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isHazard: false },
      { id: 'wall2', x: 300, y: 480, width: 600, height: 30, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 's-plat', x: 1000, y: 400, width: 200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'return-p', x: 0, y: 200, width: 300, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
    ],
    enemies: []
  },
  {
    id: 9,
    title: "Molecular Turbulence",
    description: "REBALANCED: Slow and steady. Combine all protocols to find the path.",
    timeLimit: 100,
    playerStart: { x: 50, y: 400 },
    shards: [{ id: 's1', x: 600, y: 400, collected: false }],
    goal: { id: 'goal', x: 1100, y: 400, width: 50, height: 50, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 450, width: 100, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'moving-haz', x: 200, y: 300, width: 50, height: 200, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: 300, moveSpeed: 0.005 },
      { id: 'tight-gap-n', x: 400, y: 0, width: 50, height: 380, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'tight-gap-s', x: 400, y: 420, width: 50, height: 380, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'drift-p', x: 600, y: 400, width: 100, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeX: 300, moveSpeed: 0.004 },
      { id: 'end-p', x: 1050, y: 450, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
    ],
    enemies: []
  },
  {
    id: 10,
    title: "The Compression Chamber",
    description: "Hazards are closing in. Shrink and shift to avoid being crushed between the timelines.",
    timeLimit: 60,
    playerStart: { x: 50, y: 400 },
    shards: [{ id: 's1', x: 1100, y: 700, collected: false }],
    goal: { id: 'goal', x: 1100, y: 400, width: 60, height: 60, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 's', x: 0, y: 350, width: 150, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'h-top', x: 200, y: 0, width: 800, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: 250, moveSpeed: 0.002 },
      { id: 'h-bot', x: 200, y: 700, width: 800, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: -250, moveSpeed: 0.002 },
      { id: 'm-p', x: 250, y: 400, width: 100, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeX: 600, moveSpeed: 0.003 },
      { id: 'm-p-s', x: 850, y: 400, width: 100, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeX: -600, moveSpeed: 0.003 },
      { id: 'e', x: 1050, y: 350, width: 150, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
    ],
    enemies: []
  },
  {
    id: 11,
    title: "Quantum Needle",
    description: "Tiny gaps and massive hazards. The stability cost is high, but the destination is close.",
    timeLimit: 90,
    playerStart: { x: 600, y: 700 },
    shards: [{ id: 's1', x: 600, y: 400, collected: false }, { id: 's2', x: 100, y: 100, collected: false }, { id: 's3', x: 1100, y: 100, collected: false }],
    goal: { id: 'goal', x: 600, y: 50, width: 40, height: 40, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 500, y: 750, width: 200, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'gate1-l', x: 0, y: 550, width: 580, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'gate1-r', x: 620, y: 550, width: 580, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'gate2-l', x: 0, y: 350, width: 590, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'gate2-r', x: 610, y: 350, width: 590, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'haz-l', x: 0, y: 0, width: 50, height: 800, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-r', x: 1150, y: 0, width: 50, height: 800, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'final-m', x: 550, y: 150, width: 100, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeX: 200, moveSpeed: 0.002 },
    ],
    enemies: []
  },
  {
    id: 12,
    title: "The Singularity",
    description: "The core is collapsing. Everything you have learned ends here. Escape the fragment.",
    timeLimit: 120,
    playerStart: { x: 50, y: 700 },
    shards: [{ id: 's1', x: 1100, y: 100, collected: false }],
    goal: { id: 'goal', x: 1100, y: 700, width: 80, height: 80, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'p1', x: 0, y: 750, width: 150, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'h1', x: 200, y: 600, width: 100, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: 300, moveSpeed: 0.004 },
      { id: 'h2', x: 400, y: 200, width: 100, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: -300, moveSpeed: 0.005 },
      { id: 'p2', x: 300, y: 400, width: 50, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'p3', x: 500, y: 400, width: 50, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'm-end', x: 700, y: 100, width: 300, height: 600, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isMoving: true, moveRangeY: 50, moveSpeed: 0.001 },
      { id: 'tunnel', x: 700, y: 350, width: 300, height: 30, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: false },
      { id: 'exit', x: 1000, y: 750, width: 200, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
    ],
    enemies: []
  },
  {
    id: 13,
    title: "Twin Currents",
    description: "Two routes flow in opposite realities. Ride momentum and pick your timeline.",
    timeLimit: 75,
    playerStart: { x: 80, y: 700 },
    shards: [
      { id: 's1', x: 450, y: 560, collected: false },
      { id: 's2', x: 920, y: 280, collected: false }
    ],
    goal: { id: 'goal', x: 1120, y: 120, width: 44, height: 44, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 750, width: 220, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'n1', x: 260, y: 620, width: 220, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 's1p', x: 260, y: 300, width: 220, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'bridge', x: 560, y: 470, width: 200, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'n2', x: 820, y: 360, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 's2p', x: 820, y: 190, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'goal-p', x: 1030, y: 170, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-floor', x: 220, y: 790, width: 810, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true }
    ],
    enemies: []
  },
  {
    id: 14,
    title: "Pulse Elevator",
    description: "The shaft breathes. Catch moving lifts and swap realities before they drift away.",
    timeLimit: 80,
    playerStart: { x: 90, y: 720 },
    shards: [
      { id: 's1', x: 600, y: 620, collected: false },
      { id: 's2', x: 610, y: 280, collected: false }
    ],
    goal: { id: 'goal', x: 1040, y: 90, width: 50, height: 50, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'floor', x: 0, y: 760, width: 260, height: 40, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'm1', x: 320, y: 640, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeY: 200, moveSpeed: 0.003 },
      { id: 'm2', x: 540, y: 520, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeY: -220, moveSpeed: 0.0032 },
      { id: 'm3', x: 760, y: 360, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeY: 200, moveSpeed: 0.003 },
      { id: 'm4', x: 940, y: 220, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeY: -180, moveSpeed: 0.0035 },
      { id: 'goal-base', x: 980, y: 140, width: 160, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-l-top', x: 260, y: 0, width: 20, height: 620, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-r', x: 1120, y: 0, width: 20, height: 800, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true }
    ],
    enemies: []
  },
  {
    id: 15,
    title: "Needle Weave",
    description: "Thread narrow gates by shrinking at speed. Mistime it and the weave closes.",
    timeLimit: 85,
    playerStart: { x: 60, y: 420 },
    shards: [
      { id: 's1', x: 350, y: 420, collected: false },
      { id: 's2', x: 760, y: 420, collected: false },
      { id: 's3', x: 1030, y: 250, collected: false }
    ],
    goal: { id: 'goal', x: 1120, y: 120, width: 45, height: 45, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 460, width: 140, height: 24, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'gate-a-top', x: 220, y: 0, width: 40, height: 380, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'gate-a-bot', x: 220, y: 440, width: 40, height: 360, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'mid-1', x: 300, y: 460, width: 140, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'gate-b-top', x: 520, y: 0, width: 40, height: 360, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'gate-b-bot', x: 520, y: 440, width: 40, height: 360, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'mid-2', x: 610, y: 340, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'gate-c-top', x: 860, y: 0, width: 40, height: 300, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'gate-c-bot', x: 860, y: 500, width: 40, height: 300, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'goal-base', x: 980, y: 190, width: 220, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-strip', x: 140, y: 790, width: 1060, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true }
    ],
    enemies: []
  },
  {
    id: 16,
    title: "Crimson Tides",
    description: "Lava channels rise and fall. Follow the calm windows between eruptions.",
    timeLimit: 90,
    playerStart: { x: 70, y: 700 },
    shards: [
      { id: 's1', x: 430, y: 560, collected: false },
      { id: 's2', x: 830, y: 320, collected: false }
    ],
    goal: { id: 'goal', x: 1110, y: 140, width: 46, height: 46, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 750, width: 180, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'safe-1', x: 220, y: 660, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'lava-1', x: 180, y: 710, width: 220, height: 90, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: -120, moveSpeed: 0.0025 },
      { id: 'safe-2', x: 470, y: 520, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'lava-2', x: 440, y: 600, width: 240, height: 120, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: 120, moveSpeed: 0.0022 },
      { id: 'safe-3', x: 760, y: 360, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'lava-3', x: 720, y: 440, width: 260, height: 140, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: -130, moveSpeed: 0.0027 },
      { id: 'goal-p', x: 1010, y: 200, width: 190, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' }
    ],
    enemies: []
  },
  {
    id: 17,
    title: "Counter Orbit",
    description: "Platforms drift against each other. Use one to launch into another timeline.",
    timeLimit: 95,
    playerStart: { x: 100, y: 690 },
    shards: [
      { id: 's1', x: 580, y: 630, collected: false },
      { id: 's2', x: 620, y: 190, collected: false }
    ],
    goal: { id: 'goal', x: 580, y: 90, width: 48, height: 48, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 740, width: 220, height: 60, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'orb-1', x: 300, y: 610, width: 180, height: 22, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeX: 220, moveSpeed: 0.003 },
      { id: 'orb-2', x: 710, y: 510, width: 180, height: 22, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeX: -240, moveSpeed: 0.0032 },
      { id: 'orb-3', x: 300, y: 380, width: 180, height: 22, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeX: 260, moveSpeed: 0.0034 },
      { id: 'orb-4', x: 710, y: 250, width: 180, height: 22, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeX: -260, moveSpeed: 0.0034 },
      { id: 'goal-base', x: 480, y: 150, width: 240, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-btm', x: 220, y: 790, width: 760, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true }
    ],
    enemies: []
  },
  {
    id: 18,
    title: "Binary Chambers",
    description: "Two mirrored rooms demand opposite gravity timing. Memorize then execute.",
    timeLimit: 100,
    playerStart: { x: 70, y: 700 },
    shards: [
      { id: 's1', x: 300, y: 150, collected: false },
      { id: 's2', x: 900, y: 650, collected: false },
      { id: 's3', x: 600, y: 400, collected: false }
    ],
    goal: { id: 'goal', x: 1120, y: 100, width: 44, height: 44, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 750, width: 170, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'left-floor', x: 170, y: 700, width: 350, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'left-ceil', x: 170, y: 80, width: 350, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'center-both', x: 520, y: 390, width: 160, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'right-floor', x: 680, y: 700, width: 350, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'right-ceil', x: 680, y: 80, width: 350, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'goal-base', x: 1030, y: 160, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-mid-btm', x: 340, y: 790, width: 520, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-mid-top', x: 340, y: 0, width: 520, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true }
    ],
    enemies: []
  },
  {
    id: 19,
    title: "Resonance Sprint",
    description: "Pick up shards in chain order to fuel rapid shifts before the corridor closes.",
    timeLimit: 70,
    playerStart: { x: 40, y: 420 },
    shards: [
      { id: 's1', x: 240, y: 420, collected: false },
      { id: 's2', x: 460, y: 300, collected: false },
      { id: 's3', x: 700, y: 520, collected: false },
      { id: 's4', x: 930, y: 300, collected: false }
    ],
    goal: { id: 'goal', x: 1120, y: 420, width: 46, height: 46, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 450, width: 120, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'n1', x: 180, y: 460, width: 120, height: 18, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 's1p', x: 360, y: 280, width: 140, height: 18, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'n2', x: 560, y: 560, width: 150, height: 18, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 's2p', x: 790, y: 260, width: 150, height: 18, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'end', x: 1010, y: 450, width: 190, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-floor', x: 120, y: 790, width: 890, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-ceil', x: 120, y: 0, width: 890, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true }
    ],
    enemies: []
  },
  {
    id: 20,
    title: "Gravity Lattice",
    description: "A stacked lattice of alternating reality platforms. Every jump is a commitment.",
    timeLimit: 105,
    playerStart: { x: 70, y: 730 },
    shards: [
      { id: 's1', x: 360, y: 610, collected: false },
      { id: 's2', x: 620, y: 450, collected: false },
      { id: 's3', x: 880, y: 290, collected: false }
    ],
    goal: { id: 'goal', x: 1080, y: 90, width: 50, height: 50, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 760, width: 170, height: 40, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'l1', x: 220, y: 660, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'l2', x: 420, y: 570, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'l3', x: 620, y: 480, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'l4', x: 820, y: 390, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'l5', x: 980, y: 280, width: 170, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'l6', x: 850, y: 180, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'goal-base', x: 1020, y: 140, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-bottom', x: 170, y: 790, width: 860, height: 10, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true }
    ],
    enemies: []
  },
  {
    id: 21,
    title: "Fracture Relay",
    description: "Swap realities while platforms relay you across moving hazard fields.",
    timeLimit: 110,
    playerStart: { x: 60, y: 700 },
    shards: [
      { id: 's1', x: 320, y: 520, collected: false },
      { id: 's2', x: 650, y: 340, collected: false },
      { id: 's3', x: 980, y: 200, collected: false }
    ],
    goal: { id: 'goal', x: 1120, y: 120, width: 44, height: 44, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 750, width: 180, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'relay-1', x: 220, y: 620, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeX: 140, moveSpeed: 0.003 },
      { id: 'relay-2', x: 430, y: 520, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeY: -170, moveSpeed: 0.003 },
      { id: 'relay-3', x: 650, y: 410, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL', isMoving: true, moveRangeX: -170, moveSpeed: 0.0032 },
      { id: 'relay-4', x: 870, y: 300, width: 150, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED', isMoving: true, moveRangeY: 150, moveSpeed: 0.0031 },
      { id: 'goal-p', x: 1010, y: 180, width: 190, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-mid', x: 180, y: 700, width: 840, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: -60, moveSpeed: 0.0018 }
    ],
    enemies: []
  },
  {
    id: 22,
    title: "Last Echo",
    description: "Final relay. Use every protocol—shift, shrink, and route control—to escape.",
    timeLimit: 130,
    playerStart: { x: 50, y: 700 },
    shards: [
      { id: 's1', x: 150, y: 150, collected: false },
      { id: 's2', x: 1050, y: 150, collected: false },
      { id: 's3', x: 1050, y: 650, collected: false },
      { id: 's4', x: 150, y: 650, collected: false },
      { id: 's5', x: 600, y: 400, collected: false }
    ],
    goal: { id: 'goal', x: 1120, y: 700, width: 56, height: 56, vx: 0, vy: 0, color: '#facc15', type: 'goal' },
    platforms: [
      { id: 'start', x: 0, y: 750, width: 120, height: 50, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'north-n', x: 120, y: 180, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'north-s', x: 320, y: 110, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'center-ring', x: 500, y: 350, width: 200, height: 100, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'east-n', x: 900, y: 180, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'east-s', x: 700, y: 110, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'south-n', x: 900, y: 620, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'SHIFTED' },
      { id: 'south-s', x: 700, y: 690, width: 180, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'NORMAL' },
      { id: 'final-bridge', x: 1040, y: 730, width: 160, height: 20, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH' },
      { id: 'haz-wall-l', x: 0, y: 0, width: 20, height: 800, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-wall-r', x: 1180, y: 0, width: 20, height: 800, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true },
      { id: 'haz-mid-v', x: 585, y: 0, width: 30, height: 300, vx: 0, vy: 0, color: '', type: 'platform', reality: 'BOTH', isHazard: true, isMoving: true, moveRangeY: 200, moveSpeed: 0.0024 }
    ],
    enemies: []
  }
];
