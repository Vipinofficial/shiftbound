
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Reality, PlayerSize } from './types';
import { LEVELS } from './levels';
import GameCanvas from './GameCanvas';
import UIOverlay from './UIOverlay';
import { audio } from './audio';

const STABILITY_COST_SHIFT = 15;
const STABILITY_COST_SIZE = 10;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    status: 'MENU',
    reality: 'NORMAL',
    playerSize: 'NORMAL',
    stability: 100,
    timeRemaining: 0,
    attempts: 0,
  });

  const inputRef = useRef<Record<string, boolean>>({});

  const startLevel = useCallback((levelIndex: number) => {
    audio.playClick();
    const level = LEVELS[levelIndex];
    inputRef.current = {};
    
    setGameState(prev => ({
      ...prev,
      currentLevel: levelIndex,
      status: 'PLAYING',
      reality: 'NORMAL',
      playerSize: 'NORMAL',
      stability: 100,
      timeRemaining: level.timeLimit,
      attempts: prev.currentLevel === levelIndex ? prev.attempts + 1 : 1,
    }));
  }, []);

  const nextLevel = useCallback(() => {
    audio.playClick();
    if (gameState.currentLevel + 1 < LEVELS.length) {
      startLevel(gameState.currentLevel + 1);
    } else {
      setGameState(prev => ({ ...prev, status: 'WON' }));
      audio.playWin();
    }
  }, [gameState.currentLevel, startLevel]);

  const restartLevel = useCallback(() => {
    audio.playClick();
    startLevel(gameState.currentLevel);
  }, [gameState.currentLevel, startLevel]);

  const handleLevelWin = useCallback(() => {
    audio.playWin();
    setGameState(prev => ({ ...prev, status: 'STORY' }));
  }, []);

  const handleLevelFail = useCallback(() => {
    audio.playFail();
    setGameState(prev => ({ ...prev, status: 'GAMEOVER' }));
  }, []);

  const toggleReality = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'PLAYING') return prev;
      if (prev.stability < STABILITY_COST_SHIFT) return prev; 
      audio.playShift();
      return {
        ...prev,
        reality: prev.reality === 'NORMAL' ? 'SHIFTED' : 'NORMAL',
        stability: Math.max(0, prev.stability - STABILITY_COST_SHIFT)
      };
    });
  }, []);

  const toggleSize = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'PLAYING') return prev;
      if (prev.stability < STABILITY_COST_SIZE) return prev;
      audio.playSize();
      return {
        ...prev,
        playerSize: prev.playerSize === 'NORMAL' ? 'SMALL' : 'NORMAL',
        stability: Math.max(0, prev.stability - STABILITY_COST_SIZE)
      };
    });
  }, []);

  const recoverStability = useCallback((amount: number) => {
    audio.playCollect();
    setGameState(prev => ({
      ...prev,
      stability: Math.min(100, prev.stability + amount)
    }));
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameState.status === 'PLAYING') {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 0) {
            handleLevelFail();
            return prev;
          }
          const newStability = Math.min(100, prev.stability + 0.8);
          return { 
            ...prev, 
            timeRemaining: Math.max(0, prev.timeRemaining - 0.1),
            stability: newStability
          };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState.status, handleLevelFail]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 text-white overflow-hidden touch-none">
      <div className={`absolute inset-0 transition-colors duration-1000 ${gameState.reality === 'NORMAL' ? 'bg-slate-950' : 'bg-red-950/20'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent)] pointer-events-none" />
      </div>

      {gameState.status === 'MENU' && (
        <div className="z-20 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            SHIFTBOUND
          </h1>
          <p className="text-blue-400 text-sm md:text-xl tracking-[0.3em] font-light mb-12 uppercase">Fractured Reality Protocol</p>
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <button 
              onClick={() => startLevel(0)}
              className="px-8 py-4 bg-white text-black font-bold hover:bg-blue-400 hover:scale-105 transition-all duration-200"
            >
              INITIATE
            </button>
            <p className="text-slate-500 text-[10px] md:text-sm mt-4 italic font-mono uppercase tracking-widest opacity-60">
              WASD/ARROWS: MOVE | SPACE: SHIFT | SHIFT/CTRL: SIZE<br/>Mobile: Touch Controls
            </p>
          </div>
        </div>
      )}

      {gameState.status === 'STORY' && (
        <div className="z-20 text-center p-8 max-w-2xl bg-black/80 backdrop-blur-md border border-white/10 mx-4 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-400">Memory Restored</h2>
          <p className="text-sm md:text-lg text-slate-300 leading-relaxed mb-8 italic font-serif">
            "{LEVELS[gameState.currentLevel].description}"
          </p>
          <button 
            onClick={nextLevel}
            className="px-10 py-3 bg-blue-600 hover:bg-blue-500 transition-colors uppercase font-bold tracking-widest"
          >
            CONTINUE SEARCH
          </button>
        </div>
      )}

      {(gameState.status === 'PLAYING' || gameState.status === 'PAUSED') && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <GameCanvas 
            level={LEVELS[gameState.currentLevel]} 
            gameState={gameState} 
            inputs={inputRef}
            onWin={handleLevelWin}
            onFail={handleLevelFail}
            onCollectShard={() => recoverStability(40)}
            onRealityChange={toggleReality}
            onSizeChange={toggleSize}
          />
          <UIOverlay 
            gameState={gameState} 
            inputs={inputRef}
            onRestart={restartLevel} 
            onResume={() => setGameState(prev => ({ ...prev, status: 'PLAYING' }))}
            onRealityToggle={toggleReality}
            onSizeToggle={toggleSize}
          />
        </div>
      )}

      {gameState.status === 'GAMEOVER' && (
        <div className="z-20 text-center p-12 bg-red-950/40 backdrop-blur-xl border-t border-b border-red-500/30 w-full px-4">
          <h2 className="text-5xl md:text-7xl font-black text-red-500 mb-2 italic tracking-tighter">STABILITY LOST</h2>
          <p className="text-xs md:text-sm text-red-200 mb-8 tracking-widest uppercase">The timeline has collapsed into the void.</p>
          <button 
            onClick={restartLevel}
            className="px-12 py-4 bg-red-600 hover:bg-red-500 text-white font-bold transition-transform hover:scale-110 active:scale-95"
          >
            RE-INITIATE SEQUENCE
          </button>
        </div>
      )}

      {gameState.status === 'WON' && (
        <div className="z-20 text-center px-4">
          <h2 className="text-5xl md:text-8xl font-black text-blue-400 mb-4 tracking-tighter">BOUNDARIES BROKEN</h2>
          <p className="text-white text-lg md:text-xl font-light mb-12 opacity-80">You have escaped the fractured dimension.</p>
          <button 
            onClick={() => { audio.playClick(); setGameState(prev => ({ ...prev, status: 'MENU' })); }}
            className="px-8 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold tracking-widest"
          >
            RETURN TO VOID
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
