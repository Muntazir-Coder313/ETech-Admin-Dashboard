import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import SideBar from './Components/Layout/SideBar';
import Header from './Components/Layout/Header';
import Dashboard from './Components/Dashoard/Dashboard';
import Insights from './Components/Dashoard/Analytics/Insights';
import Reports from './Components/Dashoard/Analytics/Reports';
import Overview from './Components/Dashoard/Analytics/Overview';
import AllUsers from './Components/Dashoard/User/AllUsers';
import RolesPermission from './Components/Dashoard/User/RolesPermissions';
import UserActivity from './Components/Dashoard/User/UserActivity';
import Products from './Components/Dashoard/Eccomerce/Products';
import Orders from './Components/Dashoard/Eccomerce/Orders';
import Customers from './Components/Dashoard/Eccomerce/Customers';
import Inventory from './Components/Dashoard/Inventory/Inventory';
import Transaction from './Components/Dashoard/Transaction/Transaction';
import Messages from './Components/Dashoard/Message/Messages';
import Calendar from './Components/Dashoard/Calendar/Calendar';
import Report from './Components/Dashoard/Reports/Reports';
import Settings from './Components/Dashoard/Settings/Settings';
import LoginPage from './Components/LoginPage'; // 👈 we'll create this file

function App() {
  // ----- Login state (persisted) -----
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // ----- Login / Logout handlers -----
  const handleLogin = (username, password) => {
    if (username.trim() !== '' && password === 'AM12') {
      setIsLoggedIn(true);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', username.trim());
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    setCurrentPage('dashboard');
  };

  // ----- If NOT logged in, show Login page (no dashboard) -----
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // =============================================
  // 👇 YOUR ORIGINAL DASHBOARD LAYOUT – UNCHANGED
  // =============================================
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
        <div className="flex h-screen overflow-hidden">
          <SideBar
            collapsed={sideBarCollapsed}
            onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              sideBarCollapsed={sideBarCollapsed}
              onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
              onLogout={handleLogout}   // 👈 added logout prop
            />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Dashboard / Overview */}
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'overview' && <Overview />}

                {/* Reports & Insights */}
                {currentPage === 'reports' && <Reports />}
                {currentPage === 'insights' && <Insights />}

                {/* User Management */}
                {currentPage === 'users' && <AllUsers />}
                {currentPage === 'roles' && <RolesPermission />}
                {currentPage === 'activity' && <UserActivity />}

                {/* E-commerce */}
                {currentPage === 'products' && <Products />}
                {currentPage === 'orders' && <Orders />}
                {currentPage === 'customers' && <Customers />}

                {/* Inventory */}
                {currentPage === 'inventory' && <Inventory />}

                {/* Transactions */}
                {currentPage === 'transactions' && <Transaction />}

                {currentPage === 'messages' && <Messages />}
                {currentPage === 'calendar' && <Calendar />}
                {currentPage === 'report' && <Report />}
                {currentPage === 'settings' && <Settings />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;