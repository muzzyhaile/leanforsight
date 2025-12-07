import { Scenario, StrategyResult, ScenarioType } from "../types";

const OPENROUTER_API_KEY = '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const callOpenRouter = async (messages: OpenRouterMessage[], jsonMode: boolean = true): Promise<string> => {
  const response = await fetch(OPENROUTER_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Leanforsight'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-preview',
      messages,
      temperature: 0.7,
      ...(jsonMode && { response_format: { type: 'json_object' } })
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter Error:', errorText);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || '';
};

export const generateScenarios = async (topic: string): Promise<Scenario[]> => {
  const systemPrompt = `You are a professional futurist using the Foresight Scenario Sprint methodology.
You must respond with valid JSON only - an array of scenario objects.`;

  const userPrompt = `The user is asking the following strategic question: "${topic}".
    
Generate 4 distinct future scenarios for a timeframe of 5 years from now:
1. Best Case: Everything goes perfectly.
2. Worst Case: Everything goes wrong.
3. Preferred: The ideal but realistic outcome the user likely wants.
4. Plausible: The most likely outcome based on current trends (the baseline).

For the Plausible scenario, focus on it being the "Zero Point" or baseline for validation.

Respond with a JSON array in this exact format:
[
  {
    "type": "Best Case",
    "title": "string",
    "description": "string",
    "indicators": ["string", "string", "string"]
  },
  {
    "type": "Worst Case",
    "title": "string",
    "description": "string",
    "indicators": ["string", "string", "string"]
  },
  {
    "type": "Preferred",
    "title": "string",
    "description": "string",
    "indicators": ["string", "string", "string"]
  },
  {
    "type": "Plausible",
    "title": "string",
    "description": "string",
    "indicators": ["string", "string", "string"]
  }
]`;

  try {
    const response = await callOpenRouter([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    const parsed = JSON.parse(response);
    
    // Handle both array and object with scenarios key
    const scenarios = Array.isArray(parsed) ? parsed : parsed.scenarios;
    
    if (!Array.isArray(scenarios)) {
      throw new Error('Invalid response format');
    }

    return scenarios.map((s: any) => ({
      type: s.type as ScenarioType,
      title: s.title,
      description: s.description,
      indicators: s.indicators || []
    }));
  } catch (error) {
    console.error("OpenRouter Scenario Gen Error:", error);
    throw error;
  }
};

export const generateStrategy = async (
  topic: string, 
  goal: string, 
  scenarios: Scenario[]
): Promise<StrategyResult> => {
  const systemPrompt = `You are a strategic advisor helping create actionable strategies based on future scenarios.
You must respond with valid JSON only.`;

  const userPrompt = `Context: We are doing a Foresight Strategy integration.
Strategic Question: "${topic}"
Defined Customer Goal: "${goal}"

We have generated these 4 scenarios:
${scenarios.map(s => `${s.type}: ${s.description}`).join('\n')}

Task:
1. Create a User Persona based on the "Plausible" scenario (the baseline).
2. Develop strategic recommendations to move from the Plausible/Worst case trajectories towards the Preferred Scenario.
3. These recommendations should bridge the gap between the Goal and the Scenarios.

Respond with JSON in this exact format:
{
  "persona": {
    "name": "string",
    "role": "string",
    "description": "string",
    "painPoints": ["string", "string"],
    "goals": ["string", "string"]
  },
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "timeframe": "Immediate" | "Short-term" | "Long-term",
      "impact": "High" | "Medium" | "Low"
    }
  ],
  "riskMitigation": "string describing how to avoid worst case"
}`;

  try {
    const response = await callOpenRouter([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    const result = JSON.parse(response);
    return result as StrategyResult;
  } catch (error) {
    console.error("OpenRouter Strategy Gen Error:", error);
    throw error;
  }
};
