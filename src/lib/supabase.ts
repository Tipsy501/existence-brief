import { createClient } from '@supabase/supabase-js';

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

const getEnv = (key: string) => {
  if (isNode) {
    return process.env[key];
  }
  // @ts-ignore - Vite specific
  return import.meta.env ? import.meta.env[key] : null;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');
const siteUrl = getEnv('VITE_SITE_URL') || (typeof window !== 'undefined' ? window.location.origin : 'https://existencebrief.com');

if (!supabaseUrl || !supabaseKey) {
  console.log('Supabase configuration deviation. Verify env variables.');
}

console.log('Initializing Supabase client with Site URL:', siteUrl);
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: { 'X-Client-Info': 'existence-brief' }
    }
  }
);
