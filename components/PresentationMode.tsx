import React, { useState, useEffect } from 'react';
import { Project, Scenario, SCENARIO_COLORS } from '../types';
import { IconX, IconArrowRight, IconMaximize } from './Icons';

interface PresentationModeProps {
  project: Project;
  onClose: () => void;
}

/**
 * PresentationMode Component
 * 
 * Full-screen presentation view for scenario sprint results.
 * Clean, stakeholder-ready visuals perfect for sharing and presenting.
 */
export const PresentationMode: React.FC<PresentationModeProps> = ({ project, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Build slides from project data
  const slides = React.useMemo(() => {
    const slideList: React.ReactNode[] = [];

    // Slide 1: Title
    slideList.push(
      <div key="title" className="flex flex-col items-center justify-center h-full text-center px-16">
        <h1 className="text-6xl font-black text-white mb-6">{project.name}</h1>
        {project.data.topic && (
          <p className="text-2xl text-slate-300 max-w-4xl leading-relaxed">{project.data.topic}</p>
        )}
        <div className="mt-12 text-slate-400 text-sm">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    );

    // Slide 2-5: Scenarios
    if (project.data.scenarios?.length > 0) {
      project.data.scenarios.forEach((scenario: Scenario, index: number) => {
        slideList.push(
          <div key={`scenario-${index}`} className="h-full p-16 flex flex-col justify-center">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-bold uppercase tracking-wider">
                  {scenario.type}
                </span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-8">{scenario.title}</h2>
              <p className="text-2xl text-slate-300 leading-relaxed mb-12">{scenario.description}</p>
              
              {scenario.indicators?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Key Indicators to Monitor:</h3>
                  <div className="grid gap-4">
                    {scenario.indicators.map((indicator: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                      >
                        <span className="text-2xl text-white/50">{idx + 1}</span>
                        <span className="text-lg text-slate-200">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      });
    }

    // Slide: Goal
    if (project.data.goal) {
      slideList.push(
        <div key="goal" className="flex flex-col items-center justify-center h-full text-center px-16">
          <h2 className="text-4xl font-bold text-white mb-8">Customer/Business Goal</h2>
          <p className="text-3xl text-slate-200 max-w-4xl leading-relaxed">{project.data.goal}</p>
        </div>
      );
    }

    // Slide: Strategy
    if (project.data.strategy) {
      slideList.push(
        <div key="strategy" className="h-full p-16 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-12">Strategic Recommendations</h2>
            
            {project.data.strategy.persona && (
              <div className="mb-12 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Target Persona: {project.data.strategy.persona.name}
                </h3>
                <p className="text-xl text-slate-300 mb-6">{project.data.strategy.persona.description}</p>
              </div>
            )}

            {project.data.strategy.recommendations?.length > 0 && (
              <div className="space-y-6">
                {project.data.strategy.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full">
                        {rec.timeframe}
                      </span>
                      <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full">
                        {rec.impact} Impact
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{rec.title}</h4>
                    <p className="text-lg text-slate-300">{rec.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return slideList;
  }, [project]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-slate-950/80 to-transparent">
        <div className="text-white text-sm font-medium">
          {project.name}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close presentation"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Content */}
      <div className="h-full overflow-hidden">
        {slides[currentSlide]}
      </div>

      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-slate-950/80 to-transparent">
        <div className="flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-white text-sm font-medium">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              Next
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Keyboard Hints */}
          <div className="text-xs text-slate-400">
            Use arrow keys or space to navigate • ESC to exit
          </div>
        </div>
      </div>
    </div>
  );
};

PresentationMode.displayName = 'PresentationMode';