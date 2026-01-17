import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Site Sections</p>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                Projects
              </Link>
            </nav>

            <div className="mt-5 pt-5 border-t border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sprint Steps</p>
              <div className="space-y-2">
                <button
                  onClick={() => setStep(1)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 1 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  1. Question
                </button>
                <button
                  onClick={() => setStep(2)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 2 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  2. Scenarios
                </button>
                <button
                  onClick={() => setStep(4)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 4 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  3. Strategy
                </button>
                <button
                  onClick={() => setStep(5)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 5 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  4. Monitor
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
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
      </div>
    </div>
  );
};
