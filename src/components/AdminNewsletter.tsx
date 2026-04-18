import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Users, Send, CheckCircle2, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { getConfirmedSubscribers, NewsletterSubscriber } from '../lib/newsletter';
import { sendNewsletterIssue } from '../lib/resend';
import Button from './Button';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    setLoading(true);
    try {
      const data = await getConfirmedSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.log('Error loading subscribers:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendNewsletter() {
    if (!subject || !content) {
      setStatus({ type: 'error', msg: 'Subject and content are required for protocol broadcast.' });
      return;
    }

    if (subscribers.length === 0) {
      setStatus({ type: 'error', msg: 'No confirmed recipients detected in the strategic grid.' });
      return;
    }

    setSending(true);
    setStatus(null);
    try {
      const result = await sendNewsletterIssue(subscribers, subject, content);
      if (result.success) {
        setStatus({ type: 'success', msg: `Transmission successful. Broadcasted to ${subscribers.length} strategists.` });
        setSubject('');
        setContent('');
      } else {
        setStatus({ type: 'error', msg: result.error || 'Broadcast failed due to transmission deviation.' });
      }
    } catch (err) {
      console.log('Error sending newsletter:', err);
      setStatus({ type: 'error', msg: 'Critical transmission error detected.' });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <LoadingSpinner text="Synchronizing Subscriber Grid..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <Mail className="text-indigo-600" />
            Protocol Dispatch
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Broadcast high-precision strategic tips to your enlistment.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
               <Users size={16} />
             </div>
             <div>
               <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none">Subscribers</div>
               <div className="text-lg font-black text-indigo-900 leading-none">{subscribers.length}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="md:col-span-2 space-y-6">
          <Card padding="lg" className="border-slate-200 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subject Header</label>
                <input 
                  type="text"
                  placeholder="e.g., Monday Strategic Tip: The Power of Asymmetric Leverage"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-colors font-bold text-slate-900 placeholder:text-slate-300"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Issue Content (HTML Enabled)</label>
                <textarea 
                  placeholder="Draft your strategic intelligence issue here..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-colors font-medium text-slate-700 min-h-[400px] font-mono text-sm"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>

              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                  <span className="text-sm font-bold">{status.msg}</span>
                </motion.div>
              )}

              <div className="pt-4">
                <Button 
                  fullWidth 
                  size="lg" 
                  className="gap-2 text-xs font-black tracking-widest uppercase py-5"
                  onClick={handleSendNewsletter}
                  loading={sending}
                  disabled={subscribers.length === 0}
                >
                  <Send size={16} /> Broadcast to Grid
                </Button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                  WARNING: This action is irreversible once transmission initiates.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar / List */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 shadow-sm h-fit">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
               <FileText size={14} className="text-slate-400" /> Recent Enlistments
            </h3>
            <div className="space-y-3">
              {subscribers.slice(0, 8).map((sub, i) => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-indigo-100 transition-colors">
                  <div className="truncate pr-2">
                    <div className="text-xs font-bold text-slate-900 truncate">{sub.email}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                       {new Date(sub.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                    <ChevronRight size={14} />
                  </div>
                </div>
              ))}
              {subscribers.length > 8 && (
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                  + {subscribers.length - 8} more confirmed
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white border-none shadow-xl">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Asymmetric Power</h4>
            <p className="text-sm font-medium leading-relaxed opacity-80">
              Your newsletter is the direct line to your high-performance network. Each dispatch should deliver immediate conceptual leverage or tactical clarity.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
