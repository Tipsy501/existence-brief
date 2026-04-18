import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Target, Zap, LayoutGrid, Quote, ArrowRight, ShieldCheck } from 'lucide-react';
import { getPublicBrief } from '../lib/database';
import Card from '../components/Card';
import PathCard from '../components/PathCard';
import ActionPlan from '../components/ActionPlan';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PublicBrief() {
  const { briefId } = useParams();
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicBrief() {
      if (!briefId) return;
      const data = await getPublicBrief(briefId);
      setBrief(data);
      setLoading(false);
    }
    loadPublicBrief();
  }, [briefId]);

  if (loading) return <LoadingSpinner fullPage text="Decrypting Declassified Roadmap..." />;

  if (!brief) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 max-w-xs mx-auto mb-8">
          This brief is either private or does not exist in our strategic grid.
        </p>
        <Button to="/">Return to Control Center</Button>
      </div>
    );
  }

  const result = brief.result;
  const anonymizedName = brief.profiles?.full_name ? `${brief.profiles.full_name.split(' ')[0]}'s` : "A Strategist's";

  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20">
      <div className="container-max">
        {/* Header Hero */}
        <section className="mb-12">
          <div className="flex flex-col items-center text-center gap-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-indigo-200">
              Declassified Strategic Roadmap
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none max-w-3xl">
              {anonymizedName} Path to Strategic Clarity
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              This trajectory was synthesized via Existence Brief's proprietary intelligence grid to solve for a specific set of constraints and goals.
            </p>
          </div>

          <Card padding="lg" className="bg-white border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Objective</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 italic">
                  "{brief.goal}"
                </h2>
                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium p-3 bg-slate-50 rounded-xl">
                    <Zap size={16} className="text-amber-500" />
                    <span>Recommended Path: <strong className="capitalize">{result.recommendedPath}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium p-3 bg-slate-50 rounded-xl">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Clarity Score: High Precision</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-900 rounded-3xl text-white">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Executive Summary</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                  {result.summary}
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Strategic Trajectories */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <LayoutGrid size={22} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-[0.2em] text-sm">Trajectories Analyzed</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 opacity-75 grayscale hover:grayscale-0 transition-all">
            <PathCard type="safe" {...result.paths.safe} isRecommended={result.recommendedPath === 'safe'} />
            <PathCard type="balanced" {...result.paths.balanced} isRecommended={result.recommendedPath === 'balanced'} />
            <PathCard type="growth" {...result.paths.growth} isRecommended={result.recommendedPath === 'growth'} />
          </div>
          <div className="mt-8 text-center bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
             <p className="text-sm text-indigo-900 font-medium"> Detailed weekly execution plans are restricted to the owner of this brief. </p>
          </div>
        </section>

        {/* Action Plan */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={22} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-[0.2em] text-sm">Synthesized Execution</h2>
          </div>
          <ActionPlan plan={result.actionPlan} />
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-indigo-200">
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Need your own Strategic Roadmap?</h2>
          <p className="text-indigo-100 mb-10 max-w-xl mx-auto font-medium text-lg">
            Stop guessing your trajectory. Let Existence Brief synthesize your constraints and goals into an actionable 90-day execution plan.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" to="/brief" className="px-10 gap-2">
              Generate My Brief <ArrowRight size={18} />
            </Button>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Takes less than 3 minutes.</p>
          </div>
        </section>

        {/* North Star */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto text-center relative">
            <Quote size={64} className="absolute -top-10 -left-6 text-indigo-50 opacity-50 -z-10" />
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight italic">
              "{result.focusStatement}"
            </h3>
            <div className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em]">North Star focus</div>
          </div>
        </section>
      </div>
    </div>
  );
}
