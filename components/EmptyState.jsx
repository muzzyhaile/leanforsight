import React from 'react';
import { IconFolder } from './Icons.jsx';

export const EmptyState = ({ onCreateClick }) => {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <IconFolder className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
      <p className="text-slate-500 mt-1 mb-6">Create your first scenario sprint to get started.</p>
      <button onClick={onCreateClick} className="text-foresight-sprint font-bold hover:underline">
        Create Project
      </button>
    </div>
  );
};
