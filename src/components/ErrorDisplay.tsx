import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ErrorDisplayProps {
  status: 'loading' | 'processing' | 'finishing' | 'error';
  message?: string;
  className?: string;
}

export default function ErrorDisplay({ status, className = '' }: ErrorDisplayProps) {
  const getMessage = () => {
    switch (status) {
      case 'loading':
        return 'Analyzing your situation...';
      case 'processing':
        return 'Generating your strategic plan...';
      case 'finishing':
        return 'Finalizing your brief...';
      default:
        return 'Synchronizing strategic grid...';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4 text-indigo-500"
      >
        <Loader2 size={32} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-slate-600 font-medium tracking-tight"
      >
        {getMessage()}
      </motion.p>
    </div>
  );
}
