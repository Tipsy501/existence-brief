import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Target, Brain, ArrowUpRight, CheckCircle2, Star, Users, ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import AdBanner from '../components/AdBanner';
import NewsletterSignup from '../components/NewsletterSignup';
import { getFeaturedTestimonials, getGlobalStats } from '../lib/database';

export default function Home() {
  const [stats, setStats] = useState({ briefsCount: 500 });
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    async function loadData() {
      const s = await getGlobalStats();
      const t = await getFeaturedTestimonials();
      setStats(s);
      
      // Fallback testimonials if none in DB
      if (t.length === 0) {
        setTestimonials([
          { text: "Existence Brief turned my 6 months of procrastination into a 72-hour execution blitz. Strategic clarity is a superpower.", user_name: "Marcus K., Product Lead" },
          { text: "The growth trajectory identified opportunities I hadn't even considered. It's like having a high-tier consultant on demand.", user_name: "Sarah L., Founder" },
          { text: "Minimalist, precise, and effective. The only AI tool that actually helps me make decisions instead of just generating text.", user_name: "David R., Strategist" }
        ]);
      } else {
        setTestimonials(t);
      }
    }
    loadData();
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-60" />
          <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-emerald-50 rounded-full blur-[100px] opacity-40" />
        </div>

        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-8">
              <Star size={12} className="fill-indigo-700" />
              Strategic Clarity on Demand
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
              AI-powered clarity for <br className="hidden md:block" />
              your life's <span className="text-indigo-600">biggest decisions.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Built for those who refuse to leave their future to chance. Describe your situation and receive 
              a precision-engineered brief with an actionable path forward.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Button to="/pricing" size="lg" className="px-10">
                Start your free brief
                <ChevronRight size={20} className="ml-2" />
              </Button>
              <Button to="/pricing" variant="secondary" size="lg" className="px-10">
                View pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="container-max">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Precision Analysis Engine</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            <div className="font-bold text-xl text-slate-900">FORBES</div>
            <div className="font-bold text-xl text-slate-900">VERGE</div>
            <div className="font-bold text-xl text-slate-900">WIRED</div>
            <div className="font-bold text-xl text-slate-900">VOX</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container-max text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i+40}/32/32`} referrerPolicy="no-referrer" alt="User" />
                  </div>
                ))}
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
               Joined by {stats.briefsCount}+ strategists
             </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">The Strategic Framework</h2>
          <p className="text-slate-600 max-w-xl mx-auto">AI-powered distillation of complexity into high-impact action trajectories.</p>
        </div>
        
        <div className="container-max grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ArrowUpRight className="text-indigo-600" size={24} />,
              title: "Rapid Input",
              desc: "Quickly dump your current situation, goals, and constraints into our minimal interface."
            },
            {
              icon: <Brain className="text-indigo-600" size={24} />,
              title: "Pattern Recognition",
              desc: "AI identifies non-obvious bottlenecks and identifies asymmetric opportunities."
            },
            {
              icon: <CheckCircle2 className="text-emerald-500" size={24} />,
              title: "Clear Roadscape",
              desc: "Receive exactly three high-impact steps to execute in the next 72 hours."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="flex flex-col items-center text-center group h-full">
                <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[150px]" />
        </div>

        <div className="container-max relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Voices from the Grid</div>
              <div className="flex gap-4">
                <button onClick={prevTestimonial} className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <button onClick={nextTestimonial} className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-[200px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <Quote size={48} className="text-indigo-500/30" />
                  <p className="text-2xl md:text-4xl font-light italic leading-relaxed">
                    "{testimonials[activeTestimonial]?.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                      {testimonials[activeTestimonial]?.user_name?.charAt(0)}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
                      {testimonials[activeTestimonial]?.user_name}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-20 bg-white">
        <div className="container-max grid md:grid-cols-4 gap-8">
          {[
            { label: "Briefs Generated", value: stats.briefsCount + "+" },
            { label: "Hours Saved", value: "12,000+" },
            { label: "Success Rate", value: "98%" },
             { label: "Strategic Precision", value: "∞" }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-slate-50">
        <div className="container-max grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase">Master the <br />Frequency</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Join 1,200+ elite strategists who receive our weekly "Clarity Signal." Pure tactical advice, zero conversational filler.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
