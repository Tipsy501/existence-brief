import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { Star } from 'lucide-react';

export default function AdminFeedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState('0.0');
  
  useEffect(() => {
    loadFeedback();
  }, []);
  
  async function loadFeedback() {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error loading feedback:', error);
    } else if (data) {
      setFeedback(data);
      if (data.length > 0) {
        const sum = data.reduce((acc, f) => acc + (f.rating || 0), 0);
        setAverageRating((sum / data.length).toFixed(1));
      }
    }
    setLoading(false);
  }
  
  // Admin check
  const isAdmin = user?.email === 'topogabolekwe@gmail.com';
  
  if (!isAdmin && !loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase">Access Denied</h1>
        <p className="text-slate-500">You do not have administrative clearance for this grid.</p>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-6xl mx-auto p-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Feedback Dashboard</h1>
        <p className="text-slate-500 font-medium italic">Monitoring strategic performance metrics.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-8 border-none bg-slate-50">
          <div className="text-4xl font-black text-indigo-600 mb-2">{feedback.length}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Responses</div>
        </Card>
        <Card className="p-8 border-none bg-slate-50">
          <div className="text-4xl font-black text-emerald-600 mb-2">{averageRating}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Rating</div>
        </Card>
        <Card className="p-8 border-none bg-slate-50">
          <div className="text-4xl font-black text-amber-600 mb-2">
            {feedback.filter(f => f.rating >= 4).length}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Positive (4-5 stars)</div>
        </Card>
      </div>
      
      <Card className="overflow-hidden border-slate-100" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Date</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Rating</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">Comment</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">User ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 italic">Synchronizing tactical data...</td>
                </tr>
              ) : feedback.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 italic">No feedback entries detected in the database.</td>
                </tr>
              ) : (
                feedback.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {new Date(f.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 leading-relaxed font-medium">
                      {f.comment || <span className="text-slate-300 italic">No comment provided</span>}
                    </td>
                    <td className="p-4">
                       <code className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                         {f.user_id?.slice(0, 8) || 'anonymous'}
                       </code>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="mt-12 p-8 border-2 border-dashed border-slate-100 rounded-3xl">
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Database Schema Requirements</h3>
        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
          Ensure the following SQL has been executed in your Supabase SQL Editor to support this dashboard:
        </p>
        <pre className="bg-slate-900 text-indigo-300 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed">
{`CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Basic RLS Policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON feedback FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON feedback FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin select" ON feedback FOR SELECT TO authenticated 
USING (auth.jwt() ->> 'email' = 'topogabolekwe@gmail.com');`}
        </pre>
      </div>
    </div>
  );
}
