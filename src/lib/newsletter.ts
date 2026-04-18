import { supabase } from './supabase';
import { sendConfirmationEmail, notifyAdminNewSubscriber } from './resend';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  confirmed: boolean;
  confirmation_token: string;
  source: string;
  created_at: string;
  last_sent_at?: string;
}

/**
 * Subscribe a new email to the newsletter
 */
export async function subscribeToNewsletter(email: string) {
  const cleanEmail = email.toLowerCase().trim();
  const token = crypto.randomUUID();
  
  // 1. Save to database
  // Note: We use 'newsletter_subscribers' as requested. Ensure RLS allows insertion.
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{
      email: cleanEmail,
      confirmation_token: token,
      source: 'existencebrief.com',
      confirmed: false
    }])
    .select()
    .single();
    
  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Already subscribed' };
    }
    console.log('Newsletter subscription error:', error);
    return { success: false, error: error.message };
  }
  
  // 2. Try to send email (Wait for result to provide feedback)
  const emailResult = await sendConfirmationEmail(cleanEmail, token);
  
  if (!emailResult.success) {
    console.log('[Newsletter] Email failed but subscriber saved:', cleanEmail);
    // 3. Notify admin anyway if possible
    notifyAdminNewSubscriber(cleanEmail).catch(() => {});
    
    return { 
      success: true, 
      warning: 'Protocol account secured, but confirmation dispatch encountered a deviation. We will manually synchronize your account.',
      data: data as NewsletterSubscriber 
    };
  }
  
  // 4. Notify admin (Silent)
  notifyAdminNewSubscriber(cleanEmail).catch(e => console.log('Admin notification error:', e));
  
  return { success: true, data: data as NewsletterSubscriber };
}

/**
 * Confirm a subscription via token
 */
export async function confirmNewsletterSubscription(token: string) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ 
      confirmed: true, 
      confirmation_token: null // Clear token after use
    })
    .eq('confirmation_token', token)
    .select()
    .single();

  if (error) {
    console.log('Subscription confirmation error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, subscriber: data as NewsletterSubscriber };
}

/**
 * Fetch all confirmed subscribers
 */
export async function getConfirmedSubscribers() {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('confirmed', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error fetching subscribers:', error);
    return [];
  }

  return data as NewsletterSubscriber[];
}
