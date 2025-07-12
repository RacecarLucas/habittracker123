import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserStats, Habit } from '../types';
import { User, Award, Target, Flame, Calendar, Settings, Trash2, LogOut } from 'lucide-react';

interface ProfileProps {
  userStats: UserStats;
  habits: Habit[];
  onResetData: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  userStats, 
  habits, 
  onResetData
}) => {
  const { signOut } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameSave = () => {
    localStorage.setItem('userName', userName);
    setIsEditingName(false);
  };

  const handleResetData = () => {
    onResetData();
    setShowResetConfirm(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (userStats.totalHabitsCompleted >= 10) {
      achievements.push({ name: 'First 10', icon: '🎯', description: 'Complete 10 habits' });
    }
    if (userStats.totalHabitsCompleted >= 50) {
      achievements.push({ name: 'Half Century', icon: '🏆', description: 'Complete 50 habits' });
    }
    if (userStats.totalHabitsCompleted >= 100) {
      achievements.push({ name: 'Centurion', icon: '👑', description: 'Complete 100 habits' });
    }
    if (userStats.currentStreak >= 7) {
      achievements.push({ name: 'Week Warrior', icon: '⚡', description: '7 day streak' });
    }
    if (userStats.currentStreak >= 30) {
      achievements.push({ name: 'Month Master', icon: '🔥', description: '30 day streak' });
    }
    if (userStats.totalCoins >= 1000) {
      achievements.push({ name: 'Coin Collector', icon: '💰', description: 'Earn 1000 coins' });
    }
    if (habits.length >= 5) {
      achievements.push({ name: 'Habit Hero', icon: '🌟', description: 'Track 5 habits' });
    }
    
    return achievements;
  };

  const getProgressToNextLevel = () => {
    const habitsForNextLevel = userStats.level * 10;
    const progress = (userStats.totalHabitsCompleted % 10) / 10 * 100;
    return { progress, habitsForNextLevel };
  };

  const { progress, habitsForNextLevel } = getProgressToNextLevel();
  const achievements = getAchievements();

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Profile
        </h1>
        <User className="text-purple-600" size={28} />
      </div>

      {/* User Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleNameSave}
                  className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Settings size={16} />
                </button>
              </div>
            )}
            <p className="text-gray-600">Level {userStats.level}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to Level {userStats.level + 1}</span>
            <span>{userStats.totalHabitsCompleted % 10}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Habits</p>
              <p className="text-2xl font-bold text-purple-600">{habits.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Best Streak</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.max(...habits.map(h => h.longestStreak), 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <Award className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{achievement.name}</p>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          ))}
          
          {achievements.length === 0 && (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Start completing habits to earn achievements!</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Activity Summary</h2>
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Completions</span>
            <span className="font-semibold">{userStats.totalHabitsCompleted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Streak</span>
            <span className="font-semibold">{userStats.currentStreak} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Coins</span>
            <span className="font-semibold">{userStats.totalCoins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Average per Habit</span>
            <span className="font-semibold">
              {habits.length > 0 ? Math.round(userStats.totalHabitsCompleted / habits.length) : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-4">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-4">
          This will permanently delete all your data including habits, progress, and achievements.
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          <Trash2 size={16} />
          <span>Reset All Data</span>
        </button>
      </div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Confirm Reset</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all your data? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleResetData}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;