import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface BriefInput {
  situation: string;
  goal: string;
  constraints: string;
}

const MODELS = [
  "deepseek/deepseek-chat:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-2-9b-it:free"
];

export async function generateBrief(input: BriefInput): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your-openrouter-key') {
    throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your secrets.');
  }

  const prompt = `
    You are an expert strategic advisor. Your goal is to provide a "Existence Brief" - a concise, brutal, and highly actionable roadmap based on a user's current situation.
    
    USER DATA:
    - Situation: ${input.situation}
    - Goal: ${input.goal}
    - Constraints: ${input.constraints}
    
    OUTPUT FORMAT (Strict Markdown):
    ### THE ROADMAP
    
    #### CORE INSIGHT
    [A 1-2 sentence brutal summary of the underlying truth of their situation]
    
    #### NEXT 3 ACTIONS
    1. **[Action Label]**: [Detailed instruction on what to do in the next 24-72 hours]
    2. **[Action Label]**: [The second priority step]
    3. **[Action Label]**: [The third priority step]
    
    *CLARITY IS KING.*
  `;

  for (const model of MODELS) {
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: model,
          messages: [
            { role: 'system', content: 'You are a elite strategic advisor known for brevity and clarity.' },
            { role: 'user', content: prompt }
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Existence Brief',
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (content) return content;
    } catch (error) {
      console.log(`Model logic deviation (${model}):`, error);
      // Continue to next model
    }
  }

  throw new Error('Failed to generate brief with all available models. Please try again later.');
}
