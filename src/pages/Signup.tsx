import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, ArrowLeft, Zap, AlertCircle, CheckCircle2, User, Mail, Shield, Check, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Real-time validation
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = agreed && email.includes('@') && password.length >= 8 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('You must agree to the Terms and Privacy Policy to create an account.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: signUpError } = await signUp(email, password, { 
        full_name: fullName || null 
      });
      
      if (signUpError) throw signUpError;
      
      setSuccess(true);
    } catch (err: any) {
      console.log('Signup protocol deviation:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-10 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Strategic Clearance Requested</h1>
            <p className="text-slate-500 leading-relaxed mb-8">
              We've sent a verification link to <span className="font-bold text-slate-900">{email}</span>. 
              Please confirm your tactical identity to unlock your dashboard.
            </p>
            <Button to="/login" variant="secondary" fullWidth className="py-4">
              Return to Login
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors mb-6">
                <ArrowLeft size={14} /> Back to Login
              </Link>
              <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <Zap size={20} className="fill-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign Up</h1>
              </div>
              <p className="text-slate-500 text-sm">Join the top tier of high-performers today.</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs font-medium"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name (Optional)"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName((e.target as any).value)}
                disabled={isSubmitting}
                icon={<User size={18} className="text-slate-400" />}
              />

              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail((e.target as any).value)}
                disabled={isSubmitting}
                icon={<Mail size={18} className="text-slate-400" />}
              />

              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                showStrength
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-900 focus:ring-2 outline-none transition-all pr-12 font-medium ${
                      confirmPassword.length > 0 
                        ? (passwordsMatch ? 'border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500' : 'border-red-200 focus:ring-red-500/20 focus:border-red-500')
                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                    }`}
                    required
                  />
                  {confirmPassword.length > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <div className="bg-emerald-100 p-0.5 rounded-full"><Check size={12} className="text-emerald-600" /></div>
                      ) : (
                        <div className="bg-red-100 p-0.5 rounded-full"><X size={12} className="text-red-600" /></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-200 transition-all checked:bg-indigo-600 checked:border-indigo-600"
                    />
                    <Check className="absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={4} />
                  </div>
                  <span className="text-xs text-slate-500 leading-relaxed font-medium">
                    I agree to the <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                disabled={!isFormValid || isSubmitting}
                loading={isSubmitting}
                className="py-4 text-sm uppercase tracking-widest font-bold mt-2"
              >
                Sign Up
                {!isSubmitting && <UserPlus size={18} className="ml-2" />}
              </Button>
            </form>
          </div>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <span className="text-sm text-slate-500">Already a member?</span>{' '}
            <Link to="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign in to platform
            </Link>
          </div>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <Shield size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Bank-Grade Security Encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
