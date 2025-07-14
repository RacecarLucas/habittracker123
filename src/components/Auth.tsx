import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Heart, Mail, Lock, UserPlus, LogIn, Chrome, Sparkles } from 'lucide-react';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp, signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if environment variables are set
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError('Database connection not configured. Please check environment variables.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cute-pink-50 via-cute-purple-50 to-cute-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-super-cute shadow-cute-lg border border-cute-pink-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cute-pink-400 to-cute-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-cute">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-cute-pink-600 to-cute-purple-600 bg-clip-text text-transparent mb-2">
            Habit Tracker
          </h1>
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Sparkles className="h-4 w-4 text-cute-pink-400" />
            <span className="text-cute-purple-600 font-medium">Build cute habits daily</span>
            <Sparkles className="h-4 w-4 text-cute-pink-400" />
          </div>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cute-pink-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cute-pink-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cute-pink-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-cute p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cute-pink-500 to-cute-purple-500 text-white py-4 rounded-cute font-semibold hover:from-cute-pink-600 hover:to-cute-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-cute"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-cute-pink-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-cute-purple-600 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-4 w-full bg-white border-2 border-cute-pink-200 text-cute-purple-700 py-4 rounded-cute font-semibold hover:bg-cute-pink-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-cute"
          >
            <Chrome size={20} className="text-cute-blue-500" />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-cute-pink-600 hover:text-cute-pink-700 font-semibold"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;