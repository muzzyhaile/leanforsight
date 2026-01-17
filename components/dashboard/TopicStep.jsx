import React from 'react';
import { IconLoader } from '../Icons.jsx';

export const TopicStep = ({ topic, loading, onTopicChange, onGenerate }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">1. Strategic Question</h2>
        <p className="text-sm sm:text-base text-slate-500">
          What is the core uncertainty or strategic development question for your product or company?
        </p>
      </div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Topic / Question</label>
      <textarea
        className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-3 sm:p-4 focus:ring-2 focus:ring-foresight-sprint focus:outline-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
        placeholder="e.g., How will Artificial Intelligence impact our digital marketing agency's business model over the next 5 years?"
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
      />
      <button
        disabled={loading || !topic}
        onClick={onGenerate}
        className="mt-4 sm:mt-6 w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm sm:text-base"
      >
        {loading ? (
          <>
            <IconLoader className="w-5 h-5" /> Thinking...
          </>
        ) : (
          'Generate Scenarios'
        )}
      </button>
    </div>
  );
};
