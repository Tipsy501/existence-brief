import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  slot: string;
  format?: string;
  size?: 'leaderboard' | 'banner' | 'large-mobile' | 'skyscraper' | 'medium-rectangle';
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({ slot, format = 'auto', size = 'leaderboard', style = {} }: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  const getDimensions = () => {
    switch (size) {
      case 'leaderboard': return { width: '728px', height: '90px' };
      case 'banner': return { width: '468px', height: '60px' };
      case 'large-mobile': return { width: '320px', height: '100px' };
      case 'skyscraper': return { width: '160px', height: '600px' };
      case 'medium-rectangle': return { width: '300px', height: '250px' };
      default: return { width: '728px', height: '90px' };
    }
  };

  const dims = getDimensions();
  const adFormat = size === 'leaderboard' || size === 'banner' ? 'horizontal' : 
                   size === 'skyscraper' ? 'vertical' : 
                   size === 'medium-rectangle' ? 'rectangle' : format;
  
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
    <div style={{ 
      minWidth: dims.width, 
      minHeight: dims.height, 
      maxWidth: '100%',
      ...style 
    }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'inline-block', 
          width: dims.width, 
          height: dims.height,
          maxWidth: '100%'
        }}
        data-ad-client="ca-pub-8314573797180963"
        data-ad-slot={slot}
        data-ad-format={adFormat}
        data-full-width-responsive={size === 'leaderboard' ? "true" : "false"}
      />
    </div>
  );
}
