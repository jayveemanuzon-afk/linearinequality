import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVEL_2_CHALLENGES } from '../data/level2Challenges';
import { PlayerStats } from '../types';
import { IMAGES } from '../assets';
import { sound } from '../utils/audio';
import { RobinHoodMascot } from './RobinHoodMascot';
import {
  Target,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Coins,
  ChevronRight,
  Flame,
  Trophy,
  Info,
} from 'lucide-react';

interface Level2ArcheryProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onOpenShop: () => void;
}

type RoundPhase = 'SIMPLIFY' | 'ARCHERY_NUMBER_LINE' | 'ROUND_VICTORY';

interface FlyingArrow {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  angle: number;
  isHit: boolean;
  targetNumber: number;
  startTime: number;
  duration: number;
}

/**
 * Strips white and near-white backdrop pixels from an image source using an in-memory canvas
 * ensuring Robin Hood renders with a 100% transparent background.
 */
function useTransparentRobinHood(src: string): string {
  const [transparentSrc, setTransparentSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if near white
          if (r > 220 && g > 220 && b > 220) {
            data[i + 3] = 0; // fully transparent
          } else if (r > 195 && g > 195 && b > 195) {
            // Feather edge
            const alpha = 255 - ((r + g + b) / 3 - 195) * 6;
            data[i + 3] = Math.max(0, Math.min(data[i + 3], alpha));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setTransparentSrc(canvas.toDataURL('image/png'));
      } catch {
        // Fallback to original
      }
    };
    img.src = src;
  }, [src]);

  return transparentSrc;
}

export const Level2Archery: React.FC<Level2ArcheryProps> = ({
  stats,
  onUpdateStats,
  onOpenShop,
}) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const challenge = LEVEL_2_CHALLENGES[challengeIndex % LEVEL_2_CHALLENGES.length];

  // Transparent Robin Hood Image
  const cleanRobinHoodSrc = useTransparentRobinHood(IMAGES.robinHood);

  // Phase State
  const [phase, setPhase] = useState<RoundPhase>('SIMPLIFY');
  const [simplificationStepIdx, setSimplificationStepIdx] = useState(0);
  const [stepHistory, setStepHistory] = useState<string[]>([challenge.initialInequality]);
  const [simplificationFeedback, setSimplificationFeedback] = useState<{
    text: string;
    isCorrect: boolean;
  } | null>(null);

  // Number Line & Archery State (Multiple selections & cancellation supported)
  const [correctNumbers, setCorrectNumbers] = useState<number[]>([]);
  const [incorrectNumbers, setIncorrectNumbers] = useState<number[]>([]);
  const [lastShotFeedback, setLastShotFeedback] = useState<string | null>(null);
  const [flyingArrows, setFlyingArrows] = useState<FlyingArrow[]>([]);
  const [robinPose, setRobinPose] = useState<'idle' | 'drawing' | 'loosing'>('idle');
  const [shotCount, setShotCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const archeryCanvasRef = useRef<HTMLDivElement>(null);

  const op = challenge.finalSolution.operator;
  const boundary = challenge.finalSolution.boundary;

  const checkSatisfies = useCallback(
    (val: number) => {
      switch (op) {
        case '<':
          return val < boundary;
        case '<=':
        case '≤':
          return val <= boundary;
        case '>':
          return val > boundary;
        case '>=':
        case '≥':
          return val >= boundary;
      }
    },
    [op, boundary]
  );

  // Number line integers displayed around boundary (-5 to +5)
  const lineMin = boundary - 5;
  const lineMax = boundary + 5;
  const lineNumbers: number[] = [];
  for (let i = lineMin; i <= lineMax; i++) {
    lineNumbers.push(i);
  }

  const requiredTrueNumbers = lineNumbers.filter(checkSatisfies);
  const isAllTrueSelected =
    requiredTrueNumbers.length > 0 &&
    requiredTrueNumbers.every((n) => correctNumbers.includes(n));
  const isFullySolved = isAllTrueSelected && incorrectNumbers.length === 0;

  // Reset challenge when challengeIndex changes
  useEffect(() => {
    const curr = LEVEL_2_CHALLENGES[challengeIndex % LEVEL_2_CHALLENGES.length];
    setPhase('SIMPLIFY');
    setSimplificationStepIdx(0);
    setStepHistory([curr.initialInequality]);
    setSimplificationFeedback(null);
    setCorrectNumbers([]);
    setIncorrectNumbers([]);
    setLastShotFeedback(null);
    setFlyingArrows([]);
    setRobinPose('idle');
    setShotCount(0);
  }, [challengeIndex]);

  // Handle Simplification Step
  const handleSelectOperation = (opIdx: number) => {
    const currentStep = challenge.steps[simplificationStepIdx];
    const operation = currentStep.availableOperations[opIdx];

    if (operation.isCorrect) {
      sound.successFanfare();
      sound.coin();
      const newDisplay = `${operation.leftResult} ${operation.newOperator} ${operation.rightResult}`;
      setStepHistory((prev) => [...prev, newDisplay]);
      setSimplificationFeedback({
        text: `Operation Applied! ${operation.explanation}`,
        isCorrect: true,
      });

      if (simplificationStepIdx + 1 < challenge.steps.length) {
        setSimplificationStepIdx((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setPhase('ARCHERY_NUMBER_LINE');
          setLastShotFeedback(
            `Simplified to ${challenge.finalSolution.formatted}! Click numbers directly on the number line to shoot targets. Click again to cancel points and fix answers!`
          );
        }, 700);
      }
    } else {
      sound.miss();
      setSimplificationFeedback({
        text: `Not quite! ${operation.explanation}`,
        isCorrect: false,
      });
    }
  };

  // Check for full victory whenever correct & incorrect sets update
  useEffect(() => {
    if (phase === 'ARCHERY_NUMBER_LINE' && isFullySolved) {
      sound.successFanfare();
      const timer = setTimeout(() => {
        setPhase('ROUND_VICTORY');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [phase, isFullySolved]);

  // Multi-Arrow Animation Loop (Supports multiple concurrent arrows)
  useEffect(() => {
    if (flyingArrows.length === 0) return;

    let animFrame: number;

    const updateArrows = () => {
      const now = performance.now();
      const remaining: FlyingArrow[] = [];

      flyingArrows.forEach((arr) => {
        const elapsed = now - arr.startTime;
        const progress = Math.min(1, elapsed / arr.duration);

        const curX = arr.startX + (arr.targetX - arr.startX) * progress;
        const arcHeight = -36 * Math.sin(progress * Math.PI);
        const curY = arr.startY + (arr.targetY - arr.startY) * progress + arcHeight;

        if (progress >= 1) {
          // Arrow reached target!
          if (arr.isHit) {
            sound.targetHit(true);
            sound.coin();
            const earned = Math.round(50 * stats.goldMultiplier);

            onUpdateStats((prev) => ({
              ...prev,
              gold: prev.gold + earned,
              bullseyes: prev.bullseyes + 1,
              level2Score: prev.level2Score + 100,
              streak: prev.streak + 1,
              highestStreak: Math.max(prev.highestStreak, prev.streak + 1),
            }));
            setStreakCount((s) => s + 1);

            setLastShotFeedback(
              `🎯 Bullseye! Robin Hood hit target x = ${arr.targetNumber}! It SATISFIES ${challenge.finalSolution.formatted}! (+${earned} Gold)`
            );
          } else {
            sound.miss();
            onUpdateStats((prev) => ({ ...prev, streak: 0 }));
            setStreakCount(0);
            setLastShotFeedback(
              `❌ Miss! x = ${arr.targetNumber} does NOT satisfy ${challenge.finalSolution.formatted}! (Marked Red — click again to cancel)`
            );
          }
        } else {
          remaining.push({
            ...arr,
            currentX: curX,
            currentY: curY,
          });
        }
      });

      setFlyingArrows(remaining);
      if (remaining.length > 0) {
        animFrame = requestAnimationFrame(updateArrows);
      }
    };

    animFrame = requestAnimationFrame(updateArrows);
    return () => cancelAnimationFrame(animFrame);
  }, [flyingArrows, challenge, stats.goldMultiplier, onUpdateStats]);

  // Click a Point Directly on the Number Line:
  // - If clicked again: CANCEL the point and fix the answer!
  // - If newly clicked: Shoot arrow, mark Green (if true) or Red (if incorrect)
  // - Supports clicking multiple numbers without blocking!
  const handlePointClick = (val: number) => {
    const isCurrentlyCorrect = correctNumbers.includes(val);
    const isCurrentlyIncorrect = incorrectNumbers.includes(val);

    // 1. CLICK TO CANCEL POINT & FIX ANSWER
    if (isCurrentlyCorrect) {
      setCorrectNumbers((prev) => prev.filter((n) => n !== val));
      sound.click();
      setLastShotFeedback(`Cancelled point x = ${val}. Solution set updated!`);
      return;
    }

    if (isCurrentlyIncorrect) {
      setIncorrectNumbers((prev) => prev.filter((n) => n !== val));
      sound.click();
      setLastShotFeedback(`Cancelled incorrect point x = ${val}. Mistake cleared!`);
      return;
    }

    // 2. NEW POINT SELECTION
    const isTrue = checkSatisfies(val);

    if (isTrue) {
      setCorrectNumbers((prev) => (prev.includes(val) ? prev : [...prev, val]));
    } else {
      setIncorrectNumbers((prev) => (prev.includes(val) ? prev : [...prev, val]));
    }

    // 3. FLUID ROBIN HOOD ARCHERY ANIMATION
    sound.bowDraw();
    setShotCount((c) => c + 1);
    setRobinPose('drawing');

    // Canvas geometry
    const rect = archeryCanvasRef.current?.getBoundingClientRect();
    const width = rect?.width || 760;
    const height = rect?.height || 300;

    const startX = 110;
    const startY = height * 0.58;

    const pct = (val - lineMin) / (lineMax - lineMin);
    const targetX = width * (0.35 + pct * 0.57);
    const targetY = height * 0.45 + (val % 2 === 0 ? -12 : 12);
    const angle = Math.atan2(targetY - startY, targetX - startX) * (180 / Math.PI);

    // Loose arrow after quick draw
    setTimeout(() => {
      sound.arrowRelease();
      setRobinPose('loosing');
      onUpdateStats((prev) => ({ ...prev, arrowsFired: prev.arrowsFired + 1 }));

      const newArrow: FlyingArrow = {
        id: `arrow-${val}-${Date.now()}-${Math.random()}`,
        startX,
        startY,
        targetX,
        targetY,
        currentX: startX,
        currentY: startY,
        angle,
        isHit: isTrue,
        targetNumber: val,
        startTime: performance.now(),
        duration: 270,
      };

      setFlyingArrows((prev) => [...prev, newArrow]);

      // Reset archer pose back to idle after recoil
      setTimeout(() => {
        setRobinPose('idle');
      }, 200);
    }, 70);
  };

  const handleNextChallenge = () => {
    setChallengeIndex((prev) => prev + 1);
    sound.bowDraw();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950/80 border border-amber-500/50 rounded-xl text-amber-400">
            <Target className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Level 2: Archery Tournament · Item {challenge.id} of {LEVEL_2_CHALLENGES.length}
            </div>
            <h1 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100">
              Round {challenge.id} of {LEVEL_2_CHALLENGES.length}: {challenge.initialInequality}
            </h1>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              phase === 'SIMPLIFY'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span>1. Simplify</span>
          </div>
          <span className="text-slate-600">›</span>
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              phase === 'ARCHERY_NUMBER_LINE' || phase === 'ROUND_VICTORY'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span>2. Number Line & Archery</span>
          </div>
        </div>
      </div>

      {/* Robin Hood Mascot Dialogue */}
      <RobinHoodMascot
        message={
          phase === 'SIMPLIFY'
            ? `Select operations that isolate the variable! ${challenge.storyContext}`
            : phase === 'ARCHERY_NUMBER_LINE'
            ? isFullySolved
              ? `Magnificent shooting! All true solutions are green with zero incorrect marks! Advance to the next round!`
              : isAllTrueSelected && incorrectNumbers.length > 0
              ? `You found all true numbers, but some red mistakes remain! Click the red points to cancel them and conquer the round!`
              : `Click all points on the number line that satisfy ${challenge.finalSolution.formatted}! You can click multiple numbers, and click any point again to cancel it!`
            : "Round cleared with honor! Nottingham's guards are in awe of your mathematical precision!"
        }
        mood={
          phase === 'ROUND_VICTORY'
            ? 'proud'
            : isFullySolved
            ? 'cheering'
            : robinPose === 'drawing' || robinPose === 'loosing'
            ? 'aiming'
            : 'explaining'
        }
        rankTitle={`Robin's Cohort · Score ${stats.level2Score}`}
      />

      {/* PHASE 1: ALGEBRAIC SIMPLIFICATION */}
      {phase === 'SIMPLIFY' && (
        <div className="p-6 bg-slate-900/90 border border-amber-600/40 rounded-2xl space-y-6 shadow-xl animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-wider">
                Step 1: Simplify the Inequality
              </div>
              <p className="text-xs text-slate-300">
                Click the operation that isolates the variable. The operation will automatically apply to both sides!
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
              Stage {simplificationStepIdx + 1} of {challenge.steps.length}
            </span>
          </div>

          {/* Inequality Equation Parchment */}
          <div className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/40 border border-amber-500/50 rounded-xl text-center space-y-3">
            <div className="text-xs text-amber-300/80 uppercase tracking-widest font-cinzel">
              Current Statement
            </div>
            <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-300 tracking-wider">
              {challenge.steps[simplificationStepIdx].currentDisplay}
            </div>

            {/* Step history breadcrumb */}
            {stepHistory.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
                <span className="text-slate-400">Progression:</span>
                {stepHistory.map((s, idx) => (
                  <span key={idx} className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-300 font-semibold">{s}</span>
                    {idx < stepHistory.length - 1 && <span className="text-slate-600">→</span>}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Operation Choices */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-300">
              Select the Next Strategic Move:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {challenge.steps[simplificationStepIdx].availableOperations.map((operation, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOperation(idx)}
                  className="p-4 bg-slate-800/80 hover:bg-amber-950/50 border border-slate-700 hover:border-amber-500 rounded-xl text-left transition-all group cursor-pointer shadow-md hover:scale-[1.02]"
                >
                  <div className="font-mono text-sm font-bold text-amber-300 group-hover:text-amber-200 mb-1 flex items-center justify-between">
                    <span>{operation.label}</span>
                    <ChevronRight className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Applies <span className="text-slate-300 font-mono">{operation.label}</span> equally to both sides
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Display */}
          {simplificationFeedback && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn ${
                simplificationFeedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/70 text-rose-200'
              }`}
            >
              {simplificationFeedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{simplificationFeedback.text}</div>
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: RE-ARRANGED ORDER:
          1. HUGE PROMINENT INEQUALITY
          2. INSTRUCTIONS
          3. NUMBER LINE RIGHT BELOW THE INEQUALITY
          4. ROBIN HOOD & ARCHERY FIELD BELOW THE NUMBER LINE */}
      {(phase === 'ARCHERY_NUMBER_LINE' || phase === 'ROUND_VICTORY') && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. HUGE, PROMINENT INEQUALITY DISPLAY */}
          <div className="py-6 px-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-2xl text-center space-y-2 shadow-2xl">
            <div className="text-xs text-amber-400 font-cinzel font-semibold uppercase tracking-widest">
              Solved Linear Inequality
            </div>
            <div className="font-cinzel text-5xl sm:text-7xl font-black text-amber-300 tracking-wider drop-shadow-[0_2px_16px_rgba(245,158,11,0.5)]">
              {challenge.finalSolution.formatted}
            </div>
          </div>

          {/* 2. CLEAR LEVEL INSTRUCTIONS PANEL */}
          <div className="p-4 bg-slate-900/90 border border-amber-600/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-amber-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>How to Solve This Level:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold shrink-0">1.</span>
                <span>
                  Click each number point directly on the number line that makes{' '}
                  <strong className="text-amber-300 font-mono">{challenge.finalSolution.formatted}</strong> true. You can click multiple numbers freely!
                </span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold shrink-0">2.</span>
                <span>
                  <strong className="text-emerald-400">Green (✓)</strong> = True solution & bullseye.{' '}
                  <strong className="text-rose-400">Red (✗)</strong> = False value.
                </span>
              </div>
              <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold shrink-0">3.</span>
                <span>
                  <strong className="text-amber-300">Click again to cancel</strong> any point to fix your answer! Find all{' '}
                  <strong className="text-emerald-400">{requiredTrueNumbers.length}</strong> true solutions with no red errors to win!
                </span>
              </div>
            </div>
          </div>

          {/* 3. NUMBER LINE — RIGHT BELOW THE INEQUALITY (FIXED: STATIONARY POINTS, MULTI-CLICK, CLICK TO CANCEL) */}
          <div className="p-5 sm:p-6 bg-slate-950/90 border-2 border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-wider">
                  Interactive Number Line
                </span>
                <span className="text-xs text-slate-400">
                  (Click any point to shoot · Click again to cancel & fix)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Progress:</span>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-600/50">
                  {correctNumbers.length} / {requiredTrueNumbers.length} True Solutions
                </span>
                {incorrectNumbers.length > 0 && (
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-1 rounded border border-rose-600/50">
                    {incorrectNumbers.length} Red (Click to clear)
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 760 110"
                className="w-full h-auto min-w-[620px] select-none"
              >
                {/* Background Shaded Range Highlight for Correct Points */}
                {correctNumbers.length > 0 && (
                  <rect
                    x={
                      Math.min(
                        ...correctNumbers.map(
                          (n) => 40 + ((n - lineMin) / (lineMax - lineMin)) * 680
                        )
                      ) - 15
                    }
                    y="10"
                    width={
                      Math.max(
                        ...correctNumbers.map(
                          (n) => 40 + ((n - lineMin) / (lineMax - lineMin)) * 680
                        )
                      ) -
                      Math.min(
                        ...correctNumbers.map(
                          (n) => 40 + ((n - lineMin) / (lineMax - lineMin)) * 680
                        )
                      ) +
                      30
                    }
                    height="45"
                    rx="8"
                    fill="rgba(16, 185, 129, 0.12)"
                  />
                )}

                {/* Main Axis Line */}
                <line
                  x1="25"
                  y1="50"
                  x2="735"
                  y2="50"
                  stroke="#64748b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Left Arrow Head */}
                <polygon points="15,50 26,43 26,57" fill="#64748b" />
                {/* Right Arrow Head */}
                <polygon points="745,50 734,43 734,57" fill="#64748b" />

                {/* Number Line Points (Fixed: circle strictly stays in place, zero hover movement!) */}
                {(() => {
                  const lineY = 50;
                  return lineNumbers.map((val) => {
                    const cx = 40 + ((val - lineMin) / (lineMax - lineMin)) * 680;
                    const isCorrect = correctNumbers.includes(val);
                    const isIncorrect = incorrectNumbers.includes(val);
                    const isZero = val === 0;

                    // Point colors: Green if right, Red if incorrect, Slate if unclicked
                    let fillColor = '#1e293b';
                    let strokeColor = '#94a3b8';
                    let symbol: string | null = null;

                    if (isCorrect) {
                      fillColor = '#10b981';
                      strokeColor = '#34d399';
                      symbol = '✓';
                    } else if (isIncorrect) {
                      fillColor = '#ef4444';
                      strokeColor = '#f87171';
                      symbol = '✗';
                    }

                    return (
                      <g
                        key={val}
                        onClick={() => handlePointClick(val)}
                        className="cursor-pointer"
                        style={{ pointerEvents: 'all' }}
                      >
                        {/* Invisible large click target (r=26) */}
                        <circle
                          cx={cx}
                          cy={lineY}
                          r="26"
                          fill="transparent"
                        />

                        {/* Tick Mark */}
                        <line
                          x1={cx}
                          y1={lineY - (isZero ? 9 : 6)}
                          x2={cx}
                          y2={lineY + (isZero ? 9 : 6)}
                          stroke={isZero ? '#cbd5e1' : '#64748b'}
                          strokeWidth={isZero ? '2.5' : '1.5'}
                        />

                        {/* Green indicator beam if correct */}
                        {isCorrect && (
                          <line
                            x1={cx}
                            y1="14"
                            x2={cx}
                            y2="50"
                            stroke="#10b981"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        )}

                        {/* Point Circle: Fixed position, NO SCALE TRANSFORM ON HOVER! */}
                        <circle
                          cx={cx}
                          cy={lineY}
                          r="14"
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={isCorrect || isIncorrect ? '3.5' : '2'}
                        />

                        {/* Symbol or Center Dot (Never moves) */}
                        {symbol ? (
                          <text
                            x={cx}
                            y={lineY + 4.5}
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="bold"
                            fill="#ffffff"
                          >
                            {symbol}
                          </text>
                        ) : (
                          <circle
                            cx={cx}
                            cy={lineY}
                            r="3"
                            fill="#94a3b8"
                          />
                        )}

                        {/* Coordinate Number Underneath Axis */}
                        <text
                          x={cx}
                          y="85"
                          textAnchor="middle"
                          fontSize="14"
                          fontWeight={isCorrect ? 'bold' : isZero ? '600' : 'normal'}
                          fill={
                            isCorrect
                              ? '#34d399'
                              : isIncorrect
                              ? '#f87171'
                              : isZero
                              ? '#f8fafc'
                              : '#94a3b8'
                          }
                        >
                          {val}
                        </text>
                      </g>
                    );
                  });
                })()}
              </svg>
            </div>
          </div>

          {/* 4. BELOW THE NUMBER LINE: ROBIN HOOD & ARCHERY FIELD */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 px-1">
              <span className="font-cinzel font-bold text-amber-400 uppercase tracking-wider">
                Sherwood Archery Range
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{stats.gold} Gold</span>
                </div>
                <div className="flex items-center gap-1 text-orange-400 font-mono font-bold">
                  <Flame className="w-4 h-4 animate-pulse" />
                  <span>Streak: {streakCount}</span>
                </div>
              </div>
            </div>

            {/* Archery Canvas */}
            <div
              ref={archeryCanvasRef}
              className="relative w-full h-[290px] sm:h-[330px] rounded-2xl overflow-hidden border-2 border-amber-700/60 shadow-2xl select-none"
              style={{
                backgroundImage: `url(${IMAGES.forestBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/40 to-slate-950/75" />

              {/* ROBIN HOOD ARCHER (NO WHITE BACKGROUND, DYNAMIC FLUID SHOOTING ANIMATION) */}
              <div
                key={shotCount}
                className={`absolute left-4 sm:left-8 bottom-3 z-20 pointer-events-none flex flex-col items-center transition-all duration-200 ${
                  robinPose === 'drawing'
                    ? 'scale-115 rotate-[-8deg] -translate-x-2'
                    : robinPose === 'loosing'
                    ? 'scale-105 rotate-[6deg] translate-x-2'
                    : 'scale-100 rotate-0'
                }`}
              >
                <div className="relative w-28 h-40 sm:w-32 sm:h-44">
                  {/* Clean transparent Robin Hood without any white box backdrop */}
                  <img
                    src={cleanRobinHoodSrc}
                    alt="Robin Hood Archer"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Dynamic Bow Tension Effect during shot */}
                  {robinPose === 'drawing' && (
                    <div className="absolute -top-1 -right-2 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full shadow-lg animate-ping">
                      DRAW!
                    </div>
                  )}
                  {robinPose === 'loosing' && (
                    <div className="absolute -top-1 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg animate-bounce">
                      LOOSE!
                    </div>
                  )}
                </div>
              </div>

              {/* Archery Straw Targets across the range for each coordinate */}
              {lineNumbers.map((val) => {
                const isHit = correctNumbers.includes(val);
                const isMissed = incorrectNumbers.includes(val);
                const pct = (val - lineMin) / (lineMax - lineMin);
                const leftPct = 35 + pct * 57;
                const topPct = 38 + (val % 2 === 0 ? -12 : 12);

                return (
                  <div
                    key={val}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  >
                    {/* Target Disc */}
                    <div
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform ${
                        isHit
                          ? 'scale-110 drop-shadow-[0_0_14px_rgba(16,185,129,0.85)]'
                          : isMissed
                          ? 'scale-95 opacity-80'
                          : 'drop-shadow-md'
                      }`}
                    >
                      <svg viewBox="0 0 60 60" className="w-full h-full">
                        <circle cx="30" cy="30" r="28" fill="#d97706" stroke="#b45309" strokeWidth="2" />
                        <circle cx="30" cy="30" r="22" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                        <circle cx="30" cy="30" r="16" fill="#0f172a" />
                        <circle cx="30" cy="30" r="11" fill={isHit ? '#10b981' : isMissed ? '#ef4444' : '#0284c7'} />
                        <circle cx="30" cy="30" r="6" fill={isHit ? '#34d399' : isMissed ? '#f87171' : '#dc2626'} />
                      </svg>

                      {/* Coordinate Value Badge */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-cinzel font-black text-xs sm:text-sm text-amber-300 bg-slate-950/85 px-1.5 py-0.5 rounded-full border border-amber-400/80">
                          {val}
                        </span>
                      </div>

                      {/* Struck Badge */}
                      {isHit && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow animate-bounce">
                          ✓
                        </div>
                      )}
                      {isMissed && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow">
                          ✗
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-200 mt-0.5 bg-slate-900/85 px-1 rounded shadow">
                      x = {val}
                    </span>
                  </div>
                );
              })}

              {/* Animated Flying Arrows (Supports Multiple Concurrent Flights) */}
              {flyingArrows.map((arr) => (
                <div
                  key={arr.id}
                  className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${arr.currentX}px`,
                    top: `${arr.currentY}px`,
                    transform: `rotate(${arr.angle}deg)`,
                  }}
                >
                  <svg width="46" height="14" viewBox="0 0 46 14" className="overflow-visible">
                    <line x1="0" y1="7" x2="40" y2="7" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                    <polygon points="40,3 46,7 40,11" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                    <polygon points="2,7 8,2 15,2 9,7" fill={arr.isHit ? '#10b981' : '#f59e0b'} />
                    <polygon points="2,7 8,12 15,12 9,7" fill={arr.isHit ? '#10b981' : '#f59e0b'} />
                    <circle cx="-3" cy="7" r="3" fill="#f59e0b" className="animate-ping" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Toast from Robin Hood */}
          {lastShotFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn ${
                isFullySolved
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                  : lastShotFeedback.includes('Bullseye') || lastShotFeedback.includes('Cancelled') || lastShotFeedback.includes('Simplified')
                  ? 'bg-emerald-950/60 border-emerald-600/70 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/70 text-rose-200'
              }`}
            >
              {lastShotFeedback.includes('❌') ? (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{lastShotFeedback}</div>
            </div>
          )}

          {/* Victory Modal Overlay when Round is Complete */}
          {phase === 'ROUND_VICTORY' && (
            <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-emerald-500 rounded-2xl text-center space-y-4 shadow-2xl animate-fadeIn">
              <div className="inline-flex p-3 bg-emerald-900/60 rounded-full border border-emerald-400 text-amber-400 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-300">
                {challenge.id === LEVEL_2_CHALLENGES.length
                  ? `🏆 Grand Champion! All ${LEVEL_2_CHALLENGES.length} Items Conquered!`
                  : `Item ${challenge.id} of ${LEVEL_2_CHALLENGES.length} Conquered!`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto">
                {challenge.id === LEVEL_2_CHALLENGES.length ? (
                  <span>
                    Magnificent mastery! You have solved and shot all <strong>10 linear inequality challenges</strong>. The Sheriff has surrendered the keys to Nottingham!
                  </span>
                ) : (
                  <span>
                    You simplified <strong className="text-amber-400">{challenge.initialInequality}</strong> to{' '}
                    <strong className="text-emerald-400 font-mono">{challenge.finalSolution.formatted}</strong>, then struck every true point on the number line!
                  </span>
                )}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setCorrectNumbers([]);
                    setIncorrectNumbers([]);
                    setPhase('ARCHERY_NUMBER_LINE');
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-cinzel font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Round</span>
                </button>
                <button
                  onClick={onOpenShop}
                  className="px-4 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-cinzel font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>Quiver Armory</span>
                </button>
                <button
                  onClick={handleNextChallenge}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-cinzel font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
                >
                  {challenge.id === LEVEL_2_CHALLENGES.length ? (
                    <>
                      <span>Play Again from Item 1</span>
                      <RotateCcw className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next Item ({challenge.id + 1} of {LEVEL_2_CHALLENGES.length})</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
