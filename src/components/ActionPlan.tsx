import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, Zap, Crown } from 'lucide-react';

import { usePremium } from '../hooks/usePremium';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface ActionPlanProps {
  plan: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
}

export default function ActionPlan({ plan }: ActionPlanProps) {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'30' | '60' | '90' | 'pricing'>('30');

  const tabs = [
    { id: '30', label: 'Immediate (30d)', data: plan.day30 },
    { id: '60', label: 'Mid-term (60d)', data: plan.day60 },
    { id: '90', label: 'Long-term (90d)', data: plan.day90 },
  ];

  // Add pricing tab for free users
  const allTabs = [...tabs];
  if (!isPremium) {
    allTabs.push({ id: 'pricing', label: 'Unlimited Path', data: [] });
  }

  return (
    <div className="w-full">
      <div className="flex p-1 bg-slate-100 rounded-xl mb-8 overflow-x-auto no-scrollbar">
        {allTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'}
            `}
          >
            {tab.id === 'pricing' && <Zap size={10} className="inline mr-1 fill-current" />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'pricing' ? (
            <motion.div
              key="pricing-upsell"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-200"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                   <div className="w-16 md:w-20 h-16 md:h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center rotate-6 border border-white/20">
                      <Zap size={32} className="fill-white" />
                   </div>
                </div>
                <div className="flex-1 space-y-3 text-center md:text-left">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                     Tactical Expansion Required
                   </div>
                   <h3 className="text-2xl md:text-3xl font-black italic serif leading-tight">Unlock Deep Strategic Logic.</h3>
                   <p className="text-sm text-indigo-100 font-medium leading-relaxed max-w-lg">
                     Free briefs are limited to basic execution. Upgrade to unlock asymetric analysis, unlimited iterations, and your strategic vault.
                   </p>
                   <div className="pt-2">
                     <Button onClick={() => navigate('/upgrade')} variant="secondary" className="bg-white text-indigo-600 hover:bg-slate-50 border-none px-8 font-black uppercase tracking-widest text-[10px]">
                        Upgrade to Unlimited
                     </Button>
                   </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 p-8 opacity-5" aria-hidden="true">
                <Crown size={240} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {tabs.find(t => t.id === activeTab)?.data.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-xl group hover:border-indigo-100 transition-colors"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-200 transition-colors">
                    <CheckCircle2 size={16} className="text-white group-hover:text-slate-100" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-slate-300" />
                    <span className="text-sm font-medium text-slate-700 leading-relaxed">{item}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
