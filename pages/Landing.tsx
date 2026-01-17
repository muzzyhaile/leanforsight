import React from 'react';
import { IconTrendingUp, IconLayers, IconTarget, IconBrain, IconArrowRight, IconChevronDown } from '../components/Icons';
import { MethodologySection } from '../components/MethodologySection';

interface LandingProps {
  onLogin: () => void;
}

/**
 * Landing Component
 * 
 * Main landing page with methodology section for credibility.
 * Explains the Foresight RAM framework and value proposition.
 */
export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-50 selection:bg-foresight-sprint selection:text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20 sm:pt-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-foresight-sprint/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-foresight-creative/10 rounded-full blur-[60px] sm:blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-foresight-ram/10 rounded-full blur-[60px] sm:blur-[100px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] animate-fade-in-up delay-100">
            Future-Proof <br />
            <span className="text-white">
              Your Strategy.
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-200 px-2">
            Turn uncertainty into your competitive advantage. <br className="hidden md:block" />
            The first AI-powered tool for <span className="text-slate-100 font-medium">Scenario Sprints</span> &{' '}
            <span className="text-slate-100 font-medium">Continuous Validation</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 animate-fade-in-up delay-300">
            <button
              onClick={onLogin}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 bg-white text-slate-950 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Start Scenario Sprint
              <span className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></span>
            </button>
            <button
              onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-5 text-slate-300 font-medium hover:text-white transition-colors flex items-center gap-2"
            >
              Learn the Methodology <IconChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <MethodologySection />

      {/* CTA Section */}
      <section className="bg-slate-900/50 border-t border-white/10 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to run your scenario sprint?</h2>
          <p className="text-slate-400 text-base sm:text-xl">
            Generate future scenarios, build strategies, and validate trajectories — all in minutes.
          </p>
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300"
          >
            Start Now <IconArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

Landing.displayName = 'Landing';