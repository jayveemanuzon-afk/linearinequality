import React from 'react';
import { GameMode, PlayerStats } from '../types';
import { IMAGES } from '../assets';
import { sound } from '../utils/audio';
import {
  BookOpen,
  Target,
  Sparkles,
  Trophy,
  Coins,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
} from 'lucide-react';
import { RobinHoodMascot } from './RobinHoodMascot';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenShop: () => void;
  onOpenGlossary: () => void;
  stats: PlayerStats;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenShop,
  onOpenGlossary,
  stats,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Hero Showcase Card */}
      <div
        className="relative rounded-3xl overflow-hidden border-2 border-amber-600/70 shadow-2xl p-6 sm:p-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.75) 50%, rgba(15, 23, 42, 0.92) 100%), url(${IMAGES.forestBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text & Call to Action (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-cinzel font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sherwood Forest Mathematical Adventure</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-amber-300 tracking-tight leading-tight">
              Math Hood:<br />
              <span className="text-emerald-400">Arrows of Logic</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              Join Robin Hood in the enchanted woods of Nottingham! Master linear inequalities in one variable through structured interactive lessons, exit-ticket checkpoints, and high-stakes archery duels against moving mathematical targets.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectMode('LEVEL_1_LEARN');
                  sound.bowDraw();
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-cinzel font-bold text-sm rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2.5 transition-all transform hover:scale-102 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-200" />
                <span>Begin Level 1: Lessons</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectMode('LEVEL_2_ARCHERY');
                  sound.arrowRelease();
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-cinzel font-bold text-sm rounded-xl shadow-lg shadow-amber-950 flex items-center gap-2.5 transition-all transform hover:scale-102 cursor-pointer"
              >
                <Target className="w-4 h-4 text-amber-200" />
                <span>Play Level 2: Archery</span>
              </button>

              <button
                onClick={onOpenShop}
                className="px-4 py-3 bg-slate-800/80 hover:bg-slate-750 border border-amber-600/40 text-amber-300 font-cinzel font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Quiver Armory</span>
              </button>
            </div>
          </div>

          {/* Right Robin Hood Character Showcase (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="relative w-44 h-60 sm:w-56 sm:h-76 rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-2xl bg-emerald-950/60 p-2">
                <img
                  src={IMAGES.robinHood}
                  alt="Robin Hood - Arrows of Logic"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Character Badge */}
              <div className="mt-3 text-center">
                <div className="font-cinzel text-base font-bold text-amber-300">
                  Robin of Locksley
                </div>
                <div className="text-xs text-emerald-400 font-medium">
                  Champion of Sherwood & Master of Inequalities
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Robin Hood Welcome Mascot Bubble */}
      <RobinHoodMascot
        message="Greetings, scholar! Whether you are here to learn the fundamentals of linear inequalities or test your aim at moving coordinate targets, my quiver is at your service. Earn gold on every shot to unlock enchanted bows!"
        mood="explaining"
        rankTitle="Robin's Camp"
      />

      {/* Two Game Modes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Level 1 Self-Learning Module */}
        <div
          onClick={() => {
            onSelectMode('LEVEL_1_LEARN');
            sound.bowDraw();
          }}
          role="button"
          tabIndex={0}
          className="p-6 bg-slate-900/90 border border-emerald-600/40 hover:border-emerald-400 rounded-2xl shadow-xl transition-all cursor-pointer group hover:scale-[1.01] flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-700/50">
                5 Structured Slides
              </span>
            </div>

            <div>
              <h2 className="font-cinzel text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                Level 1: Self-Learning Module
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore clear definitions, real-world examples, interactive number line sandboxes, and compulsory exit tickets.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Inequality Symbols (<span className="font-mono text-amber-300">&lt;, ≤, &gt;, ≥</span>) & Range Concepts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Open Circle (○) vs Solid Closed Dot (●) Graphs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>The Golden Negative Sign Flip Rule</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Interactive Exit Ticket Gates to advance each slide</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-cinzel font-bold text-emerald-400 group-hover:text-emerald-300">
            <span>Enter Sherwood Academy</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Level 2 Archery Tournament */}
        <div
          onClick={() => {
            onSelectMode('LEVEL_2_ARCHERY');
            sound.arrowRelease();
          }}
          role="button"
          tabIndex={0}
          className="p-6 bg-slate-900/90 border border-amber-600/40 hover:border-amber-400 rounded-2xl shadow-xl transition-all cursor-pointer group hover:scale-[1.01] flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-950/80 border border-amber-500/50 rounded-xl text-amber-400">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-amber-300 font-bold bg-amber-950 px-2.5 py-1 rounded border border-amber-700/50">
                10 Tournament Items
              </span>
            </div>

            <div>
              <h2 className="font-cinzel text-xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                Level 2: Archery Tournament
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Simplify inequalities with both-side operations, then click points directly on the number line for Robin Hood to shoot the matching targets!
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🎯</span>
                <span>Click operations to simplify both sides automatically</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🎯</span>
                <span>Large visible inequality & direct point clicks on the number line</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🎯</span>
                <span>Every true number triggers Robin Hood to fire and strike the target</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">🎯</span>
                <span>Earn gold on every shot to unlock quiver upgrades!</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-cinzel font-bold text-amber-400 group-hover:text-amber-300">
            <span>Enter the Archery Range</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Player Stats & Progress Strip */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-cinzel font-bold text-sm text-slate-200">
              Archer Career Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Gold Treasury:</span>
              <strong className="text-amber-400 font-mono text-sm">{stats.gold}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Bullseyes:</span>
              <strong className="text-emerald-400 font-mono text-sm">{stats.bullseyes}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Max Streak:</span>
              <strong className="text-orange-400 font-mono text-sm">{stats.highestStreak}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Equipped Bow:</span>
              <strong className="text-amber-300 font-medium">Nottingham Oak</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
