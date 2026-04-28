import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({ slot, format = 'auto', style = {} }: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);
  
  useEffect(() => {
    // Prevent duplicate initialization
    if (initialized.current) return;
    initialized.current = true;
    
    // Wait for adsbygoogle to be available
    const checkAds = setInterval(() => {
      if (window.adsbygoogle && adRef.current) {
        clearInterval(checkAds);
        
        try {
          // Only push if not already filled
          if (!adRef.current.getAttribute('data-ad-status')) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (err) {
          console.log('AdSense error:', err);
        }
      }
    }, 500);
    
    // Timeout after 10 seconds
    const timeout = setTimeout(() => clearInterval(checkAds), 10000);
    
    return () => {
      clearInterval(checkAds);
      clearTimeout(timeout);
    };
  }, []);
  
  return (
    <div style={{ minWidth: '300px', minHeight: '250px', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8314573797180963"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
