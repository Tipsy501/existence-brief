import React from 'react';
import { Zap, AlertCircle } from 'lucide-react';

interface UsageBadgeProps {
  used: number;
  limit: number;
  isPremium: boolean;
  isAdmin?: boolean;
  className?: string;
}

export default function UsageBadge({ used, limit, isPremium, isAdmin, className = '' }: UsageBadgeProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const isNearLimit = !isPremium && used >= limit - 1;
  const isAtLimit = !isPremium && used >= limit;

  if (isAdmin) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200">
          <Zap size={10} className="fill-indigo-400 text-indigo-400" />
          Admin Mode
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Zap size={12} className={isPremium ? 'text-indigo-500' : ''} />
          {isPremium ? 'Unlimited Access' : 'Daily Quota'}
        </div>
        {!isPremium && (
          <span className={`text-[10px] font-bold ${isAtLimit ? 'text-red-500' : 'text-slate-600'}`}>
            {used} / {limit}
          </span>
        )}
      </div>

      {!isPremium && (
        <div className="group relative">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {isAtLimit && (
            <div className="mt-2 flex items-center gap-1.5 text-red-500 text-[9px] font-bold uppercase tracking-wider animate-pulse">
              <AlertCircle size={10} />
              Limit Reached &middot; Resets Daily
            </div>
          )}
        </div>
      )}
    </div>
  );
}
