import React from 'react';
import { Info } from 'lucide-react';

interface ConfidenceBadgeProps {
  score: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score }) => {
  let colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let ringColor = 'stroke-emerald-500';
  
  if (score < 90) {
    colorClass = 'text-amber-600 bg-amber-50 border-amber-200';
    ringColor = 'stroke-amber-500';
  }
  if (score < 70) {
    colorClass = 'text-rose-600 bg-rose-50 border-rose-200';
    ringColor = 'stroke-rose-500';
  }

  // Calculate svg circle dash for progress
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="group relative flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${colorClass} transition-all duration-300`}>
        {/* Progress Ring */}
        <div className="relative w-5 h-5">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="10"
              cy="10"
              r={radius}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-gray-200 opacity-30"
            />
            <circle
              cx="10"
              cy="10"
              r={radius}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={ringColor}
            />
          </svg>
        </div>
        
        <span className="text-xs font-bold">{score}%</span>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
        Reliability Score
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};