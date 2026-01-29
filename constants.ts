
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

export const PHYSICS = {
  GRAVITY: 0.75,
  SHIFTED_GRAVITY: -0.75,
  FRICTION: 0.88,
  MOVE_SPEED: 0.8,
  MAX_SPEED: 9,
  JUMP_FORCE: -15,
  SHIFTED_JUMP_FORCE: 15,
  COYOTE_TIME: 5, // frames you can jump after falling
};

export const THEME = {
  NORMAL: {
    bg: '#020617',
    grid: 'rgba(56, 189, 248, 0.05)',
    platform: '#1e293b',
    activePlatform: '#0ea5e9',
    player: '#7dd3fc',
    hazard: '#ef4444',
    accent: '#38bdf8',
  },
  SHIFTED: {
    bg: '#180000',
    grid: 'rgba(244, 63, 94, 0.05)',
    platform: '#450a0a',
    activePlatform: '#f43f5e',
    player: '#fda4af',
    hazard: '#fb7185',
    accent: '#e11d48',
  }
};
