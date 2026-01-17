import React from 'react';
import { IconBrain } from '../Icons.jsx';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Line } from 'recharts';

export const MonitorStep = ({ onBackToStrategy }) => {
  const data = [
    { name: 'Jan', preferred: 20, actual: 20, plausible: 20 },
    { name: 'Feb', preferred: 40, actual: 35, plausible: 25 },
    { name: 'Mar', preferred: 60, actual: 42, plausible: 30 },
    { name: 'Apr', preferred: 80, actual: 45, plausible: 35 },
    { name: 'May', preferred: 100, actual: 50, plausible: 40 }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex border-b border-slate-200 mb-6 sm:mb-8 overflow-x-auto">
        <button
          className="px-4 sm:px-6 py-3 text-slate-500 hover:text-slate-700 text-sm sm:text-base whitespace-nowrap"
          onClick={onBackToStrategy}
        >
          Strategy & Persona
        </button>
        <button className="px-4 sm:px-6 py-3 border-b-2 border-foresight-creative text-foresight-creative font-bold text-sm sm:text-base whitespace-nowrap">
          Creative Monitor
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h3 className="font-bold text-base sm:text-lg text-slate-900">Scenario Trajectory Monitor</h3>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-full"></div> Preferred</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Actual</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded-full"></div> Plausible</div>
            </div>
          </div>
          <div className="h-[250px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="preferred" stroke="#4ade80" fill="#4ade80" fillOpacity={0.1} strokeWidth={2} name="Preferred Scenario" />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual Performance" />
                <Line type="monotone" dataKey="plausible" stroke="#94a3b8" strokeDasharray="5 5" name="Plausible Baseline" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-xl">
            <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2 text-sm sm:text-base">⚠️ Deviation Alert</h3>
            <p className="text-red-700 text-xs sm:text-sm">
              The current trajectory is deviating <strong>-30%</strong> from the Preferred Scenario path.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <IconBrain className="w-4 h-4 sm:w-5 sm:h-5 text-foresight-creative" /> Creative Interventions
            </h3>
            <p className="text-xs text-slate-500 mb-3 sm:mb-4">Recommended campaigns to steer back to Preferred Scenario:</p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-foresight-creative transition-colors cursor-pointer">
                <div className="text-xs font-bold text-foresight-creative uppercase mb-1">Campaign A</div>
                <div className="font-medium text-sm text-slate-800">Targeted Community Webinar Series</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-foresight-creative transition-colors cursor-pointer">
                <div className="text-xs font-bold text-foresight-creative uppercase mb-1">Campaign B</div>
                <div className="font-medium text-sm text-slate-800">Beta Program for Top Tier Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
