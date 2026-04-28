import React, { useState, useEffect } from 'react';
import { Star, Check, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Card from './Card';
import Button from './Button';

const FEEDBACK_KEY = 'existence_feedback_submitted';
const FEEDBACK_SHOWN_KEY = 'existence_feedback_shown';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if user already submitted feedback
    const hasSubmitted = localStorage.getItem(FEEDBACK_KEY);
    if (hasSubmitted && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    
    try {
      // Save directly to 'feedback' table as requested
      const { error } = await supabase.from('feedback').insert([{
        rating,
        comment,
        user_id: user?.id || 'anonymous',
        created_at: new Date().toISOString()
      }]);
      
      if (error) throw error;
      
      // Mark as submitted - NEVER SHOW AGAIN
      localStorage.setItem(FEEDBACK_KEY, 'true');
      localStorage.setItem(FEEDBACK_SHOWN_KEY, 'true');
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Mark as shown even if not submitted, as per user request to show only once
    localStorage.setItem(FEEDBACK_SHOWN_KEY, 'true');
    onClose();
  };

  // Only render if not submitted
  const hasSubmitted = localStorage.getItem(FEEDBACK_KEY);
  if (hasSubmitted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden" padding="none">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <h3 className="text-sm font-black uppercase tracking-widest">How was your brief?</h3>
          {!isSuccess && (
            <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <Check size={32} />
              </div>
              <p className="text-lg font-bold text-slate-900">Thank you for your feedback!</p>
              <p className="text-sm text-slate-500 font-medium">Your input helps us improve the strategic engine.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-slate-600 font-medium mb-6">Your feedback helps us refine the AI for everyone.</p>
                
                <div className="flex items-center justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={32} 
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
                placeholder="What can we improve? (Optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              />

              <Button 
                fullWidth 
                onClick={handleSubmit} 
                loading={isSubmitting} 
                disabled={rating === 0}
                className="py-4 text-sm font-black uppercase tracking-widest"
              >
                Submit Feedback
              </Button>
              
              <button 
                onClick={handleClose}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
              >
                Maybe later
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
