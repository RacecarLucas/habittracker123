import React, { useState } from 'react';
import { Habit } from '../types';
import { formatDate, isToday } from '../utils/dateUtils';
import { Plus, Edit2, Trash2, CheckCircle, Circle, Flame, Target, Calendar, Sparkles, Heart } from 'lucide-react';

interface HabitsManagerProps {
  habits: Habit[];
  onSaveHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'longestStreak'>) => void;
  onUpdateHabit: (habitId: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (habitId: string) => void;
  onToggleCompletion: (habitId: string, date: string) => void;
  userStats: any;
  onUpdateStats: (stats: any) => void;
}

const HabitsManager: React.FC<HabitsManagerProps> = ({ 
  habits, 
  onSaveHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleCompletion,
  userStats, 
  onUpdateStats
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const today = formatDate(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHabit) {
      // Update existing habit
      onUpdateHabit(editingHabit.id, formData);
      setEditingHabit(null);
    } else {
      // Add new habit
      const newHabit = {
        name: formData.name,
        description: formData.description,
        priority: formData.priority,
        coinsPerCompletion: formData.priority === 'high' ? 30 : formData.priority === 'medium' ? 20 : 10
      };
      onSaveHabit(newHabit);
    }
    
    setFormData({ name: '', description: '', priority: 'medium' });
    setShowAddForm(false);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      priority: habit.priority
    });
    setShowAddForm(true);
  };

  const handleDelete = (habitId: string) => {
    onDeleteHabit(habitId);
  };

  const toggleHabitCompletion = (habitId: string) => {
    onToggleCompletion(habitId, today);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-cute-pink-500" />
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-cute-pink-600 to-cute-purple-600 bg-clip-text text-transparent">
            My Habits
          </h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-cute-pink-500 to-cute-purple-500 text-white px-5 py-3 rounded-super-cute font-semibold hover:from-cute-pink-600 hover:to-cute-purple-600 transition-all duration-200 flex items-center space-x-2 shadow-cute"
        >
          <Plus size={22} />
          <span>Add</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-super-cute p-8 w-full max-w-md shadow-cute-lg">
            <h2 className="text-2xl font-display font-bold text-cute-purple-800 mb-6">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="low">Low (10 coins)</option>
                  <option value="medium">Medium (20 coins)</option>
                  <option value="high">High (30 coins)</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cute-pink-500 to-cute-purple-500 text-white py-3 rounded-cute font-semibold hover:from-cute-pink-600 hover:to-cute-purple-600 transition-all duration-200 shadow-cute"
                >
                  {editingHabit ? 'Update' : 'Add'} Habit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingHabit(null);
                    setFormData({ name: '', description: '', priority: 'medium' });
                  }}
                  className="flex-1 bg-cute-pink-100 text-cute-purple-700 py-3 rounded-cute font-semibold hover:bg-cute-pink-200 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(today);
          
          return (
            <div
              key={habit.id}
              className={`bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-6 transition-all duration-300 ${
                isCompleted ? 'ring-2 ring-cute-green-300 bg-cute-green-50' : 'hover:shadow-cute-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isCompleted 
                        ? 'text-cute-green-600 hover:text-cute-green-700 bg-cute-green-100' 
                        : 'text-gray-400 hover:text-cute-pink-500 hover:bg-cute-pink-50'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={26} /> : <Circle size={26} />}
                  </button>
                  <div>
                    <h3 className={`font-semibold ${
                      isCompleted ? 'text-cute-green-800' : 'text-cute-purple-800'
                    }`}>
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <p className="text-sm text-cute-purple-600 mt-1">{habit.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(habit)}
                    className="p-2 text-gray-500 hover:text-cute-purple-600 hover:bg-cute-purple-100 rounded-cute transition-all duration-200"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-cute transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(habit.priority)}`} />
                    <span className={`text-sm font-semibold ${getPriorityTextColor(habit.priority)}`}>
                      {habit.priority.charAt(0).toUpperCase() + habit.priority.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Flame size={18} className="text-orange-400" />
                    <span className="text-sm text-cute-purple-600 font-semibold">{habit.streak}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Target size={18} className="text-cute-blue-500" />
                    <span className="text-sm text-cute-purple-600 font-semibold">{habit.longestStreak}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar size={18} className="text-cute-pink-500" />
                  <span className="text-sm text-cute-purple-600 font-semibold">{habit.completedDates.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-20 w-20 text-cute-pink-300 mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-cute-purple-600 mb-2">No habits yet</h3>
          <p className="text-cute-purple-500 mb-6">Start building cute habits today! ✨</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-cute-pink-500 to-cute-purple-500 text-white px-8 py-4 rounded-super-cute font-semibold hover:from-cute-pink-600 hover:to-cute-purple-600 transition-all duration-200 shadow-cute"
          >
            Add Your First Habit
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitsManager;