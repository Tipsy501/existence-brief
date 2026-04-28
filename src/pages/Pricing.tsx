import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, ShieldCheck, Heart, HelpCircle, Layout, Crown, Lock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Pricing() {
  return (
    <div className="flex-1 bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container-max max-w-5xl text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Choose the plan that fits your strategic needs. 
              Engineering clarity for high-performers, at every scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="pb-24">
        <div className="container-max max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex"
            >
              <Card 
                className="w-full h-full flex flex-col p-8 md:p-10 border-slate-200 shadow-sm"
                padding="none"
              >
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    Free Forever
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-black text-slate-900">$0</span>
                    <span className="text-slate-500 font-bold text-sm">/month</span>
                  </div>
                  <p className="text-slate-600 font-medium">Get started with basic strategic clarity.</p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {[
                    "3 Selective Briefs per Day",
                    "Standard 3-Path Analysis",
                    "5 Saved Briefs Record",
                    "Community Network Support"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center shrink-0 border border-slate-100">
                        <Check size={12} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <Button to="/login" variant="secondary" fullWidth className="py-4 font-bold uppercase tracking-widest text-xs">
                  Get Started
                </Button>
              </Card>
            </motion.div>

            {/* Premium Tier Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex"
            >
              <Card 
                className="w-full h-full flex flex-col p-8 md:p-10 border-indigo-200 bg-indigo-50/50 shadow-md relative overflow-hidden"
                padding="none"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 blur-3xl -mr-16 -mt-16 rounded-full"></div>
                
                <div className="relative z-10 mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Crown size={12} className="fill-indigo-700" />
                    Lifetime Access
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-black text-slate-900">$29</span>
                    <span className="text-slate-500 font-bold text-sm italic">one-time</span>
                  </div>
                  <p className="text-slate-600 font-medium">The definitive operating system for high-impact decision making.</p>
                </div>

                <div className="relative z-10 space-y-4 mb-10 flex-1">
                  {[
                    "Make as many plans as you want",
                    "All your plans saved securely",
                    "Download your plan as PDF",
                    "Email us anytime",
                    "Get new features first"
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-900 transition-transform group">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
                        <Check size={12} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="relative z-10 space-y-4">
                  <Button to="/upgrade" fullWidth className="py-5 font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-200">
                    UNLOCK LIFETIME ACCESS
                  </Button>
                  
                  <div className="flex items-center justify-center gap-6 pt-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                       <ShieldCheck size={12} className="text-emerald-500" /> SECURE PAYMENT
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                       <Zap size={12} className="text-amber-500 fill-amber-500" /> INSTANT ACCESS
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container-max max-w-4xl mx-auto px-4">
          <Card className="p-10 md:p-14 border-slate-200 shadow-sm">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 text-indigo-600">
                <HelpCircle size={24} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Frequently Asked Questions</h2>
              <p className="text-slate-500 font-medium mt-2">Everything you need to know about the strategic engine.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { 
                  q: "Lifetime actually means lifetime?", 
                  a: "Yes. Pay once, use it forever. You get all future updates and features for free." 
                },
                { 
                  q: "Is there a money-back guarantee?", 
                  a: "Absolutely. If you don't find value in your first 30 days, email us at topogabolekwe@gmail.com and we'll refund you. No questions asked." 
                },
                { 
                  q: "How many briefs can I make?", 
                  a: "The free tier allows 3 briefs per day. Premium users get unlimited access — generate as many plans as you need to find the right path." 
                },
                { 
                  q: "Who is this for?", 
                  a: "Anyone at a crossroads — whether you're looking to change careers, start a business, or just get more organized with your goals." 
                }
              ].map((faq, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-tight">
                    <span className="text-indigo-600">Q.</span> {faq.q}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium pl-6 border-l-2 border-slate-100">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
