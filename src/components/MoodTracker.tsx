import React, { useState } from 'react';
import { MoodEntry } from '../types';
import { formatDate } from '../utils/dateUtils';
import { Calendar, Smile, Frown, Meh, Heart, TrendingUp } from 'lucide-react';

interface MoodTrackerProps {
  moodEntries: MoodEntry[];
  setMoodEntries: (entries: MoodEntry[]) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ moodEntries, setMoodEntries }) => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedMood, setSelectedMood] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [note, setNote] = useState('');

  const today = formatDate(new Date());
  const todayEntry = moodEntries.find(entry => entry.date === today);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
    { value: 2, emoji: '😟', label: 'Sad', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Happy', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Very Happy', color: 'text-blue-500' }
  ];

  const handleMoodSubmit = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        date: selectedDate,
        mood: selectedMood,
        note: note.trim() || undefined
      };
      
      const updatedEntries = moodEntries.filter(entry => entry.date !== selectedDate);
      setMoodEntries([...updatedEntries, newEntry]);
      setSelectedMood(null);
      setNote('');
    }
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return sum / moodEntries.length;
  };

  const getRecentMoods = () => {
    return moodEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };

  const getMoodTrend = () => {
    const recent = getRecentMoods();
    if (recent.length < 2) return 'neutral';
    
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    
    const firstAvg = firstHalf.reduce((acc, entry) => acc + entry.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc, entry) => acc + entry.mood, 0) / secondHalf.length;
    
    if (firstAvg > secondAvg + 0.5) return 'improving';
    if (secondAvg > firstAvg + 0.5) return 'declining';
    return 'stable';
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Mood Tracker
        </h1>
        <Heart className="text-red-500" size={28} />
      </div>

      {/* Today's Mood */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        
        {todayEntry ? (
          <div className="text-center">
            <div className="text-6xl mb-4">{moodOptions[todayEntry.mood - 1].emoji}</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {moodOptions[todayEntry.mood - 1].label}
            </p>
            {todayEntry.note && (
              <p className="text-gray-600 italic">"{todayEntry.note}"</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value as 1 | 2 | 3 | 4 | 5)}
                  className={`p-3 rounded-xl text-3xl transition-all duration-200 ${
                    selectedMood === mood.value
                      ? 'bg-purple-100 scale-110 shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
            
            {selectedMood && (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about your mood (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
                <button
                  onClick={handleMoodSubmit}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                >
                  Save Mood
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mood Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Mood</p>
              <p className="text-2xl font-bold text-purple-600">
                {getAverageMood().toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Smile className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Entries</p>
              <p className="text-2xl font-bold text-blue-600">{moodEntries.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Mood Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Mood Trend</h2>
          <TrendingUp className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            getMoodTrend() === 'improving' ? 'bg-green-500' :
            getMoodTrend() === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          <span className="text-gray-700 capitalize">{getMoodTrend()}</span>
        </div>
      </div>

      {/* Recent Moods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Moods</h2>
        <div className="space-y-3">
          {getRecentMoods().map((entry, index) => (
            <div key={entry.date} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{moodOptions[entry.mood - 1].emoji}</span>
                <div>
                  <p className="text-sm text-gray-600">{entry.date}</p>
                  {entry.note && (
                    <p className="text-xs text-gray-500 italic">"{entry.note}"</p>
                  )}
                </div>
              </div>
              <span className={`text-sm font-medium ${moodOptions[entry.mood - 1].color}`}>
                {moodOptions[entry.mood - 1].label}
              </span>
            </div>
          ))}
        </div>
        
        {moodEntries.length === 0 && (
          <div className="text-center py-8">
            <Meh className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Start tracking your mood today!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;