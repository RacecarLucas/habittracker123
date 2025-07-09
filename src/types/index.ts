export interface Habit {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  completedDates: string[];
  streak: number;
  longestStreak: number;
  coinsPerCompletion: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  purchased: boolean;
}

export interface MoodEntry {
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface UserStats {
  totalCoins: number;
  totalHabitsCompleted: number;
  currentStreak: number;
  level: number;
}