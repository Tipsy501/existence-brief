import { supabase } from './supabase';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = 'onboarding@resend.dev'; // Use Resend's default for instant delivery
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'topogabolekwe@gmail.com';

export async function sendConfirmationEmail(toEmail: string, token: string) {
  const confirmUrl = `${window.location.origin}/confirm-email?token=${token}`;
  
  console.log('[Resend] Attempting to dispatch email to:', toEmail);
  console.log('[Resend] API Key presence:', RESEND_API_KEY ? 'Verified' : 'MISSING');
  
  if (!RESEND_API_KEY) {
    return { success: false, error: 'Strategic transmission key missing.' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Existence Brief <${FROM_EMAIL}>`,
        to: toEmail,
        subject: 'Confirm your subscription to Protocol',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; padding: 40px 20px;">
            <div style="background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
              <h2 style="color: #4f46e5; margin-top: 0; font-size: 24px;">Welcome to Protocol</h2>
              <p style="font-size: 16px; line-height: 24px;">You subscribed to receive high-precision strategic tips every Monday.</p>
              <p style="font-size: 16px; line-height: 24px;">Click below to confirm your insertion into the strategic grid:</p>
              <div style="margin: 32px 0;">
                <a href="${confirmUrl}" 
                   style="display: inline-block; background: #4f46e5; color: white; 
                          padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;">
                  Confirm Subscription
                </a>
              </div>
              <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
                If you didn't request this strategic enlistment, please ignore this email.
              </p>
            </div>
          </div>
        `
      })
    });
    
    console.log('[Resend] API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Resend] Detailed API error:', errorData);
      throw new Error(errorData.message || `HTTP Transmission Error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[Resend] Success payload:', data);
    return { success: true, id: data.id };
    
  } catch (err: any) {
    console.error('[Resend] Strategic dispatch failed:', err);
    return { success: false, error: err.message };
  }
}

export async function sendNewsletterIssue(subscribers: any[], subject: string, content: string) {
  if (!RESEND_API_KEY) {
    console.log('[Resend] API Key missing. Cannot send newsletter.');
    return { success: false, error: 'API Key missing' };
  }

  // Send to each subscriber
  for (const subscriber of subscribers) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `Existence Brief <${FROM_EMAIL}>`,
          to: subscriber.email,
          subject: subject,
          html: content,
          reply_to: ADMIN_EMAIL
        })
      });
      
      if (response.ok) {
        // Update delivery status in database
        await supabase
          .from('newsletter_subscribers')
          .update({ last_sent_at: new Date().toISOString() })
          .eq('id', subscriber.id);
      } else {
        const errorData = await response.json();
        console.log(`Failed to send to ${subscriber.email}:`, errorData.message);
      }
        
    } catch (err) {
      console.log(`Failed to send to ${subscriber.email}:`, err);
    }
  }
  return { success: true };
}

export async function notifyAdminNewSubscriber(email: string) {
  if (!RESEND_API_KEY) return { success: false };

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Existence Brief <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: 'New Protocol Subscriber',
        html: `
          <div style="font-family: sans-serif; color: #1e293b;">
            <h2 style="color: #4f46e5;">New Protocol Subscriber</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p style="font-size: 14px; color: #64748b;">Registration detected in the strategic grid. Check admin dashboard for details.</p>
          </div>
        `
      })
    });
    return { success: true };
  } catch (err) {
    console.log('Admin notification error:', err);
    return { success: false };
  }
}
