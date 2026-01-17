import { useEffect, useState } from 'react';
import { storageService } from '../services/storageService.js';

export const useProjects = (userId) => {
  const [projects, setProjects] = useState([]);

  const refreshProjects = () => {
    const list = storageService.getProjects(userId);
    setProjects(list);
  };

  useEffect(() => {
    refreshProjects();
  }, [userId]);

  const createProject = (name) => {
    const project = storageService.createProject(userId, name);
    refreshProjects();
    return project;
  };

  return {
    projects,
    createProject,
    refreshProjects
  };
};
