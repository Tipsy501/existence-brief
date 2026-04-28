import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { clearEBStorage, logAuthEvent } from '../lib/security';
import Button from './Button';
import { AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes
const WARNING_ZONE = 60 * 1000; // 60 seconds

export default function InactivityHandler() {
  const { user, signOut } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const performLogout = useCallback(async (reason: string) => {
    if (!user) return;
    
    await logAuthEvent('auto_logout', { reason });
    setShowWarning(false);
    clearEBStorage();
    await signOut();
  }, [user, signOut]);

  const resetTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setShowWarning(false);
    setTimeLeft(60);

    if (user) {
      // Set timer for the warning (14 mins)
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true);
        // Start countdown
        countdownRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              performLogout('inactivity_timeout');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, INACTIVITY_LIMIT - WARNING_ZONE);

      // Final logout timer (backup)
      timerRef.current = setTimeout(() => {
        performLogout('inactivity_timeout');
      }, INACTIVITY_LIMIT);
    }
  }, [user, performLogout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (!showWarning) resetTimers();
    };

    if (user) {
      resetTimers();
      events.forEach(event => window.addEventListener(event, handleActivity));
      
      // Tab close handler
      const handleTabClose = () => {
        // Technically beforeunload is tricky to log, but we clear
        clearEBStorage();
      };
      window.addEventListener('beforeunload', handleTabClose);

      return () => {
        events.forEach(event => window.removeEventListener(event, handleActivity));
        window.removeEventListener('beforeunload', handleTabClose);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
      };
    }
  }, [user, resetTimers, showWarning]);

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-[100] max-w-md w-full"
        >
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="animate-pulse" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Session Expiring</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You've been inactive for a while. For your security, you will be logged out in <span className="text-amber-500 font-bold">{timeLeft}s</span>.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                onClick={resetTimers}
              >
                Stay Active
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1 border-slate-700 text-slate-400 hover:text-white"
                onClick={() => performLogout('manual_session_end')}
              >
                Logout Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
