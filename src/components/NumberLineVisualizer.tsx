import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { InequalityOperator } from '../types';

interface NumberLineVisualizerProps {
  min?: number;
  max?: number;
  boundary: number;
  operator: InequalityOperator;
  selectedPoints?: number[];
  onSelectPoint?: (point: number) => void;
  interactive?: boolean;
  showTestBench?: boolean;
  customTestPoints?: number[];
  className?: string;
}

export const NumberLineVisualizer: React.FC<NumberLineVisualizerProps> = ({
  min = -8,
  max = 8,
  boundary,
  operator,
  selectedPoints = [],
  onSelectPoint,
  interactive = false,
  showTestBench = true,
  customTestPoints,
  className = '',
}) => {
  const isStrict = operator === '<' || operator === '>';
  const isRight = operator === '>' || operator === '>=' || operator === '≥';

  // SVG coordinate calculations
  const svgWidth = 640;
  const svgHeight = 90;
  const paddingX = 40;
  const lineY = 45;
  const usableWidth = svgWidth - paddingX * 2;
  const totalUnits = max - min;

  const toX = (val: number) => {
    const clamped = Math.max(min, Math.min(max, val));
    return paddingX + ((clamped - min) / totalUnits) * usableWidth;
  };

  const boundaryX = toX(boundary);

  // Check if a given number satisfies the inequality
  const satisfies = (val: number) => {
    switch (operator) {
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
  };

  // Generate integer ticks
  const ticks: number[] = [];
  for (let i = min; i <= max; i++) {
    ticks.push(i);
  }

  const testPoints = customTestPoints || [
    boundary - 3,
    boundary - 1,
    boundary,
    boundary + 1,
    boundary + 3,
  ];

  return (
    <div className={`p-4 bg-slate-900/90 rounded-xl border border-slate-800 shadow-md ${className}`}>
      {/* Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Inequality Graph:</span>
          <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
            x {operator} {boundary}
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded-full border-2 ${
                isStrict
                  ? 'border-emerald-400 bg-slate-900'
                  : 'border-emerald-400 bg-emerald-400'
              }`}
            />
            <span>{isStrict ? 'Open Circle (Excluded)' : 'Closed Dot (Included)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-1.5 bg-emerald-500 rounded" />
            <span>Shaded Ray ({isRight ? 'Points Right →' : '← Points Left'})</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px] select-none"
        >
          {/* Main Axis Line */}
          <line
            x1={paddingX - 15}
            y1={lineY}
            x2={svgWidth - paddingX + 15}
            y2={lineY}
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Left Arrow Head */}
          <polygon
            points={`${paddingX - 20},${lineY} ${paddingX - 10},${lineY - 6} ${paddingX - 10},${lineY + 6}`}
            fill="#475569"
          />
          {/* Right Arrow Head */}
          <polygon
            points={`${svgWidth - paddingX + 20},${lineY} ${svgWidth - paddingX + 10},${lineY - 6} ${svgWidth - paddingX + 10},${lineY + 6}`}
            fill="#475569"
          />

          {/* Shaded Solution Ray */}
          {isRight ? (
            <>
              <line
                x1={boundaryX}
                y1={lineY}
                x2={svgWidth - paddingX + 10}
                y2={lineY}
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <polygon
                points={`${svgWidth - paddingX + 18},${lineY} ${svgWidth - paddingX + 6},${lineY - 7} ${svgWidth - paddingX + 6},${lineY + 7}`}
                fill="#10b981"
              />
            </>
          ) : (
            <>
              <line
                x1={paddingX - 10}
                y1={lineY}
                x2={boundaryX}
                y2={lineY}
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <polygon
                points={`${paddingX - 18},${lineY} ${paddingX - 6},${lineY - 7} ${paddingX - 6},${lineY + 7}`}
                fill="#10b981"
              />
            </>
          )}

          {/* Ticks and Numbers */}
          {ticks.map((t) => {
            const tx = toX(t);
            const isZero = t === 0;
            const isBound = t === boundary;

            return (
              <g key={t} className="cursor-pointer" onClick={() => onSelectPoint?.(t)}>
                <line
                  x1={tx}
                  y1={lineY - (isZero ? 10 : 6)}
                  x2={tx}
                  y2={lineY + (isZero ? 10 : 6)}
                  stroke={isZero ? '#fbbf24' : '#64748b'}
                  strokeWidth={isZero ? '2.5' : '1.5'}
                />
                <text
                  x={tx}
                  y={lineY + 22}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isBound ? '700' : isZero ? '600' : '400'}
                  fill={isBound ? '#34d399' : isZero ? '#fbbf24' : '#94a3b8'}
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* Boundary Point Circle */}
          <circle
            cx={boundaryX}
            cy={lineY}
            r="8"
            fill={isStrict ? '#0f172a' : '#10b981'}
            stroke="#10b981"
            strokeWidth="3.5"
            className="filter drop-shadow-md"
          />

          {/* Boundary indicator label */}
          <text
            x={boundaryX}
            y={lineY - 14}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill="#34d399"
          >
            {boundary} {isStrict ? '(Open)' : '(Closed)'}
          </text>
        </svg>
      </div>

      {/* Interactive Value Tester Bench */}
      {showTestBench && (
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-300 font-medium mb-2 flex items-center justify-between">
            <span>🎯 Test Values against (x {operator} {boundary}):</span>
            <span className="text-[11px] text-slate-400">Click a value to evaluate</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {testPoints.map((val) => {
              const isTrue = satisfies(val);
              const isSelected = selectedPoints.includes(val);

              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => onSelectPoint?.(val)}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    isTrue
                      ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200 hover:bg-emerald-900/50'
                      : 'bg-rose-950/30 border-rose-800/40 text-rose-200 hover:bg-rose-900/40'
                  } ${isSelected ? 'ring-2 ring-amber-400 shadow-md scale-102' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm">x = {val}</span>
                    {isTrue ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-300">
                    {val} {operator} {boundary} →{' '}
                    <span className={isTrue ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {isTrue ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
