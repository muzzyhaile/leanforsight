import { ExampleTopic } from '../types';

/**
 * Curated example topics for scenario planning
 * Organized by category to help users get started quickly
 */
export const EXAMPLE_TOPICS: ExampleTopic[] = [
  {
    id: 'remote-healthcare',
    title: 'What is the future of remote work in healthcare by 2030?',
    category: 'Healthcare',
    description: 'Explore how telehealth, remote diagnostics, and distributed care teams will evolve',
    estimatedTime: '3-5 min',
  },
  {
    id: 'ai-regulation',
    title: 'How will AI regulation affect our product development roadmap?',
    category: 'Technology',
    description: 'Understand regulatory scenarios and their impact on AI product strategy',
    estimatedTime: '4-6 min',
  },
  {
    id: 'supply-chain',
    title: 'What scenarios could disrupt our global supply chain?',
    category: 'Operations',
    description: 'Map potential supply chain disruptions and resilience strategies',
    estimatedTime: '3-5 min',
  },
  {
    id: 'climate-adaptation',
    title: 'How will climate change reshape our industry by 2035?',
    category: 'Sustainability',
    description: 'Scenario planning for climate impacts on your business model',
    estimatedTime: '5-7 min',
  },
  {
    id: 'gen-z-consumers',
    title: 'What will Gen Z consumers expect from brands in 2028?',
    category: 'Marketing',
    description: 'Explore evolving consumer preferences and brand relationships',
    estimatedTime: '3-4 min',
  },
  {
    id: 'automation-workforce',
    title: 'How will automation reshape our workforce needs?',
    category: 'HR & Talent',
    description: 'Map the future of work and required skill transformations',
    estimatedTime: '4-6 min',
  },
];

/**
 * Get example topics by category
 */
export const getExamplesByCategory = (category: string): ExampleTopic[] => {
  return EXAMPLE_TOPICS.filter((topic) => topic.category === category);
};

/**
 * Get all unique categories
 */
export const getCategories = (): string[] => {
  return Array.from(new Set(EXAMPLE_TOPICS.map((topic) => topic.category)));
};

/**
 * Get random example topics
 */
export const getRandomExamples = (count: number = 3): ExampleTopic[] => {
  const shuffled = [...EXAMPLE_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};