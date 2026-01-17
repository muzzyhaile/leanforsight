/**
 * @typedef {Object} Scenario
 * @property {string} type
 * @property {string} title
 * @property {string} description
 * @property {string[]} indicators
 */

/**
 * @typedef {Object} Persona
 * @property {string} name
 * @property {string} role
 * @property {string} description
 * @property {string[]} painPoints
 * @property {string[]} goals
 */

/**
 * @typedef {Object} Recommendation
 * @property {'Immediate'|'Short-term'|'Long-term'} timeframe
 * @property {'High'|'Medium'|'Low'} impact
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} StrategyResult
 * @property {Persona} persona
 * @property {Recommendation[]} recommendations
 * @property {string} riskMitigation
 */

/**
 * @typedef {Object} ProjectData
 * @property {string} topic
 * @property {string} goal
 * @property {Scenario[]} scenarios
 * @property {StrategyResult | null} strategy
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} userId
 * @property {string} name
 * @property {ProjectData} data
 * @property {number} createdAt
 * @property {number} updatedAt
 * @property {number} currentStep
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 */

export const ScenarioType = {
  BEST_CASE: 'Best Case',
  WORST_CASE: 'Worst Case',
  PREFERRED: 'Preferred',
  PLAUSIBLE: 'Plausible'
};
