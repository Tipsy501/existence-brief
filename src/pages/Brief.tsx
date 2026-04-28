import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBrief } from '../hooks/useBrief';
import { useAuth } from '../hooks/useAuth';
import { useUsage } from '../hooks/useUsage';
import { saveBrief } from '../lib/database';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import UpgradeModal from '../components/UpgradeModal';

export default function Brief() {
  const navigate = useNavigate();
  const { generate, loading, error } = useBrief();
  const { user, isGuest } = useAuth();
  const { canGenerate, incrementUsage, checkCanGenerate } = useUsage();
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    situation: '',
    goal: '',
    constraints: ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Initial check
    const allowed = await checkCanGenerate();
    if (!allowed && !isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }

    // Basic Validation
    if (formData.situation.length < 20) {
      setValidationError('Please provide more detail about your situation (min 20 chars).');
      return;
    }
    if (formData.goal.length < 10) {
      setValidationError('Please refine your goal (min 10 chars).');
      return;
    }

    try {
      const result = await generate(formData);
      // Increment count
      await incrementUsage();
      
      let briefId = null;
      if (user && !isGuest) {
        try {
          const savedResult = await saveBrief(user.id, result, formData);
          briefId = savedResult.id;
        } catch (saveErr) {
          console.log('Silent save failed:', saveErr);
          // Don't block navigation, just fallback to state-only
        }
      }

      // Backup to localStorage for recovery in PathDetail
      localStorage.setItem('existence_brief_latest_meta', JSON.stringify({ 
        briefId,
        situation: formData.situation,
        goal: formData.goal,
        constraints: formData.constraints,
        result
      }));

      navigate('/brief/result', { state: { result, inputs: formData, briefId } });
    } catch (err: any) {
      console.log('Submission logic deviation:', err);
      // Even if logic fails, let ErrorBoundary or higher level handle if absolutely necessary,
      // but here we already have generate with fallbacks.
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6">
        <LoadingSpinner 
          size="lg" 
          text="Engaging multi-provider grid. Analyzing your situation..." 
        />
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-slate-400 text-sm font-medium max-w-xs text-center leading-relaxed">
            Our strategic engine is coordinating with thousands of data points to engineer your asymmetric path.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-12">
      <div className="container-max max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
             <ShieldCheck size={14} />
             ENCRYPTED ANALYSIS
          </div>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 md:p-12 overflow-hidden" padding="none">
            <div className="p-8 md:p-12">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight tracking-tight">Get Your Life Plan</h1>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-medium">
                  The more detail you give, the better your plan will be. 
                  It only takes about 60 seconds.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {validationError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-600 text-sm font-medium"
                  >
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{validationError}</span>
                  </motion.div>
                )}

                <div className="space-y-6">
                  <Input
                    label="What does your life look like right now?"
                    multiline
                    required
                    maxLength={500}
                    value={formData.situation}
                    onChange={(e) => setFormData({...formData, situation: e.target.value})}
                    placeholder="Example: I work 9-5 but want to start a business"
                  />

                  <Input
                    label="What is your main goal?"
                    multiline
                    required
                    maxLength={500}
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    placeholder="Example: I want to transition to a career in tech"
                  />

                  <Input
                    label="What's stopping you? (optional)"
                    multiline
                    maxLength={500}
                    value={formData.constraints}
                    onChange={(e) => setFormData({...formData, constraints: e.target.value})}
                    placeholder="Example: I have kids and limited time"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  className="py-5 text-lg font-bold mt-4"
                >
                  START MY FREE PLAN
                  <Send size={20} className="ml-3" />
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>

        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
        />
      </div>
    </div>
  );
}
