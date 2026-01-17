/**
 * @typedef {Object} AIService
 * @property {(topic: string) => Promise<import('../types.js').Scenario[]>} generateScenarios
 * @property {(topic: string, goal: string, scenarios: import('../types.js').Scenario[]) => Promise<import('../types.js').StrategyResult>} generateStrategy
 */

export {};
