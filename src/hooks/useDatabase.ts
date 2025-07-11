import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Habit, UserStats, MoodEntry } from '../types';
import { formatDate } from '../utils/dateUtils';

export function useDatabase(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalCoins: 0,
    totalHabitsCompleted: 0,
    currentStreak: 0,
    level: 1
  });
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data when user changes
  useEffect(() => {
    if (userId) {
      loadAllData();
    } else {
      // Reset data when user logs out
      setHabits([]);
      setUserStats({
        totalCoins: 0,
        totalHabitsCompleted: 0,
        currentStreak: 0,
        level: 1
      });
      setMoodEntries([]);
      setPurchasedItems([]);
      setLoading(false);
    }
  }, [userId]);

  const loadAllData = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadHabits(),
        loadUserStats(),
        loadMoodEntries(),
        loadPurchasedItems()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadHabits = async () => {
    if (!userId) return;

    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (habitsError) {
      console.error('Error loading habits:', habitsError);
      return;
    }

    const { data: completionsData, error: completionsError } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId);

    if (completionsError) {
      console.error('Error loading completions:', completionsError);
      return;
    }

    // Transform data to match frontend format
    const transformedHabits: Habit[] = habitsData.map(habit => {
      const completions = completionsData
        .filter(c => c.habit_id === habit.id)
        .map(c => c.completed_date)
        .sort();

      // Calculate streak
      let streak = 0;
      let checkDate = new Date();
      
      while (true) {
        const dateString = formatDate(checkDate);
        if (completions.includes(dateString)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let currentStreak = 0;
      
      for (let i = 0; i < completions.length; i++) {
        if (i === 0) {
          currentStreak = 1;
        } else {
          const prevDate = new Date(completions[i - 1]);
          const currDate = new Date(completions[i]);
          const dayDiff = Math.abs(currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak);

      return {
        id: habit.id,
        name: habit.name,
        description: habit.description,
        priority: habit.priority,
        createdAt: new Date(habit.created_at),
        completedDates: completions,
        streak,
        longestStreak,
        coinsPerCompletion: habit.coins_per_completion
      };
    });

    setHabits(transformedHabits);
  };

  const loadUserStats = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading user stats:', error);
      return;
    }

    if (data) {
      setUserStats({
        totalCoins: data.total_coins,
        totalHabitsCompleted: data.total_habits_completed,
        currentStreak: data.current_streak,
        level: data.level
      });
    }
  };

  const loadMoodEntries = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (error) {
      console.error('Error loading mood entries:', error);
      return;
    }

    const transformedEntries: MoodEntry[] = data.map(entry => ({
      date: entry.entry_date,
      mood: entry.mood as 1 | 2 | 3 | 4 | 5,
      note: entry.note || undefined
    }));

    setMoodEntries(transformedEntries);
  };

  const loadPurchasedItems = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('purchased_items')
      .select('item_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading purchased items:', error);
      return;
    }

    setPurchasedItems(data.map(item => item.item_id));
  };

  const saveHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'longestStreak'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: userId,
        name: habit.name,
        description: habit.description,
        priority: habit.priority,
        coins_per_completion: habit.coinsPerCompletion
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving habit:', error);
      return;
    }

    await loadHabits();
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    if (!userId) return;

    const { error } = await supabase
      .from('habits')
      .update({
        name: updates.name,
        description: updates.description,
        priority: updates.priority,
        coins_per_completion: updates.coinsPerCompletion
      })
      .eq('id', habitId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating habit:', error);
      return;
    }

    await loadHabits();
  };

  const deleteHabit = async (habitId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting habit:', error);
      return;
    }

    await loadHabits();
  };

  const toggleHabitCompletion = async (habitId: string, date: string) => {
    if (!userId) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isCompleted = habit.completedDates.includes(date);

    if (isCompleted) {
      // Remove completion
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('user_id', userId)
        .eq('completed_date', date);

      if (error) {
        console.error('Error removing completion:', error);
        return;
      }

      // Update user stats
      await updateUserStats({
        totalCoins: userStats.totalCoins - habit.coinsPerCompletion,
        totalHabitsCompleted: userStats.totalHabitsCompleted - 1
      });
    } else {
      // Add completion
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: date
        });

      if (error) {
        console.error('Error adding completion:', error);
        return;
      }

      // Update user stats
      const newTotal = userStats.totalHabitsCompleted + 1;
      await updateUserStats({
        totalCoins: userStats.totalCoins + habit.coinsPerCompletion,
        totalHabitsCompleted: newTotal,
        level: Math.floor(newTotal / 10) + 1
      });
    }

    await loadHabits();
  };

  const updateUserStats = async (updates: Partial<UserStats>) => {
    if (!userId) return;

    const { error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        total_coins: updates.totalCoins ?? userStats.totalCoins,
        total_habits_completed: updates.totalHabitsCompleted ?? userStats.totalHabitsCompleted,
        current_streak: updates.currentStreak ?? userStats.currentStreak,
        level: updates.level ?? userStats.level,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating user stats:', error);
      return;
    }

    await loadUserStats();
  };

  const saveMoodEntry = async (entry: MoodEntry) => {
    if (!userId) return;

    const { error } = await supabase
      .from('mood_entries')
      .upsert({
        user_id: userId,
        mood: entry.mood,
        note: entry.note,
        entry_date: entry.date
      });

    if (error) {
      console.error('Error saving mood entry:', error);
      return;
    }

    await loadMoodEntries();
  };

  const purchaseItem = async (itemId: string, price: number) => {
    if (!userId || userStats.totalCoins < price) return;

    const { error } = await supabase
      .from('purchased_items')
      .insert({
        user_id: userId,
        item_id: itemId
      });

    if (error) {
      console.error('Error purchasing item:', error);
      return;
    }

    await updateUserStats({
      totalCoins: userStats.totalCoins - price
    });
    await loadPurchasedItems();
  };

  return {
    habits,
    userStats,
    moodEntries,
    purchasedItems,
    loading,
    saveHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    updateUserStats,
    saveMoodEntry,
    purchaseItem,
    refreshData: loadAllData
  };
}