import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import SideBar from './Components/Layout/SideBar'
import Header from './Components/Layout/Header'
import Dashboard from './Components/Dashoard/Dashboard';
import Insights from './Components/Dashoard/Analytics/Insights'
import Reports from './Components/Dashoard/Analytics/Reports'
import Overview from './Components/Dashoard/Analytics/Overview'
import AllUsers from './Components/Dashoard/User/AllUsers'
import RolesPermission from './Components/Dashoard/User/RolesPermissions'
import UserActivity from './Components/Dashoard/User/UserActivity'
import Products from './Components/Dashoard/Eccomerce/Products'
import Orders from './Components/Dashoard/Eccomerce/Orders'
import Customers from './Components/Dashoard/Eccomerce/Customers'
import Inventory from './Components/Dashoard/Inventory/Inventory'
import Transaction from './Components/Dashoard/Transaction/Transaction'
import Messages from './Components/Dashoard/Message/Messages'
import Calendar from './Components/Dashoard/Calendar/Calendar'
import Report from './Components/Dashoard/Reports/Reports'
import Settings from './Components/Dashoard/Settings/Settings'
import LoginPage from './Components/LoginPage'

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // ✅ EASY LOGIN – Username: admin, Password: 1234
  const handleLogin = (username, password) => {
    if (username === 'admin' && password === '1234') {
      setIsLoggedIn(true);
      sessionStorage.setItem('isLoggedIn', 'true');
      toast.success('Welcome back! 🎉');
      return true;
    }
    return false;
  };

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
      toast.success('Logged out successfully');
      setCurrentPage('dashboard');
    }
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500'>
      <Toaster position="top-right" />
      <div className="flex h-screen overflow-hidden">
        <div className={`
          fixed inset-y-0 left-0 z-30 
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}>
          <SideBar
            collapsed={sideBarCollapsed}
            onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              setMobileSidebarOpen(false);
            }}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </div>

        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            sideBarCollapsed={sideBarCollapsed}
            onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
            onPageChange={setCurrentPage}
            onMobileMenuToggle={toggleMobileSidebar}
            onLogout={handleLogout}
          />
          <main className='flex-1 overflow-y-auto'>
            <div className='p-3 sm:p-4 md:p-6 max-w-7xl mx-auto'>
              {currentPage === "dashboard" && <Dashboard />}
              {currentPage === "overview" && <Overview />}
              {currentPage === "reports" && <Reports />}
              {currentPage === "insights" && <Insights />}
              {currentPage === "users" && <AllUsers />}
              {currentPage === "roles" && <RolesPermission />}
              {currentPage === "activity" && <UserActivity />}
              {currentPage === "products" && <Products />}
              {currentPage === "orders" && <Orders />}
              {currentPage === "customers" && <Customers />}
              {currentPage === "inventory" && <Inventory />}
              {currentPage === "transactions" && <Transaction />}
              {currentPage === "messages" && <Messages />}
              {currentPage === "calendar" && <Calendar />}
              {currentPage === "report" && <Report />}
              {currentPage === "settings" && <Settings />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App