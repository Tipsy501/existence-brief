import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Button from './Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default to simulate checkout/PayPal redirect
      window.open('https://www.paypal.com/checkoutnow', '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} />
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">
                Daily Limit Reached
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                Free users get <span className="text-indigo-600 font-bold">3 strategic briefs</span> per day. Upgrade to Pro for unlimited engineering and asymmetric insights.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <Zap size={14} />, text: "Unlimited Brief Generations" },
                  { icon: <ShieldCheck size={14} />, text: "Priority Analysis Engine" },
                  { icon: <Heart size={14} />, text: "Save Unlimited Histories" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-indigo-500">{feature.icon}</div>
                    {feature.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  fullWidth 
                  className="py-4 text-sm uppercase tracking-widest font-extrabold gap-2"
                  onClick={handleUpgrade}
                >
                  UPGRADE TO PRO
                  <ArrowRight size={18} />
                </Button>
                <button 
                  onClick={onClose}
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest py-2 hover:text-slate-600 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest text-center">
              Limited Time: $9.99 / Lifetime Access
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
