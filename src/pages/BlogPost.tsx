import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateBlogPost } from '../lib/auto-blog';
import SEOMeta from '../components/SEOMeta';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      const topic = slug.replace('how-to-', '').replace(/-/g, ' ');
      const data = await generateBlogPost(topic);
      setPost(data);
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage text="Synthesizing Editorial Content..." />;

  if (!post) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <Link to="/" className="text-indigo-600 font-bold">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <SEOMeta title={post.title} description={post.excerpt} />
      
      <div className="h-[40vh] bg-slate-900 relative overflow-hidden flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-10 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <ArrowLeft size={14} /> Back to Existence Brief
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-8">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.published_at).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><User size={14} /> EB Intelligence</div>
            <div className="flex items-center gap-2"><Clock size={14} /> 5 min read</div>
          </div>
        </div>
      </div>

      <div className="container-max py-20">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16">
          <article className="prose prose-slate prose-indigo max-w-none">
            <div className="text-xl text-slate-500 font-medium italic mb-12 border-l-4 border-indigo-600 pl-6 leading-relaxed">
              {post.excerpt}
            </div>
            <div className="markdown-content">
               <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>

          <aside className="space-y-8">
            <Card className="bg-indigo-600 text-white p-8 border-none sticky top-24">
              <h3 className="text-xl font-black mb-4 tracking-tight">Build your own roadmap.</h3>
              <p className="text-indigo-100 text-sm mb-8 font-medium">
                Get a personalized 90-day plan based on your unique goals and constraints.
              </p>
              <Link to="/brief" className="block w-full py-4 bg-white text-indigo-600 rounded-xl font-bold text-center hover:bg-indigo-50 transition-colors">
                Start Free Brief
              </Link>
            </Card>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Strategic Topics</h4>
               <div className="flex flex-wrap gap-2">
                 {['Career', 'Business', 'Growth', 'Clarity', 'Execution'].map(t => (
                   <span key={t} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                     {t}
                   </span>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
