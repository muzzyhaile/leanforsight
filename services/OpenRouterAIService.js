import { generateScenarios, generateStrategy } from './openRouterService.js';

export class OpenRouterAIService {
  async generateScenarios(topic) {
    return generateScenarios(topic);
  }

  async generateStrategy(topic, goal, scenarios) {
    return generateStrategy(topic, goal, scenarios);
  }
}
