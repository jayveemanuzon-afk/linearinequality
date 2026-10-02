import React from 'react';
import { IMAGES } from '../assets';
import { Sparkles, Award } from 'lucide-react';

interface RobinHoodMascotProps {
  message?: string;
  mood?: 'cheering' | 'aiming' | 'explaining' | 'proud';
  rankTitle?: string;
  compact?: boolean;
  className?: string;
}

export const RobinHoodMascot: React.FC<RobinHoodMascotProps> = ({
  message = "Keep your eye on the inequality boundary! Let's hit the bullseye!",
  mood = 'explaining',
  rankTitle = 'Sherwood Archer',
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-amber-950/40 border border-emerald-700/40 shadow-lg ${className}`}
    >
      {/* Robin Hood Character Portrait / Figure */}
      <div className="relative shrink-0">
        <div
          className={`relative rounded-xl overflow-hidden border-2 border-amber-500/70 shadow-md bg-emerald-900/40 ${
            compact ? 'w-14 h-18 sm:w-16 sm:h-20' : 'w-20 h-28 sm:w-24 sm:h-32'
          }`}
        >
          <img
            src={IMAGES.robinHood}
            alt="Robin Hood Archer Mascot"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // Fallback to stylish SVG avatar if asset fails
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex flex-col items-center justify-center bg-emerald-800 text-amber-300 text-xs p-1 text-center font-bold">
                    🏹 Robin Hood
                  </div>
                `;
              }
            }}
          />

          {/* Glowing feather accent */}
          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-75" />
        </div>

        {/* Small rank pill below avatar */}
        <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-amber-300 font-cinzel font-semibold tracking-wider text-center">
          <Award className="w-2.5 h-2.5 text-amber-400 shrink-0" />
          <span className="truncate max-w-[80px]">{rankTitle}</span>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 relative bg-amber-50 text-slate-900 p-3 sm:p-3.5 rounded-lg shadow-inner border border-amber-300/80 before:content-[''] before:absolute before:top-4 before:-left-2 before:w-0 before:h-0 before:border-t-8 before:border-t-transparent before:border-r-8 before:border-r-amber-50 before:border-b-8 before:border-b-transparent">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-emerald-900 tracking-wide">
            <span>Robin Hood</span>
            <span className="text-amber-700">· Guide of Sherwood</span>
          </div>
          <span className="text-[10px] text-emerald-800/80 font-medium">
            {mood === 'cheering' && '🎉 Celebrating'}
            {mood === 'aiming' && '🎯 Ready to Draw'}
            {mood === 'explaining' && '🏹 Tactical Advice'}
            {mood === 'proud' && '🏆 Marksman Praise'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 leading-snug font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};
