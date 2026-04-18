import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePremium } from '../hooks/usePremium';
import { LogOut, User as UserIcon, Settings, LayoutDashboard, ChevronDown, UserPlus, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from './Button';

export default function UserMenu() {
  const { user, isGuest, signOut } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user && !isGuest) return null;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <UserIcon size={18} />
        </div>
        <div className="hidden md:flex flex-col items-start px-1 mr-2">
          <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
            {isGuest ? 'Guest User' : user?.email?.split('@')[0]}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isPremium ? 'text-emerald-500' : 'text-slate-400'}`}>
            {isGuest ? 'Free Demo' : isPremium ? 'Premium Plan' : 'Free Tier'}
          </span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 origin-top-right"
            >
              {!isPremium && !isGuest && (
                <div className="p-3 mb-2 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-1">
                    <Zap size={12} className="fill-amber-500" />
                    Limited Usage
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2 font-medium">
                    Unlock unlimited analysis with a one-time upgrade.
                  </p>
                  <Link to="/upgrade" onClick={() => setIsOpen(false)}>
                    <Button size="sm" fullWidth variant="primary" className="text-[10px] bg-amber-600 hover:bg-amber-700">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              )}
              {isGuest && (
                <div className="p-3 mb-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-1">
                    <UserPlus size={12} />
                    Unregistered
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                    Sign up to save your history and get more daily briefs.
                  </p>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button size="sm" fullWidth variant="primary" className="text-[10px]">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}

              <div className="space-y-1">
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors font-sans"
                >
                  <Settings size={18} />
                  Profile Settings
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors font-sans"
                >
                  <LogOut size={18} />
                  {isGuest ? 'Clear Session' : 'Sign Out'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
