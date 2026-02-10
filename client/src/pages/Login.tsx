// client/src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const effectiveLoading = isLoading || authLoading;
  const effectiveError = error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex">
      {/* Left Side - Hero Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        
        {/* Abstract geometric patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-yellow-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-pink-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-green-300 rounded-full blur-lg"></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          {/* Floating financial elements illustration */}
          <div className="mb-8 relative">
            <div className="w-80 h-80 relative">
              {/* Central dashboard mockup */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 transform rotate-3">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-400 rounded-lg"></div>
                    <div className="h-4 bg-white/30 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/20 rounded w-full"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <div className="h-12 bg-green-400/30 rounded flex-1"></div>
                    <div className="h-8 bg-blue-400/30 rounded flex-1"></div>
                    <div className="h-16 bg-purple-400/30 rounded flex-1"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating credit card */}
              <div className="absolute -top-4 -right-4 w-24 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                <div className="p-2">
                  <div className="w-4 h-3 bg-white/30 rounded mb-1"></div>
                  <div className="w-8 h-2 bg-white/50 rounded"></div>
                </div>
              </div>
              
              {/* Floating coins */}
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-yellow-800 font-bold text-lg transform hover:scale-110 transition-transform duration-300">
                $
              </div>
              
              {/* Growth chart */}
              <div className="absolute top-4 -left-8 w-20 h-16 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 p-2">
                <div className="flex items-end justify-between h-full space-x-1">
                  <div className="w-2 bg-green-400 rounded-t h-1/3"></div>
                  <div className="w-2 bg-green-400 rounded-t h-1/2"></div>
                  <div className="w-2 bg-green-400 rounded-t h-2/3"></div>
                  <div className="w-2 bg-green-400 rounded-t h-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Take Control of Your Finances
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Track expenses, manage budgets, and grow your wealth with intelligent financial insights.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-green-400 rounded"></div>
              </div>
              <p className="text-sm text-blue-100">Smart Categorization</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-400 rounded"></div>
              </div>
              <p className="text-sm text-blue-100">Real-time Sync</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-400 rounded"></div>
              </div>
              <p className="text-sm text-blue-100">Secure & Private</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Sign in to your FinTrack account
            </p>
          </div>

          {/* Error Message */}
          {effectiveError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{effectiveError}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Sign in with your FinTrack username and password.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="your_username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={effectiveLoading}
              className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-lg font-semibold"
            >
              {effectiveLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Don't have an account?{' '}
              <button 
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                onClick={() => navigate('/register')}
              >
                Sign up for free
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
