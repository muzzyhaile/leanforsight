import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AIServiceFactory } from '../services/AIServiceFactory';
import { useProjectData } from '../hooks/useProjectData';
import { useScenarioGeneration } from '../hooks/useScenarioGeneration';
import { ExportService } from '../services/ExportService';
import { Project, ExportFormat } from '../types';
import { IconLoader, IconDownload, IconPresentation } from '../components/Icons';
import { StepIndicator } from '../components/StepIndicator';
import { TopicStep } from '../components/dashboard/TopicStep';
import { ScenarioGoalStep } from '../components/dashboard/ScenarioGoalStep';
import { StrategyStep } from '../components/dashboard/StrategyStep';
import { MonitorStep } from '../components/dashboard/MonitorStep';
import { PresentationMode } from '../components/PresentationMode';

/**
 * Dashboard Component
 * 
 * Main workspace for scenario sprint workflow.
 * Includes export and presentation capabilities for sharing results.
 */
export const Dashboard: React.FC = () => {
  const aiService = AIServiceFactory.create('openrouter');
  const navigate = useNavigate();
  const { project, step, setStep, saveProject, updateProjectData } = useProjectData();
  const { loading, generateScenarios, generateStrategy } = useScenarioGeneration(aiService);
  const [showPresentation, setShowPresentation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
    const strategy = await generateStrategy(
      project.data.topic,
      project.data.goal,
      project.data.scenarios
    );
    if (!strategy) {
      alert('Error generating strategy.');
      return;
    }
    const updatedData = { ...project.data, strategy };
    const updatedProject = { ...project, data: updatedData, currentStep: 4 };
    saveProject(updatedProject);
    setStep(4);
  };

  const handleExportPDF = async () => {
    if (!project) return;
    setIsExporting(true);
    try {
      const result = await ExportService.export(project, {
        format: ExportFormat.PDF,
        includeMetadata: true,
        includeVisuals: true,
        watermark: true,
      });

      if (result.success && result.data instanceof Blob) {
        ExportService.downloadBlob(result.data, `${project.name}-scenario-sprint.pdf`);
      } else {
        alert(result.error || 'Export failed');
      }
    } catch (error) {
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    if (!project) return;
    setIsExporting(true);
    try {
      const result = await ExportService.export(project, {
        format: ExportFormat.JSON,
        includeMetadata: true,
        includeVisuals: false,
      });

      if (result.success && result.data instanceof Blob) {
        ExportService.downloadBlob(result.data, `${project.name}-data.json`);
      } else {
        alert(result.error || 'Export failed');
      }
    } catch (error) {
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <IconLoader className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  if (showPresentation) {
    return <PresentationMode project={project} onClose={() => setShowPresentation(false)} />;
  }

  return (
    <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <button
          onClick={() => navigate('/projects')}
          className="text-slate-500 hover:text-slate-900 text-sm font-medium flex items-center gap-1"
        >
          &larr; Back to Projects
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200 truncate max-w-[200px] sm:max-w-none">
            {project.name}
          </span>
          
          {/* Export and Presentation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
              title="Export to PDF"
            >
              <IconDownload className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
              title="Export to JSON"
            >
              <IconDownload className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={() => setShowPresentation(true)}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              title="Start presentation"
            >
              <IconPresentation className="w-4 h-4" />
              <span className="hidden sm:inline">Present</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Site Sections
            </p>
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
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Sprint Steps
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setStep(1)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 1
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  1. Question
                </button>
                <button
                  onClick={() => setStep(2)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 2
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  2. Scenarios
                </button>
                <button
                  onClick={() => setStep(4)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 4
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  3. Strategy
                </button>
                <button
                  onClick={() => setStep(5)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    step === 5
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  4. Monitor
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
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

Dashboard.displayName = 'Dashboard';
