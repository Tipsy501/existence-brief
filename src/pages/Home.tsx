import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Target, Brain, ArrowUpRight, CheckCircle2, Star, Users, ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import AdBanner from '../components/AdBanner';
import NewsletterSignup from '../components/NewsletterSignup';
import { getFeaturedTestimonials, getGlobalStats } from '../lib/database';
import { getVariant } from '../lib/ab-test';

export default function Home() {
  const heroHeadline = getVariant('hero_headline');
  const ctaLabel = getVariant('cta_label');
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
              {heroHeadline}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Answer 3 simple questions. Get your personalized life plan in 60 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Button to="/brief" size="lg" className="px-10">
                {ctaLabel}
                <ChevronRight size={20} className="ml-2" />
              </Button>
              <Button to="/brief" variant="secondary" size="lg" className="px-10">
                Get My Brief
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <div className="container-max">
        <AdBanner position="hero" />
      </div>

      {/* Social Proof / Risk Reversal */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Join 500+ people who found their path</h2>
            <p className="text-slate-500 font-medium">Free forever tier — no credit card. $29 one-time for unlimited — never pay again. 30-day money-back guarantee.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8">
              <Quote className="text-indigo-200 mb-4" size={32} />
              <p className="text-slate-600 italic mb-6 leading-relaxed">
                "I was stuck in my job. Existence Brief gave me a clear 90-day plan."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">S</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Sarah</div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Marketing → Product</div>
                </div>
              </div>
            </Card>
            <Card className="p-8">
              <Quote className="text-indigo-200 mb-4" size={32} />
              <p className="text-slate-600 italic mb-6 leading-relaxed">
                "Finally stopped overthinking and started doing."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">M</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Mike</div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Teacher → Developer</div>
                </div>
              </div>
            </Card>
            <Card className="p-8">
              <Quote className="text-indigo-200 mb-4" size={32} />
              <p className="text-slate-600 italic mb-6 leading-relaxed">
                "The only tool that actually tells me how to reach my goal, step by step."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">A</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Alex</div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Growth Strategist</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-24 bg-slate-50">
        <div className="container-max grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Most apps give you motivation. <span className="text-indigo-600">We give you a plan.</span></h2>
            <div className="space-y-6">
              {[
                { title: "Motivation alone fails.", desc: "Most tools tell you 'you can do it.' We tell you exactly how." },
                { title: "Concrete Roadmaps", desc: "3 paths. 12 weeks. Daily steps. Real resources." },
                { title: "Risk Reversal", desc: "No credit card needed to start. One-time payment for lifetime access." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative z-10 overflow-hidden">
                <h3 className="text-2xl font-bold mb-4 italic">"Stop guessing. Start executing."</h3>
                <p className="text-indigo-100 leading-relaxed mb-8">
                  Every day you wait, you're losing time you can't get back, opportunities passing by, and the life you actually want.
                </p>
                <Button to="/brief" variant="secondary" fullWidth className="bg-white text-indigo-600 hover:bg-indigo-50 border-none py-6 text-sm font-black tracking-widest">
                  START MY FREE BRIEF
                </Button>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-100/50 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* Get Your 90-Day Action Plan */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container-max text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i+60}/32/32`} referrerPolicy="no-referrer" alt="User" />
                  </div>
                ))}
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
               Joined by 500+ people using this career change tool
             </p>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Get Your 90-Day Action Plan</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">Use our life planner and action plan generator to see your options and start executing today. Answer 3 questions. Get 3 strategic paths. Free AI-powered life planning tool.</p>
        </div>
        
        <div className="container-max grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ArrowUpRight className="text-indigo-600" size={24} />,
              title: "Tell us where you are",
              desc: "Share your situation and constraints. Our strategic planning tool handles the complexity and outputs a personal roadmap."
            },
            {
              icon: <Brain className="text-indigo-600" size={24} />,
              title: "See your options",
              desc: "Our goal setting app identifies 3 distinct paths tailored to your specific 90-day goal."
            },
            {
              icon: <CheckCircle2 className="text-emerald-500" size={24} />,
              title: "Get your plan",
              desc: "Receive a week-by-week action plan with daily tasks and curated resources to help you change careers."
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

      <div className="container-max">
        <AdBanner position="content" />
      </div>

      {/* Founder Story */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container-max">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="w-48 h-48 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 grayscale hover:grayscale-0 transition-all duration-500 shadow-xl border border-slate-200">
               <Users size={64} className="text-slate-300" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Founder Story</div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Built by TopZero Group</h2>
              <p className="text-slate-600 leading-relaxed font-medium mb-6">
                Built by TopZero Group after 10 years of strategy consulting for Fortune 500 companies. We took the frameworks used by executives and made them accessible to everyone.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm font-bold text-slate-900">Topo Gabolekwe</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Founder, TopZero Group</div>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <a href="mailto:topogabolekwe@gmail.com" className="text-xs font-bold text-indigo-600 hover:underline">topogabolekwe@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="container-max max-w-3xl">
          <h2 className="text-3xl font-black text-slate-900 mb-12 text-center tracking-tight uppercase">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {[
              { q: "Is this really free?", a: "Yes, 3 briefs per day forever. Upgrade only if you want unlimited." },
              { q: "Who is this for?", a: "Anyone at a crossroads — career changers, entrepreneurs, graduates, retirees." },
              { q: "How is this different from ChatGPT?", a: "We don't give generic advice. We give you 3 specific paths with 12-week execution plans and real resources." },
              { q: "What if I don't like my plan?", a: "Generate a new one. Iterate until it clicks." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3 text-lg flex items-start gap-3">
                  <span className="text-indigo-600 shrink-0">Q.</span> {faq.q}
                </h4>
                <p className="text-slate-500 leading-relaxed pl-8 font-medium italic border-l-2 border-slate-100">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="container-max text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">Your future self is waiting.</h2>
          <Button to="/brief" size="lg" className="px-12 py-8 text-xl font-black rounded-3xl shadow-2xl shadow-indigo-200 uppercase tracking-widest gap-4">
             {ctaLabel}
             <ArrowRight size={24} />
          </Button>
          <p className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-widest">No Signup Required to Start</p>
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
