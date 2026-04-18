import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Target, 
  Calendar, 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  Briefcase,
  Users
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBriefCache } from '../hooks/useBriefCache';
import { generateDetailedPlan, DetailedPlanResult } from '../lib/ai-service';
import { getUserBriefs, updateBriefPlan } from '../lib/database';
import Button from '../components/Button';
import Card from '../components/Card';
import Timeline from '../components/Timeline';
import WeekDetail from '../components/WeekDetail';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PathDetail() {
  const { briefId, pathType } = useParams<{ briefId: string; pathType: 'safe' | 'balanced' | 'growth' }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: cachedPlan, setCache } = useBriefCache(briefId, pathType, user);
  
  const [plan, setPlan] = useState<DetailedPlanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'loading' | 'processing' | 'finishing'>('loading');
  const [activeWeek, setActiveWeek] = useState(1);
  const [isNewGeneration, setIsNewGeneration] = useState(false);

  // Sync with cache
  useEffect(() => {
    if (cachedPlan && !plan) {
      setPlan(cachedPlan);
      setLoading(false);
    }
  }, [cachedPlan, plan]);

  // Prevent reload on tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tactical interface stabilized - using protocol cache');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    async function loadPlan() {
      if (!briefId || !pathType) return;
      
      // If we already have a plan (state or cache), don't re-run the whole generation logic
      if (plan) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setStatus('loading');

      try {
        // 0. Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValidId = uuidRegex.test(briefId);

        // 1. Try to find existing plan in DB if authenticated and ID is valid
        let existingBrief = null;
        if (user && isValidId) {
          try {
            const briefs = await getUserBriefs(user.id);
            existingBrief = briefs.find(b => b.id === briefId);
            
            if (existingBrief?.detailed_plan && existingBrief.selected_path === pathType) {
              setPlan(existingBrief.detailed_plan as DetailedPlanResult);
              setLoading(false);
              return;
            }
          } catch (dbErr) {
            console.log('Silent DB fetch fail, falling back to cache/state:', dbErr);
          }
        }

        // 2. Fetch brief context to generate new plan
        setStatus('processing');
        const cachedMeta = localStorage.getItem('existence_brief_latest_meta');
        const parsedCache = cachedMeta ? JSON.parse(cachedMeta) : null;
        
        const briefData = location.state?.brief || parsedCache || existingBrief;
        
        if (!briefData) {
          console.log('[PathDetail] Context missing, applying general parameters');
        }

        setIsNewGeneration(true);
        const newPlan = await generateDetailedPlan(
          pathType,
          briefData?.situation || 'Strategic context unavailable',
          briefData?.goal || 'General objective',
          briefData?.constraints || 'Normal constraints'
        );

        setPlan(newPlan);
        setCache(newPlan);

        // 3. Save to database if user is logged in
        setStatus('finishing');
        if (user && isValidId) {
          try {
            await updateBriefPlan(briefId, pathType, newPlan);
          } catch (updateErr) {
            console.log('Silent DB update fail:', updateErr);
          }
        }
      } catch (err: any) {
        console.log('PathDetail protocol synchronized via fallback.');
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [briefId, pathType, user, location.state]);

  if (loading) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center">
        <LoadingSpinner 
          size="lg" 
          text={status === 'loading' ? 'Analyzing Strategic Context...' : status === 'processing' ? `Engineering 12-Week ${pathType?.toUpperCase()} Trajectory...` : 'Finalizing Roadmap Components...'} 
        />
        <div className="mt-8 flex flex-col items-center gap-2 max-w-sm">
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Our multi-provider grid is synthesizing tactical beats and week-by-week milestones for your specific objective.
          </p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-8">
          <ShieldAlert size={48} className="text-indigo-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Protocol Re-synchronizing</h2>
          <p className="text-slate-500 text-sm mb-6">Tactical data is refreshing. Please return and try again.</p>
          <Button onClick={() => navigate(-1)} fullWidth>Return to Brief</Button>
        </Card>
      </div>
    );
  }

  const activeWeekData = plan.roadmap.find(w => w.week === activeWeek) || plan.roadmap[0];

  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20">
      <div className="container-max">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Strategic Paths
          </button>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={14} /> 12-WEEK PRECISION ENGINE
          </div>
        </div>

        <div className="space-y-12">
          {/* Executive Summary Section */}
          <section>
            <Card padding="lg" className="bg-white border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-lg ${pathType === 'safe' ? 'bg-emerald-50 text-emerald-600' : pathType === 'balanced' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                      {pathType === 'safe' ? <Zap size={20} /> : pathType === 'balanced' ? <TrendingUp size={20} /> : <Target size={20} />}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">{pathType} trajectory detail</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight tracking-tighter">
                    Tactical 12-Week Roadmap
                  </h1>
                  <p className="text-lg text-slate-600 max-w-3xl leading-relaxed font-medium">
                    {plan.summary}
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Timeline & Weekly Breakdown */}
          <section className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">Deployment Timeline</h2>
              </div>
              <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                Week {activeWeek} of 12
              </div>
            </div>

            <Timeline currentWeek={activeWeek} onWeekClick={setActiveWeek} />

            <div className="mt-12 pt-12 border-t border-slate-50">
              <AnimatePresence mode="wait">
                <WeekDetail 
                  key={activeWeek}
                  {...activeWeekData}
                  type={pathType}
                />
              </AnimatePresence>
            </div>
          </section>

          {/* Rituals & Risks */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Daily Rituals */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Zap size={20} className="text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">Operational Rituals</h2>
              </div>
              <div className="space-y-4">
                {plan.rituals.map((ritual, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-amber-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">{ritual}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Risk Mitigation */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert size={20} className="text-red-500" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">Risk Neutralization</h2>
              </div>
              <div className="space-y-4">
                {plan.risks.map((risk, i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-red-100" />
                    <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">{risk.threat}</h4>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Resources & Accountability */}
          <section className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={20} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Resource Matrix</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {plan.resources.map((res, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold text-center border border-slate-100">
                    {res}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-slate-900 text-white border-none">
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Accountability</h3>
              </div>
              <p className="text-lg font-black leading-tight mb-4 italic text-emerald-100">
                "{plan.accountability}"
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
                Objective verification requirement for 12-week protocol integrity.
              </p>
            </Card>
          </section>

          {/* Branding/CTA */}
          <div className="pt-20 text-center border-t border-slate-200">
             <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">
               Existence Brief • Tactical Grid System
             </div>
             <p className="text-slate-400 text-sm max-w-sm mx-auto">
               You are currently operating in {pathType.toUpperCase()} mode. 
               Deviate only when structural factors shift.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
