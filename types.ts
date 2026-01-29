
export type Reality = 'NORMAL' | 'SHIFTED';
export type PlayerSize = 'NORMAL' | 'SMALL';

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
}
