import React, { useState } from 'react';
import { Habit } from '../types';
import { formatDate, isToday } from '../utils/dateUtils';
import { Plus, Edit2, Trash2, CheckCircle, Circle, Flame, Target, Calendar } from 'lucide-react';

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
    <div className="p-6 pb-24 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Habits
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low (10 coins)</option>
                  <option value="medium">Medium (20 coins)</option>
                  <option value="high">High (30 coins)</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
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
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
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
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 ${
                isCompleted ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={`p-1 rounded-full transition-all duration-200 ${
                      isCompleted 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  <div>
                    <h3 className={`font-semibold ${
                      isCompleted ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(habit)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(habit.priority)}`} />
                    <span className={`text-sm font-medium ${getPriorityTextColor(habit.priority)}`}>
                      {habit.priority.charAt(0).toUpperCase() + habit.priority.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Flame size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-600">{habit.streak}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Target size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-600">{habit.longestStreak}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar size={16} className="text-purple-500" />
                  <span className="text-sm text-gray-600">{habit.completedDates.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No habits yet</h3>
          <p className="text-gray-400 mb-6">Start building better habits today!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            Add Your First Habit
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitsManager;