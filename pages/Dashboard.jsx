import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AIServiceFactory } from '../services/AIServiceFactory.js';
import { useProjectData } from '../hooks/useProjectData.js';
import { useScenarioGeneration } from '../hooks/useScenarioGeneration.js';
import { IconLoader } from '../components/Icons.jsx';
import { StepIndicator } from '../components/StepIndicator.jsx';
import { TopicStep } from '../components/dashboard/TopicStep.jsx';
import { ScenarioGoalStep } from '../components/dashboard/ScenarioGoalStep.jsx';
import { StrategyStep } from '../components/dashboard/StrategyStep.jsx';
import { MonitorStep } from '../components/dashboard/MonitorStep.jsx';

export const Dashboard = () => {
  const aiService = AIServiceFactory.create('openrouter');
  const navigate = useNavigate();
  const { project, step, setStep, saveProject, updateProjectData } = useProjectData();
  const { loading, generateScenarios, generateStrategy } = useScenarioGeneration(aiService);

  const handleGenerateScenarios = async () => {
    if (!project?.data.topic) return;
    const scenarios = await generateScenarios(project.data.topic);
    if (!scenarios) {
      alert('Error generating scenarios. Please check your API key.');
      return;
    }
    const updatedData = { ...project.data, scenarios };
    const updatedProject = { ...project, data: updatedData, currentStep: 2 };
    saveProject(updatedProject);
    setStep(2);
  };

  const handleGenerateStrategy = async () => {
    if (!project?.data.goal) return;
    const strategy = await generateStrategy(project.data.topic, project.data.goal, project.data.scenarios);
    if (!strategy) {
      alert('Error generating strategy.');
      return;
    }
    const updatedData = { ...project.data, strategy };
    const updatedProject = { ...project, data: updatedData, currentStep: 4 };
    saveProject(updatedProject);
    setStep(4);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <IconLoader className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <button
          onClick={() => navigate('/projects')}
          className="text-slate-500 hover:text-slate-900 text-sm font-medium flex items-center gap-1"
        >
          &larr; Back to Projects
        </button>
        <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200 truncate max-w-[200px] sm:max-w-none">
          {project.name}
        </span>
      </div>

      <StepIndicator step={step} />

      {step === 1 && (
        <TopicStep
          topic={project.data.topic}
          loading={loading}
          onTopicChange={(value) => updateProjectData({ topic: value })}
          onGenerate={handleGenerateScenarios}
        />
      )}
      {step === 2 && (
        <ScenarioGoalStep
          scenarios={project.data.scenarios}
          goal={project.data.goal}
          loading={loading}
          onGoalChange={(value) => updateProjectData({ goal: value })}
          onGenerateStrategy={handleGenerateStrategy}
        />
      )}
      {step === 4 && project.data.strategy && (
        <StrategyStep
          strategy={project.data.strategy}
          onGoToMonitor={() => {
            setStep(5);
            saveProject({ currentStep: 5 });
          }}
        />
      )}
      {step === 5 && <MonitorStep onBackToStrategy={() => setStep(4)} />}
    </div>
  );
};
