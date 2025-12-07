export enum ScenarioType {
  BEST_CASE = 'Best Case',
  WORST_CASE = 'Worst Case',
  PREFERRED = 'Preferred',
  PLAUSIBLE = 'Plausible'
}

export interface Scenario {
  type: ScenarioType;
  title: string;
  description: string;
  indicators: string[]; // Key signals for this scenario
}

export interface Persona {
  name: string;
  role: string;
  description: string;
  painPoints: string[];
  goals: string[];
}

export interface Recommendation {
  title: string;
  description: string;
  timeframe: 'Immediate' | 'Short-term' | 'Long-term';
  impact: 'High' | 'Medium' | 'Low';
}

export interface StrategyResult {
  persona: Persona;
  recommendations: Recommendation[];
  riskMitigation: string; // How to avoid worst case
}

export interface ProjectData {
  topic: string; // The strategic question
  goal: string; // The specific customer goal
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

export interface User {
  id: string;
  email: string;
  name: string;
}
