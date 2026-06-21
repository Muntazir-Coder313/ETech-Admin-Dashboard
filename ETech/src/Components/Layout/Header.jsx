import {
  Bell,
  ChevronDown,
  Filter,
  Menu,
  Plus,
  Search,
  Settings,
  Sun,
  Moon,
  LogOut
} from 'lucide-react'
import React from 'react'
import Profile from '../../Image/Profile.jpg'

function Header({
  sideBarCollapsed,
  onToggleSidebar,
  darkMode,
  toggleTheme,
  onLogout,
  onMobileMenuToggle,
  onPageChange
}) {

  const handleSettingsClick = () => {
    if (onPageChange) onPageChange('settings');
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/40 dark:border-slate-700/40 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-sm">

      <div className="flex items-center justify-between gap-2">

        {/* LEFT */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back, Muntazir 👋
            </p>
          </div>
        </div>

        {/* CENTER SEARCH - Hidden on mobile */}
        <div className="hidden md:block flex-1 max-w-xs lg:max-w-md mx-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-xl
              bg-slate-100 dark:bg-slate-800
              text-slate-800 dark:text-white
              placeholder-slate-400
              border border-slate-200 dark:border-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all text-sm"
            />
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">

          {/* NEW BUTTON - Hidden on small screens */}
          <button className="hidden md:flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition text-sm">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">New</span>
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105"
          >
            {darkMode ? (
              <Sun className="w-4 sm:w-5 h-4 sm:h-5" />
            ) : (
              <Moon className="w-4 sm:w-5 h-4 sm:h-5" />
            )}
          </button>

          {/* ✅ LOGOUT BUTTON – Glassmorphism / Blur Transparent */}
          <button
            onClick={onLogout}
            className="group relative flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl
              bg-white/10 dark:bg-white/5
              backdrop-blur-xl
              border border-white/20 dark:border-white/10
              text-slate-700 dark:text-slate-200
              hover:bg-red-500/20 dark:hover:bg-red-500/20
              hover:border-red-400/50 dark:hover:border-red-400/30
              hover:text-red-600 dark:hover:text-red-400
              transition-all duration-300
              shadow-lg shadow-black/5
              hover:shadow-red-500/20
              hover:scale-105
              text-xs sm:text-sm font-medium
            "
          >
            {/* Glow effect on hover */}
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">Logout</span>
          </button>

          {/* NOTIFICATION */}
          <button className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105">
            <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[8px] sm:text-[10px] font-bold bg-red-500 text-white rounded-full">
              3
            </span>
          </button>

          {/* SETTINGS */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105"
          >
            <Settings className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>

          {/* PROFILE */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-700">
            <img
              src={Profile}
              alt="user"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full ring-2 ring-blue-500 object-cover cursor-pointer hover:ring-3 transition"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Muntazir Mehdi
              </p>
              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
          </div>

        </div>

      </div>
    </div>
  )
}

export default Header