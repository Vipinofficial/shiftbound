
export type Reality = 'NORMAL' | 'SHIFTED';
export type PlayerSize = 'NORMAL' | 'SMALL';
export type DifficultyMode = 'EASY' | 'INTERMEDIATE' | 'HARD';
export type DesktopActionOrder = 'PAUSE_FIRST' | 'RESTART_FIRST';
export type DesktopMovePreset = 'WASD' | 'ARROWS';
export type MobileTouchDock = 'BOTTOM' | 'TOP_LEFT' | 'TOP_RIGHT';
export type MobileClusterOrder = 'MOVE_LEFT_ACTION_RIGHT' | 'ACTION_LEFT_MOVE_RIGHT';
export type FailReason = 'LAVA' | 'MONSTER' | 'VOID' | 'TIME' | 'UNKNOWN';

export interface DesktopInputBindings {
  moveLeft: string;
  moveRight: string;
  jump: string;
  toggleReality: string;
  toggleSize: string;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  color: string;
}

export interface Platform extends Entity {
  type: 'platform';
  reality: 'BOTH' | 'NORMAL' | 'SHIFTED';
  isHazard?: boolean;
  // Moving platform properties
  isMoving?: boolean;
  moveRangeX?: number;
  moveRangeY?: number;
  moveSpeed?: number;
  initialX?: number;
  initialY?: number;
}

export interface Shard extends Vector2D {
  id: string;
  collected: boolean;
}

export interface Goal extends Entity {
  type: 'goal';
}

export interface Level {
  id: number;
  title: string;
  description: string;
  platforms: Platform[];
  shards: Shard[];
  playerStart: Vector2D;
  goal: Goal;
  enemies: Entity[];
  timeLimit: number;
}

export interface GameState {
  currentLevel: number;
  status: 'MENU' | 'PLAYING' | 'PAUSED' | 'WON' | 'GAMEOVER' | 'STORY';
  reality: Reality;
  playerSize: PlayerSize;
  stability: number;
  timeRemaining: number;
  attempts: number;
  shardsCollected: number;
  shardsTotal: number;
  resonance: number;
  score: number;
  hardLives: number;
  lastLevelScore: number;
  totalAttempts: number;
  maxLevelReached: number;
}

export interface ControlLayoutSettings {
  desktopActionOrder: DesktopActionOrder;
  desktopMovePreset: DesktopMovePreset;
  desktopBindings: DesktopInputBindings;
  mobileTouchDock: MobileTouchDock;
  mobileClusterOrder: MobileClusterOrder;
}
