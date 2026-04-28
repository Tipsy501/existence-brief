import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import Card from './Card';
import { ArrowRight, Target } from 'lucide-react';

export default function RelatedBriefs() {
  const [briefs, setBriefs] = useState<any[]>([]);

  useEffect(() => {
    async function loadRelated() {
      const { data } = await supabase
        .from('briefs')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setBriefs(data);
    }
    loadRelated();
  }, []);

  if (briefs.length === 0) return null;

  return (
    <div className="my-16 pt-16 border-t border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Explore Other Strategic Paths</h3>
        <Link to="/topics/strategic-planning" className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2 group">
          View All Topics <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {briefs.map(b => (
          <Link key={b.id} to={`/p/${b.id}`} className="group">
            <Card className="h-full p-6 border-slate-100 hover:border-indigo-200 transition-all flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                <Target size={12} className="text-indigo-400" /> Strategic Plan
              </div>
              <p className="text-sm font-bold text-slate-900 leading-tight mb-4 flex-grow line-clamp-2">
                "{b.goal}"
              </p>
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                Read Roadmap <ArrowRight size={10} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
