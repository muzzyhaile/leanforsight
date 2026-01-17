import React from 'react';
import { ScenarioType } from '../../types.js';
import { IconLoader } from '../Icons.jsx';

export const ScenarioGoalStep = ({ scenarios, goal, loading, onGoalChange, onGenerateStrategy }) => {
  const getColor = (type) => {
    switch (type) {
      case ScenarioType.BEST_CASE:
        return 'border-foresight-strategy bg-foresight-strategy/5';
      case ScenarioType.WORST_CASE:
        return 'border-foresight-ram bg-foresight-ram/5';
      case ScenarioType.PREFERRED:
        return 'border-foresight-creative bg-foresight-creative/5';
      default:
        return 'border-slate-300 bg-white';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Scenario Sprint Results</h2>
        <p className="text-sm sm:text-base text-slate-500 mt-2">
          The AI has mapped 4 possible futures based on your question.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
        {scenarios.map((s, idx) => (
          <div key={idx} className={`p-4 sm:p-6 rounded-xl border-t-4 shadow-sm ${getColor(s.type)}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{s.type}</div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 sm:mb-3 leading-tight">{s.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">{s.description}</p>
            <div className="space-y-2">
              {s.indicators.slice(0, 2).map((ind, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                  {ind}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Define Customer Goal</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
          To bridge these scenarios into a strategy, we need to know the specific goal or "North Star" for the customer/business.
        </p>
        <input
          type="text"
          className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-foresight-strategy focus:outline-none mb-4 text-sm sm:text-base"
          placeholder="e.g., Become the leading provider of ethical AI marketing tools in Europe."
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
        />
        <button
          disabled={loading || !goal}
          onClick={onGenerateStrategy}
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <IconLoader className="w-5 h-5" /> Integrating Goal...
            </>
          ) : (
            'Generate Strategy'
          )}
        </button>
      </div>
    </div>
  );
};
