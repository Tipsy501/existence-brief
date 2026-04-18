import { getProfile, updateProfile } from './database';

export const FREE_DAILY_LIMIT = 3;
export const PREMIUM_DAILY_LIMIT = 100;

export interface UsageInfo {
  used: number;
  limit: number;
  isPremium: boolean;
  canGenerate: boolean;
  lastDate: string | null;
}

/**
 * Fetch usage details for a specific user
 */
export async function getUserUsage(userId: string, email?: string): Promise<UsageInfo> {
  const isAdmin = email === 'topogabolekwe@gmail.com';
  
  if (isAdmin) {
    return { used: 0, limit: Infinity, isPremium: true, canGenerate: true, lastDate: null };
  }

  const profile = await getProfile(userId);
  
  if (!profile) {
    return { used: 0, limit: FREE_DAILY_LIMIT, isPremium: false, canGenerate: true, lastDate: null };
  }

  const isPremium = profile.plan === 'pro' || profile.is_premium === true;
  const baseLimit = isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const bonusLimit = profile.referral_bonus_briefs || 0;
  const limit = baseLimit + bonusLimit;
  const today = new Date().toISOString().split('T')[0];
  
  // Logic to handle daily reset check on read
  let used = profile.briefs_used_today;
  if (profile.last_brief_date !== today) {
    used = 0;
  }

  return {
    used,
    limit,
    isPremium,
    canGenerate: used < limit,
    lastDate: profile.last_brief_date
  };
}

/**
 * Increment usage count in Supabase
 */
export async function incrementBriefUsage(userId: string, email?: string): Promise<number> {
  if (email === 'topogabolekwe@gmail.com') return 0;

  const profile = await getProfile(userId);
  if (!profile) return 0;

  const today = new Date().toISOString().split('T')[0];
  const lastDate = profile.last_brief_date;

  let newCount = profile.briefs_used_today + 1;
  
  // Reset if it's a new day
  if (lastDate !== today) {
    newCount = 1;
  }

  await updateProfile(userId, {
    briefs_used_today: newCount,
    last_brief_date: today
  });

  return newCount;
}

/**
 * Quick check if user can generate a brief
 */
export async function checkUsage(userId: string, email?: string): Promise<boolean> {
  const usage = await getUserUsage(userId, email);
  return usage.canGenerate;
}
