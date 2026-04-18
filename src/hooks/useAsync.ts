import { useState, useCallback, useEffect, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useAsync hook to handle loading, error, and data states for async operations.
 * Includes unmount safety and error reset.
 */
export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const run = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await promise;
      if (isMounted.current) {
        setState({ data, loading: false, error: null });
      }
      return data;
    } catch (error) {
      if (isMounted.current) {
        setState({ data: null, loading: false, error: error as Error });
      }
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    run,
    reset,
  };
}
