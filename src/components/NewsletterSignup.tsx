import React, { useState } from 'react';
import { Mail, Check, Send } from 'lucide-react';
import { subscribeToNewsletter } from '../lib/newsletter';
import Button from './Button';
import Card from './Card';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);
    setWarning(null);
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        if (result.warning) {
          setWarning(result.warning);
        }
        setIsSuccess(true);
      } else {
        setError(result.error || 'Could not save your email. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="bg-slate-900 border-none p-8 text-center" padding="none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <Check size={24} />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-widest">
            {warning ? 'Almost there' : 'Check your inbox'}
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            {warning ? warning : 'Please click the link in your email to confirm your subscription.'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-none relative overflow-hidden" padding="lg">
      <div className="absolute top-0 right-0 p-8 text-indigo-500/10 -rotate-12">
        <Send size={120} />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-white font-black text-xl mb-2">Weekly Life Plans</h3>
        <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed max-w-sm">
          Join 1,200+ people getting one simple life planning tip every Monday. No spam. Just clarity.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <Button type="submit" loading={isSubmitting} fullWidth className="gap-2">
            Get My Weekly Tip
          </Button>
          {error && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest text-center mt-2">{error}</p>}
        </form>
      </div>
    </Card>
  );
}
