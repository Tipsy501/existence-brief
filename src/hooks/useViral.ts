import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getProfile, incrementBriefShareCount, updateBriefSharing } from '../lib/database';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
}

export function useViral() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadViralData() {
      if (!user) {
        setLoading(false);
        return;
      }
      const p = await getProfile(user.id);
      setProfile(p);
      setLoading(false);
    }
    loadViralData();
  }, [user]);

  const getBadges = (): Badge[] => {
    if (!profile) return [];
    
    return [
      {
        id: 'founding',
        name: 'Founding Strategist',
        description: 'One of the first 100 strategic architects.',
        icon: 'Crown',
        achieved: true // Simplified for demo, IRL check created_at or global count
      },
      {
        id: 'sharer',
        name: 'First Share',
        description: 'Broadcast your strategic frequency.',
        icon: 'Share2',
        achieved: (profile.referral_count || 0) > 0 || (profile.share_count || 0) > 0
      },
      {
        id: 'referral_pro',
        name: 'Referral Pro',
        description: 'Successfully onboarded a peer strategist.',
        icon: 'Users',
        achieved: (profile.referral_bonus_briefs || 0) > 0
      },
      {
        id: 'public_strategist',
        name: 'Public Strategist',
        description: 'Declassified a strategic roadmap.',
        icon: 'Globe',
        achieved: profile.has_public_brief || false
      }
    ];
  };

  const getReferralUrl = () => {
    if (!profile?.referral_code) return window.location.origin;
    return `${window.location.origin}?ref=${profile.referral_code}`;
  };

  const shareToPlatform = async (briefId: string, platform: 'twitter' | 'linkedin') => {
    const shareUrl = `${window.location.origin}/p/${briefId}`;
    let url = '';
    
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent('I just got strategic clarity on my goals using Existence Brief.')}&url=${encodeURIComponent(shareUrl)}`;
    } else {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    }
    
    window.open(url, '_blank');
    await incrementBriefShareCount(briefId);
  };

  return {
    profile,
    loading,
    badges: getBadges(),
    referralUrl: getReferralUrl(),
    shareToPlatform,
    referralBonus: profile?.referral_bonus_briefs || 0
  };
}
