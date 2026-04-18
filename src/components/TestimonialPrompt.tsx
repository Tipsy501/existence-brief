import React, { useState, useEffect } from 'react';
import { Star, Check, Quote, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { submitTestimonial, getProfile } from '../lib/database';
import Card from './Card';
import Button from './Button';

export default function TestimonialPrompt() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isAllowFeatured, setIsAllowFeatured] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function checkEligibility() {
      if (!user) return;
      
      const profile = await getProfile(user.id);
      if (!profile) return;

      // Check if user has been around for 7 days (mocked as simple check)
      const createdDate = new Date(profile.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const hasTestimonial = localStorage.getItem(`testimonial_submitted_${user.id}`);
      
      if (createdDate <= sevenDaysAgo && !hasTestimonial) {
        setIsVisible(true);
      }
    }
    checkEligibility();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    setIsSubmitting(true);
    try {
      await submitTestimonial(user.id, rating, feedback, isAllowFeatured);
      localStorage.setItem(`testimonial_submitted_${user.id}`, 'true');
      setIsSuccess(true);
      setTimeout(() => setIsVisible(false), 3000);
    } catch (err) {
      console.log('Testimonial protocol deviation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-8 right-8 z-50 w-full max-w-sm shadow-2xl border-indigo-100 overflow-hidden animate-in slide-in-from-bottom-10" padding="none">
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Quote size={16} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategic Feedback Protocol</span>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-6">
        {isSuccess ? (
          <div className="text-center py-4 flex flex-col items-center gap-3">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <Check size={24} />
             </div>
             <p className="text-sm font-bold text-slate-900">Your signal has been received.</p>
             <p className="text-xs text-slate-500 font-medium italic">Contributing to the collective clarity.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="font-bold text-slate-900 mb-2">How has your clarity improved?</h4>
              <p className="text-xs text-slate-500 font-medium mb-6">It's been 7 days since your first synthesis. How effective is your roadmap?</p>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-95"
                  >
                    <Star 
                      size={28} 
                      className={`transition-colors ${
                        (hoveredRating || rating) >= star 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Your brief testimonial (Optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full h-24 bg-slate-50 border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />

            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isAllowFeatured}
                onChange={(e) => setIsAllowFeatured(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-700 transition-colors">
                Allow my story to feature in the intelligence grid
              </span>
            </label>

            <Button size="sm" fullWidth onClick={handleSubmit} loading={isSubmitting} disabled={rating === 0}>
              Transmit Feedback
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
