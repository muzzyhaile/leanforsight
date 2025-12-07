import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateScenarios, generateStrategy } from '../services/openRouterService';
import { Project, ScenarioType } from '../types';
import { storageService } from '../services/storageService';
import { IconLoader, IconCheck, IconTarget, IconBrain, IconArrowRight } from '../components/Icons';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Line } from 'recharts';

export const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  // Load Project Data
  useEffect(() => {
    if (id) {
      const storedProject = storageService.getProject(id);
      if (storedProject) {
        setProject(storedProject);
        setStep(storedProject.currentStep || 1);
      } else {
        navigate('/projects'); // Project not found
      }
    }
  }, [id, navigate]);

  // Save Helper
  const saveProject = (updates: Partial<Project>) => {
    if (!project) return;
    const updated = { ...project, ...updates };
    setProject(updated);
    storageService.updateProject(updated);
  };

  const updateProjectData = (dataUpdates: Partial<typeof project.data>) => {
    if (!project) return;
    const updatedData = { ...project.data, ...dataUpdates };
    saveProject({ data: updatedData });
  };

  // Step 1 Handler: Generate Scenarios
  const handleGenerateScenarios = async () => {
    if (!project?.data.topic) return;
    setLoading(true);
    try {
      const scenarios = await generateScenarios(project.data.topic);
      const updatedData = { ...project.data, scenarios };
      const updatedProject = { ...project, data: updatedData, currentStep: 2 };
      setProject(updatedProject);
      storageService.updateProject(updatedProject);
      setStep(2);
    } catch (e) {
      alert("Error generating scenarios. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Handler: Generate Strategy
  const handleGenerateStrategy = async () => {
    if (!project?.data.goal) return;
    setLoading(true);
    try {
      const strategy = await generateStrategy(project.data.topic, project.data.goal, project.data.scenarios);
      const updatedData = { ...project.data, strategy };
      const updatedProject = { ...project, data: updatedData, currentStep: 4 };
      setProject(updatedProject);
      storageService.updateProject(updatedProject);
      setStep(4);
    } catch (e) {
      alert("Error generating strategy.");
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <div className="min-h-screen flex items-center justify-center"><IconLoader className="w-8 h-8 text-slate-400" /></div>;

  // --- Views for each Step ---

  // Step 1: Input Topic
  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">1. Strategic Question</h2>
        <p className="text-sm sm:text-base text-slate-500">What is the core uncertainty or strategic development question for your product or company?</p>
      </div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Topic / Question</label>
      <textarea
        className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-3 sm:p-4 focus:ring-2 focus:ring-foresight-sprint focus:outline-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
        placeholder="e.g., How will Artificial Intelligence impact our digital marketing agency's business model over the next 5 years?"
        value={project.data.topic}
        onChange={(e) => updateProjectData({ topic: e.target.value })}
      />
      <button
        disabled={loading || !project.data.topic}
        onClick={handleGenerateScenarios}
        className="mt-4 sm:mt-6 w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm sm:text-base"
      >
        {loading ? <><IconLoader className="w-5 h-5" /> Thinking...</> : 'Generate Scenarios'}
      </button>
    </div>
  );

  // Step 2: View Scenarios & Input Goal
  const renderStep2 = () => {
    const getColor = (type: ScenarioType) => {
      switch (type) {
        case ScenarioType.BEST_CASE: return 'border-foresight-strategy bg-foresight-strategy/5';
        case ScenarioType.WORST_CASE: return 'border-foresight-ram bg-foresight-ram/5';
        case ScenarioType.PREFERRED: return 'border-foresight-creative bg-foresight-creative/5';
        default: return 'border-slate-300 bg-white';
      }
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Scenario Sprint Results</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">The AI has mapped 4 possible futures based on your question.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {project.data.scenarios.map((s, idx) => (
            <div key={idx} className={`p-4 sm:p-6 rounded-xl border-t-4 shadow-sm ${getColor(s.type)}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{s.type}</div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 sm:mb-3 leading-tight">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">{s.description}</p>
              <div className="space-y-2">
                {s.indicators.slice(0, 2).map((ind, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="mt-0.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                    {ind}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Define Customer Goal</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">To bridge these scenarios into a strategy, we need to know the specific goal or "North Star" for the customer/business.</p>
          <input 
            type="text"
            className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-foresight-strategy focus:outline-none mb-4 text-sm sm:text-base"
            placeholder="e.g., Become the leading provider of ethical AI marketing tools in Europe."
            value={project.data.goal}
            onChange={(e) => updateProjectData({ goal: e.target.value })}
          />
          <button
            disabled={loading || !project.data.goal}
            onClick={handleGenerateStrategy}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
          >
             {loading ? <><IconLoader className="w-5 h-5" /> Integrating Goal...</> : 'Generate Strategy'}
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Strategy View & Monitoring Dashboard
  const renderStep4 = () => {
    if (!project.data.strategy) return null;

    return (
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 sm:mb-8 overflow-x-auto">
           <button className="px-4 sm:px-6 py-3 border-b-2 border-foresight-strategy text-foresight-strategy font-bold text-sm sm:text-base whitespace-nowrap">Strategy & Persona</button>
           <button 
             className="px-4 sm:px-6 py-3 text-slate-500 hover:text-slate-700 text-sm sm:text-base whitespace-nowrap"
             onClick={() => { setStep(5); saveProject({currentStep: 5}); }} 
           >
             Creative Monitor
           </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Persona Column */}
          <div className="lg:col-span-1">
             <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 lg:sticky lg:top-24">
               <div className="flex items-center gap-3 mb-4 sm:mb-6">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">👤</div>
                 <div>
                   <h3 className="font-bold text-slate-900 text-sm sm:text-base">{project.data.strategy.persona.name}</h3>
                   <p className="text-xs sm:text-sm text-slate-500">{project.data.strategy.persona.role}</p>
                 </div>
               </div>
               <p className="text-xs sm:text-sm text-slate-600 italic mb-4 sm:mb-6">"{project.data.strategy.persona.description}"</p>
               
               <div className="mb-4">
                 <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Goals</h4>
                 <ul className="space-y-2">
                   {project.data.strategy.persona.goals.map((g, i) => (
                     <li key={i} className="text-sm flex gap-2"><IconCheck className="w-4 h-4 text-green-500 shrink-0" /> {g}</li>
                   ))}
                 </ul>
               </div>

               <div>
                 <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Pain Points</h4>
                 <ul className="space-y-2">
                   {project.data.strategy.persona.painPoints.map((g, i) => (
                     <li key={i} className="text-sm flex gap-2"><span className="text-red-400">-</span> {g}</li>
                   ))}
                 </ul>
               </div>
             </div>
          </div>

          {/* Strategy Roadmap */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Strategic Recommendations</h2>
            <p className="text-sm sm:text-base text-slate-500">Action plan to shift from the Plausible baseline to the Preferred future.</p>
            
            <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-lg text-amber-900 text-xs sm:text-sm mb-4 sm:mb-6">
               <strong>Risk Mitigation:</strong> {project.data.strategy.riskMitigation}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {project.data.strategy.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="sm:w-32 shrink-0 flex flex-row sm:flex-col gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-center
                      ${rec.timeframe === 'Immediate' ? 'bg-red-100 text-red-700' : 
                        rec.timeframe === 'Short-term' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {rec.timeframe}
                    </span>
                    <span className="text-xs text-slate-400 sm:text-center uppercase font-bold tracking-wider">{rec.impact} Impact</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{rec.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => {setStep(5); saveProject({currentStep: 5});}} className="mt-8 text-foresight-creative font-bold flex items-center gap-2 hover:underline">
              View Continuous Validation Dashboard <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep5 = () => {
    // Mock Data for Chart
    const data = [
      { name: 'Jan', preferred: 20, actual: 20, plausible: 20 },
      { name: 'Feb', preferred: 40, actual: 35, plausible: 25 },
      { name: 'Mar', preferred: 60, actual: 42, plausible: 30 }, // Deviation starts
      { name: 'Apr', preferred: 80, actual: 45, plausible: 35 }, // Deviation grows
      { name: 'May', preferred: 100, actual: 50, plausible: 40 },
    ];

    return (
      <div className="max-w-7xl mx-auto">
         <div className="flex border-b border-slate-200 mb-6 sm:mb-8 overflow-x-auto">
           <button 
             className="px-4 sm:px-6 py-3 text-slate-500 hover:text-slate-700 text-sm sm:text-base whitespace-nowrap"
             onClick={() => setStep(4)}
           >
             Strategy & Persona
           </button>
           <button className="px-4 sm:px-6 py-3 border-b-2 border-foresight-creative text-foresight-creative font-bold text-sm sm:text-base whitespace-nowrap">Creative Monitor</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="font-bold text-base sm:text-lg text-slate-900">Scenario Trajectory Monitor</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-full"></div> Preferred</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Actual</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded-full"></div> Plausible</div>
              </div>
            </div>
            <div className="h-[250px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="preferred" stroke="#4ade80" fill="#4ade80" fillOpacity={0.1} strokeWidth={2} name="Preferred Scenario" />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual Performance" />
                  <Line type="monotone" dataKey="plausible" stroke="#94a3b8" strokeDasharray="5 5" name="Plausible Baseline" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-3 sm:space-y-4">
             <div className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-xl">
                <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2 text-sm sm:text-base">
                  ⚠️ Deviation Alert
                </h3>
                <p className="text-red-700 text-xs sm:text-sm">
                  The current trajectory is deviating <strong>-30%</strong> from the Preferred Scenario path.
                </p>
             </div>

             <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                 <IconBrain className="w-4 h-4 sm:w-5 sm:h-5 text-foresight-creative" /> Creative Interventions
               </h3>
               <p className="text-xs text-slate-500 mb-3 sm:mb-4">Recommended campaigns to steer back to Preferred Scenario:</p>
               
               <div className="space-y-3">
                 <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-foresight-creative transition-colors cursor-pointer">
                    <div className="text-xs font-bold text-foresight-creative uppercase mb-1">Campaign A</div>
                    <div className="font-medium text-sm text-slate-800">Targeted Community Webinar Series</div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-foresight-creative transition-colors cursor-pointer">
                    <div className="text-xs font-bold text-foresight-creative uppercase mb-1">Campaign B</div>
                    <div className="font-medium text-sm text-slate-800">Beta Program for Top Tier Clients</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      {/* Header with Back Button */}
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

      {/* Step Indicator */}
      <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
          {[1, 2, 3, 4].map((s) => {
             // Map logic: Step 1=Q, 2=Scenarios, 4=Strategy, 5=Monitor
             // Adjusted visualization to keep 4 dots but track progress
             const isActive = step >= (s === 3 ? 4 : s === 4 ? 5 : s);
             return (
              <div key={s} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-500 border-4 border-slate-50
                ${isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border-slate-200'}`}>
                {s}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider px-0 sm:px-2">
          <span>Question</span>
          <span>Scenarios</span>
          <span>Strategy</span>
          <span>Monitor</span>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
};
