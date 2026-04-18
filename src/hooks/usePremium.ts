import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { verifyPremiumStatus, markUserAsPremium } from '../lib/subscription';

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    // Admin bypass
    if (user.email === 'topogabolekwe@gmail.com') {
      setIsPremium(true);
      setLoading(false);
      return;
    }

    try {
      const status = await verifyPremiumStatus(user.id);
      setIsPremium(status);
    } catch (err) {
      console.log('Premium status check deviation:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const upgrade = async (orderId: string) => {
    if (!user) return;
    try {
      await markUserAsPremium(user.id, orderId);
      setIsPremium(true);
    } catch (err) {
      console.log('Upgrade logic deviation:', err);
      throw err;
    }
  };

  const isAdmin = user?.email === 'topogabolekwe@gmail.com';

  return {
    isPremium: isPremium || isAdmin,
    isAdmin,
    loading,
    upgrade,
    checkStatus
  };
}
