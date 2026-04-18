import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

interface PremiumBadgeProps {
  className?: string;
  showText?: boolean;
}

export default function PremiumBadge({ className = '', showText = true }: PremiumBadgeProps) {
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm ${className}`}
      title="Unlimited strategic briefs active"
    >
      <Star size={14} className="fill-emerald-500 text-emerald-500" />
      {showText && (
        <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          Premium <ShieldCheck size={10} />
        </span>
      )}
    </div>
  );
}
