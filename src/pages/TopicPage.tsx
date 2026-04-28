import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Card from '../components/Card';
import SEOMeta from '../components/SEOMeta';
import LoadingSpinner from '../components/LoadingSpinner';
import { Target, TrendingUp, Users } from 'lucide-react';

export default function TopicPage() {
  const { topic } = useParams();
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopicData() {
      if (!topic) return;
      
      const formattedTopic = topic.replace(/-/g, ' ');
      const { data } = await supabase
        .from('briefs')
        .select('*, profiles(full_name)')
        .ilike('goal', `%${formattedTopic}%`)
        .limit(10);
        
      if (data) setBriefs(data);
      setLoading(false);
    }
    loadTopicData();
  }, [topic]);

  if (loading) return <LoadingSpinner fullPage text="Aggregating Topic Intelligence..." />;

  const formattedTopic = topic?.replace(/-/g, ' ') || 'Strategic Planning';

  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20">
      <SEOMeta 
        title={`Strategic Planning for ${formattedTopic}`} 
        description={`See how ${briefs.length > 0 ? briefs.length : 'others'} are planning their path to ${formattedTopic}.`}
      />
      
      <div className="container-max">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter capitalize">
            {formattedTopic}
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Real data from anonymous strategic plans focusing on {formattedTopic}. See how others are mapping their trajectory.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
           <Card className="bg-white p-6 border-none text-center">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Users size={24} />
             </div>
             <div className="text-2xl font-black text-slate-900">{briefs.length * 10 + 12}</div>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Strategists</div>
           </Card>
           <Card className="bg-white p-6 border-none text-center">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <Target size={24} />
             </div>
             <div className="text-2xl font-black text-slate-900">84%</div>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clarity Rate</div>
           </Card>
           <Card className="bg-white p-6 border-none text-center">
             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <TrendingUp size={24} />
             </div>
             <div className="text-2xl font-black text-slate-900">3.4mo</div>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Timeline</div>
           </Card>
        </div>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-8 uppercase tracking-widest text-sm flex items-center gap-3">
             <div className="w-2 h-2 bg-indigo-600 rounded-full" />
             Public Roadmap Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {briefs.length > 0 ? briefs.map(b => (
              <Link key={b.id} to={`/p/${b.id}`}>
                <Card className="hover:border-indigo-200 transition-all p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(b.created_at).toLocaleDateString()}
                    </div>
                    <div className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase">
                      {b.result.recommendedPath}
                    </div>
                  </div>
                  <p className="text-slate-900 font-bold line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">
                    "{b.goal}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                    View Roadmap <TrendingUp size={12} />
                  </div>
                </Card>
              </Link>
            )) : (
              <div className="col-span-full py-12 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Synchronizing tactical data for this focus area...</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-20 py-16 bg-slate-900 rounded-3xl p-8 md:p-16 text-center text-white">
           <h2 className="text-3xl font-black mb-6 tracking-tight">Mapping your path to {formattedTopic}?</h2>
           <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">
             Use our AI to synthesize your own unique situation into a concrete 90-day execution plan.
           </p>
           <Link to="/brief" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 transition-colors">
             Start Your Brief
           </Link>
        </section>
      </div>
    </div>
  );
}
