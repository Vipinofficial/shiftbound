
import React from 'react';
import { GameState } from './types';
import { LEVELS } from './levels';
import { audio } from './audio';

interface UIOverlayProps {
  gameState: GameState;
  inputs: React.MutableRefObject<Record<string, boolean>>;
  onRestart: () => void;
  onResume: () => void;
  onRealityToggle: () => void;
  onSizeToggle: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, inputs, onRestart, onResume, onRealityToggle, onSizeToggle }) => {
  const level = LEVELS[gameState.currentLevel];
  const isShifted = gameState.reality === 'SHIFTED';
  const isSmall = gameState.playerSize === 'SMALL';

  const setTouchInput = (key: string, active: boolean) => {
    if (active) audio.playClick();
    inputs.current[key] = active;
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col p-4 md:p-10 font-mono">
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col">
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mb-1 opacity-60">Memory Fragment</div>
          <div className="flex items-center gap-4">
            <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">0{level.id}</span>
            <div className="flex flex-col">
              <span className={`text-sm md:text-xl font-bold uppercase tracking-widest ${isShifted ? 'text-rose-500' : 'text-sky-400'}`}>
                {level.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mb-1 opacity-60">Temporal Window</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl md:text-5xl font-black tabular-nums ${gameState.timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {Math.ceil(gameState.timeRemaining)}
            </span>
            <span className="text-slate-500 text-sm">S</span>
          </div>
        </div>
      </div>

      {/* Stability Meter - Center Left */}
      <div className="absolute top-1/2 left-4 md:left-10 -translate-y-1/2 flex flex-col items-center">
        <div className="text-[8px] md:text-[10px] text-slate-500 uppercase rotate-90 mb-12 tracking-widest font-black">Stability</div>
        <div className="w-2 md:w-4 h-48 bg-slate-900 border border-slate-700 relative overflow-hidden rounded-full">
          <div 
            className={`absolute bottom-0 w-full transition-all duration-300 ${gameState.stability < 30 ? 'bg-red-600 animate-pulse' : 'bg-yellow-400'}`}
            style={{ height: `${gameState.stability}%` }}
          />
        </div>
        <div className="text-[10px] text-white font-bold mt-2">{Math.floor(gameState.stability)}%</div>
      </div>

      {/* Control Overlay */}
      <div className="mt-auto flex justify-between items-end w-full pointer-events-auto">
        <div className="flex items-center gap-3">
          <div 
            onPointerDown={() => setTouchInput('TOUCH_LEFT', true)}
            onPointerUp={() => setTouchInput('TOUCH_LEFT', false)}
            onPointerLeave={() => setTouchInput('TOUCH_LEFT', false)}
            className="w-14 h-14 md:w-20 md:h-20 bg-slate-900/70 border border-slate-700 flex items-center justify-center rounded-xl active:bg-blue-600/30 transition-colors touch-none"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="rotate-180"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div 
            onPointerDown={() => setTouchInput('TOUCH_RIGHT', true)}
            onPointerUp={() => setTouchInput('TOUCH_RIGHT', false)}
            onPointerLeave={() => setTouchInput('TOUCH_RIGHT', false)}
            className="w-14 h-14 md:w-20 md:h-20 bg-slate-900/70 border border-slate-700 flex items-center justify-center rounded-xl active:bg-blue-600/30 transition-colors touch-none"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>

        <div className="flex items-end gap-2 md:gap-4">
          <button 
            onPointerDown={() => { audio.playClick(); onSizeToggle(); }}
            className={`w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-xl border-2 transition-all active:scale-90 ${isSmall ? 'bg-amber-600/40 border-amber-400' : 'bg-slate-900/70 border-slate-700'}`}
          >
            <div className="text-[8px] font-black opacity-50 mb-1">SIZE</div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              {isSmall ? <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/> : <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>}
            </svg>
          </button>

          <button 
            onPointerDown={() => { audio.playClick(); onRealityToggle(); }}
            className={`w-14 h-14 md:w-20 md:h-20 flex flex-col items-center justify-center rounded-full border-2 transition-all active:scale-90 ${isShifted ? 'bg-rose-600/40 border-rose-400' : 'bg-slate-900/70 border-slate-700'}`}
          >
            <div className="text-[8px] font-black opacity-50 mb-1">SHIFT</div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 11V7l-5 5 5 5v-4h10v4l5-5-5-5v4z"/></svg>
          </button>
          
          <button 
            onPointerDown={() => setTouchInput('TOUCH_JUMP', true)}
            onPointerUp={() => setTouchInput('TOUCH_JUMP', false)}
            onPointerLeave={() => setTouchInput('TOUCH_JUMP', false)}
            className="w-20 h-20 md:w-28 md:h-28 bg-sky-600/40 border-2 border-sky-400 flex flex-col items-center justify-center rounded-full active:scale-90 transition-all shadow-lg"
          >
            <div className="text-[10px] font-black mb-1">JUMP</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className={isShifted ? 'rotate-180' : ''}><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
        </div>
      </div>

      <button 
        onClick={() => { audio.playClick(); onRestart(); }}
        className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-900/50 hover:bg-white hover:text-black border border-white/10 rounded-full transition-all pointer-events-auto"
      >
        <span className="text-xl">↻</span>
      </button>

      {gameState.status === 'PAUSED' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center pointer-events-auto z-50">
          <div className="text-center">
            <h2 className="text-6xl md:text-8xl font-black mb-12 italic tracking-tighter text-white">STASIS</h2>
            <button 
              onClick={() => { audio.playClick(); onResume(); }}
              className="px-16 py-4 bg-white text-black font-black hover:bg-sky-400 transition-all uppercase tracking-[0.4em] text-sm"
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
