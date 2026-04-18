import React from 'react';
import { Crown, Share2, Users, Globe, Lock } from 'lucide-react';
import { useViral, Badge } from '../hooks/useViral';
import Card from './Card';

const ICON_MAP: Record<string, any> = {
  Crown,
  Share2,
  Users,
  Globe
};

export default function BadgeDisplay() {
  const { badges, loading } = useViral();

  if (loading) return null;

  return (
    <Card padding="md" className="bg-white border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Strategic Commendations</h3>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{badges.filter(b => b.achieved).length}/{badges.length} Unlocked</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const Icon = ICON_MAP[badge.icon] || Lock;
          return (
            <div 
              key={badge.id}
              className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all ${
                badge.achieved 
                  ? 'bg-slate-50 border-indigo-100 border-b-4' 
                  : 'bg-slate-50 opacity-40 grayscale border-slate-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                badge.achieved ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400'
              }`}>
                <Icon size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900 leading-none">{badge.name}</p>
              <p className="text-[9px] text-slate-500 font-medium leading-tight">{badge.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 font-medium italic text-center">
          Broaden your strategic frequency to unlock more commendations.
        </p>
      </div>
    </Card>
  );
}
