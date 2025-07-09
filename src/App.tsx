import React, { useState, useEffect } from 'react';
import { Habit, UserStats, MoodEntry } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { formatDate } from './utils/dateUtils';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import HabitsManager from './components/HabitsManager';
import Shop from './components/Shop';
import MoodTracker from './components/MoodTracker';
import ExportData from './components/ExportData';
import Profile from './components/Profile';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [userStats, setUserStats] = useLocalStorage<UserStats>('userStats', {
    totalCoins: 0,
    totalHabitsCompleted: 0,
    currentStreak: 0,
    level: 1
  });
  const [purchasedItems, setPurchasedItems] = useLocalStorage<string[]>('purchasedItems', []);
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('moodEntries', []);

  // Update current streak based on habit completions
  useEffect(() => {
    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    const todayCompletions = habits.filter(habit => 
      habit.completedDates.includes(today)
    ).length;
    
    const yesterdayCompletions = habits.filter(habit => 
      habit.completedDates.includes(yesterday)
    ).length;
    
    // Calculate streak based on consecutive days of completing at least one habit
    let currentStreak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateString = formatDate(checkDate);
      const dayCompletions = habits.filter(habit => 
        habit.completedDates.includes(dateString)
      ).length;
      
      if (dayCompletions > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setUserStats(prev => ({
      ...prev,
      currentStreak
    }));
  }, [habits, setUserStats]);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard habits={habits} userStats={userStats} />;
      case 'habits':
        return (
          <HabitsManager 
            habits={habits} 
            setHabits={setHabits} 
            userStats={userStats} 
            setUserStats={setUserStats} 
          />
        );
      case 'shop':
        return (
          <Shop 
            userStats={userStats} 
            setUserStats={setUserStats} 
            purchasedItems={purchasedItems} 
            setPurchasedItems={setPurchasedItems} 
          />
        );
      case 'mood':
        return (
          <MoodTracker 
            moodEntries={moodEntries} 
            setMoodEntries={setMoodEntries} 
          />
        );
      case 'export':
        return (
          <ExportData 
            habits={habits} 
            moodEntries={moodEntries} 
            userStats={userStats} 
          />
        );
      case 'profile':
        return (
          <Profile 
            userStats={userStats} 
            habits={habits} 
            setHabits={setHabits} 
            setUserStats={setUserStats} 
            setPurchasedItems={setPurchasedItems} 
            setMoodEntries={setMoodEntries} 
          />
        );
      default:
        return <Dashboard habits={habits} userStats={userStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {renderCurrentTab()}
      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default App;