import React, { useState } from 'react';
import { 
  Eye, EyeOff, Mail, Lock, User, 
  Zap, Shield, Activity, AlertCircle, CheckCircle
} from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    setTimeout(() => {
      const authSuccess = onLogin(username, password);
      if (!authSuccess) {
        setError(true);
        setPassword('');
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    }, 800);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Signing in with ${provider}...`);
    // You can replace this with a real social login flow.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 animate-fade-in">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 border border-white/20 dark:border-slate-700/50">
        
        {/* Left side – brand + illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 lg:p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-2xl shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white drop-shadow-lg">ETech</span>
            </div>
            
            <div className="mt-12 space-y-3">
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-lg">
                Welcome Back!
              </h1>
              <p className="text-blue-100 text-lg font-light drop-shadow">
                Sign in to your dashboard and stay ahead.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all duration-300">
                <div className="bg-white/20 p-2.5 rounded-full">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure & Encrypted</p>
                  <p className="text-blue-100 text-xs">Enterprise-grade security</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all duration-300">
                <div className="bg-white/20 p-2.5 rounded-full">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Real-time Analytics</p>
                  <p className="text-blue-100 text-xs">Live insights at your fingertips</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-blue-200 text-xs mt-8 border-t border-white/10 pt-4">
            <p>© 2026 ETech. All rights reserved by <i className="text-white font-medium">Muntazir Mehdi</i>.</p>
          </div>
        </div>

        {/* Right side – login form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative">
          <div className="md:hidden flex items-center justify-center gap-2 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ETech
            </span>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Sign In</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Enter your credentials to continue.</p>
          </div>

          {/* Social login buttons – using emojis instead of icon components */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <span className="text-base">🔵</span> Google
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <span className="text-base">🐙</span> GitHub
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-800 px-3 text-slate-400">or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username or Email
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(false);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Remember me
              </label>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Invalid username or password. Please try again.</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm p-3 rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Login successful! Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;