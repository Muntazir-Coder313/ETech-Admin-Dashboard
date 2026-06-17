import React from 'react';

const StatCard = ({ title, value, change, icon, color = 'blue' }) => {
  const isPositive = change?.startsWith('+');
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-500',
  };
  return (
    <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-[1.02]">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-extrabold text-gray-800 dark:text-white mt-1 tracking-tight">{value}</p>
        </div>
        <div className="text-3xl drop-shadow-md">{icon}</div>
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-3 text-sm">
          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>{change}</span>
          <span className="text-gray-400 text-xs">vs last month</span>
        </div>
      )}
    </div>
  );
};
export default StatCard;