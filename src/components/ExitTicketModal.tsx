import React, { useState } from 'react';
import { ExitTicket } from '../types';
import { RobinHoodMascot } from './RobinHoodMascot';
import { sound } from '../utils/audio';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Award, Coins } from 'lucide-react';

interface ExitTicketModalProps {
  exitTicket: ExitTicket;
  currentSlideNum: number;
  totalSlides: number;
  isOpen: boolean;
  onProceed: () => void;
  onRewardGold: (amount: number) => void;
}

export const ExitTicketModal: React.FC<ExitTicketModalProps> = ({
  exitTicket,
  currentSlideNum,
  totalSlides,
  isOpen,
  onProceed,
  onRewardGold,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  if (!isOpen) return null;

  const handleSelectOption = (optId: string) => {
    if (hasAnsweredCorrectly) return;

    setSelectedOptionId(optId);
    const chosen = exitTicket.options.find((o) => o.id === optId);
    setAttemptCount((prev) => prev + 1);

    if (chosen?.isCorrect) {
      setHasAnsweredCorrectly(true);
      setFeedback(chosen.explanation);
      sound.successFanfare();
      sound.coin();
      onRewardGold(30);
    } else {
      sound.miss();
      setFeedback(
        chosen?.explanation || 'That is not quite right. Look closely at the inequality symbol and try again!'
      );
    }
  };

  const handleProceedClick = () => {
    if (!hasAnsweredCorrectly) return;
    onProceed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-emerald-950 to-slate-950 border-b border-amber-600/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-cinzel text-lg font-bold text-amber-300">
              Sherwood Gate Exit Ticket
            </span>
          </div>
          <div className="text-xs text-amber-200/80 font-cinzel">
            Checkpoint {currentSlideNum} of {totalSlides}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Robin Hood Mascot Prompt */}
          <RobinHoodMascot
            compact
            mood={hasAnsweredCorrectly ? 'cheering' : 'aiming'}
            message={
              hasAnsweredCorrectly
                ? "Brilliant archery of the mind! You've conquered this checkpoint and earned +30 Gold!"
                : "Halt traveler! Answer this Exit Ticket correctly to prove your mastery and unlock the next chamber!"
            }
            rankTitle="Sherwood Guardian"
          />

          {/* Question Box */}
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl">
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
              Challenge Question
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-100">
              {exitTicket.question}
            </p>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {exitTicket.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.isCorrect;

              let btnStyle = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600';
              if (isSelected) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500';
                } else {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-100 ring-2 ring-rose-500';
                }
              } else if (hasAnsweredCorrectly && isCorrect) {
                btnStyle = 'bg-emerald-950/60 border-emerald-600/70 text-emerald-200';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={hasAnsweredCorrectly}
                  className={`w-full p-3.5 text-left rounded-xl border transition-all flex items-center justify-between group ${btnStyle} ${
                    hasAnsweredCorrectly ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="text-sm font-semibold">{option.text}</span>
                  {isSelected && (
                    <span className="shrink-0 ml-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Area */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-sm flex items-start gap-2.5 animate-fadeIn ${
                hasAnsweredCorrectly
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/80 text-rose-200'
              }`}
            >
              {hasAnsweredCorrectly ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold mb-0.5">
                  {hasAnsweredCorrectly ? 'Target Struck! (+30 Gold)' : 'Arrow Missed the Target'}
                </div>
                <div>{feedback}</div>
              </div>
            </div>
          )}

          {/* Hint accordion */}
          {!hasAnsweredCorrectly && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Hide Robin’s Hint' : 'Need Robin’s Hint?'}</span>
              </button>
              {attemptCount > 0 && (
                <span className="text-slate-400">Attempts: {attemptCount}</span>
              )}
            </div>
          )}

          {showHint && !hasAnsweredCorrectly && (
            <div className="p-3 bg-amber-950/40 border border-amber-700/50 rounded-lg text-xs text-amber-200 animate-fadeIn">
              💡 <span className="font-semibold">Tip from the Green Archer:</span> {exitTicket.hint}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {hasAnsweredCorrectly ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Coins className="w-4 h-4 text-amber-400" />
                Unlocked! Click Proceed to advance
              </span>
            ) : (
              <span>Select the correct answer to unlock the next slide</span>
            )}
          </div>

          <button
            onClick={handleProceedClick}
            disabled={!hasAnsweredCorrectly}
            className={`px-5 py-2.5 rounded-xl font-cinzel font-bold text-sm flex items-center gap-2 transition-all ${
              hasAnsweredCorrectly
                ? 'bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white shadow-lg shadow-emerald-900/50 cursor-pointer animate-pulse'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Next Slide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
