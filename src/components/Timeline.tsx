import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface TimelineProps {
  currentWeek: number;
  onWeekClick: (week: number) => void;
  weeksCount?: number;
}

export default function Timeline({ currentWeek, onWeekClick, weeksCount = 12 }: TimelineProps) {
  const weeks = Array.from({ length: weeksCount }, (_, i) => i + 1);

  return (
    <div className="relative w-full py-8 overflow-x-auto no-scrollbar">
      <div className="min-w-[800px] px-4">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-8 h-1 bg-indigo-500 -translate-y-1/2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentWeek - 1) / (weeksCount - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        <div className="relative flex justify-between">
          {weeks.map((week) => {
            const isCompleted = week < currentWeek;
            const isActive = week === currentWeek;

            return (
              <div 
                key={week}
                className="flex flex-col items-center gap-3"
              >
                <button
                  onClick={() => onWeekClick(week)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10
                    ${isCompleted ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 
                      isActive ? 'bg-white border-4 border-indigo-500 text-indigo-600 scale-125 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' : 
                      'bg-white border-2 border-slate-200 text-slate-400 hover:border-slate-400'}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : `W${week}`}
                </button>
                
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isActive ? 'Current' : `Week ${week}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
