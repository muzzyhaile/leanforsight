import React from 'react';

export const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Project</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
            <input
              autoFocus
              type="text"
              className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-foresight-sprint focus:outline-none"
              placeholder="e.g. Q3 Strategic Plan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
