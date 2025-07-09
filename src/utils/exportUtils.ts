import { Habit, MoodEntry, UserStats } from '../types';

export const generateProgressReport = (
  habits: Habit[],
  moodEntries: MoodEntry[],
  userStats: UserStats
): string => {
  const currentDate = new Date().toLocaleDateString();
  
  let report = `HABIT TRACKER PROGRESS REPORT\n`;
  report += `Generated on: ${currentDate}\n`;
  report += `═══════════════════════════════════════\n\n`;
  
  // User Stats
  report += `USER STATISTICS\n`;
  report += `Total Coins: ${userStats.totalCoins}\n`;
  report += `Total Habits Completed: ${userStats.totalHabitsCompleted}\n`;
  report += `Current Streak: ${userStats.currentStreak}\n`;
  report += `Level: ${userStats.level}\n\n`;
  
  // Habits Summary
  report += `HABITS SUMMARY\n`;
  report += `Total Habits: ${habits.length}\n`;
  habits.forEach((habit, index) => {
    report += `${index + 1}. ${habit.name}\n`;
    report += `   Priority: ${habit.priority.toUpperCase()}\n`;
    report += `   Current Streak: ${habit.streak} days\n`;
    report += `   Longest Streak: ${habit.longestStreak} days\n`;
    report += `   Completed: ${habit.completedDates.length} times\n\n`;
  });
  
  // Recent Mood Entries
  report += `RECENT MOOD ENTRIES\n`;
  const recentMoods = moodEntries.slice(-7).reverse();
  recentMoods.forEach(entry => {
    const moodEmoji = ['😢', '😟', '😐', '😊', '😄'][entry.mood - 1];
    report += `${entry.date}: ${moodEmoji} (${entry.mood}/5)`;
    if (entry.note) report += ` - ${entry.note}`;
    report += `\n`;
  });
  
  return report;
};

export const downloadProgressReport = (
  habits: Habit[],
  moodEntries: MoodEntry[],
  userStats: UserStats
) => {
  const report = generateProgressReport(habits, moodEntries, userStats);
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-report-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportHabitsAsJson = (habits: Habit[]) => {
  const dataStr = JSON.stringify(habits, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habits-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};