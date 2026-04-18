import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Twitter, Linkedin, Copy, Check, Download, Globe, Lock } from 'lucide-react';
import { useViral } from '../hooks/useViral';
import { updateBriefSharing } from '../lib/database';
import Button from './Button';
import Card from './Card';

interface ShareBriefProps {
  brief: any;
  onUpdate?: () => void;
}

export default function ShareBrief({ brief, onUpdate }: ShareBriefProps) {
  const { shareToPlatform, referralUrl } = useViral();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(brief.is_public || false);
  const [isToggling, setIsToggling] = useState(false);

  const handleCopyToClipboard = () => {
    const url = `${window.location.origin}/p/${brief.id}${referralUrl.includes('?ref=') ? '&ref=' + referralUrl.split('?ref=')[1] : ''}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 0.95 });
      const link = document.createElement('a');
      link.download = `existence-brief-summary.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log('Image generation deviation:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePublic = async () => {
    setIsToggling(true);
    try {
      await updateBriefSharing(brief.id, !isPublic);
      setIsPublic(!isPublic);
      onUpdate?.();
    } catch (err) {
      console.log('Toggle visibility deviation:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Visibility Toggle */}
      <Card padding="md" className="bg-slate-50 border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPublic ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
              {isPublic ? <Globe size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{isPublic ? 'Privacy Protocol: Declassified' : 'Privacy Protocol: Restricted'}</h4>
              <p className="text-xs text-slate-500 font-medium">
                {isPublic ? 'This brief is accessible via public link.' : 'Only you can access this roadmap.'}
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant={isPublic ? 'secondary' : 'primary'}
            onClick={togglePublic}
            loading={isToggling}
          >
            {isPublic ? 'Make Private' : 'Make Public'}
          </Button>
        </div>
      </Card>

      {/* Share Actions */}
      {isPublic && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-widest text-sm">Broaden the Frequency</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Your strategic clarity can act as a North Star for others. Share your synthesized trajectory with your network.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="sm" variant="secondary" className="gap-2" onClick={() => shareToPlatform(brief.id, 'twitter')}>
                <Twitter size={16} /> Twitter / X
              </Button>
              <Button size="sm" variant="secondary" className="gap-2" onClick={() => shareToPlatform(brief.id, 'linkedin')}>
                <Linkedin size={16} /> LinkedIn
              </Button>
              <Button size="sm" variant="secondary" className="gap-2" onClick={handleCopyToClipboard}>
                {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {isCopied ? 'Copied' : 'Copy Link'}
              </Button>
              <Button size="sm" variant="ghost" className="gap-2" onClick={handleDownloadImage} loading={isGenerating}>
                <Download size={16} /> Download Card
              </Button>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs text-indigo-900 font-bold mb-1 uppercase tracking-widest">Incentive Protocol</p>
              <p className="text-[11px] text-indigo-700 font-medium italic">
                Earn 3 bonus briefs for every peer who joins via your shared link.
              </p>
            </div>
          </div>

          {/* Hidden/Preview Card for Generation */}
          <div className="relative group">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
              <span>Shareable Asset Preview</span>
              <span className="text-indigo-500">Optimized for Clarity</span>
            </div>
            
            <div 
              ref={cardRef}
              className="bg-slate-900 text-white p-8 rounded-3xl aspect-[1.91/1] flex flex-col justify-between overflow-hidden relative shadow-2xl shadow-indigo-100/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-slate-900 font-black text-xs">E</div>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em]">Existence Brief</span>
                </div>
                <h2 className="text-xl font-bold leading-tight mb-3">
                  Strategic Clarity Confirmed: {brief.result.recommendedPath} Trajectory
                </h2>
                <p className="text-[10px] text-slate-300 line-clamp-3 font-medium leading-relaxed italic border-l-2 border-indigo-500 pl-4">
                  "{brief.result.focusStatement}"
                </p>
              </div>

              <div className="flex items-end justify-between relative z-10 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated Objective</p>
                  <p className="text-xs font-bold line-clamp-1">{brief.goal}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Synthesized by</p>
                  <p className="text-[10px] font-black tracking-tighter">EXISTENCE.BIZ</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl backdrop-blur-[2px]">
              <div className="p-3 bg-white rounded-full shadow-lg">
                <Download size={24} className="text-slate-900" onClick={handleDownloadImage} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
