
import React from 'react';
import { GameState } from './types';
import { LEVELS } from './levels';
import { audio } from './audio';

interface UIOverlayProps {
  gameState: GameState;
  inputs: React.MutableRefObject<Record<string, boolean>>;
  onRestart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRealityToggle: () => void;
  onSizeToggle: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, inputs, onRestart, onPause, onResume, onRealityToggle, onSizeToggle }) => {
  const level = LEVELS[gameState.currentLevel];
  const isShifted = gameState.reality === 'SHIFTED';
  const isSmall = gameState.playerSize === 'SMALL';
  const timePct = Math.max(0, Math.min(100, (gameState.timeRemaining / level.timeLimit) * 100));

  const setTouchInput = (key: string, active: boolean) => {
    if (active) audio.playClick();
    inputs.current[key] = active;
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col p-3 md:p-4 font-mono ui-safe-area">
      <div className="ui-hud-panel px-3 md:px-4 py-2.5 md:py-3 pointer-events-auto">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-xl md:text-3xl font-black text-white italic tracking-tight leading-none">{String(level.id).padStart(2, '0')}</span>
          <div className="min-w-0 flex-1">
            <div className={`text-[11px] md:text-sm font-black uppercase tracking-[0.12em] truncate ${isShifted ? 'text-rose-300' : 'text-sky-300'}`}>
              {level.title}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.12em] text-slate-300/80 flex-wrap">
              <span className="px-2 py-0.5 rounded-full border border-cyan-300/35 bg-cyan-400/10">Shards {gameState.shardsCollected}/{gameState.shardsTotal}</span>
              <span className="px-2 py-0.5 rounded-full border border-fuchsia-300/35 bg-fuchsia-400/10">Res {gameState.resonance}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {gameState.status === 'PLAYING' && (
              <button
                onClick={() => { audio.playClick(); onPause(); }}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-slate-900/70 hover:bg-white hover:text-black border border-slate-400/20 rounded-full transition-all shadow-xl"
              >
                <span className="text-sm md:text-base">⏸</span>
              </button>
            )}
            <button
              onClick={() => { audio.playClick(); onRestart(); }}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-slate-900/70 hover:bg-white hover:text-black border border-slate-400/20 rounded-full transition-all shadow-xl"
            >
              <span className="text-lg">↻</span>
            </button>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:gap-3 lg:hidden">
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-1">Stability</div>
            <div className="h-1.5 md:h-2 rounded-full overflow-hidden bg-slate-900/80 border border-slate-700/60">
              <div
                className={`h-full transition-all duration-300 ${gameState.stability < 30 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-yellow-300'}`}
                style={{ width: `${gameState.stability}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mb-1 text-right">Time {Math.ceil(gameState.timeRemaining)}s</div>
            <div className="h-1.5 md:h-2 rounded-full overflow-hidden bg-slate-900/80 border border-slate-700/60">
              <div className={`h-full transition-all duration-300 ${timePct < 20 ? 'bg-red-500' : 'bg-cyan-400'}`} style={{ width: `${timePct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="ui-hud-panel px-3 py-4 w-16 flex flex-col items-center">
          <div className="text-[8px] text-slate-400 uppercase tracking-[0.18em] font-semibold mb-3 [writing-mode:vertical-rl] rotate-180">Stability</div>
          <div className="w-2.5 h-44 bg-slate-900/80 border border-slate-700/60 relative overflow-hidden rounded-full">
            <div
              className={`absolute bottom-0 w-full transition-all duration-300 ${gameState.stability < 30 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-t from-amber-500 to-yellow-300'}`}
              style={{ height: `${gameState.stability}%` }}
            />
          </div>
          <div className="text-[10px] text-white font-bold mt-3 tabular-nums">{Math.floor(gameState.stability)}%</div>
        </div>
      </div>

      <div className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="ui-hud-panel px-3 py-4 w-16 flex flex-col items-center">
          <div className="text-[8px] text-slate-400 uppercase tracking-[0.18em] font-semibold mb-3 [writing-mode:vertical-rl] rotate-180">Time</div>
          <div className="w-2.5 h-44 bg-slate-900/80 border border-slate-700/60 relative overflow-hidden rounded-full">
            <div
              className={`absolute bottom-0 w-full transition-all duration-300 ${timePct < 20 ? 'bg-red-500 animate-pulse' : 'bg-cyan-400'}`}
              style={{ height: `${timePct}%` }}
            />
          </div>
          <div className="text-[10px] text-white font-bold mt-3 tabular-nums">{Math.ceil(gameState.timeRemaining)}s</div>
        </div>
      </div>

      <div className="mt-auto w-full pointer-events-auto md:hidden">
        <div className="ui-hud-panel p-2 flex items-end justify-between gap-2">
          <div className="flex items-center gap-2">
            <div 
              onPointerDown={() => setTouchInput('TOUCH_LEFT', true)}
              onPointerUp={() => setTouchInput('TOUCH_LEFT', false)}
              onPointerLeave={() => setTouchInput('TOUCH_LEFT', false)}
              className="ui-control-btn w-11 h-11"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="rotate-180"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <div 
              onPointerDown={() => setTouchInput('TOUCH_RIGHT', true)}
              onPointerUp={() => setTouchInput('TOUCH_RIGHT', false)}
              onPointerLeave={() => setTouchInput('TOUCH_RIGHT', false)}
              className="ui-control-btn w-11 h-11"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button 
              onPointerDown={() => { audio.playClick(); onSizeToggle(); }}
              className={`w-11 h-11 flex flex-col items-center justify-center rounded-xl border transition-all active:scale-90 ${isSmall ? 'bg-amber-500/25 border-amber-300 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.35)]' : 'bg-slate-900/70 border-slate-600 text-slate-200'}`}
            >
              <div className="text-[7px] font-black opacity-60 mb-0.5">SIZE</div>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                {isSmall ? <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/> : <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>}
              </svg>
            </button>

            <button 
              onPointerDown={() => { audio.playClick(); onRealityToggle(); }}
              className={`w-11 h-11 flex flex-col items-center justify-center rounded-full border transition-all active:scale-90 ${isShifted ? 'bg-rose-500/30 border-rose-300 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.35)]' : 'bg-slate-900/70 border-slate-600 text-slate-200'}`}
            >
              <div className="text-[7px] font-black opacity-60 mb-0.5">SHIFT</div>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 11V7l-5 5 5 5v-4h10v4l5-5-5-5v4z"/></svg>
            </button>
            
            <button 
              onPointerDown={() => setTouchInput('TOUCH_JUMP', true)}
              onPointerUp={() => setTouchInput('TOUCH_JUMP', false)}
              onPointerLeave={() => setTouchInput('TOUCH_JUMP', false)}
              className="w-14 h-14 bg-gradient-to-br from-sky-500/45 to-cyan-400/25 border border-sky-300 flex flex-col items-center justify-center rounded-full active:scale-90 transition-all shadow-[0_0_22px_rgba(56,189,248,0.4)]"
            >
              <div className="text-[8px] font-black mb-0.5">JUMP</div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className={isShifted ? 'rotate-180' : ''}><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {gameState.status === 'PAUSED' && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xl flex items-center justify-center pointer-events-auto z-50">
          <div className="ui-card text-center p-8 md:p-12 mx-4">
            <h2 className="text-5xl md:text-7xl font-black mb-10 italic tracking-tight text-white">Stasis</h2>
            <button 
              onClick={() => { audio.playClick(); onResume(); }}
              className="px-10 py-4 rounded-2xl ui-primary-btn font-black uppercase tracking-[0.22em] text-xs md:text-sm"
            >
              Resume Fragment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
