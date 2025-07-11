import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDatabase } from './hooks/useDatabase';
import { formatDate } from './utils/dateUtils';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import HabitsManager from './components/HabitsManager';
import Shop from './components/Shop';
import MoodTracker from './components/MoodTracker';
import ExportData from './components/ExportData';
import Profile from './components/Profile';

function App() {
  const { user, loading: authLoading } = useAuth();
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
    
    updateUserStats({
      currentStreak
    });
  }, [habits, updateUserStats]);

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