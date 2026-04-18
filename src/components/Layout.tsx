import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LayoutDashboard, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import UserMenu from './UserMenu';
import TestimonialPrompt from './TestimonialPrompt';
import ErrorBoundary from './ErrorBoundary';
import CookieBanner from './CookieBanner';
import SocialShare from './SocialShare';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isGuest } = useAuth();
  const location = useLocation();

  // Viral: Track referral code from URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('existence_referral_code', ref);
    }
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon size={18} /> },
    { name: 'How it works', path: '/how-it-works', icon: <ChevronRight size={18} /> },
    { name: 'Pricing', path: '/pricing', icon: <Zap size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16">
        <div className="container-max h-full flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
            onClick={() => {
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:rotate-6 transition-transform">
              <Zap size={18} className="fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-slate-900 text-lg leading-none">Existence Brief</span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-0.5">Premium Clarity</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-colors hover:text-indigo-600 ${
                  location.pathname === item.path ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {(user || isGuest) ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="btn-primary flex items-center gap-2 group text-sm"
              >
                Sign in
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {(user || isGuest) && <UserMenu />}
            <button
              className="p-2 text-slate-500 hover:text-slate-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="container-max flex flex-col p-6 gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-bold flex items-center gap-3 ${
                      location.pathname === item.path ? 'text-indigo-600' : 'text-slate-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!(user || isGuest) && (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary w-full text-center py-4"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-slate-100 bg-white">
        <div className="container-max grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <Zap className="text-indigo-600" size={20} />
              <span className="font-bold text-slate-900 text-xl tracking-tight">Existence Brief</span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
              AI-powered clarity for your life's biggest decisions. Built for those who 
              refuse to leave their future to chance.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-600 underline-offset-4">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/how-it-works" className="hover:underline">How it works</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
              <li><Link to="/brief" className="hover:underline">Brief Generator</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-600 underline-offset-4">
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:underline">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="container-max mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <span>&copy; 2025 Existence Brief &middot; TopZero Group &middot; Built in 2025</span>
           <SocialShare 
            variant="minimal"
            url={window.location.origin}
            title="Existence Brief"
            description="Premium clarity and asymmetric advantages through precision strategic analysis."
           />
        </div>
      </footer>
      
      <CookieBanner />
      <TestimonialPrompt />
    </div>
  );
}
