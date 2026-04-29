import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  Bookmark, 
  Download, 
  Share2, 
  Target, 
  LayoutGrid, 
  Zap,
  Quote,
  FileDown
} from 'lucide-react';
import { useBrief } from '../hooks/useBrief';
import { useAuth } from '../hooks/useAuth';
import { usePremium } from '../hooks/usePremium';
import { saveBrief } from '../lib/database';
import Card from '../components/Card';
import PathCard from '../components/PathCard';
import ActionPlan from '../components/ActionPlan';
import Button from '../components/Button';
import ShareBrief from '../components/ShareBrief';
import AdBanner from '../components/AdBanner';
import SocialShare from '../components/SocialShare';
import PDFExport from '../components/PDFExport';
import FeedbackModal from '../components/FeedbackModal';

const FEEDBACK_KEY = 'existence_feedback_submitted';
const FEEDBACK_SHOWN_KEY = 'existence_feedback_shown';

export default function BriefResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { result: rawResult } = useBrief();
  const { user } = useAuth();
  const { isPremium } = usePremium();
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(!!location.state?.briefId);
  const [briefId, setBriefId] = useState<string | null>(location.state?.briefId || null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Prefer result from location state, fallback to hook (localStorage)
  const result = location.state?.result || rawResult;
  const inputs = location.state?.inputs;

  useEffect(() => {
    // Only show feedback after successful brief generation if not submitted and not shown
    const hasSubmitted = localStorage.getItem(FEEDBACK_KEY);
    const hasBeenShown = localStorage.getItem(FEEDBACK_SHOWN_KEY);
    
    if (result && !hasSubmitted && !hasBeenShown) {
      // Delay 10 seconds after page load
      const timer = setTimeout(() => {
        setShowFeedback(true);
        localStorage.setItem(FEEDBACK_SHOWN_KEY, 'true');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => {
    if (!result) {
      navigate('/brief', { replace: true });
    }
  }, [result, navigate]);

  const handleDownloadPDF = () => {
    if (!result) return;
    
    const content = `
EXISTENCE BRIEF: STRATEGIC ROADMAP
Generated on: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
${result.summary}

RECOMMENDED PATH: ${result.recommendedPath.toUpperCase()}

NORTH STAR FOCUS
"${result.focusStatement}"

30-60-90 DAY ACTION PLAN
Day 30: ${result.actionPlan.day30.join(', ')}
Day 60: ${result.actionPlan.day60.join(', ')}
Day 90: ${result.actionPlan.day90.join(', ')}

-----------------------------------------
CONFIDENTIAL ANALYSIS - EXISTENCE BRIEF
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `existence-brief-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!user || !result || !inputs) return;
    if (saveSuccess && briefId) return; // Already saved
    
    setIsSaving(true);
    try {
      const saved = await saveBrief(user.id, result, inputs);
      setBriefId(saved.id);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.log('Error saving brief:', err);
      // Silent error handling - use ErrorBoundary if UI crashes, otherwise log and continue
    } finally {
      setIsSaving(false);
    }
  };

  if (!result) return null;

  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20">
      <div className="container-max">
        {/* Navigation & Actions */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => {
              const el = document.getElementById('share-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <Share2 size={16} /> Share
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleDownloadPDF}>
              <Download size={16} /> Export
            </Button>
          </div>
        </div>

        <div className="space-y-12">
          {/* Summary Section */}
          <section>
            <Card padding="lg" className="bg-gradient-to-br from-white to-slate-50 border-none shadow-xl shadow-slate-200/50">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <Zap size={18} />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">The Bottom Line</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                    Your 3 Paths
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                    {result.summary}
                  </p>
                </div>
                
                <div className="w-full md:w-72 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Target size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Approach</span>
                  <div className="text-xl font-bold text-slate-900 capitalize mb-1">{result.recommendedPath} Path</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    {result.recommendedPath === 'safe' ? '6-12 Months' : result.recommendedPath === 'balanced' ? '3-6 Months' : '30-90 Days'}
                  </div>
                  <Button size="sm" fullWidth onClick={() => {
                    const el = document.getElementById('action-plan');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    View Steps
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* Strategic Paths */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <LayoutGrid size={20} className="text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest text-sm">Your 3 Paths</h2>
              </div>
              <span className="hidden md:block text-[10px] font-bold text-indigo-500 uppercase tracking-widest animate-pulse">
                Click any path to view your detailed plan
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <PathCard 
                type="safe"
                {...result.paths.safe}
                isRecommended={result.recommendedPath === 'safe'}
                onClick={() => navigate(`/brief/${briefId || 'last'}/path/safe`, { state: { brief: { ...inputs, ...result, id: briefId } } })}
              />
              <PathCard 
                type="balanced"
                {...result.paths.balanced}
                isRecommended={result.recommendedPath === 'balanced'}
                onClick={() => navigate(`/brief/${briefId || 'last'}/path/balanced`, { state: { brief: { ...inputs, ...result, id: briefId } } })}
              />
              <PathCard 
                type="growth"
                {...result.paths.growth}
                isRecommended={result.recommendedPath === 'growth'}
                onClick={() => navigate(`/brief/${briefId || 'last'}/path/growth`, { state: { brief: { ...inputs, ...result, id: briefId } } })}
              />
            </div>

            <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center">
              <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                <span className="font-bold uppercase tracking-wider text-[10px] mr-2 text-indigo-500">Comparative Insight:</span>
                {result.comparison}
              </p>
              <p className="mt-2 block md:hidden text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                Tap any trajectory above for your detailed execution plan.
              </p>
            </div>
          </section>

          {/* Action Plan */}
          <section id="action-plan" className="pt-8">
            <div className="flex items-center gap-3 mb-8">
              <Target size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest text-sm">Execution Roadmap</h2>
            </div>
            
            <ActionPlan plan={result.actionPlan} />

            <AdBanner position="result-action-plan" size="medium-rectangle" />
          </section>

          {/* Your Mantra */}
          <section className="py-12">
            <div className="max-w-2xl mx-auto text-center relative px-6">
              <Quote size={64} className="absolute -top-6 -left-4 text-indigo-50 opacity-50 -z-10" />
              <Quote size={64} className="absolute -bottom-6 -right-4 text-indigo-50 opacity-50 rotate-180 -z-10" />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-8">
                Your Mantra
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight italic">
                "{result.focusStatement}"
              </h3>
            </div>
          </section>

          {/* Share Section */}
          <section id="share-section">
            <ShareBrief brief={{ ...result, id: briefId, inputs }} onUpdate={() => {/* Optional: refresh info if needed */}} />
          </section>

          {/* Premium PDF Export */}
          <section className="py-8 bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest mb-4">
                  Professional Archiving
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Generate Professional Brief</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Export your strategic clarity roadmap as a high-depth, 5-page PDF report. Perfect for sharing with execution teams or archiving your tactical history.
                </p>
              </div>
              <div className="shrink-0">
                <PDFExport 
                  briefData={result} 
                  userName={user?.email?.split('@')[0] || 'Strategist'}
                  isPremium={isPremium}
                />
              </div>
            </div>
          </section>

          {/* Final Actions */}
          <section className="pt-12 border-t border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-center">
            <Button variant="secondary" size="lg" className="px-10 gap-2" onClick={() => navigate('/brief')}>
              <RotateCcw size={18} /> Start New Analysis
            </Button>
            {user ? (
               <Button 
                size="lg" 
                className="px-10 gap-2" 
                onClick={handleSave} 
                loading={isSaving}
                disabled={saveSuccess}
              >
                {saveSuccess ? (
                  <> <Bookmark size={18} className="fill-current" /> Saved to History </>
                ) : (
                  <> <Bookmark size={18} /> Save to My Briefs </>
                )}
              </Button>
            ) : (
              <Button size="lg" className="px-10 gap-2" to="/login">
                <Bookmark size={18} /> Sign in to Save
              </Button>
            )}
          </section>
        </div>
      </div>
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  );
}
