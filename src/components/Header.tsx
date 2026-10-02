import React from 'react';
import { Volume2, VolumeX, Shield, Coins, Sparkles, BookOpen, Target } from 'lucide-react';
import { GameMode, PlayerStats } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: PlayerStats;
  onOpenShop: () => void;
  onOpenGlossary: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  stats,
  onOpenShop,
  onOpenGlossary,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-900/40 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectMode('MENU')}
          className="text-left group flex items-center gap-2 focus:outline-none"
        >
          <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors">
            Math Hood
          </span>
          <span className="hidden sm:inline text-xs text-amber-200/70 font-cinzel tracking-widest uppercase">
            Arrows of Logic
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectMode('MENU')}
            className={`transition-colors hover:text-amber-400 ${
              currentMode === 'MENU' ? 'text-amber-400 underline decoration-amber-400 underline-offset-8' : 'text-slate-300'
            }`}
          >
            Sherwood Camp
          </button>
          <button
            onClick={() => onSelectMode('LEVEL_1_LEARN')}
            className={`flex items-center gap-1.5 transition-colors hover:text-amber-400 ${
              currentMode === 'LEVEL_1_LEARN' ? 'text-amber-400 underline decoration-amber-400 underline-offset-8' : 'text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Level 1: Self-Learning</span>
          </button>
          <button
            onClick={() => onSelectMode('LEVEL_2_ARCHERY')}
            className={`flex items-center gap-1.5 transition-colors hover:text-amber-400 ${
              currentMode === 'LEVEL_2_ARCHERY' ? 'text-amber-400 underline decoration-amber-400 underline-offset-8' : 'text-slate-300'
            }`}
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span>Level 2: Archery Game</span>
          </button>
          <button
            onClick={onOpenGlossary}
            className="text-slate-300 hover:text-amber-400 transition-colors"
          >
            Glossary
          </button>
        </nav>

        {/* Zone 3: Primary actions (Gold, Shop, Audio) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Gold counter */}
          <div
            onClick={onOpenShop}
            role="button"
            tabIndex={0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/60 border border-amber-600/40 rounded-lg text-amber-300 text-xs sm:text-sm font-semibold cursor-pointer hover:bg-amber-900/60 transition-colors shadow-sm"
            title="Click to open Quiver Upgrades Shop"
          >
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-mono tabular-nums">{stats.gold}</span>
            <span className="hidden sm:inline text-amber-200/70 text-xs">Gold</span>
          </div>

          {/* Quiver Shop CTA */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Quiver</span> Shop
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.targetHit(false);
            }}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
