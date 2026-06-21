import React, { useState } from 'react'
import {
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Zap,
  X
} from 'lucide-react'
import Profile from '../../Image/Profile.jpg'

const menuitems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    badge: "New",
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    submenu: [
      { id: "overview", label: "Overview" },
      { id: "reports", label: "Reports" },
      { id: "insights", label: "Insights" },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    count: "2.4k",
    submenu: [
      { id: "users", label: "All Users" },
      { id: "roles", label: "Roles & Permissions" },
      { id: "activity", label: "User Activity" },
    ],
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    label: "E-commerce",
    submenu: [
      { id: "products", label: "Products" },
      { id: "orders", label: "Orders" },
      { id: "customers", label: "Customers" },
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    count: "847",
  },
  {
    id: "transactions",
    icon: CreditCard,
    label: "Transactions",
  },
  {
    id: "messages",
    icon: MessagesSquare,
    label: "Messages",
    badge: "12",
  },
  {
    id: "calendar",
    icon: Calendar,
    label: "Calendar",
  },
  {
    id: "report",
    icon: FileText,
    label: "Report",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
  },
]

function SideBar({ collapsed, currentPage, onPageChange, onMobileClose }) {
  const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]))

  const toggleExpanded = (id) => {
    const updated = new Set(expandedItems)
    updated.has(id) ? updated.delete(id) : updated.add(id)
    setExpandedItems(updated)
  }

  const adminName = "Muntazir Mehdi"
  const adminRole = "Administrator"
  const initials = adminName.split(' ').map(n => n[0]).join('')

  const handleProfileClick = () => {
    onPageChange('settings')
    if (onMobileClose) onMobileClose()
  }

  const handleNavClick = (page) => {
    onPageChange(page)
    if (onMobileClose) onMobileClose()
  }

  return (
    <div className={`
      ${collapsed ? "w-20" : "w-72"}
      h-full flex flex-col
      bg-white/95 dark:bg-slate-900/95
      backdrop-blur-2xl
      border-r border-slate-200/40 dark:border-slate-700/40
      transition-all duration-300
      shadow-2xl
      relative
    `}>
      {/* Close button on mobile - more beautiful */}
      <button
        onClick={onMobileClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-110 transition-transform lg:hidden shadow-lg z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* LOGO - enhanced */}
      <div className="p-4 sm:p-5 flex items-center space-x-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg animate-pulse-slow">
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ETech
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              Admin Dashboard
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION - improved for mobile */}
      <nav className="flex-1 px-2 sm:px-3 space-y-1 overflow-y-auto pb-4">
        {menuitems.map((item) => {
          const isActive = currentPage === item.id
          return (
            <div key={item.id} className="relative">
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              )}
              <button
                onClick={() => {
                  if (item.submenu) toggleExpanded(item.id)
                  else handleNavClick(item.id)
                }}
                className={`
                  w-full flex items-center justify-between
                  px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                  transition-all duration-300
                  group relative
                  ${isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }
                `}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="font-medium text-xs sm:text-sm truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-red-500 text-white rounded-full flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {!collapsed && item.submenu && (
                  <ChevronDown
                    className={`
                      w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 flex-shrink-0
                      ${expandedItems.has(item.id) ? "rotate-180" : ""}
                    `}
                  />
                )}
              </button>
              {!collapsed && item.submenu && expandedItems.has(item.id) && (
                <div className="ml-6 sm:ml-8 mt-1 space-y-1 border-l-2 border-blue-400/30 pl-2 sm:pl-3">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`
                        w-full text-left text-xs sm:text-sm px-3 py-1.5 sm:py-2 rounded-lg transition-all
                        ${
                          currentPage === sub.id
                            ? "bg-blue-500 text-white shadow-md"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }
                      `}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* PROFILE SECTION - Enhanced for mobile */}
      {!collapsed && (
        <div className="p-3 sm:p-4 border-t border-slate-200/40 dark:border-slate-700/40 bg-gradient-to-t from-slate-50/50 to-transparent dark:from-slate-800/30">
          <button
            onClick={handleProfileClick}
            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
          >
            <div className="relative group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl bg-gradient-to-r from-slate-100/80 to-slate-50/80 dark:from-slate-800/60 dark:to-slate-700/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-400/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
              
              <div className="relative flex-shrink-0">
                <img
                  src={Profile}
                  alt="Profile"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-white/50 dark:ring-slate-800/50 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const parent = e.target.parentElement
                    const fallback = document.createElement('div')
                    fallback.className = 'w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg'
                    fallback.textContent = initials
                    parent.appendChild(fallback)
                  }}
                />
                {/* Online status dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-md animate-pulse" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white truncate">
                  {adminName}
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    {adminRole}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="text-[8px] sm:text-[10px] text-green-500 font-medium">● Online</span>
                </div>
              </div>

              <ChevronDown size={16} className="text-slate-400 opacity-60 group-hover:opacity-100 transition flex-shrink-0" />
            </div>
          </button>
        </div>
      )}

      {/* COLLAPSED PROFILE - Enhanced */}
      {collapsed && (
        <div className="p-3 sm:p-4 border-t border-slate-200/40 dark:border-slate-700/40">
          <button
            onClick={handleProfileClick}
            className="w-full flex justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition"
          >
            <div className="relative group">
              <img
                src={Profile}
                alt="Profile"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-white/50 dark:ring-slate-800/50 object-cover transition-transform group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none'
                  const parent = e.target.parentElement
                  const fallback = document.createElement('div')
                  fallback.className = 'w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg'
                  fallback.textContent = initials
                  parent.appendChild(fallback)
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-md animate-pulse" />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default SideBar