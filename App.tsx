
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
    shardsCollected: 0,
    shardsTotal: 0,
    resonance: 0,
    score: 0,
    lastLevelScore: 0,
    totalAttempts: 0,
    maxLevelReached: 0,
  });

  const inputRef = useRef<Record<string, boolean>>({});
  const shardChainRef = useRef<number>(0);
  const lastShardPickupRef = useRef<number>(0);

  const startLevel = useCallback((levelIndex: number, playClickSound: boolean = true) => {
    if (playClickSound) audio.playClick();
    const level = LEVELS[levelIndex];
    inputRef.current = {};
    shardChainRef.current = 0;
    lastShardPickupRef.current = 0;
    
    setGameState(prev => ({
      ...prev,
      currentLevel: levelIndex,
      status: 'PLAYING',
      reality: 'NORMAL',
      playerSize: 'NORMAL',
      stability: 100,
      timeRemaining: level.timeLimit,
      attempts: prev.currentLevel === levelIndex ? prev.attempts + 1 : 1,
      shardsCollected: 0,
      shardsTotal: level.shards.length,
      resonance: 0,
      lastLevelScore: 0,
      totalAttempts: prev.totalAttempts + 1,
      maxLevelReached: Math.max(prev.maxLevelReached, levelIndex + 1),
      ...(prev.status === 'MENU' && levelIndex === 0
        ? { score: 0, totalAttempts: 1, maxLevelReached: 1 }
        : {}),
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
    setGameState(prev => {
      const levelScore =
        1000 +
        Math.floor(prev.timeRemaining * 25) +
        Math.floor(prev.stability * 8) +
        prev.shardsCollected * 300 +
        prev.resonance * 120;

      return {
        ...prev,
        status: 'STORY',
        lastLevelScore: levelScore,
        score: prev.score + levelScore,
        maxLevelReached: Math.max(prev.maxLevelReached, prev.currentLevel + 1)
      };
    });
  }, []);

  const handleLevelFail = useCallback(() => {
    audio.playFail();
    startLevel(0, false);
  }, [startLevel]);

  const toggleReality = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'PLAYING') return prev;
      const hasResonance = prev.resonance > 0;
      if (!hasResonance && prev.stability < STABILITY_COST_SHIFT) return prev;
      audio.playShift();
      return {
        ...prev,
        reality: prev.reality === 'NORMAL' ? 'SHIFTED' : 'NORMAL',
        stability: hasResonance ? prev.stability : Math.max(0, prev.stability - STABILITY_COST_SHIFT),
        resonance: hasResonance ? prev.resonance - 1 : prev.resonance
      };
    });
  }, []);

  const toggleSize = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'PLAYING') return prev;
      const hasResonance = prev.resonance > 0;
      if (!hasResonance && prev.stability < STABILITY_COST_SIZE) return prev;
      audio.playSize();
      return {
        ...prev,
        playerSize: prev.playerSize === 'NORMAL' ? 'SMALL' : 'NORMAL',
        stability: hasResonance ? prev.stability : Math.max(0, prev.stability - STABILITY_COST_SIZE),
        resonance: hasResonance ? prev.resonance - 1 : prev.resonance
      };
    });
  }, []);

  const handleShardCollect = useCallback(() => {
    audio.playCollect();
    const now = Date.now();
    if (now - lastShardPickupRef.current <= 4500) {
      shardChainRef.current += 1;
    } else {
      shardChainRef.current = 1;
    }
    lastShardPickupRef.current = now;

    setGameState(prev => {
      const level = LEVELS[prev.currentLevel];
      const chain = shardChainRef.current;
      const baseStability = 20;
      const clutchBonus = prev.stability < 35 ? 14 : 0;
      const chainStabilityBonus = Math.min(16, (chain - 1) * 4);
      const stabilityGain = baseStability + clutchBonus + chainStabilityBonus;

      const baseTimeBonus = prev.timeRemaining < 12 ? 4 : 2.5;
      const chainTimeBonus = Math.min(3, (chain - 1) * 0.7);
      const timeGain = baseTimeBonus + chainTimeBonus;

      const resonanceGain = chain >= 3 ? 2 : 1;

      return {
        ...prev,
        shardsCollected: Math.min(prev.shardsTotal, prev.shardsCollected + 1),
        stability: Math.min(100, prev.stability + stabilityGain),
        timeRemaining: Math.min(level.timeLimit + 25, prev.timeRemaining + timeGain),
        resonance: Math.min(5, prev.resonance + resonanceGain)
      };
    });
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

  const levelData = LEVELS[gameState.currentLevel];
  const progress = Math.round(((gameState.currentLevel + (gameState.status === 'WON' ? 1 : 0)) / LEVELS.length) * 100);

  return (
    <div className="relative w-full h-full flex items-center justify-center text-white overflow-hidden touch-none ui-root ui-screen-shell">
      <div className={`absolute inset-0 transition-all duration-1000 ${gameState.reality === 'NORMAL' ? 'ui-normal-bg' : 'ui-shifted-bg'}`}>
        <div className="absolute inset-0 ui-grid-overlay" />
        <div className="absolute inset-0 ui-vignette" />
      </div>

      {(gameState.status !== 'PLAYING' && gameState.status !== 'PAUSED') && (
        <div className="absolute top-0 left-0 right-0 z-10 px-4 md:px-10 pt-4 md:pt-6 pointer-events-none">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs uppercase tracking-[0.22em] text-slate-300/70 font-semibold">
            <span className="truncate">Shiftbound // Fractured Reality Protocol</span>
            <span>{progress}% Restored</span>
          </div>
        </div>
      )}

      {gameState.status === 'MENU' && (
        <div className="z-20 w-full px-4 md:px-8">
          <div className="max-w-5xl mx-auto ui-card p-8 md:p-14 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-sky-300/25 bg-slate-900/60 text-[10px] md:text-xs tracking-[0.2em] uppercase text-sky-300/90 mb-6">
              Simulation Node Online
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-3 text-white leading-none ui-title-glow">
              SHIFTBOUND
            </h1>
            <p className="text-slate-300 text-sm md:text-lg tracking-[0.25em] font-medium mb-6 uppercase">Fractured Reality Protocol</p>
            <p className="max-w-2xl mx-auto text-slate-300/85 text-sm md:text-base leading-relaxed mb-10">
              You are trapped inside a collapsing timeline. Bend gravity, compress your form, and navigate unstable structures before temporal integrity fails.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-10 text-left">
              <div className="ui-pill">
                <div className="ui-pill-label">Levels</div>
                <div className="ui-pill-value">{LEVELS.length}</div>
              </div>
              <div className="ui-pill">
                <div className="ui-pill-label">Core Actions</div>
                <div className="ui-pill-value">Shift / Resize</div>
              </div>
              <div className="ui-pill">
                <div className="ui-pill-label">Risk Model</div>
                <div className="ui-pill-value">Time + Stability</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
              <button 
                onClick={() => startLevel(0)}
                className="w-full px-8 py-4 rounded-2xl ui-primary-btn font-black tracking-[0.18em] uppercase"
              >
                Begin Run
              </button>
              <div className="text-slate-400 text-[11px] md:text-xs font-mono uppercase tracking-[0.18em] leading-relaxed">
                WASD / Arrows: Move • Space: Jump • Shift: Gravity Flip • Ctrl: Size Shift • Touch controls supported
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.status === 'STORY' && (
        <div className="z-20 w-full px-4 md:px-8">
          <div className="max-w-3xl mx-auto ui-card p-8 md:p-12 text-center">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-amber-300/80 mb-3">Memory Fragment Recovered</div>
            <h2 className="text-3xl md:text-5xl font-black mb-5 text-amber-300 tracking-tight">{levelData.title}</h2>
            <p className="text-base md:text-xl text-slate-200/90 leading-relaxed mb-10 italic font-serif">
              “{levelData.description}”
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8 text-left">
              <div className="ui-pill">
                <div className="ui-pill-label">Level Score</div>
                <div className="ui-pill-value">{gameState.lastLevelScore}</div>
              </div>
              <div className="ui-pill">
                <div className="ui-pill-label">Total Score</div>
                <div className="ui-pill-value">{gameState.score}</div>
              </div>
              <div className="ui-pill">
                <div className="ui-pill-label">Attempts</div>
                <div className="ui-pill-value">{gameState.totalAttempts}</div>
              </div>
              <div className="ui-pill">
                <div className="ui-pill-label">Max Level</div>
                <div className="ui-pill-value">{gameState.maxLevelReached}</div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mb-8 text-xs md:text-sm uppercase tracking-[0.18em] text-slate-400">
              <span>Attempt {gameState.attempts}</span>
              <span>Level {gameState.currentLevel + 1} / {LEVELS.length}</span>
            </div>
            <button 
              onClick={nextLevel}
              className="px-10 py-4 rounded-2xl ui-primary-btn uppercase font-black tracking-[0.2em]"
            >
              Continue Search
            </button>
          </div>
        </div>
      )}

      {(gameState.status === 'PLAYING' || gameState.status === 'PAUSED') && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-1 sm:px-2 md:px-6 pt-28 md:pt-28 lg:pt-24 pb-24 md:pb-12 lg:pb-8">
          <GameCanvas 
            level={LEVELS[gameState.currentLevel]} 
            gameState={gameState} 
            inputs={inputRef}
            onWin={handleLevelWin}
            onFail={handleLevelFail}
            onCollectShard={handleShardCollect}
            onRealityChange={toggleReality}
            onSizeChange={toggleSize}
          />
          <UIOverlay 
            gameState={gameState} 
            inputs={inputRef}
            onRestart={restartLevel} 
            onPause={() => setGameState(prev => prev.status === 'PLAYING' ? { ...prev, status: 'PAUSED' } : prev)}
            onResume={() => setGameState(prev => ({ ...prev, status: 'PLAYING' }))}
            onRealityToggle={toggleReality}
            onSizeToggle={toggleSize}
          />
        </div>
      )}

      {gameState.status === 'GAMEOVER' && (
        <div className="z-20 w-full px-4 md:px-8">
          <div className="max-w-3xl mx-auto ui-card-danger p-8 md:p-12 text-center">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-red-200/70 mb-3">Critical Event</div>
            <h2 className="text-4xl md:text-7xl font-black text-red-300 mb-3 italic tracking-tight">Stability Lost</h2>
            <p className="text-sm md:text-base text-red-100/80 mb-8 tracking-[0.12em] uppercase">The timeline has collapsed into the void.</p>
            <div className="flex items-center justify-center gap-6 mb-8 text-xs md:text-sm uppercase tracking-[0.15em] text-red-100/75">
              <span>Level {gameState.currentLevel + 1}</span>
              <span>Attempt {gameState.attempts}</span>
            </div>
            <button 
              onClick={restartLevel}
              className="px-12 py-4 rounded-2xl ui-danger-btn font-black uppercase tracking-[0.18em]"
            >
              Re-initiate Sequence
            </button>
          </div>
        </div>
      )}

      {gameState.status === 'WON' && (
        <div className="z-20 w-full px-4 md:px-8">
          <div className="max-w-4xl mx-auto ui-card p-8 md:p-14 text-center">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-cyan-300/80 mb-3">Protocol Complete</div>
            <h2 className="text-4xl md:text-8xl font-black text-cyan-300 mb-4 tracking-tight leading-none">Boundaries Broken</h2>
            <p className="text-slate-200 text-lg md:text-2xl font-light mb-10 opacity-90">You escaped the fractured dimension.</p>
            <div className="max-w-xl mx-auto w-full h-3 rounded-full bg-slate-900/80 border border-slate-700/70 mb-10 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-sky-500 via-cyan-300 to-blue-500" />
            </div>
            <button 
              onClick={() => { audio.playClick(); setGameState(prev => ({ ...prev, status: 'MENU' })); }}
              className="px-10 py-4 rounded-2xl ui-primary-btn font-black uppercase tracking-[0.18em]"
            >
              Return To Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
