import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface TimelineProps {
  currentPeriod: number;
  onPeriodClick: (period: number) => void;
  periodsCount?: number;
  unit?: 'day' | 'week' | 'biweek';
}

export default function Timeline({ 
  currentPeriod, 
  onPeriodClick, 
  periodsCount = 12,
  unit = 'week'
}: TimelineProps) {
  const periods = Array.from({ length: periodsCount }, (_, i) => i + 1);

  const getLabel = (period: number) => {
    switch (unit) {
      case 'day': return `D${period}`;
      case 'biweek': return `B${period}`;
      case 'week':
      default: return `W${period}`;
    }
  };

  const getFullLabel = (period: number) => {
    switch (unit) {
      case 'day': return `Day ${period}`;
      case 'biweek': return `Bi-week ${period}`;
      case 'week':
      default: return `Week ${period}`;
    }
  };

  return (
    <div className="relative w-full py-8 overflow-x-auto no-scrollbar">
      <div className={`min-w-[${Math.max(800, periodsCount * 60)}px] px-4`}>
        {/* Progress Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-8 h-1 bg-indigo-500 -translate-y-1/2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: periodsCount > 1 ? `${((currentPeriod - 1) / (periodsCount - 1)) * 100}%` : '100%' }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        <div className="relative flex justify-between gap-4">
          {periods.map((period) => {
            const isCompleted = period < currentPeriod;
            const isActive = period === currentPeriod;

            return (
              <div 
                key={period}
                className="flex flex-col items-center gap-3 shrink-0"
              >
                <button
                  onClick={() => onPeriodClick(period)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 z-10
                    ${isCompleted ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 
                      isActive ? 'bg-white border-4 border-indigo-500 text-indigo-600 scale-125 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' : 
                      'bg-white border-2 border-slate-200 text-slate-400 hover:border-slate-400'}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : getLabel(period)}
                </button>
                
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isActive ? 'Current' : getFullLabel(period)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
