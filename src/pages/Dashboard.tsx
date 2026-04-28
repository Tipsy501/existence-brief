import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, History, Clock, Zap, Ghost, ArrowRight, Activity, Calendar, AlertCircle, ShieldCheck, Crown, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUsage } from '../hooks/useUsage';
import { usePremium } from '../hooks/usePremium';
import { getUserBriefs } from '../lib/database';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import BadgeDisplay from '../components/BadgeDisplay';
import UsageBadge from '../components/UsageBadge';
import PremiumBadge from '../components/PremiumBadge';
import AdBanner from '../components/AdBanner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { isPremium, isAdmin, loading: premiumLoading } = usePremium();
  const { used, limit, isPremium: usageIsPremium, canGenerate, loading: usageLoading } = useUsage();
  
  const [dataLoading, setDataLoading] = useState(true);
  const [briefs, setBriefs] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) {
        setDataLoading(false);
        return;
      }

      try {
        const list = await getUserBriefs(user.id);
        setBriefs(list);
      } catch (err) {
        console.log('Error loading dashboard data:', err);
      } finally {
        setDataLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  if (usageLoading || dataLoading || premiumLoading) {
    return <LoadingSpinner fullPage text="Synchronizing Strategy..." />;
  }

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  
  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="container-max flex flex-col gap-8">
        
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-slate-200"
          >
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck size={20} className="shrink-0 text-indigo-400" />
              <div className="flex flex-col">
                <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Commander Protocol Active</p>
                <p className="text-[11px] text-slate-400 font-medium">Bypassing all usage limits. Strategic engine at 100% capacity.</p>
              </div>
            </div>
          </motion.div>
        )}

        {isGuest && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-indigo-600 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-200"
          >
            <div className="flex items-center gap-3 text-white">
              <Zap size={20} className="shrink-0" />
              <p className="text-sm font-bold uppercase tracking-wider">You are in Guest Mode &middot; Sign up to save your briefs forever.</p>
            </div>
            <Button size="sm" variant="secondary" to="/login" className="whitespace-nowrap">
              Create Account
            </Button>
          </motion.div>
        )}

        {!isPremium && !isGuest && !isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border ${
              !canGenerate 
                ? 'bg-amber-50 border-amber-100' 
                : 'bg-indigo-50 border-indigo-100 shadow-sm shadow-indigo-50'
            }`}
          >
            <div className={`flex items-center gap-3 ${!canGenerate ? 'text-amber-700' : 'text-indigo-700'}`}>
              <Zap size={20} className="shrink-0" />
              <p className="text-sm font-semibold">
                {!canGenerate 
                  ? "Daily limit reached. Resets in 24 hours." 
                  : "Enjoying the insights? Upgrade to Pro for lifetime access."}
              </p>
            </div>
            <Button size="sm" to="/upgrade" variant={canGenerate ? "primary" : "secondary"} className="whitespace-nowrap">
              Upgrade to Pro
            </Button>
          </motion.div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            {isPremium && <PremiumBadge className="w-fit mb-2" />}
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back{fullName ? `, ${fullName}` : user?.email ? `, ${user.email.split('@')[0]}` : isGuest ? ', Guest' : ''}
            </h1>
            <p className="text-slate-600">Your strategic dashboard is synchronized and ready.</p>
          </div>
          <Button 
            to="/brief" 
            size="md" 
            className="gap-2"
            disabled={!canGenerate && !isGuest && !isPremium}
          >
            <Plus size={20} />
            Generate New Brief
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="h-full flex flex-col justify-center" padding="md">
            <UsageBadge 
              used={used}
              limit={limit}
              isPremium={isPremium || usageIsPremium}
              isAdmin={isAdmin}
            />
          </Card>

          <Card className="h-full flex flex-col justify-center" padding="md">
            <div className="flex items-center gap-3 mb-2 text-slate-400">
              <History size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Briefs Created</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 leading-none">
              {String(briefs.length).padStart(2, '0')}
            </div>
          </Card>

          <Card className="h-full flex flex-col justify-center" padding="md">
            <div className={`flex items-center gap-3 mb-2 ${isPremium ? 'text-indigo-500' : 'text-slate-400'}`}>
              <Zap size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">
                {isPremium ? 'Pro Member' : 'Free Tier'}
              </span>
            </div>
            {!isPremium ? (
              <Link to="/upgrade" className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors flex items-center gap-1 group">
                Upgrade to Unlimited
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                 <ShieldCheck size={16} /> Lifetime Access
              </div>
            )}
          </Card>
        </div>

        <AdBanner position="dashboard-stats" />

        {/* Gamification Area */}
        <BadgeDisplay />

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <History className="text-slate-400" size={20} />
                Recent Briefs
              </h2>
            </div>

            {briefs.length === 0 ? (
              <Card className="py-20 flex flex-col items-center justify-center text-center gap-4 border-dashed border-slate-200" padding="none">
                <div className="p-8 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <Ghost size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No briefs yet</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
                      Your historical analysis record starts after your first generation.
                    </p>
                  </div>
                  <Button variant="secondary" to="/brief">
                    Create first brief
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {briefs.map((brief) => (
                  <Card 
                    key={brief.id} 
                    padding="sm" 
                    className="hover:border-indigo-100 transition-all cursor-pointer group"
                    onClick={() => navigate(`/brief/result`, { state: { result: brief.result, inputs: brief, briefId: brief.id } })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                          <Zap size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{brief.goal}</h4>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <Calendar size={10} />
                              {new Date(brief.created_at).toLocaleDateString()}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                              {brief.result.recommendedPath} path
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <AdBanner position="sidebar" className="hidden lg:block my-0" />
            
            {isPremium && (
              <Card className="bg-slate-900 border-none relative overflow-hidden group p-6">
                <div className="absolute top-0 right-0 p-4 text-amber-500 opacity-10 group-hover:scale-110 transition-transform">
                  <Crown size={80} />
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4">Precision Support</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                  Direct strategic advisory line. Priority response for all "Commander" protocol users.
                </p>
                <a 
                  href="mailto:topogabolekwe@gmail.com?subject=Strategic Support Request" 
                  className="inline-flex items-center gap-2 text-amber-500 text-xs font-bold hover:gap-3 transition-all"
                >
                  Contact Admin <ArrowRight size={14} />
                </a>
              </Card>
            )}

            <Card className="bg-indigo-600 border-none p-6 text-white relative overflow-hidden">
               <div className="absolute -bottom-4 -right-4 opacity-10">
                  <Users size={120} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-widest mb-2">Expansion Bonus</h3>
               <p className="text-[11px] text-indigo-100 font-medium mb-4 leading-relaxed">
                 Invite a peer to the strategic grid using your referral link and unlock 3 free analysis briefs.
               </p>
               <Button 
                size="sm" 
                variant="secondary" 
                className="w-full text-[10px] font-black"
                onClick={() => {
                   const refCode = briefs[0]?.profiles?.referral_code || '';
                   const url = `${window.location.origin}?ref=${refCode}`;
                   navigator.clipboard.writeText(url);
                }}
               >
                 Copy Referral Link
               </Button>
            </Card>

            <h2 className="text-xl font-bold text-slate-900">Optimization Tips</h2>
            <div className="space-y-4">
              {[
                { title: "Describe the 'Why'", desc: "Strategic bottlenecks are often emotional or psychological. Be honest about your friction." },
                { title: "Quantitative Goals", desc: "A vague goal leads to a vague roadmap. If you can measure it, the AI can plan it better." },
                { title: "Identify Trade-offs", desc: "Every path has a cost. Being clear about what you WON'T do helps sharpen the strategy." }
              ].map((tip, i) => (
                <Card key={i} className="border-indigo-50" padding="sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{tip.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{tip.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
