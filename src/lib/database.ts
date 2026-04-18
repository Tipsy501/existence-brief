import { supabase } from './supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro';
  is_premium: boolean;
  paypal_subscription_id: string | null;
  paypal_order_id: string | null;
  upgraded_at: string | null;
  briefs_used_today: number;
  last_brief_date: string | null;
  referral_code: string | null;
  referred_by: string | null;
  referral_bonus_briefs: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  status: 'pending' | 'joined';
  created_at: string;
}

export interface Testimonial {
  id: string;
  user_id: string;
  rating: number;
  text: string;
  is_featured: boolean;
  approved: boolean;
  created_at: string;
  user_name?: string;
}

/**
 * Fetch a user profile by ID
 */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Row not found - could happen if trigger hasn't finished
      return null;
    }
    console.log('Error fetching profile:', error);
    return null;
  }
  return data as Profile;
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  // If no referral code, generate one
  if ('referral_code' in updates === false) {
    const profile = await getProfile(userId);
    if (profile && !profile.referral_code) {
      updates.referral_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Profile;
}

/**
 * Increment brief count and handle daily reset logic
 */
export async function incrementBriefCount(userId: string) {
  const profile = await getProfile(userId);
  if (!profile) return null;

  const today = new Date().toISOString().split('T')[0];
  const lastDate = profile.last_brief_date;

  let newCount = profile.briefs_used_today + 1;
  
  // Reset if it's a new day
  if (lastDate !== today) {
    newCount = 1;
  }

  return await updateProfile(userId, {
    briefs_used_today: newCount,
    last_brief_date: today
  });
}

/**
 * Save a generated brief to the database
 */
export async function saveBrief(
  userId: string, 
  result: any, 
  inputs: any, 
  selectedPath?: string, 
  detailedPlan?: any
) {
  const { data, error } = await supabase
    .from('briefs')
    .insert([{
      user_id: userId,
      situation: inputs.situation,
      goal: inputs.goal,
      constraints: inputs.constraints,
      result: result,
      selected_path: selectedPath || null,
      detailed_plan: detailedPlan || null
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Update an existing brief with a selected path and detailed plan
 */
export async function updateBriefPlan(
  briefId: string,
  selectedPath: string,
  detailedPlan: any
) {
  const { data, error } = await supabase
    .from('briefs')
    .update({
      selected_path: selectedPath,
      detailed_plan: detailedPlan
    })
    .eq('id', briefId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Update an existing brief with sharing information
 */
export async function updateBriefSharing(briefId: string, isPublic: boolean) {
  const { data, error } = await supabase
    .from('briefs')
    .update({ is_public: isPublic })
    .eq('id', briefId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Increment share count for a brief
 */
export async function incrementBriefShareCount(briefId: string) {
  const { data: brief } = await supabase.from('briefs').select('share_count').eq('id', briefId).single();
  const currentCount = brief?.share_count || 0;
  
  const { error } = await supabase
    .from('briefs')
    .update({ share_count: currentCount + 1 })
    .eq('id', briefId);

  if (error) console.log('Error incrementing share count:', error);
}

/**
 * Fetch a public brief (no auth required)
 */
export async function getPublicBrief(briefId: string) {
  const { data, error } = await supabase
    .from('briefs')
    .select('*, profiles(full_name)')
    .eq('id', briefId)
    .eq('is_public', true)
    .single();

  if (error) return null;
  return data;
}

/**
 * Referral System: Register a new referral
 */
export async function registerReferral(referrerCode: string, refereeId: string) {
  // 0. Quick check if already referred
  const profile = await getProfile(refereeId);
  if (profile?.referred_by) return null;

  // 1. Find referrer by code
  const { data: referrer, error: refError } = await supabase
    .from('profiles')
    .select('id')
    .eq('referral_code', referrerCode)
    .single();

  if (refError || !referrer || referrer.id === refereeId) return null;

  // 2. Register referral (use upsert to be safe, though id is uuid)
  const { error: insertError } = await supabase
    .from('referrals')
    .upsert([{
      referrer_id: referrer.id,
      referee_id: refereeId,
      status: 'joined'
    }], { onConflict: 'referee_id' }); // Assuming we want one referral per referee

  if (insertError) {
    console.log('Error registering referral:', insertError);
    return null;
  }

  // 3. Update profiles
  await updateProfile(refereeId, { referred_by: referrer.id });
  
  // 4. Award bonus to referrer (3 free briefs)
  const { data: referrerProfile } = await supabase.from('profiles').select('referral_bonus_briefs').eq('id', referrer.id).single();
  const currentBonus = referrerProfile?.referral_bonus_briefs || 0;
  
  await supabase
    .from('profiles')
    .update({ referral_bonus_briefs: currentBonus + 3 })
    .eq('id', referrer.id);

  return referrer.id;
}

/**
 * Testimonial System
 */
export async function submitTestimonial(userId: string, rating: number, text: string, isFeatured: boolean = false) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      user_id: userId,
      rating,
      text,
      is_featured: isFeatured,
      approved: false
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFeaturedTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*, profiles(full_name)')
    .eq('is_featured', true)
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data.map(t => ({
    ...t,
    user_name: t.profiles?.full_name || 'Anonymous Strategist'
  }));
}

/**
 * Platform Stats
 */
export async function getGlobalStats() {
  const { count, error } = await supabase
    .from('briefs')
    .select('*', { count: 'exact', head: true });
    
  if (error) return { briefsCount: 500 }; // Fallback
  return { briefsCount: count || 500 };
}
/**
 * Fetch all briefs for a specific user
 */
export async function getUserBriefs(userId: string) {
  const { data, error } = await supabase
    .from('briefs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error fetching briefs:', error);
    return [];
  }
  return data;
}
