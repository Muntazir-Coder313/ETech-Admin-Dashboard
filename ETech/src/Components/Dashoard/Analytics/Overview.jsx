import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 142, orders: 1240 },
  { month: 'Feb', revenue: 156, orders: 1350 },
  { month: 'Mar', revenue: 189, orders: 1680 },
  { month: 'Apr', revenue: 223, orders: 2020 },
  { month: 'May', revenue: 249, orders: 2310 },
  { month: 'Jun', revenue: 284, orders: 2680 },
];

const deviceData = [
  { name: 'Mobile', value: 42, color: '#3b82f6' },
  { name: 'Desktop', value: 48, color: '#10b981' },
  { name: 'Tablet', value: 10, color: '#f59e0b' },
];

const topProducts = [
  { name: 'Premium Plan', sales: 1240, revenue: '$49,600' },
  { name: 'Pro Subscription', sales: 892, revenue: '$35,680' },
  { name: 'Basic Plan', sales: 654, revenue: '$13,080' },
];

const StatCard = ({ title, value, change, icon }) => {
  const isPositive = change?.startsWith('+');
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs font-semibold uppercase">{title}</p>
          <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <div className="text-2xl sm:text-3xl">{icon}</div>
      </div>
      {change && (
        <p className={`text-[10px] sm:text-xs mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change} vs last month
        </p>
      )}
    </div>
  );
};

const Overview = () => {
  return (
    <div className="animate-fade-in space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Overview
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Your business at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard title="Total Revenue" value="$284,520" change="+12.5%" icon="💰" />
        <StatCard title="Total Orders" value="2,683" change="+8.1%" icon="🛒" />
        <StatCard title="Active Users" value="18,342" change="+5.2%" icon="👥" />
        <StatCard title="Conversion Rate" value="4.86%" change="-0.4%" icon="📊" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border">
          <h3 className="font-bold text-base sm:text-lg mb-3">Revenue Trend (USD)</h3>
          <div className="w-full h-52 sm:h-64 md:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `$${v}k`} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#rev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border">
          <h3 className="font-bold text-base sm:text-lg mb-3">Monthly Orders</h3>
          <div className="w-full h-52 sm:h-64 md:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border">
          <h3 className="font-bold text-base sm:text-lg mb-3">🏆 Top Products</h3>
          <div className="space-y-2 sm:space-y-3">
            {topProducts.map((p) => (
              <div key={p.name} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 text-sm md:text-base">
                <span>{p.name}</span>
                <span className="font-semibold">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border">
          <h3 className="font-bold text-base sm:text-lg mb-3">📱 Traffic by Device</h3>
          <div className="w-full h-48 sm:h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;