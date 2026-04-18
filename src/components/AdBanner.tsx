import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdSense from './AdSense';

interface AdBannerProps {
  type: 'top' | 'sidebar' | 'content';
  className?: string;
}

export default function AdBanner({ type, className = '' }: AdBannerProps) {
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Replace these slots with actual IDs from AdSense dashboard when available
  const slots = {
    top: '1234567890', 
    sidebar: '2345678901',
    content: '3456789012'
  };

  const config = {
    top: { format: 'horizontal' as const, minHeight: '250px', minWidth: '300px' },
    sidebar: { format: 'vertical' as const, minHeight: '600px', minWidth: '300px' },
    content: { format: 'auto' as const, minHeight: '250px', minWidth: '300px' }
  };

  const { format, minHeight, minWidth } = config[type];

  if (!isClient) return null;

  return (
    <div 
      className={`ad-banner-wrapper my-8 ${className}`}
      style={{ minHeight, minWidth }}
    >
      <div className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-300 mb-3 text-center">
        Strategic Sponsorship
      </div>
      <AdSense 
        key={`${location.pathname}-${type}`}
        slot={slots[type]} 
        format={format} 
        className="mx-auto shadow-sm"
      />
    </div>
  );
}
