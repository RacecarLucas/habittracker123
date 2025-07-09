import React from 'react';
import { Habit, UserStats } from '../types';
import { formatDate, isToday } from '../utils/dateUtils';
import { Calendar, Flame, Trophy, Coins, TrendingUp, Target } from 'lucide-react';

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
    <div className="p-6 pb-24 max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Welcome Back!
        </h1>
        <p className="text-gray-600">Let's check your progress today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Coins</p>
              <p className="text-2xl font-bold">{userStats.totalCoins}</p>
            </div>
            <Coins className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Level</p>
              <p className="text-2xl font-bold">{userStats.level}</p>
            </div>
            <Trophy className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Today's Progress</h2>
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Completion Rate</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed</span>
            <span className="font-semibold">{todayCompletions} / {habits.length}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Streak</p>
              <p className="text-2xl font-bold text-green-600">{Math.round(averageStreak)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Completed</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.totalHabitsCompleted}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Habits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Habits</h2>
        <div className="space-y-3">
          {habits.slice(0, 3).map((habit) => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  habit.priority === 'high' ? 'bg-red-500' :
                  habit.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <span className="text-gray-700">{habit.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600">{habit.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;