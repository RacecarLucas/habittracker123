import React from 'react';
import { Habit, MoodEntry, UserStats } from '../types';
import { downloadProgressReport, exportHabitsAsJson } from '../utils/exportUtils';
import { Download, FileText, Database, Image, Share2 } from 'lucide-react';

interface ExportDataProps {
  habits: Habit[];
  moodEntries: MoodEntry[];
  userStats: UserStats;
}

const ExportData: React.FC<ExportDataProps> = ({ habits, moodEntries, userStats }) => {
  const handleProgressReport = () => {
    downloadProgressReport(habits, moodEntries, userStats);
  };

  const handleExportHabits = () => {
    exportHabitsAsJson(habits);
  };

  const handleShareProgress = () => {
    const shareText = `I've completed ${userStats.totalHabitsCompleted} habits and earned ${userStats.totalCoins} coins! 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Habit Tracker Progress',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    }
  };

  const generateScreenshotData = () => {
    // Create a summary card for screenshot
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#3B82F6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('My Habit Tracker Progress', 400, 80);
    
    // Stats
    ctx.font = '32px Arial';
    ctx.fillText(`Level ${userStats.level}`, 400, 150);
    
    ctx.font = '24px Arial';
    ctx.fillText(`${userStats.totalCoins} Coins Earned`, 400, 200);
    ctx.fillText(`${userStats.totalHabitsCompleted} Habits Completed`, 400, 240);
    ctx.fillText(`${userStats.currentStreak} Day Streak`, 400, 280);
    
    // Habits list
    ctx.font = '20px Arial';
    ctx.fillText('Active Habits:', 400, 340);
    
    habits.slice(0, 5).forEach((habit, index) => {
      ctx.fillText(`• ${habit.name} (${habit.streak} days)`, 400, 380 + (index * 30));
    });
    
    // Download the image
    const link = document.createElement('a');
    link.download = `habit-progress-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportOptions = [
    {
      id: 'progress-report',
      title: 'Progress Report',
      description: 'Download a detailed text report of your progress',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      action: handleProgressReport
    },
    {
      id: 'habits-backup',
      title: 'Habits Backup',
      description: 'Export your habits data as JSON file',
      icon: Database,
      color: 'from-green-500 to-green-600',
      action: handleExportHabits
    },
    {
      id: 'progress-image',
      title: 'Progress Image',
      description: 'Generate a shareable progress image',
      icon: Image,
      color: 'from-purple-500 to-purple-600',
      action: generateScreenshotData
    },
    {
      id: 'share-progress',
      title: 'Share Progress',
      description: 'Share your achievements with others',
      icon: Share2,
      color: 'from-pink-500 to-pink-600',
      action: handleShareProgress
    }
  ];

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Export Data
        </h1>
        <Download className="text-purple-600" size={28} />
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Progress Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{userStats.totalCoins}</p>
            <p className="text-sm text-gray-600">Total Coins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{userStats.totalHabitsCompleted}</p>
            <p className="text-sm text-gray-600">Habits Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{habits.length}</p>
            <p className="text-sm text-gray-600">Active Habits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{moodEntries.length}</p>
            <p className="text-sm text-gray-600">Mood Entries</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          
          return (
            <button
              key={option.id}
              onClick={option.action}
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color} text-white`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Data Info */}
      <div className="bg-gray-50 rounded-xl p-6 mt-6">
        <h3 className="font-semibold text-gray-800 mb-2">Data Information</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• All data is stored locally in your browser</p>
          <p>• Exports include all your habits, completions, and mood entries</p>
          <p>• Progress images are generated client-side</p>
          <p>• JSON backups can be used to restore your data</p>
        </div>
      </div>
    </div>
  );
};

export default ExportData;