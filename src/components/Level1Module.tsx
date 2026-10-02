import React, { useState } from 'react';
import { LEVEL_1_SLIDES } from '../data/level1Content';
import { RobinHoodMascot } from './RobinHoodMascot';
import { NumberLineVisualizer } from './NumberLineVisualizer';
import { ExitTicketModal } from './ExitTicketModal';
import { sound } from '../utils/audio';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface Level1ModuleProps {
  onCompleteModule: () => void;
  onRewardGold: (amount: number) => void;
  onGoToLevel2: () => void;
}

export const Level1Module: React.FC<Level1ModuleProps> = ({
  onCompleteModule,
  onRewardGold,
  onGoToLevel2,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showExitTicket, setShowExitTicket] = useState(false);
  const [selectedPracticePoints, setSelectedPracticePoints] = useState<number[]>([]);
  const [completedSlides, setCompletedSlides] = useState<number[]>([1]); // slide IDs completed

  const currentSlide = LEVEL_1_SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === LEVEL_1_SLIDES.length - 1;

  const handleNextClick = () => {
    // Show exit ticket modal
    setShowExitTicket(true);
    sound.bowDraw();
  };

  const handlePrevClick = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setSelectedPracticePoints([]);
      sound.bowDraw();
    }
  };

  const handleExitTicketPassed = () => {
    setShowExitTicket(false);
    const nextIndex = currentSlideIndex + 1;

    // Mark current slide completed
    if (!completedSlides.includes(currentSlide.id)) {
      setCompletedSlides((prev) => [...prev, currentSlide.id]);
    }

    if (nextIndex < LEVEL_1_SLIDES.length) {
      setCurrentSlideIndex(nextIndex);
      setSelectedPracticePoints([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed all slides of Level 1!
      onCompleteModule();
      sound.successFanfare();
    }
  };

  const toggleTestPoint = (point: number) => {
    sound.targetHit(false);
    setSelectedPracticePoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Module Navigation & Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Level 1: Self-Learning Module
            </div>
            <h1 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100">
              {currentSlide.title}
            </h1>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {LEVEL_1_SLIDES.map((slide, idx) => {
            const isCurrent = idx === currentSlideIndex;
            const isDone = completedSlides.includes(slide.id);

            return (
              <button
                key={slide.id}
                onClick={() => {
                  if (completedSlides.includes(slide.id) || idx <= currentSlideIndex) {
                    setCurrentSlideIndex(idx);
                    setSelectedPracticePoints([]);
                  }
                }}
                title={slide.title}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 font-extrabold'
                    : isDone
                    ? 'bg-emerald-900/60 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-800'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {slide.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slide Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson, Definitions & Theory (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Robin Hood Dialogue Banner - Consistent in Every Slide */}
          <RobinHoodMascot
            message={`Welcome to Lesson ${currentSlide.id}! ${currentSlide.subtitle}. Study the definitions, examine the worked example, and test real values on our number line below.`}
            mood="explaining"
            rankTitle={`Sherwood Cadet · Stage ${currentSlide.id}/5`}
          />

          {/* Definition Card */}
          <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-l-4 border-l-amber-500 border border-slate-800 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold font-cinzel text-amber-400 uppercase tracking-wider">
                Official Mathematical Definition
              </h2>
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1.5 font-cinzel">
              {currentSlide.definition.term}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {currentSlide.definition.meaning}
            </p>
            <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg text-xs text-amber-200">
              <span className="font-bold text-amber-300">🏹 Key Takeaway: </span>
              {currentSlide.definition.keyTakeaway}
            </div>
          </div>

          {/* Core Theory & Rules */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold font-cinzel text-slate-200 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>Sherwood Rules of Engagement</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {currentSlide.theory.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">›</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Worked Example */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-cinzel text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Worked Example from Master Robin</span>
              </h3>
              <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-300">
                {currentSlide.workedExample.problem}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentSlide.workedExample.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-emerald-300">
                      Step {idx + 1}: {step.action}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-amber-300 font-bold">
                    {step.result}
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    Reason: {step.reason}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-600/50 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Final Solution Set:</span>
              <span className="font-mono font-bold text-emerald-300 text-sm">
                {currentSlide.workedExample.finalSolution}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Practice Sandbox & Exit Ticket Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Practice Sandbox Card */}
          <div className="p-5 bg-slate-900/90 border border-emerald-600/40 rounded-xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-cinzel">
                Interactive Practice
              </span>
              <span className="text-[11px] text-amber-300 font-mono">Instant Feedback</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200">
              {currentSlide.interactivePractice.prompt}
            </p>

            {/* Interactive Number line */}
            <NumberLineVisualizer
              boundary={currentSlide.interactivePractice.boundary}
              operator={currentSlide.interactivePractice.operator}
              selectedPoints={selectedPracticePoints}
              onSelectPoint={toggleTestPoint}
              customTestPoints={currentSlide.interactivePractice.testPoints}
              min={currentSlide.interactivePractice.boundary - 6}
              max={currentSlide.interactivePractice.boundary + 6}
            />

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-400">
              💡 <span className="font-semibold text-slate-200">Practice Tip:</span> Select any number above to test if it makes the inequality true. Notice how the open/closed dot marks the boundary between valid and invalid numbers!
            </div>
          </div>

          {/* Navigation & Mandatory Exit Ticket Call-to-Action */}
          <div className="p-5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-emerald-950/50 border border-amber-600/50 rounded-xl space-y-3">
            <div className="text-xs font-cinzel font-bold text-amber-300">
              Slide Checkpoint & Progression
            </div>
            <p className="text-xs text-slate-300">
              Ready to advance? You must pass Robin Hood's <strong className="text-amber-400">Exit Ticket</strong> to prove your mastery before unlocking the next slide!
            </p>

            <div className="flex items-center gap-3 pt-2">
              {currentSlideIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrevClick}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNextClick}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-amber-600 via-emerald-600 to-amber-600 hover:from-amber-500 hover:to-emerald-500 text-white font-cinzel font-bold text-sm rounded-xl shadow-lg shadow-amber-950 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <span>Take Exit Ticket to Proceed</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Level 2 Unlock Banner if completed */}
          {completedSlides.length >= LEVEL_1_SLIDES.length && (
            <div className="p-5 bg-emerald-950/80 border-2 border-emerald-500 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-300 font-cinzel font-bold text-base">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Level 1 Mastered!</span>
              </div>
              <p className="text-xs text-slate-200">
                You have passed all Sherwood exit tickets! Step into Level 2 to wield the longbow in the Archery Tournament!
              </p>
              <button
                onClick={onGoToLevel2}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-cinzel font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Enter Level 2: Archery Tournament</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Exit Ticket Modal */}
      <ExitTicketModal
        exitTicket={currentSlide.exitTicket}
        currentSlideNum={currentSlide.id}
        totalSlides={LEVEL_1_SLIDES.length}
        isOpen={showExitTicket}
        onProceed={handleExitTicketPassed}
        onRewardGold={onRewardGold}
      />
    </div>
  );
};
