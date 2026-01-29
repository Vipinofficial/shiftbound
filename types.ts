
export type Reality = 'NORMAL' | 'SHIFTED';

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
  stability: number;
  timeRemaining: number;
  attempts: number;
}
