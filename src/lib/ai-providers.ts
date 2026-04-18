export interface AIProvider {
  name: string;
  url: string;
  models: string[];
  key: string | undefined;
  type: 'openai' | 'google-sdk';
}

/**
 * Registry of available AI providers for the multi-fallback system.
 */
export const PROVIDERS: AIProvider[] = [
  {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    models: [
      'google/gemini-2.0-flash-exp:free',
      'deepseek/deepseek-chat-v3-0324:free',
      'meta-llama/llama-3.1-8b-instruct:free'
    ],
    key: import.meta.env.VITE_OPENROUTER_API_KEY,
    type: 'openai'
  },
  {
    name: 'DeepSeek Direct',
    url: 'https://api.deepseek.com/v1/chat/completions',
    models: ['deepseek-chat'],
    key: import.meta.env.VITE_DEEPSEEK_API_KEY,
    type: 'openai'
  },
  {
    name: 'Gemini Direct',
    url: '', // Not used by SDK
    models: ['gemini-3-flash-preview'],
    key: (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined) || import.meta.env.VITE_GEMINI_API_KEY,
    type: 'google-sdk'
  }
];
