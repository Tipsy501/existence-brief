import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mb-6">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif italic">404: Static Lost.</h1>
      <p className="text-slate-500 max-w-sm mb-8 font-medium">
        The strategic path you are looking for does not exist or has been archived.
      </p>
      <Button to="/" className="gap-2">
        <Home size={18} />
        Return Home
      </Button>
    </div>
  );
}
