
import React from 'react';
import { GameState } from '../types';
import { LEVELS } from '../levels';

interface UIOverlayProps {
  gameState: GameState;
  onRestart: () => void;
  onResume: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, onRestart, onResume }) => {
  const level = LEVELS[gameState.currentLevel];
  const isShifted = gameState.reality === 'SHIFTED';

  return (
    <div className="absolute inset-0 pointer-events-none select-none p-8 font-mono">
      {/* HUD Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-slate-500 uppercase tracking-widest">Memory Fragment</div>
          <div className="text-3xl font-bold flex items-center gap-4">
            <span className="text-white">0{level.id}</span>
            <span className="w-8 h-[2px] bg-slate-700" />
            <span className="text-blue-400">{level.title}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-500 uppercase tracking-widest">Temporal Stability</div>
          <div className={`text-4xl font-black ${gameState.timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {gameState.timeRemaining.toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Reality Status */}
      <div className="absolute bottom-8 left-8">
        <div className="text-sm text-slate-500 uppercase tracking-widest mb-2">Active Plane</div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 border transition-all duration-300 ${!isShifted ? 'bg-blue-600 border-blue-400 text-white' : 'bg-transparent border-slate-700 text-slate-600'}`}>
            NORMAL
          </div>
          <div className={`px-4 py-2 border transition-all duration-300 ${isShifted ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-transparent border-slate-700 text-slate-600'}`}>
            SHIFTED
          </div>
        </div>
      </div>

      {/* Gravity Indicator */}
      <div className="absolute bottom-8 right-8 text-right">
        <div className="text-sm text-slate-500 uppercase tracking-widest mb-2">Gravity Vector</div>
        <div className={`text-2xl transition-transform duration-500 ${isShifted ? 'rotate-180 text-red-500' : 'rotate-0 text-blue-500'}`}>
          ↓
        </div>
      </div>

      {/* Pause Menu Button (Manual Controls) */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto opacity-20 hover:opacity-100 transition-opacity">
        <button 
          onClick={onRestart}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
          title="Restart Level"
        >
          ↻
        </button>
      </div>

      {gameState.status === 'PAUSED' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="text-center">
            <h2 className="text-6xl font-black mb-8 italic">STASIS</h2>
            <button 
              onClick={onResume}
              className="px-12 py-3 bg-white text-black font-bold hover:bg-blue-400 transition-colors"
            >
              RESUME
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
