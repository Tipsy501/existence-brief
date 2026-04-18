import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AdminNewsletter from '../components/AdminNewsletter';
import { ShieldAlert, Terminal } from 'lucide-react';
import Card from '../components/Card';

export default function Admin() {
  const { user, loading } = useAuth();
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'topogabolekwe@gmail.com';

  if (loading) return null;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-12 border-rose-100 shadow-xl shadow-rose-100/20">
          <ShieldAlert size={64} className="text-rose-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Restricted Protocol</h2>
          <p className="text-slate-500 font-medium italic">
            Your identity has not been verified for administrative dispatch. 
            This intrusion attempt has been logged.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white py-12 md:py-20">
      <div className="container-max">
        <div className="mb-12 flex items-center gap-3 border-b border-slate-100 pb-8">
           <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
             <Terminal size={20} />
           </div>
           <div>
             <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">Administrative Control</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Authorized Personnel Only</p>
           </div>
        </div>
        
        <AdminNewsletter />
      </div>
    </div>
  );
}
