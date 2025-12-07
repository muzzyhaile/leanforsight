import React from 'react';
import { IconTrendingUp, IconLayers, IconTarget, IconArrowRight, IconBrain } from '../components/Icons';

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Predict the Future.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foresight-ram via-foresight-sprint to-foresight-creative">
              Design Your Strategy.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10">
            A comprehensive tool for modern companies to navigate uncertainty using Scenario Sprints and AI-driven validation.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Start Scenario Sprint <IconArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-foresight-ram rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-foresight-creative rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-foresight-sprint rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Methodology Steps (Based on PDF) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">The Foresight RAM Process</h2>
            <p className="text-slate-500 mt-2">From strategic ambiguity to clear action in 4 steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1: Scenario Sprint */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-foresight-sprint/10 text-foresight-sprint rounded-lg flex items-center justify-center mb-6">
                <IconLayers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Scenario Sprints</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We generate 4 distinct scenarios: Best Case, Worst Case, Preferred, and Plausible to map the field of possibility.
              </p>
              <span className="absolute top-4 right-4 text-xs font-bold text-slate-200 text-4xl">01</span>
            </div>

            {/* Step 2: Strategy */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-foresight-strategy/10 text-foresight-strategy rounded-lg flex items-center justify-center mb-6">
                <IconTarget className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Goal Integration</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Define customer goals and integrate them into scenarios to create resilient strategic personas.
              </p>
              <span className="absolute top-4 right-4 text-xs font-bold text-slate-200 text-4xl">02</span>
            </div>

             {/* Step 3: Recommendations */}
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-foresight-ram/10 text-foresight-ram rounded-lg flex items-center justify-center mb-6">
                <IconTrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Action Plan</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate immediate, short-term, and long-term recommendations based on the gap between Plausible and Preferred.
              </p>
              <span className="absolute top-4 right-4 text-xs font-bold text-slate-200 text-4xl">03</span>
            </div>

            {/* Step 4: Creative Validation */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-foresight-creative/10 text-foresight-creative rounded-lg flex items-center justify-center mb-6">
                <IconBrain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">4. Creative Monitor</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Continuous measurement of indicators. If reality drifts from the Preferred Scenario, creative campaigns are triggered.
              </p>
              <span className="absolute top-4 right-4 text-xs font-bold text-slate-200 text-4xl">04</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};