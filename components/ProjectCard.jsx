import React from 'react';
import { IconFolder, IconTarget, IconArrowRight } from './Icons.jsx';

export const ProjectCard = ({ project, onClick }) => {
  const formatDate = (ts) => new Date(ts).toLocaleDateString();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 border border-slate-200 hover:border-foresight-sprint hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-foresight-sprint group-hover:text-white transition-colors">
          <IconFolder className="w-6 h-6" />
        </div>
        <span className="text-xs text-slate-400">{formatDate(project.updatedAt)}</span>
      </div>

      <h3 className="font-semibold text-lg text-slate-900 mb-2">{project.name}</h3>

      {project.data.topic && <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.data.topic}</p>}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <IconTarget className="w-4 h-4" />
          <span>Step {project.currentStep} of 5</span>
        </div>
        <IconArrowRight className="w-5 h-5 text-slate-300 group-hover:text-foresight-sprint transition-colors" />
      </div>
    </div>
  );
};
