import { GoogleGenAI } from "@google/genai";
import { EXISTENCE_BRIEF_PROMPT, EXISTENCE_DETAILED_PLAN_PROMPT } from './prompts';
import { PROVIDERS, AIProvider } from './ai-providers';
import { generateTemplateBrief, generateTemplateDetailedPlan } from './template-fallback';

/**
 * Interface for the AI Brief Output
 */
export interface BriefResult {
  summary: string;
  paths: {
    safe: PathDefinition;
    balanced: PathDefinition;
    growth: PathDefinition;
  };
  comparison: string;
  recommendedPath: 'safe' | 'balanced' | 'growth';
  actionPlan: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
  focusStatement: string;
}

/**
 * Interface for the 12-Week Detailed Plan Output
 */
export interface DetailedPlanResult {
  summary: string;
  roadmap: Array<{
    week: number;
    theme: string;
    objectives: string[];
    daily: {
      morning: string;
      afternoon: string;
      evening: string;
    };
    milestone: string;
    contingency: string;
  }>;
  rituals: string[];
  risks: Array<{ threat: string; mitigation: string }>;
  resources: string[];
  accountability: string;
}

interface PathDefinition {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
}

/**
 * High-performance AI generation service.
 * Implements "Guaranteed Response" logic with multi-provider fallbacks.
 */
export async function generateBrief(
  situation: string,
  goal: string,
  constraints: string
): Promise<BriefResult> {
  const prompt = EXISTENCE_BRIEF_PROMPT
    .replace('{situation}', situation)
    .replace('{goal}', goal)
    .replace('{constraints}', constraints || 'None provided');

  return executeTask<BriefResult>(prompt, 'Strategic Analysis', situation, goal, constraints, generateTemplateBrief);
}

/**
 * Generates a detailed 12-week execution plan for a specific path.
 */
export async function generateDetailedPlan(
  pathType: 'safe' | 'balanced' | 'growth',
  situation: string,
  goal: string,
  constraints: string
): Promise<DetailedPlanResult> {
  const prompt = EXISTENCE_DETAILED_PLAN_PROMPT
    .replace('{pathType}', pathType)
    .replace('{situation}', situation)
    .replace('{goal}', goal)
    .replace('{constraints}', constraints || 'None provided');

  return executeTask<DetailedPlanResult>(
    prompt, 
    'Detailed Execution Roadmap', 
    situation, 
    goal, 
    constraints, 
    (s, g, c) => generateTemplateDetailedPlan(pathType, s, g, c)
  );
}

/**
 * Generic execution wrapper for AI tasks with fallbacks
 */
async function executeTask<T>(
  prompt: string, 
  taskName: string,
  situation: string,
  goal: string,
  constraints: string,
  fallbackFn: (s: string, g: string, c: string) => T
): Promise<T> {
  console.log(`${taskName} Initiated: Engaging multi-provider intelligence grid...`);

  const activeProviders = PROVIDERS.filter(p => p.key && p.key !== 'your-key' && p.key !== '');

  if (activeProviders.length === 0) {
    console.warn(`No active AI providers for ${taskName}. Activating fallback...`);
    return fallbackFn(situation, goal, constraints);
  }

  try {
    // Attempt all active providers in parallel.
    // Use Settled to ensure we check all of them for success.
    const results = await Promise.allSettled(
      activeProviders.map(provider => tryProvider<T>(provider, prompt))
    );

    const successfulResult = results.find(r => r.status === 'fulfilled');
    
    if (successfulResult && successfulResult.status === 'fulfilled') {
      const { data, provider } = successfulResult.value;
      console.log(`${taskName} Success: Logic synthesized via ${provider}`);
      return data;
    }

    throw new Error('All AI providers exhausted or timed out.');
  } catch (err) {
    console.log(`[AI-Service] ${taskName} protocol deviation. Engaging secondary fallback grid.`);
    return fallbackFn(situation, goal, constraints);
  }
}

/**
 * Individual provider attempt logic
 */
async function tryProvider<T>(provider: AIProvider, prompt: string): Promise<{ data: T, provider: string }> {
  // Increased timeout to 60s for complex plans and slow free models
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); 

  try {
    for (const model of provider.models) {
      try {
        let content = '';
        console.log(`[AI-Service] Attempting ${provider.name} with model ${model}...`);

        if (provider.type === 'openai') {
          const response = await fetch(provider.url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${provider.key}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Existence Brief',
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: 'You are a specialist strategy consultant. Respond ONLY in valid JSON. No conversational filler.' },
                { role: 'user', content: prompt }
              ],
              temperature: 0.7,
              max_tokens: 3000,
              response_format: (provider.name.includes('OpenRouter') || provider.name.includes('DeepSeek')) 
                ? { type: 'json_object' } 
                : undefined
            }),
            signal: controller.signal
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.warn(`[AI-Service] Provider ${provider.name} (${model}) reponse failed with status ${response.status}:`, errData?.error?.message || 'Unknown error');
            continue;
          }

          const rawData = await response.json();
          content = rawData.choices?.[0]?.message?.content || '';
        } 
        else if (provider.type === 'google-sdk') {
          // Use process.env directly as per system instructions for Gemini API
          const apiKey = (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined) || provider.key;
          if (!apiKey) throw new Error('Gemini API Key missing');
          
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          });
          content = response.text || '';
        }

        if (content) {
          const parsed = safeJsonParse<T>(content);
          if (parsed) {
            clearTimeout(timeoutId);
            console.log(`[AI-Service] ${provider.name} (${model}) successfully returned and parsed.`);
            return {
              data: parsed,
              provider: `${provider.name} (${model})`
            };
          } else {
            console.warn(`[AI-Service] ${provider.name} (${model}) returned invalid JSON. Content preview:`, content.substring(0, 100));
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.log(`[AI-Service] ${provider.name} (${model}) TIMEOUT after 60s.`);
          throw e;
        }
        console.warn(`[AI-Service] Attempt with ${provider.name} (${model}) failed:`, e.message);
      }
    }
    throw new Error(`${provider.name} all models failed`);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Robust JSON parser that handles markdown code blocks or stray text
 */
function safeJsonParse<T>(input: string): T | null {
  try {
    // 1. Try direct parse
    return JSON.parse(input) as T;
  } catch (e) {
    try {
      // 2. Try extracting from markdown JSON block
      const match = input.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        return JSON.parse(match[1]) as T;
      }
      
      // 3. Try finding first { and last }
      const firstBrace = input.indexOf('{');
      const lastBrace = input.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const potentialJson = input.substring(firstBrace, lastBrace + 1);
        return JSON.parse(potentialJson) as T;
      }
    } catch (innerE) {
      console.log('Failed to parse AI output as JSON:', input.substring(0, 100) + '...');
    }
    return null;
  }
}
