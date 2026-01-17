import { useState } from 'react';

export const useScenarioGeneration = (aiService) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateScenarios = async (topic) => {
    setLoading(true);
    setError(null);
    try {
      return await aiService.generateScenarios(topic);
    } catch {
      setError('Error generating scenarios. Please check your API key.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateStrategy = async (topic, goal, scenarios) => {
    setLoading(true);
    setError(null);
    try {
      return await aiService.generateStrategy(topic, goal, scenarios);
    } catch {
      setError('Error generating strategy.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateScenarios,
    generateStrategy
  };
};
