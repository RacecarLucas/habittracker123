import React from 'react';
import { Habit, UserStats } from '../types';
import { formatDate, isToday } from '../utils/dateUtils';
import { Calendar, Flame, Trophy, Coins, TrendingUp, Target, Sparkles, Heart } from 'lucide-react';

interface DashboardProps {
  habits: Habit[];
  userStats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, userStats }) => {
  const today = formatDate(new Date());
  const todayCompletions = habits.filter(habit => 
    habit.completedDates.includes(today)
  ).length;
  
  const completionRate = habits.length > 0 ? (todayCompletions / habits.length) * 100 : 0;
  
  const activeHabits = habits.filter(habit => habit.streak > 0);
  const averageStreak = activeHabits.length > 0 
    ? activeHabits.reduce((sum, habit) => sum + habit.streak, 0) / activeHabits.length 
    : 0;

  return (
    <div className="p-6 pb-24 max-w-md mx-auto font-sans">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-8 w-8 text-cute-pink-500" />
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-cute-pink-600 to-cute-purple-600 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <Heart className="h-6 w-6 text-cute-pink-400" />
        </div>
        <p className="text-cute-purple-600 font-medium">Let's check your cute progress today ✨</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cute-pink-400 to-cute-pink-500 p-6 rounded-super-cute text-white shadow-cute">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cute-pink-100 text-sm font-semibold">Total Coins</p>
              <p className="text-3xl font-display font-bold">{userStats.totalCoins}</p>
            </div>
            <Coins className="h-10 w-10 text-cute-pink-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-cute-purple-400 to-cute-purple-500 p-6 rounded-super-cute text-white shadow-cute">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cute-purple-100 text-sm font-semibold">Level</p>
              <p className="text-3xl font-display font-bold">{userStats.level}</p>
            </div>
            <Trophy className="h-10 w-10 text-cute-purple-200" />
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-cute-purple-800">Today's Progress</h2>
          <Calendar className="h-6 w-6 text-cute-pink-500" />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-cute-purple-600 font-semibold mb-2">
              <span>Completion Rate</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-cute-pink-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cute-green-400 to-cute-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-cute-purple-600 font-medium">Completed</span>
            <span className="font-bold text-cute-pink-600">{todayCompletions} / {habits.length}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cute-purple-600 text-sm font-semibold">Current Streak</p>
              <p className="text-3xl font-display font-bold text-orange-500">{userStats.currentStreak}</p>
            </div>
            <div className="p-4 bg-orange-100 rounded-full shadow-cute">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cute-purple-600 text-sm font-semibold">Average Streak</p>
              <p className="text-3xl font-display font-bold text-cute-green-500">{Math.round(averageStreak)}</p>
            </div>
            <div className="p-4 bg-cute-green-100 rounded-full shadow-cute">
              <TrendingUp className="h-8 w-8 text-cute-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cute-purple-600 text-sm font-semibold">Total Completed</p>
              <p className="text-3xl font-display font-bold text-cute-purple-600">{userStats.totalHabitsCompleted}</p>
            </div>
            <div className="p-4 bg-cute-purple-100 rounded-full shadow-cute">
              <Target className="h-8 w-8 text-cute-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Habits */}
      <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-6">
        <h2 className="text-xl font-display font-bold text-cute-purple-800 mb-4">Recent Habits</h2>
        <div className="space-y-3">
          {habits.slice(0, 3).map((habit) => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  habit.priority === 'high' ? 'bg-red-400' :
                  habit.priority === 'medium' ? 'bg-cute-yellow-400' : 'bg-cute-green-400'
                }`} />
                <span className="text-cute-purple-700 font-medium">{habit.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="text-sm text-cute-purple-600 font-semibold">{habit.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;