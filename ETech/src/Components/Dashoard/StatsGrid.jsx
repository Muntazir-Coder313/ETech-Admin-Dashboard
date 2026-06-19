import { ArrowDownRight, ArrowUpRight, DollarSign, Eye, ShoppingCart, Users } from 'lucide-react';
import React from 'react';

const stats = [
  { title: 'Total Revenue', value: '$124,563', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', textColor: 'text-emerald-600 dark:text-emerald-400' },
  { title: 'Active Users', value: '8,549', change: '+8.2%', trend: 'up', icon: Users, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
  { title: 'Total Orders', value: '2,847', change: '+15.3%', trend: 'up', icon: ShoppingCart, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-600 dark:text-purple-400' },
  { title: 'Page Views', value: '45,892', change: '-2.1%', trend: 'down', icon: Eye, color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20', textColor: 'text-orange-600 dark:text-orange-400' },
];

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 group" key={index}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex-1 w-full">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4">{stat.value}</p>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4 text-emerald-500"/> : <ArrowDownRight className="w-4 h-4 text-red-500"/>}
                <span className={`text-sm font-semibold ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>{stat.change}</span>
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Vs Last Month</span>
              </div>
            </div>
            <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-100`} style={{width: stat.trend === "up" ? "75%" : "45%"}} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;