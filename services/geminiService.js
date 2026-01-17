import { GoogleGenAI, Type } from '@google/genai';
import { ScenarioType } from '../types.js';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const getModel = () => 'gemini-2.5-flash';

export const generateScenarios = async (topic) => {
  const modelId = getModel();

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        type: {
          type: Type.STRING,
          enum: [ScenarioType.BEST_CASE, ScenarioType.WORST_CASE, ScenarioType.PREFERRED, ScenarioType.PLAUSIBLE]
        },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        indicators: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['type', 'title', 'description', 'indicators']
    }
  };

  const prompt = `
    Act as a professional futurist using the Foresight Scenario Sprint methodology.
    The user is asking the following strategic question: "${topic}".

    Generate 4 distinct future scenarios for a timeframe of 5 years from now:
    1. Best Case: Everything goes perfectly.
    2. Worst Case: Everything goes wrong.
    3. Preferred: The ideal but realistic outcome the user likely wants.
    4. Plausible: The most likely outcome based on current trends (the baseline).

    For the Plausible scenario, focus on it being the "Zero Point" or baseline for validation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Scenario Gen Error:', error);
    throw error;
  }
};

export const generateStrategy = async (topic, goal, scenarios) => {
  const modelId = 'gemini-2.5-flash';

  const schema = {
    type: Type.OBJECT,
    properties: {
      persona: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          description: { type: Type.STRING },
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          goals: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['name', 'role', 'description']
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            timeframe: { type: Type.STRING, enum: ['Immediate', 'Short-term', 'Long-term'] },
            impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
          },
          required: ['title', 'description', 'timeframe', 'impact']
        }
      },
      riskMitigation: { type: Type.STRING }
    },
    required: ['persona', 'recommendations', 'riskMitigation']
  };

  const prompt = `
    Context: We are doing a Foresight Strategy integration.
    Strategic Question: "${topic}"
    Defined Customer Goal: "${goal}"

    We have generated these 4 scenarios:
    ${JSON.stringify(scenarios.map((s) => `${s.type}: ${s.description}`).join('\n'))}

    Task:
    1. Create a User Persona based on the "Plausible" scenario (the baseline).
    2. Develop strategic recommendations to move from the Plausible/Worst case trajectories towards the Preferred Scenario.
    3. These recommendations should bridge the gap between the Goal and the Scenarios.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.6
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Strategy Gen Error:', error);
    throw error;
  }
};
