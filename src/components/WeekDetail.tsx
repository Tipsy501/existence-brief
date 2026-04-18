import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Target, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from './Card';

interface WeekDetailProps {
  week: number;
  theme: string;
  objectives: string[];
  daily: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  milestone: string;
  contingency: string;
  type: 'safe' | 'balanced' | 'growth';
}

export default function WeekDetail({
  week,
  theme,
  objectives,
  daily,
  milestone,
  contingency,
  type
}: WeekDetailProps) {
  const accents = {
    safe: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    balanced: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    growth: 'text-amber-600 bg-amber-50 border-amber-100'
  };

  const accentClass = accents[type];

  const days = [
    { label: 'Morning', value: daily.morning, time: '08:00 AM' },
    { label: 'Afternoon', value: daily.afternoon, time: '02:00 PM' },
    { label: 'Evening', value: daily.evening, time: '08:00 PM' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-3 ${accentClass}`}>
            Phase {Math.ceil(week / 2)} • Week {week}
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            {theme}
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Objectives */}
        <Card padding="md" className="border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Target size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Primary Objectives</span>
          </div>
          <ul className="space-y-4">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${type === 'safe' ? 'bg-emerald-500' : type === 'balanced' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                <span className="text-sm text-slate-700 font-medium leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Daily Ritual */}
        <Card padding="md" className="border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Calendar size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Command Schedule</span>
          </div>
          <div className="space-y-4">
            {days.map((day, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-[10px] font-black text-slate-400 w-16 pt-1 tracking-tighter uppercase whitespace-nowrap">
                  {day.time}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{day.label}</div>
                  <div className="text-sm text-slate-900 font-medium leading-tight">{day.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Milestone & Contingency */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 text-white relative overflow-hidden group">
          <CheckCircle2 size={80} className="absolute -bottom-4 -right-4 text-slate-800 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Milestone: Success Threshold</div>
            <p className="text-lg font-bold leading-tight italic">
              "{milestone}"
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-red-50 border border-red-100 relative overflow-hidden group">
          <ShieldAlert size={80} className="absolute -bottom-4 -right-4 text-red-100 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-4">Tactical Contingency</div>
            <p className="text-sm text-red-900 font-medium leading-relaxed">
              {contingency}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
