import React from 'react';
import { IconTrendingUp, IconLayers, IconTarget, IconBrain, IconArrowRight, IconChevronDown } from '../components/Icons';

interface LandingProps {
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-50 selection:bg-foresight-sprint selection:text-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foresight-sprint/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-foresight-creative/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-foresight-ram/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-foresight-strategy animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300 tracking-wide">Foresight RAM Methodology v2.0</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] animate-fade-in-up delay-100">
            Future-Proof <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foresight-sprint via-foresight-creative to-foresight-strategy">
              Your Strategy.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-200">
            Turn uncertainty into your competitive advantage. <br className="hidden md:block"/>
            The first AI-powered tool for <span className="text-slate-100 font-medium">Scenario Sprints</span> & <span className="text-slate-100 font-medium">Continuous Validation</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up delay-300">
            <button 
              onClick={onLogin}
              className="group relative px-8 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Start Scenario Sprint
              <span className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></span>
            </button>
            <button 
              onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-5 text-slate-300 font-medium hover:text-white transition-colors flex items-center gap-2"
            >
              Learn the Methodology <IconChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* --- METHODOLOGY SECTION --- */}
      <div id="methodology" className="relative py-32 space-y-32">
        
        {/* Phase 1: Scenario Sprints (Purple) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
          <div className="absolute inset-0 bg-foresight-sprint/5 blur-[100px] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Abstract UI Representation */}
              <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl p-8 flex flex-col justify-between overflow-hidden group-hover:border-foresight-sprint/50 transition-colors duration-500">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-foresight-sprint/20 blur-[80px]"></div>
                 
                 <div className="grid grid-cols-2 gap-4 relative z-10">
                    {['Best Case', 'Worst Case', 'Preferred', 'Plausible'].map((label, i) => (
                      <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-foresight-sprint/20 mb-3 flex items-center justify-center">
                          <IconLayers className="w-4 h-4 text-foresight-sprint" />
                        </div>
                        <div className="h-2 w-16 bg-slate-600 rounded mb-2"></div>
                        <div className="h-2 w-10 bg-slate-700 rounded"></div>
                        <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 p-4 bg-foresight-sprint/10 rounded-xl border border-foresight-sprint/20">
                   <p className="text-foresight-sprint text-sm font-mono">> AI Generating 4 trajectories...</p>
                 </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-block px-4 py-1 rounded-full border border-foresight-sprint text-foresight-sprint text-xs font-bold uppercase tracking-widest">
                Phase 01
              </div>
              <h2 className="text-4xl md:text-6xl font-bold">
                The Scenario <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Sprint.</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Move beyond linear thinking. We use AI to instantly generate the <span className="text-white">Foresight RAM</span> quadrants: Best, Worst, Preferred, and Plausible scenarios.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-slate-300">
                  <span className="w-8 h-8 rounded-full bg-foresight-sprint/10 flex items-center justify-center text-foresight-sprint"><IconLayers className="w-4 h-4"/></span>
                  Map the field of possibility in seconds.
                </li>
                <li className="flex items-center gap-4 text-slate-300">
                  <span className="w-8 h-8 rounded-full bg-foresight-sprint/10 flex items-center justify-center text-foresight-sprint"><IconLayers className="w-4 h-4"/></span>
                  Identify key indicators for each future.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phase 2: Strategy (Green) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
           <div className="absolute inset-0 bg-foresight-strategy/5 blur-[100px] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 rounded-full border border-foresight-strategy text-foresight-strategy text-xs font-bold uppercase tracking-widest">
                Phase 02
              </div>
              <h2 className="text-4xl md:text-6xl font-bold">
                Strategic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Integration.</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Connect the future to the present. We define your "North Star" customer goal and integrate it into the scenarios to build a resilient strategy.
              </p>
              <div className="flex gap-4">
                 <div className="pl-4 border-l-2 border-foresight-strategy">
                   <div className="text-2xl font-bold text-white mb-1">Plausible</div>
                   <div className="text-sm text-slate-500">The Baseline (0-Point)</div>
                 </div>
                 <div className="pl-4 border-l-2 border-slate-700">
                   <div className="text-2xl font-bold text-white mb-1">Preferred</div>
                   <div className="text-sm text-slate-500">The Target (+ROI)</div>
                 </div>
              </div>
            </div>

            <div className="relative">
              {/* Abstract UI Representation */}
              <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8 flex items-center justify-center overflow-hidden group-hover:border-foresight-strategy/50 transition-colors duration-500">
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-foresight-strategy/20 blur-[80px]"></div>
                 
                 {/* Connection Graphic */}
                 <div className="relative w-full h-full flex items-center justify-between px-4">
                    <div className="w-24 h-32 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center gap-2">
                       <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">?</div>
                       <div className="h-2 w-12 bg-slate-700 rounded"></div>
                    </div>
                    
                    <div className="flex-1 h-1 bg-gradient-to-r from-slate-700 to-foresight-strategy relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-xs text-slate-400">
                        Integration
                      </div>
                    </div>

                    <div className="w-24 h-32 rounded-xl bg-foresight-strategy/10 border border-foresight-strategy flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                       <IconTarget className="w-8 h-8 text-foresight-strategy" />
                       <div className="text-xs font-bold text-foresight-strategy">GOAL</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Creative (Blue) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
          <div className="absolute inset-0 bg-foresight-creative/5 blur-[100px] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
               <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8 flex flex-col overflow-hidden group-hover:border-foresight-creative/50 transition-colors duration-500">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foresight-creative/10 via-transparent to-transparent opacity-50"></div>
                 
                 {/* Chart Graphic */}
                 <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-4 relative z-10">
                    {[30, 45, 35, 60, 50, 75, 90].map((h, i) => (
                      <div key={i} className="w-full bg-slate-800 rounded-t-sm relative group/bar">
                        <div 
                          style={{ height: `${h}%` }} 
                          className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-1000 ${i > 4 ? 'bg-foresight-creative animate-pulse' : 'bg-slate-700'}`}
                        ></div>
                      </div>
                    ))}
                 </div>
                 <div className="h-px w-full bg-slate-700"></div>
                 <div className="flex justify-between text-xs text-slate-500 pt-2 font-mono">
                   <span>NOW</span>
                   <span>FUTURE</span>
                 </div>

                 {/* Floating Alert */}
                 <div className="absolute top-8 right-8 bg-slate-800/90 backdrop-blur border border-foresight-creative/50 text-foresight-creative px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce-slow">
                   <IconBrain className="w-4 h-4" />
                   Validation Active
                 </div>
               </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-block px-4 py-1 rounded-full border border-foresight-creative text-foresight-creative text-xs font-bold uppercase tracking-widest">
                Phase 03
              </div>
              <h2 className="text-4xl md:text-6xl font-bold">
                Continuous <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Validation.</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                Strategies shouldn't be static. We monitor the delta between the "Plausible" baseline and your "Preferred" outcome. If you drift, we trigger creative interventions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                   <div className="text-3xl font-bold text-white mb-1">A/B</div>
                   <div className="text-sm text-slate-500">Testing Campaigns</div>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                   <div className="text-3xl font-bold text-white mb-1">AI</div>
                   <div className="text-sm text-slate-500">Signal Detection</div>
                 </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* --- CTA FOOTER --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Ready to <br/><span className="text-white">Lead the Market?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Stop reacting to change. Start designing it. Join the companies using LeanForesight to navigate uncertainty.
          </p>
          <button 
             onClick={onLogin}
             className="px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-xl hover:scale-105 transition-transform duration-300 shadow-2xl shadow-white/10 flex items-center gap-3 mx-auto"
           >
            Get Started Now <IconArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

    </div>
  );
};