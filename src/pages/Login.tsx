import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, LogIn, UserPlus, ArrowRight, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, continueAsGuest, resetPassword } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check for confirmation param or other URL markers
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('confirmed') === 'true') {
      setSuccessMsg('Email confirmed! You can now sign in to your tactical dashboard.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check for error in hash (Supabase puts some errors there)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('error_description')) {
      setAuthError(decodeURIComponent(hashParams.get('error_description') || 'Verification failed.'));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError('Please enter your email address to reset your password.');
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setSuccessMsg('Password reset link sent! Please check your email inbox.');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setAuthError(null);
    setSuccessMsg(null);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      console.log('Auth interaction deviation:', err);
      setAuthError('Authentication sequence interrupted. Please verify credentials and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-0 overflow-hidden" padding="none">
          <div className="p-8 md:p-10">
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl mb-4">
                <Zap className="text-indigo-600" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Please enter your credentials to sign in
              </p>
            </div>

            <AnimatePresence mode="wait">
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs font-medium"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-600 text-xs font-medium"
                >
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail((e.target as any).value)}
                disabled={isSubmitting}
                icon={<Mail size={18} className="text-slate-400" />}
              />
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 underline underline-offset-2"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword((e.target as any).value)}
                  disabled={isSubmitting}
                  icon={<Lock size={18} className="text-slate-400" />}
                />
              </div>

              <Button type="submit" fullWidth loading={isSubmitting} className="py-4 text-sm uppercase tracking-widest font-bold">
                Sign in
                {!isSubmitting && <LogIn size={18} className="ml-2" />}
              </Button>
            </form>
          </div>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <span className="text-sm text-slate-500">New to platform?</span>{' '}
            <Link to="/signup" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Create tactical account
            </Link>
          </div>
        </Card>

        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={handleGuestMode}
            fullWidth
            disabled={isSubmitting}
            className="group gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
          >
            Continue as guest
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
