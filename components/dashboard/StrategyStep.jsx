import React from 'react';
import { IconCheck, IconArrowRight } from '../Icons.jsx';

export const StrategyStep = ({ strategy, onGoToMonitor }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex border-b border-slate-200 mb-6 sm:mb-8 overflow-x-auto">
        <button className="px-4 sm:px-6 py-3 border-b-2 border-foresight-strategy text-foresight-strategy font-bold text-sm sm:text-base whitespace-nowrap">
          Strategy & Persona
        </button>
        <button
          className="px-4 sm:px-6 py-3 text-slate-500 hover:text-slate-700 text-sm sm:text-base whitespace-nowrap"
          onClick={onGoToMonitor}
        >
          Creative Monitor
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">👤</div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{strategy.persona.name}</h3>
                <p className="text-xs sm:text-sm text-slate-500">{strategy.persona.role}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 italic mb-4 sm:mb-6">"{strategy.persona.description}"</p>

            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Goals</h4>
              <ul className="space-y-2">
                {strategy.persona.goals.map((g, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <IconCheck className="w-4 h-4 text-green-500 shrink-0" /> {g}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Pain Points</h4>
              <ul className="space-y-2">
                {strategy.persona.painPoints.map((g, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-red-400">-</span> {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Strategic Recommendations</h2>
          <p className="text-sm sm:text-base text-slate-500">Action plan to shift from the Plausible baseline to the Preferred future.</p>

          <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-lg text-amber-900 text-xs sm:text-sm mb-4 sm:mb-6">
            <strong>Risk Mitigation:</strong> {strategy.riskMitigation}
          </div>

          <div className="space-y-3 sm:space-y-4">
            {strategy.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="sm:w-32 shrink-0 flex flex-row sm:flex-col gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-center
                      ${rec.timeframe === 'Immediate' ? 'bg-red-100 text-red-700' :
                      rec.timeframe === 'Short-term' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                  >
                    {rec.timeframe}
                  </span>
                  <span className="text-xs text-slate-400 sm:text-center uppercase font-bold tracking-wider">
                    {rec.impact} Impact
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">{rec.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={onGoToMonitor} className="mt-8 text-foresight-creative font-bold flex items-center gap-2 hover:underline">
            View Continuous Validation Dashboard <IconArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
