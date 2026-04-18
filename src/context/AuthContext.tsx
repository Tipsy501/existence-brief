import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { updateProfile, getProfile, registerReferral } from '../lib/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  continueAsGuest: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('existence_brief_guest') === 'true');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        setIsGuest(false);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const user = session?.user ?? null;
      setUser(user);
      
      if (user) {
        setIsGuest(false);
        localStorage.removeItem('existence_brief_guest');

        // Sync metadata to profile
        const metadata = user.user_metadata;
        if (metadata.full_name || metadata.name || metadata.avatar_url) {
          updateProfile(user.id, {
            full_name: metadata.full_name || metadata.name || null,
            avatar_url: metadata.avatar_url || null
          }).catch(err => console.log('AuthContext: Profile sync failed', err));
        }

        // Viral: Handle referral registration on first login
        const refCode = localStorage.getItem('existence_referral_code');
        if (refCode) {
          getProfile(user.id).then(profile => {
            if (profile && !profile.referred_by) {
              registerReferral(refCode, user.id).then(() => {
                localStorage.removeItem('existence_referral_code');
              }).catch(err => console.log('AuthContext: Referral registration failed', err));
            } else if (profile?.referred_by) {
              localStorage.removeItem('existence_referral_code'); // Clean up if already referred
            }
          });
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('AuthContext: Initiating signUp for', email);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${siteUrl}/login?confirmed=true`,
          data: metadata
        }
      });
      
      if (result.error) {
        console.warn('AuthContext: signUp error', result.error.message);
      } else {
        console.log('AuthContext: signUp success');
      }
      
      return result;
    } catch (err: any) {
      console.log('AuthContext: Unexpected signUp error', err);
      return { data: { user: null, session: null }, error: err };
    } finally {
      setLoading(false); // Critical: Ensure loading is unset
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Initiating signIn for', email);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) {
        console.warn('AuthContext: signIn error', result.error.message);
      } else {
        console.log('AuthContext: signIn success');
      }
      
      return result;
    } catch (err: any) {
      console.log('AuthContext: Unexpected signIn error', err);
      return { data: { user: null, session: null }, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsGuest(false);
    localStorage.removeItem('existence_brief_guest');
  };

  const resetPassword = async (email: string) => {
    const result = await supabase.auth.resetPasswordForEmail(email);
    return result;
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('existence_brief_guest', 'true');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isGuest,
      signUp, 
      signIn, 
      signOut, 
      resetPassword,
      continueAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
}
