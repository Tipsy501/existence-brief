import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Card from '../components/Card';
import SEOMeta from '../components/SEOMeta';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadBlogs() {
      // For now, we'll list some common topics as blog entry points
      const commonTopics = [
        'Career Change',
        'Starting a Business',
        'Finding Life Purpose',
        'Financial Independence',
        'Skill Acquisition'
      ];
      
      setBlogs(commonTopics.map(t => ({
        title: `How to ${t}: Strategic Analysis`,
        slug: `how-to-${t.toLowerCase().replace(/\s+/g, '-')}`,
        topic: t
      })));
    }
    loadBlogs();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 py-12 md:py-20">
      <SEOMeta title="Strategic Blog" description="Tactical insights and data-driven plans for your most important goals." />
      
      <div className="container-max">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
            Clarity Blog
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            We analyze thousands of anonymous strategic briefs to find the patterns that lead to successful execution.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {blogs.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <Card className="p-8 hover:border-indigo-200 transition-all group">
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">
                  <BookOpen size={12} /> Strategic Insight
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 mb-6 line-clamp-2">
                  Building a roadmap for {post.topic} requires careful consideration of constraints. We analyze the common paths taken by strategists.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-widest">
                  Read Article <ArrowRight size={14} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
