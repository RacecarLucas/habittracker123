import React, { useState } from 'react';
import { Habit, MoodEntry } from '../types';
import { formatDate } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Heart, Sparkles, CheckCircle } from 'lucide-react';

interface CalendarProps {
  habits: Habit[];
  moodEntries: MoodEntry[];
}

const Calendar: React.FC<CalendarProps> = ({ habits, moodEntries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const moodEmojis = ['😢', '😟', '😐', '😊', '😄'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayData = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = formatDate(date);
    
    // Get completed habits for this day
    const completedHabits = habits.filter(habit => 
      habit.completedDates.includes(dateString)
    );
    
    // Get mood entry for this day
    const moodEntry = moodEntries.find(entry => entry.date === dateString);
    
    // Calculate completion percentage
    const completionRate = habits.length > 0 ? (completedHabits.length / habits.length) * 100 : 0;
    
    return {
      dateString,
      completedHabits,
      moodEntry,
      completionRate,
      isToday: dateString === formatDate(today),
      isFuture: date > today
    };
  };

  const getCompletionColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-100';
    if (rate < 50) return 'bg-cute-yellow-200';
    if (rate < 100) return 'bg-cute-blue-200';
    return 'bg-cute-green-200';
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 bg-gray-50 rounded-cute"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = getDayData(day);
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dayData.dateString)}
          className={`h-20 p-2 rounded-cute border-2 cursor-pointer transition-all duration-200 hover:shadow-cute ${
            dayData.isToday 
              ? 'border-cute-pink-400 bg-cute-pink-50' 
              : 'border-cute-pink-100 bg-white hover:border-cute-pink-200'
          } ${dayData.isFuture ? 'opacity-50' : ''}`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-semibold ${
              dayData.isToday ? 'text-cute-pink-600' : 'text-cute-purple-700'
            }`}>
              {day}
            </span>
            {dayData.moodEntry && (
              <span className="text-lg">
                {moodEmojis[dayData.moodEntry.mood - 1]}
              </span>
            )}
          </div>
          
          {!dayData.isFuture && habits.length > 0 && (
            <div className="space-y-1">
              <div className={`h-2 rounded-full ${getCompletionColor(dayData.completionRate)}`}>
                <div 
                  className="h-full bg-cute-green-400 rounded-full transition-all duration-300"
                  style={{ width: `${dayData.completionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-cute-purple-600 font-medium">
                  {dayData.completedHabits.length}/{habits.length}
                </span>
                {dayData.completionRate === 100 && (
                  <CheckCircle className="h-3 w-3 text-cute-green-500" />
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const selectedDayData = selectedDate ? getDayData(new Date(selectedDate).getDate()) : null;

  return (
    <div className="p-6 pb-24 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-8 w-8 text-cute-pink-500" />
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-cute-pink-600 to-cute-purple-600 bg-clip-text text-transparent">
            Calendar
          </h1>
        </div>
        <Sparkles className="text-cute-purple-500" size={28} />
      </div>

      {/* Month Navigation */}
      <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-cute-purple-600 hover:text-cute-pink-600 hover:bg-cute-pink-50 rounded-cute transition-all duration-200"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h2 className="text-xl font-display font-bold text-cute-purple-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-cute-purple-600 hover:text-cute-pink-600 hover:bg-cute-pink-50 rounded-cute transition-all duration-200"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-cute-purple-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-4 mb-6">
        <h3 className="font-display font-bold text-cute-purple-800 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-sm text-cute-purple-600 font-medium">No habits completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-cute-yellow-200 rounded"></div>
            <span className="text-sm text-cute-purple-600 font-medium">Some habits completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-cute-blue-200 rounded"></div>
            <span className="text-sm text-cute-purple-600 font-medium">Most habits completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-cute-green-200 rounded"></div>
            <span className="text-sm text-cute-purple-600 font-medium">All habits completed</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">😊</span>
            <span className="text-sm text-cute-purple-600 font-medium">Mood recorded</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && selectedDayData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-super-cute p-6 w-full max-w-md shadow-cute-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-cute-purple-800">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 text-gray-500 hover:text-cute-purple-600 hover:bg-cute-purple-100 rounded-cute transition-all duration-200"
              >
                ✕
              </button>
            </div>

            {/* Mood for the day */}
            {selectedDayData.moodEntry ? (
              <div className="bg-cute-pink-50 rounded-cute p-4 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Heart className="h-5 w-5 text-cute-pink-500" />
                  <span className="font-semibold text-cute-purple-800">Mood</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{moodEmojis[selectedDayData.moodEntry.mood - 1]}</span>
                  <div>
                    <p className="font-medium text-cute-purple-700">
                      {['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'][selectedDayData.moodEntry.mood - 1]}
                    </p>
                    {selectedDayData.moodEntry.note && (
                      <p className="text-sm text-cute-purple-600 italic">"{selectedDayData.moodEntry.note}"</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-cute p-4 mb-4">
                <p className="text-gray-500 text-center">No mood recorded for this day</p>
              </div>
            )}

            {/* Habits for the day */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-cute-purple-800">Habits Progress</h3>
                <span className="text-sm text-cute-purple-600 font-medium">
                  {selectedDayData.completedHabits.length}/{habits.length} completed
                </span>
              </div>
              
              {habits.length > 0 ? (
                <div className="space-y-2">
                  {habits.map(habit => {
                    const isCompleted = selectedDayData.completedHabits.some(h => h.id === habit.id);
                    return (
                      <div
                        key={habit.id}
                        className={`flex items-center space-x-3 p-3 rounded-cute ${
                          isCompleted ? 'bg-cute-green-50 border border-cute-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <CheckCircle 
                          className={`h-5 w-5 ${
                            isCompleted ? 'text-cute-green-500' : 'text-gray-300'
                          }`} 
                        />
                        <span className={`font-medium ${
                          isCompleted ? 'text-cute-green-800' : 'text-gray-600'
                        }`}>
                          {habit.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No habits to track</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;