import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDatabase } from './hooks/useDatabase';
import { formatDate } from './utils/dateUtils';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import HabitsManager from './components/HabitsManager';
import Shop from './components/Shop';
import { MoodTracker } from './components/MoodTracker';
import ExportData from './components/ExportData';
import Profile from './components/Profile';
import BugReport from './components/BugReport';
import Calendar from './components/Calendar';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    habits,
    userStats,
    moodEntries,
    purchasedItems,
    loading: dataLoading,
    saveHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    updateUserStats,
    saveMoodEntry,
    purchaseItem,
    refreshData
  } = useDatabase(user?.id);

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Update current streak based on habit completions
  useEffect(() => {
    if (!user?.id || dataLoading || habits.length === 0) return;
    
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
    
    updateUserStats({
      currentStreak
    });
  }, [user?.id, habits, updateUserStats, dataLoading]);

  // Debug logging
  useEffect(() => {
    console.log('App state:', {
      user: user?.id,
      userEmail: user?.email,
      authLoading,
      dataLoading,
      habitsCount: habits.length,
      userStatsCoins: userStats.totalCoins,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
    });
  }, [user, authLoading, dataLoading, habits]);

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <Auth />;
  }

  // Show error if environment variables are missing
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-purple-600 mb-4">Database Setup Required</h1>
          <p className="text-gray-600 mb-4">
            Please connect to Supabase to enable all features like saving habits, moods, and progress.
          </p>
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg mb-4">
            <p className="font-semibold mb-2">🚀 Click "Connect to Supabase" in the top right!</p>
            <p className="text-sm opacity-90">This will set up your personal database automatically.</p>
          </div>
          <div className="text-left bg-gray-50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">What you'll get after connecting:</p>
            <ul className="space-y-1 text-gray-600">
              <li>✅ Save and track your habits</li>
              <li>✅ Record daily moods</li>
              <li>✅ Earn coins and level up</li>
              <li>✅ Shop for rewards</li>
              <li>✅ View progress calendar</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentTab = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your data...</p>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return <Dashboard habits={habits} userStats={userStats} />;
      case 'habits':
        return (
          <HabitsManager 
            habits={habits} 
            onSaveHabit={saveHabit}
            onUpdateHabit={updateHabit}
            onDeleteHabit={deleteHabit}
            onToggleCompletion={toggleHabitCompletion}
            userStats={userStats} 
            onUpdateStats={updateUserStats}
          />
        );
      case 'calendar':
        return (
          <Calendar 
            habits={habits} 
            moodEntries={moodEntries}
          />
        );
      case 'shop':
        return (
          <Shop 
            userStats={userStats} 
            onPurchaseItem={purchaseItem}
            purchasedItems={purchasedItems} 
          />
        );
      case 'mood':
        return (
          <MoodTracker 
            moodEntries={moodEntries} 
            onSaveMoodEntry={saveMoodEntry}
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
            onResetData={refreshData}
          />
        );
      case 'report':
        return <BugReport />;
      default:
        return <Dashboard habits={habits} userStats={userStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-pink-50 via-cute-purple-50 to-cute-blue-50 font-sans">
      {renderCurrentTab()}
      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default App;