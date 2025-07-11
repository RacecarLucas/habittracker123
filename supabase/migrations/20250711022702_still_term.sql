/*
  # Create Habit Tracker Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamp)
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `priority` (text)
      - `coins_per_completion` (integer)
      - `created_at` (timestamp)
    - `habit_completions`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `completed_date` (date)
      - `created_at` (timestamp)
    - `mood_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `mood` (integer)
      - `note` (text, optional)
      - `entry_date` (date)
      - `created_at` (timestamp)
    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `total_coins` (integer)
      - `total_habits_completed` (integer)
      - `current_streak` (integer)
      - `level` (integer)
      - `updated_at` (timestamp)
    - `purchased_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `item_id` (text)
      - `purchased_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT 'User',
  created_at timestamptz DEFAULT now()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  coins_per_completion integer DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

-- Create habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  completed_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

-- Create mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  mood integer NOT NULL CHECK (mood >= 1 AND mood <= 5),
  note text,
  entry_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

-- Create user stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_coins integer DEFAULT 0,
  total_habits_completed integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  level integer DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

-- Create purchased items table
CREATE TABLE IF NOT EXISTS purchased_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  item_id text NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create RLS policies for habits
CREATE POLICY "Users can manage own habits"
  ON habits
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for habit completions
CREATE POLICY "Users can manage own habit completions"
  ON habit_completions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for mood entries
CREATE POLICY "Users can manage own mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for user stats
CREATE POLICY "Users can manage own stats"
  ON user_stats
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for purchased items
CREATE POLICY "Users can manage own purchased items"
  ON purchased_items
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(completed_date);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_date ON mood_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_purchased_items_user_id ON purchased_items(user_id);