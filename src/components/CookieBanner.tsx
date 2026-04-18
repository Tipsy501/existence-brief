import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X } from 'lucide-react';
import Button from './Button';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[100]"
        >
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Shield size={20} />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-1">Privacy Protocol</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  We use essential cookies to maintain your tactical session and optimize the strategic engine. By continuing, you agree to our <a href="/cookie-policy" className="text-indigo-600 underline">Cookie Policy</a>.
                </p>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex gap-3">
              <Button size="sm" fullWidth onClick={handleAccept} className="text-[10px] font-black uppercase tracking-widest py-3">
                Synchronize & Accept
              </Button>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mx-16 -my-16 -z-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
