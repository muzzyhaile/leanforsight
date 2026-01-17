import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects.js';
import { IconPlus } from '../components/Icons.jsx';
import { CreateProjectModal } from '../components/CreateProjectModal.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

export const ProjectList = ({ user }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { projects, createProject } = useProjects(user.id);
  const navigate = useNavigate();

  const handleCreate = (name) => {
    const project = createProject(name);
    setIsCreating(false);
    navigate(`/project/${project.id}`);
  };

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

      <CreateProjectModal isOpen={isCreating} onClose={() => setIsCreating(false)} onCreate={handleCreate} />

      {projects.length === 0 ? (
        <EmptyState onCreateClick={() => setIsCreating(true)} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => navigate(`/project/${project.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};
