
import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Fracture Begins",
    description: "Your weight is a suggestion. Use SPACE or the Shift button to flip gravity. Shifting costs stability—don't let it reach zero.",
    timeLimit: 40,
    playerStart: { x: 100, y: 650 },
    shards: [
      { id: 's1', x: 600, y: 400, collected: false }
    ],
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
    shards: [
      { id: 's1', x: 600, y: 400, collected: false }
    ],
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
    shards: [
      { id: 's1', x: 400, y: 500, collected: false },
      { id: 's2', x: 800, y: 300, collected: false }
    ],
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
    shards: [
      { id: 's1', x: 600, y: 400, collected: false },
      { id: 's2', x: 100, y: 700, collected: false }
    ],
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
  }
];
