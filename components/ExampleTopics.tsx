import React from 'react';
import { ExampleTopic } from '../types';
import { IconLightbulb, IconClock } from './Icons';

interface ExampleTopicsProps {
  examples: ExampleTopic[];
  onSelectTopic: (topic: string) => void;
  className?: string;
}

/**
 * ExampleTopics Component
 * 
 * Displays curated example scenario planning questions to help users get started.
 * Provides context on topic quality and estimated completion time.
 * 
 * @param examples - Array of example topics to display
 * @param onSelectTopic - Callback when user selects an example
 * @param className - Optional additional CSS classes
 */
export const ExampleTopics: React.FC<ExampleTopicsProps> = ({
  examples,
  onSelectTopic,
  className = '',
}) => {
  return (
    <div className={`p-4 bg-blue-50 rounded-xl border border-blue-200 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <IconLightbulb className="w-5 h-5 text-blue-600" />
        <p className="text-sm text-blue-900 font-medium">
          💡 Try these example scenario sprint questions:
        </p>
      </div>
      
      <div className="space-y-2">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => onSelectTopic(example.title)}
            className="w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                  {example.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">{example.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                <IconClock className="w-3 h-3" />
                <span>{example.estimatedTime}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                {example.category}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-700 flex items-start gap-2">
          <span className="font-medium">💡 Tip:</span>
          <span>Best questions are forward-looking (3-5 years) and open-ended. Avoid yes/no questions.</span>
        </p>
      </div>
    </div>
  );
};

ExampleTopics.displayName = 'ExampleTopics';