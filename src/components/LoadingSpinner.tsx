import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export default function LoadingSpinner({
  text,
  size = 'md',
  fullPage = false
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerStyles = fullPage 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerStyles}>
      <Loader2 className={`${sizes[size]} text-indigo-600 animate-spin`} />
      {text && (
        <p className="mt-4 text-sm font-medium text-slate-500 uppercase tracking-widest animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
