import React from 'react';
import { IconLayers, IconTrendingUp, IconTarget, IconBrain } from './Icons';
import { ScenarioType } from '../types';

/**
 * MethodologySection Component
 * 
 * Explains the Foresight RAM framework to build credibility and trust.
 * Educates users on the proven methodology behind LeanForesight.
 */
export const MethodologySection: React.FC = () => {
  const quadrants = [
    {
      type: ScenarioType.BEST_CASE,
      icon: IconTrendingUp,
      color: 'foresight-strategy',
      title: 'Best Case',
      description: 'Optimistic but plausible future where ideal conditions align',
      examples: ['Breakthrough innovations', 'Favorable policy changes', 'Market leadership'],
    },
    {
      type: ScenarioType.WORST_CASE,
      icon: IconLayers,
      color: 'foresight-ram',
      title: 'Worst Case',
      description: 'Challenging future to stress-test resilience and risk mitigation',
      examples: ['Market disruption', 'Regulatory setbacks', 'Crisis scenarios'],
    },
    {
      type: ScenarioType.PREFERRED,
      icon: IconTarget,
      color: 'foresight-creative',
      title: 'Preferred',
      description: 'Aspirational future you want to create through strategic action',
      examples: ['Vision achievement', 'Competitive advantage', 'Industry transformation'],
    },
    {
      type: ScenarioType.PLAUSIBLE,
      icon: IconBrain,
      color: 'slate-400',
      title: 'Plausible',
      description: 'Most likely baseline extrapolating current trends and momentum',
      examples: ['Trend continuation', 'Expected evolution', 'Status quo trajectory'],
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-slate-900" id="methodology">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-foresight-sprint text-foresight-sprint text-xs font-bold uppercase tracking-widest mb-4">
            Proven Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Built on the <span className="text-foresight-sprint">Foresight RAM</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            LeanForesight uses the <strong className="text-slate-200">Rapid Analysis Method (RAM)</strong>, 
            a proven framework from strategic foresight experts to systematically explore 
            the field of possible futures across four key dimensions.
          </p>
        </div>

        {/* Quadrants Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {quadrants.map((quadrant, index) => {
            const Icon = quadrant.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${quadrant.color}/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${quadrant.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{quadrant.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {quadrant.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 pl-16">
                  {quadrant.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Why 4 Scenarios */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Why Four Scenarios?</h3>
          <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Research shows that exploring <strong className="text-slate-200">exactly four scenarios</strong> strikes 
            the perfect balance: complex enough to capture meaningful uncertainty, yet simple enough to 
            remain actionable. This quadrant approach has been validated by organizations like Shell, 
            RAND Corporation, and leading futures institutes worldwide.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span className="px-3 py-1 bg-slate-700/50 rounded-full">Shell Scenario Planning</span>
            <span className="px-3 py-1 bg-slate-700/50 rounded-full">Strategic Foresight</span>
            <span className="px-3 py-1 bg-slate-700/50 rounded-full">Evidence-Based</span>
          </div>
        </div>

        {/* Speed Advantage */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            <strong className="text-white">Traditional scenario planning:</strong> Weeks of research and workshops
          </p>
          <div className="my-4 flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-slate-700"></div>
            <span className="text-foresight-sprint font-bold">→</span>
            <div className="h-px w-16 bg-slate-700"></div>
          </div>
          <p className="text-foresight-sprint font-bold">
            LeanForesight: Minutes, powered by AI + proven methodology
          </p>
        </div>
      </div>
    </section>
  );
};

MethodologySection.displayName = 'MethodologySection';