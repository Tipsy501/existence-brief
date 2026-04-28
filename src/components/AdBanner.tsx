import React from 'react';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../hooks/useAuth';
import AdSense from './AdSense';

interface AdBannerProps {
  position?: string;
  slot?: string;
  className?: string;
}

export default function AdBanner({ position = 'bottom', slot = '1234567890', className = '' }: AdBannerProps) {
  const { isPremium, isAdmin: hookIsAdmin } = usePremium();
  const { user } = useAuth();
  const isAdmin = hookIsAdmin || user?.email === 'topogabolekwe@gmail.com';
  
  // Only show for free users, not premium/admin
  if (isPremium || isAdmin) return null;
  
  return (
    <div className={`ad-banner-wrapper my-8 p-4 bg-slate-50 rounded-xl border border-slate-200 ${position} ${className}`}>
      <p className="text-xs text-slate-500 text-center mb-2 uppercase tracking-widest font-bold">Advertisement</p>
      <div className="flex justify-center">
        <AdSense slot={slot} format="auto" />
      </div>
    </div>
  );
}
