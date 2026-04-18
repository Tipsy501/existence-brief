import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Heart, ArrowLeft, Star, Crown, ChevronRight, Check, ArrowRight, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePremium } from '../hooks/usePremium';
import Button from '../components/Button';
import Card from '../components/Card';
import PayPalButton from '../components/PayPalButton';

export default function Upgrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, upgrade } = usePremium();
  const [isProcessing, setIsProcessing] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);

  const handleSuccess = async (orderId: string) => {
    setIsProcessing(true);
    try {
      await upgrade(orderId);
      setUpgradeComplete(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.log('Payment processing logic deviation:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPremium || upgradeComplete) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6"
        >
          <Crown size={40} />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to the Inner Circle</h1>
        <p className="text-slate-500 max-w-sm mb-8">
          Your strategic capabilities are now unlimited. Redirecting you to your enhanced dashboard...
        </p>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-100 min-h-screen">
      <div className="container-max py-12 md:py-24">
        <button 
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Value Prop */}
          <div className="space-y-12">
            <header>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <Crown size={12} className="fill-amber-500" /> Exclusive Early-Beta Access
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[0.9] tracking-tighter mb-8">
                The Definitive <br />
                <span className="text-amber-500">Operating</span> System.
              </h1>
              <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                Strategic clarity shouldn't have a quota. Unlock the full depth of the Existence Brief engine with a single investment in your future.
              </p>
            </header>

            <div className="space-y-6">
              {[
                { 
                  title: "Unlimited Iteration", 
                  desc: "Generate high-depth briefs as your situation requires. Zero daily resets or limits.",
                  icon: <Zap size={20} /> 
                },
                { 
                  title: "Priority Intelligence", 
                  desc: "Access the most advanced strategic models with zero latency and priority queue.",
                  icon: <BarChart3 size={20} /> 
                },
                { 
                  title: "Private Strategy Vault", 
                  desc: "Save every analysis session to your encrypted cloud briefcase forever.",
                  icon: <ShieldCheck size={20} /> 
                }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-amber-500 group-hover:border-amber-500/50 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">{feature.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-slate-800">
               <div className="flex items-center gap-4 text-slate-500">
                 <img src="https://picsum.photos/seed/trust-dark/100/40?grayscale" alt="Trust" className="h-8 opacity-30 invert" referrerPolicy="no-referrer" />
                 <p className="text-[10px] uppercase font-bold tracking-widest leading-none">
                   30-Day Money Back Guarantee <br />
                   <span className="font-medium opacity-60 normal-case">No questions asked clarity assurance.</span>
                 </p>
               </div>
            </div>
          </div>

          {/* Right Side: Pricing Card */}
          <div className="lg:sticky lg:top-32">
            <Card className="p-0 overflow-hidden shadow-[0_0_50px_-12px_rgba(245,158,11,0.15)] border-slate-800 bg-slate-900" padding="none">
              <div className="p-10 md:p-12">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500/60 mb-2 italic">Lifetime Access</h3>
                    <div className="flex items-baseline gap-1 text-white">
                      <span className="text-5xl font-bold">$29</span>
                      <span className="text-slate-500 line-through text-lg font-medium">$99</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center rotate-6 border border-amber-500/20">
                    <Crown size={28} />
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {[
                    "Unlimited High-Depth Briefs",
                    "Priority Execution Intelligence",
                    "Private Strategy Vault",
                    "White-label PDF Archive",
                    "Precision Strategy Support",
                    "Exclusive Early-Beta Access"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                        <Check size={12} />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                {!user ? (
                  <Button 
                    fullWidth 
                    size="lg" 
                    to="/login"
                    className="py-5 text-sm uppercase tracking-[0.2em] font-black bg-amber-500 hover:bg-amber-600 text-slate-900 border-none shadow-[0_4px_20px_-4px_rgba(245,158,11,0.5)] flex items-center justify-center"
                  >
                    Sign in to Upgrade
                  </Button>
                ) : (
                  <div className="space-y-8">
                    <PayPalButton 
                      onSuccess={handleSuccess}
                      onError={() => {}} 
                    />
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-800"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                        <span className="bg-slate-900 px-4 text-slate-600 italic">Secure Payment Terminal</span>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Secondary strategic manual secure link:
                      </p>
                      <a 
                        href="https://www.paypal.com/paypalme/topogabolekwe/29" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl group hover:border-amber-500/50 transition-all font-bold text-white hover:text-amber-500"
                      >
                        <span className="text-xs">paypal.me/topogabolekwe/29</span>
                        <ArrowRight size={16} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <div className="flex items-start gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                        <ShieldCheck size={14} className="shrink-0 text-amber-500" />
                        <span>MVP Protocol: Manual verification via receipt email to <span className="text-white">topogabolekwe@gmail.com</span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-amber-500 p-4 text-slate-900 text-center font-black uppercase tracking-[0.2em] text-[10px]">
                Confirm Your Upgrade to Premium Status
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
