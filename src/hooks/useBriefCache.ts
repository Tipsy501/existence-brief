import { useState, useEffect } from 'react';
import { DetailedPlanResult } from '../lib/ai-service';
import { getUserBriefs } from '../lib/database';

export function useBriefCache(briefId: string | undefined, pathType: string | undefined, user: any) {
  const [data, setData] = useState<DetailedPlanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!briefId || !pathType || isFetched) return;

    const cacheKey = `existence_detailed_plan_${briefId}_${pathType}`;
    
    async function load() {
      try {
        // 1. Check Memory/State first (handled by standard React state if this hook is used multiple times, 
        // but here it's per component instance. LocalStorage is the real cache).
        
        // 2. Check LocalStorage (Instant)
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
          setIsFetched(true);
          console.log(`[useBriefCache] Loaded ${pathType} path from storage cache`);
          return;
        }

        // 3. If no cache, we let the component handle the initial fetch if needed, 
        // OR we can fetch it here. The user request suggests fetching it if not cached.
        // However, the component already has complex generation logic.
        // Let's make this hook just a state/storage bridge.
      } catch (err) {
        console.log('[useBriefCache] Cache retrieval deviation:', err);
      } finally {
        // We don't set loading false here if we didn't find data, 
        // because the component will provide the data later.
      }
    }

    load();
  }, [briefId, pathType, isFetched]);

  const setCache = (newData: DetailedPlanResult) => {
    if (!briefId || !pathType) return;
    const cacheKey = `existence_detailed_plan_${briefId}_${pathType}`;
    localStorage.setItem(cacheKey, JSON.stringify(newData));
    setData(newData);
    setIsFetched(true);
  };

  return { data, loading: loading && !data, setCache };
}
