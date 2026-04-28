import React from 'react';
import { Check, X, Shield, Zap, TrendingUp, Award } from 'lucide-react';
import Card from './Card';

interface PathCardProps {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  type: 'safe' | 'balanced' | 'growth';
  isRecommended: boolean;
  onClick?: () => void;
}

export default function PathCard({
  title,
  description,
  pros,
  cons,
  type,
  isRecommended,
  onClick
}: PathCardProps) {
  const styles = {
    safe: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50/30',
      icon: <Shield className="text-emerald-500" size={18} />,
      accent: 'emerald'
    },
    balanced: {
      border: 'border-l-indigo-500',
      bg: 'bg-indigo-50/30',
      icon: <Zap className="text-indigo-500" size={18} />,
      accent: 'indigo'
    },
    growth: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50/30',
      icon: <TrendingUp className="text-amber-500" size={18} />,
      accent: 'amber'
    }
  };

  const current = styles[type];

  return (
    <Card 
      className={`relative h-full flex flex-col border-l-4 ${current.border} ${isRecommended ? 'ring-2 ring-indigo-500 ring-offset-2' : ''} 
      ${onClick ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : ''}`}
      padding="md"
      onClick={onClick}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-6 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg z-10">
          <Award size={12} />
          Recommended Path
        </div>
      )}

      <div className="flex items-center gap-3 mb-2 mt-2">
        <div className={`p-2 rounded-lg ${current.bg}`}>
          {current.icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
      </div>

      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-${current.accent}-50 text-${current.accent}-600 border border-${current.accent}-100 shadow-sm`}>
          {type === 'safe' ? '🐢 6-12 Months' : type === 'balanced' ? '⚡ 3-6 Months' : '🚀 30-90 Days'}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-grow">
        {description}
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Strengths</h4>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Trade-offs</h4>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <X size={14} className="text-red-400 shrink-0 mt-0.5" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {onClick && (
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between group">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">
            Click for detailed plan
          </span>
          <TrendingUp size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </div>
      )}
    </Card>
  );
}
