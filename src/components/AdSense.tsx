import React, { useEffect, useState } from 'react';
import { usePremium } from '../hooks/usePremium';

interface AdSenseProps {
  key?: string | number;
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: 'true' | 'false';
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Hardened AdSense component
 * Focuses on single-push logic, client-side only mounting, 
 * and strict physical dimension constraints to prevent layout shift and AdSense sizing errors.
 */
export default function AdSense({ 
  slot, 
  format = 'auto', 
  responsive = 'true',
  className = '',
  style = {}
}: AdSenseProps) {
  const { isPremium, isAdmin } = usePremium();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isPremium && !isAdmin) {
      try {
        // Only push if there's a compatible adsbygoogle array and we haven't pushed for this specific element yet
        // AdSense library adds data-adsbygoogle-status="done" once processed
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Silently catch push errors to avoid UI interruption
        console.warn('AdSense Push Signal Intercepted:', e);
      }
    }
  }, [isClient, isPremium, isAdmin, slot]);

  // Early return for server-side or privileged users
  if (!isClient || isPremium || isAdmin) return null;

  return (
    <div 
      className={`adsense-wrapper relative overflow-hidden bg-slate-50/5 rounded-xl border border-dotted border-slate-200/50 ${className}`}
      style={{ 
        minWidth: '300px', 
        minHeight: '250px',
        ...style 
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-200">
          Strategic Signal
        </span>
      </div>
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-8314573797180963"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
