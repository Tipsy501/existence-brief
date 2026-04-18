import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowUpRight, 
  Brain, 
  CheckCircle2, 
  Shield, 
  Target, 
  ChevronRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function HowItWorks() {
  const steps = [
    {
      icon: <ArrowUpRight className="text-indigo-600" size={32} />,
      title: "Context Injection",
      desc: "Provide the raw details of your current situation. Our engine consumes complexity and identifies the hidden noise.",
      details: [
        "Current bottleneck assessment",
        "Asset and resource mapping",
        "Goal parameter definition"
      ]
    },
    {
      icon: <Brain className="text-indigo-600" size={32} />,
      title: "Logic Synthesis",
      desc: "AI-driven pattern recognition maps your context against verified strategic frameworks to identify asymmetric paths.",
      details: [
        "Risk-reward ratio analysis",
        "High-leverage action identifying",
        "Constraint-based filtering"
      ]
    },
    {
      icon: <CheckCircle2 className="text-emerald-500" size={32} />,
      title: "Clarity Output",
      desc: "Receive a precision-engineered roadmap with exactly three high-impact trajectories: Safe, Balanced, and Growth.",
      details: [
        "30-60-90 day execution roadmap",
        "Probabilistic outcome forecasting",
        "North Star focus statement"
      ]
    }
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 transform origin-top translate-x-1/4 -z-10" />
        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              The Framework
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8">
              HOW PRECISION <br />
              <span className="text-indigo-600">INTENT</span> WORKS.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Existence Brief is not a generic advice engine. It is a strategic 
              operating system designed to turn high-entropy situations into 
              structured roadmaps through advanced pattern recognition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The 3 Steps */}
      <section className="py-24 bg-slate-50/30">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <Card className="h-full border-none shadow-xl shadow-slate-200/50 p-10 flex flex-col group hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                    {step.icon}
                  </div>
                  <div className="text-slate-300 text-4xl font-black mb-4 opacity-50">0{idx + 1}</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed italic">
                    "{step.desc}"
                  </p>
                  
                  <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-4">
                    {step.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-3 text-sm font-bold text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scientific Validation */}
      <section className="py-24">
        <div className="container-max">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10">
              <Zap size={400} />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-10 leading-none">THE ASYMMETRIC <br /> ADVANTAGE.</h2>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Target className="text-indigo-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-2">PROBABILISTIC ACCURACY</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Our models calculate outcomes based on relevant data points pertaining to your industry and life stage.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Shield className="text-indigo-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-2">ZERO VULNERABILITY</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Your strategic data is processed and anonymized instantly. We prioritize your privacy as much as your success.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="text-emerald-400" size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-2">SYNTHETIC INTELLIGENCE</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Combining the best of DeepSeek and Gemini models to provide a unified, conflict-free strategic brief.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-indigo-400 mb-2 uppercase">AI-Powered</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Analysis Engine</div>
                 </div>
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                    <div className="text-4xl font-black text-emerald-400 mb-2">3</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Strategic Paths</div>
                 </div>
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-white mb-2 uppercase">Privacy</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">First Architecture</div>
                 </div>
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-indigo-400 mb-2 uppercase">Actionable</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Roadmap Strategy</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-slate-100">
        <div className="container-max text-center">
          <BarChart3 className="mx-auto text-indigo-600 mb-8" size={32} />
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">READY TO ALIGN?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button to="/brief" size="lg" className="px-12 h-16 text-lg">
              Start Your Free Brief
              <ChevronRight size={24} />
            </Button>
            <Button to="/pricing" variant="secondary" size="lg" className="px-12 h-16 text-lg">
              View Premium Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
