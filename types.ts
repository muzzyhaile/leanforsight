// ============================================================================
// Core Domain Types
// ============================================================================

export enum ScenarioType {
  BEST_CASE = 'Best Case',
  WORST_CASE = 'Worst Case',
  PREFERRED = 'Preferred',
  PLAUSIBLE = 'Plausible',
}

export interface Scenario {
  type: ScenarioType;
  title: string;
  description: string;
  indicators: string[];
}

export interface Persona {
  name: string;
  role: string;
  description: string;
  painPoints: string[];
  goals: string[];
}

export enum RecommendationTimeframe {
  IMMEDIATE = 'Immediate',
  SHORT_TERM = 'Short-term',
  LONG_TERM = 'Long-term',
}

export enum RecommendationImpact {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface Recommendation {
  timeframe: RecommendationTimeframe;
  impact: RecommendationImpact;
  title: string;
  description: string;
}

export interface StrategyResult {
  persona: Persona;
  recommendations: Recommendation[];
  riskMitigation: string;
}

export interface ProjectData {
  topic: string;
  goal: string;
  scenarios: Scenario[];
  strategy: StrategyResult | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  data: ProjectData;
  createdAt: number;
  updatedAt: number;
  currentStep: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export enum ViewMode {
  CARDS = 'cards',
  MAP = 'map',
}

export interface ScenarioPosition {
  x: number;
  y: number;
  scenario: Scenario;
}

// ============================================================================
// Export Types
// ============================================================================

export enum ExportFormat {
  PDF = 'pdf',
  JSON = 'json',
  MARKDOWN = 'markdown',
}

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata: boolean;
  includeVisuals: boolean;
  watermark?: boolean;
}

export interface ExportResult {
  success: boolean;
  data?: Blob | string;
  error?: string;
}

// ============================================================================
// Example/Template Types
// ============================================================================

export interface ExampleTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedTime: string;
}

// ============================================================================
// Service Response Types
// ============================================================================

export interface AIServiceResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// ============================================================================
// Constants
// ============================================================================

export const SCENARIO_COLORS: Record<ScenarioType, string> = {
  [ScenarioType.BEST_CASE]: 'border-foresight-strategy bg-foresight-strategy/5',
  [ScenarioType.WORST_CASE]: 'border-foresight-ram bg-foresight-ram/5',
  [ScenarioType.PREFERRED]: 'border-foresight-creative bg-foresight-creative/5',
  [ScenarioType.PLAUSIBLE]: 'border-slate-300 bg-white',
};
