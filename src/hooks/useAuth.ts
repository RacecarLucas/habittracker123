import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id ? 'User logged in' : 'No user');
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Session error:', error);
      if (error.message && error.message.includes('Invalid Refresh Token')) {
        supabase.auth.signOut();
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id ? 'User logged in' : 'No user');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (data.user && !error) {
      // Create user profile and initial stats
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email!,
        name
      });

      await supabase.from('user_stats').insert({
        user_id: data.user.id,
        total_coins: 0,
        total_habits_completed: 0,
        current_streak: 0,
        level: 1
      });
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({
      password: newPassword
    });
  };
  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    updatePassword
  };
}