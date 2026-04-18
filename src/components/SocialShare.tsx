import React, { useState } from 'react';
import { Twitter, Facebook, Linkedin, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  className?: string;
  variant?: 'minimal' | 'full';
}

export default function SocialShare({ 
  url, 
  title, 
  description, 
  className = '',
  variant = 'full'
}: SocialShareProps) {
  const [showToast, setShowToast] = useState(false);

  const shareTwitter = () => {
    const text = encodeURIComponent(`${title} - ${description}`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`${description}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const copyLink = () => {
    try {
      navigator.clipboard.writeText(url);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.log('Failed to copy link:', err);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <button onClick={shareTwitter} className="hover:text-indigo-600 transition-colors" title="Twitter/X">Twitter</button>
        <button onClick={shareLinkedIn} className="hover:text-indigo-600 transition-colors" title="LinkedIn">LinkedIn</button>
        <button onClick={shareEmail} className="hover:text-indigo-600 transition-colors" title="Email">Email</button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <button 
        onClick={copyLink}
        className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all hover:shadow-sm active:scale-95"
        title="Copy Link"
      >
        <LinkIcon size={18} />
      </button>
      
      <button 
        onClick={shareTwitter}
        className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/20 transition-all hover:shadow-sm active:scale-95"
        title="Twitter"
      >
        <Twitter size={18} />
      </button>

      <button 
        onClick={shareLinkedIn}
        className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#0077B5] hover:border-[#0077B5]/20 transition-all hover:shadow-sm active:scale-95"
        title="LinkedIn"
      >
        <Linkedin size={18} />
      </button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 shadow-xl shadow-slate-200 text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 z-[100]"
          >
            <Check size={14} className="text-emerald-400" />
            Link Copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
