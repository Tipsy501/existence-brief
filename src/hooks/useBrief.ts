import { useState } from 'react';
import { generateBrief as apiGenerateBrief, BriefResult } from '../lib/ai-service';

const LOCAL_STORAGE_KEY = 'existence_brief_latest';

/**
 * Hook to manage AI brief generation and persistence
 */
export function useBrief() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BriefResult | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const generate = async (inputs: { situation: string; goal: string; constraints: string }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiGenerateBrief(inputs.situation, inputs.goal, inputs.constraints);
      setResult(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred during analysis.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResult(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return {
    loading,
    error,
    result,
    generate,
    clear
  };
}
