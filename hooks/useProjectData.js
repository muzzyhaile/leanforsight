import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService.js';

export const useProjectData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!id) {
      navigate('/projects');
      return;
    }

    const storedProject = storageService.getProject(id);
    if (storedProject) {
      setProject(storedProject);
      setStep(storedProject.currentStep || 1);
    } else {
      navigate('/projects');
    }
  }, [id, navigate]);

  const saveProject = (updates) => {
    if (!project) return;
    const updated = { ...project, ...updates };
    setProject(updated);
    storageService.updateProject(updated);
  };

  const updateProjectData = (dataUpdates) => {
    if (!project) return;
    const updatedData = { ...project.data, ...dataUpdates };
    saveProject({ data: updatedData });
  };

  return {
    project,
    step,
    setStep,
    saveProject,
    updateProjectData
  };
};
