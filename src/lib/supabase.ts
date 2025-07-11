import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          priority: 'low' | 'medium' | 'high';
          coins_per_completion: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          priority?: 'low' | 'medium' | 'high';
          coins_per_completion?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          priority?: 'low' | 'medium' | 'high';
          coins_per_completion?: number;
          created_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
          created_at?: string;
        };
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          mood: number;
          note: string | null;
          entry_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: number;
          note?: string | null;
          entry_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: number;
          note?: string | null;
          entry_date?: string;
          created_at?: string;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          total_coins: number;
          total_habits_completed: number;
          current_streak: number;
          level: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_coins?: number;
          total_habits_completed?: number;
          current_streak?: number;
          level?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_coins?: number;
          total_habits_completed?: number;
          current_streak?: number;
          level?: number;
          updated_at?: string;
        };
      };
      purchased_items: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          purchased_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          purchased_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          purchased_at?: string;
        };
      };
    };
  };
}