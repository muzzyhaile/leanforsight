import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Project, User } from '../types';
import { IconPlus, IconFolder, IconTarget, IconArrowRight } from '../components/Icons';

interface ProjectListProps {
  user: User;
}

export const ProjectList: React.FC<ProjectListProps> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const list = storageService.getProjects(user.id);
    setProjects(list);
  }, [user.id]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const project = storageService.createProject(user.id, newProjectName);
    navigate(`/project/${project.id}`);
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
          <p className="text-slate-500 mt-1">Manage your strategic foresight scenarios.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-shadow shadow-md hover:shadow-lg"
        >
          <IconPlus className="w-5 h-5" /> New Project
        </button>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-foresight-sprint focus:outline-none"
                  placeholder="e.g. Q3 Strategic Plan"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <IconFolder className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
          <p className="text-slate-500 mt-1 mb-6">Create your first scenario sprint to get started.</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="text-foresight-sprint font-bold hover:underline"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-foresight-sprint/10 text-foresight-sprint rounded-lg flex items-center justify-center">
                  <IconTarget className="w-5 h-5" />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                  ${project.currentStep >= 4 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {project.currentStep >= 4 ? 'Active' : 'Draft'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-foresight-sprint transition-colors">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                {project.data.topic || 'No topic defined yet.'}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Updated {formatDate(project.updatedAt)}</span>
                <IconArrowRight className="w-4 h-4 text-slate-300 group-hover:text-foresight-sprint" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
