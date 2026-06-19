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
  onLogout
}) {
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/40 dark:border-slate-700/40 px-6 py-4 shadow-sm">

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center space-x-4">

          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-xl font-black text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back, Muntazir 👋
            </p>
          </div>

        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">

            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" />

            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl
              bg-slate-100 dark:bg-slate-800
              text-slate-800 dark:text-white
              placeholder-slate-400
              border border-slate-200 dark:border-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all"
            />

            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-3">

          {/* NEW BUTTON */}
          <button className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New</span>
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onLogout}
            className="hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500  text-white shadow-lg hover:shadow-xl hover:scale-105 transition"
          >
            <LogOut className="w-4 h-4" />

            Logout
          </button>

          {/* NOTIFICATION */}
          <button className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105">

            <Bell className="w-5 h-5" />

            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
              3
            </span>

          </button>

          {/* SETTINGS */}
          <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105">
            <Settings className="w-5 h-5" />
          </button>

          {/* PROFILE */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700">

            <img
              src={Profile}
              alt="user"
              className="w-9 h-9 rounded-full ring-2 ring-blue-500"
            />

            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Muntazir Mehdi
              </p>
              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400" />

          </div>

        </div>

      </div>
    </div>
  )
}

export default Header