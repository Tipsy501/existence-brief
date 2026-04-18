import { useState, useEffect, useCallback } from 'react';
import { getUserUsage, incrementBriefUsage, UsageInfo, FREE_DAILY_LIMIT } from '../lib/usage';
import { useAuth } from './useAuth';

/**
 * Hook to manage and monitor user brief generation limits
 */
export function useUsage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<UsageInfo>({
    used: 0,
    limit: FREE_DAILY_LIMIT,
    isPremium: false,
    canGenerate: true,
    lastDate: null
  });

  const isAdmin = user?.email === 'topogabolekwe@gmail.com';

  const refreshUsage = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (isAdmin) {
      setUsage({
        used: 0,
        limit: Infinity,
        isPremium: true,
        canGenerate: true,
        lastDate: null
      });
      setLoading(false);
      return;
    }

    try {
      const data = await getUserUsage(user.id, user.email);
      setUsage(data);
    } catch (err) {
      console.log('Failed to fetch usage:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  const incrementUsage = async () => {
    if (!user || isAdmin) return;
    try {
      const newCount = await incrementBriefUsage(user.id, user.email);
      setUsage(prev => ({
        ...prev,
        used: newCount,
        canGenerate: newCount < prev.limit
      }));
    } catch (err) {
      console.log('Failed to increment usage:', err);
    }
  };

  const checkCanGenerate = async () => {
    if (!user) return true; // Guests aren't strictly throttled in DB but we can handle UI-side
    const data = await getUserUsage(user.id, user.email);
    setUsage(data);
    return data.canGenerate;
  };

  return {
    ...usage,
    loading,
    refreshUsage,
    incrementUsage,
    checkCanGenerate
  };
}
