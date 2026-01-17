import React from 'react';

export const StepIndicator = ({ step }) => {
  return (
    <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {[1, 2, 3, 4].map((s) => {
          const isActive = step >= (s === 3 ? 4 : s === 4 ? 5 : s);
          return (
            <div
              key={s}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-500 border-4 border-slate-50
                ${isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border-slate-200'}`}
            >
              {s}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider px-0 sm:px-2">
        <span>Question</span>
        <span>Scenarios</span>
        <span>Strategy</span>
        <span>Monitor</span>
      </div>
    </div>
  );
};
