import React from 'react';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../hooks/useAuth';
import AdSense from './AdSense';

interface AdBannerProps {
  position?: string;
  slot?: string;
  className?: string;
  size?: 'leaderboard' | 'banner' | 'large-mobile' | 'skyscraper' | 'medium-rectangle';
}

export default function AdBanner({ 
  position = 'bottom', 
  slot = '1234567890', 
  className = '',
  size = 'leaderboard' 
}: AdBannerProps) {
  const { isPremium, isAdmin: hookIsAdmin } = usePremium();
  const { user } = useAuth();
  const isAdmin = hookIsAdmin || user?.email === 'topogabolekwe@gmail.com';
  
  // Only show for free users, not premium/admin
  if (isPremium || isAdmin) return null;
  
  return (
    <div className={`ad-banner-wrapper my-8 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden ${position} ${className}`}>
      <p className="text-[10px] text-slate-400 text-center mb-2 uppercase tracking-[0.3em] font-black">Sponsored Content</p>
      <div className="flex justify-center overflow-hidden">
        <AdSense slot={slot} size={size} />
      </div>
    </div>
  );
}
