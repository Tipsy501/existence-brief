import { supabase } from './supabase';

/**
 * Handles premium activation and verification logic
 */

export async function markUserAsPremium(userId: string, paypalOrderId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      plan: 'pro',
      is_premium: true,
      paypal_order_id: paypalOrderId,
      upgraded_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.log('User upgrade protocol deviation:', error);
    throw error;
  }
  return data;
}

export async function verifyPremiumStatus(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_premium, plan')
    .eq('id', userId)
    .single();

  if (error) return false;
  return data.is_premium || data.plan === 'pro';
}

export async function cancelPremium(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      plan: 'free',
      is_premium: false
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
