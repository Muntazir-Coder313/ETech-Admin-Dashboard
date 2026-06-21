import React from 'react'
import { MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react'

const recentOrders = [
  { id: "#3847", customer: "John Smith", product: "MacBook Pro 16", amount: "$2,399", status: "completed", date: "2024-01-15" },
  { id: "#3848", customer: "Sarah Johnson", product: "iPhone 15 pro", amount: "$1,199", status: "pending", date: "2024-01-15" },
  { id: "#3849", customer: "Mike Wilson", product: "AirPods Pro", amount: "$249", status: "completed", date: "2024-01-14" },
  { id: "#3850", customer: "Emily Davis", product: "iPad Air", amount: "$599", status: "cancelled", date: "2024-01-14" },
]

const topProducts = [
  { name: 'MacBook Pro 16', sales: 1247, revenue: "$2,987,530", trend: "up", change: "+12%" },
  { name: 'iPhone 15 Pro', sales: 2156, revenue: "$2,587,044", trend: "up", change: "+8%" },
  { name: 'AirPods Pro', sales: 3421, revenue: "$852,299", trend: "down", change: "-3%" },
  { name: 'iPad Air', sales: 987, revenue: "$591,213", trend: "up", change: "+15%" },
]

function TableSection() {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
    }
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Recent Orders */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className='text-base sm:text-lg font-bold text-slate-800 dark:text-white'>Recent Orders</h3>
              <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>Latest Customer Orders</p>
            </div>
            <button className='text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium'>View All</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs font-semibold text-slate-600">Order</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs font-semibold text-slate-600 hidden sm:table-cell">Customer</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs font-semibold text-slate-600 hidden md:table-cell">Product</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs font-semibold text-slate-600">Amount</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs font-semibold text-slate-600 hidden lg:table-cell">Status</th>
                  <th className="text-left p-2 sm:p-3 md:p-4 text-[10px] sm:text-xs font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                {recentOrders.map((order, index) => (
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors" key={index}>
                    <td className="p-2 sm:p-3 md:p-4">
                      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-blue-600">{order.id}</span>
                    </td>
                    <td className="hidden sm:table-cell p-2 sm:p-3 md:p-4">
                      <span className="text-xs sm:text-sm text-slate-800 dark:text-white">{order.customer}</span>
                    </td>
                    <td className="hidden md:table-cell p-2 sm:p-3 md:p-4">
                      <span className="text-xs sm:text-sm text-slate-800 dark:text-white">{order.product}</span>
                    </td>
                    <td className="p-2 sm:p-3 md:p-4">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">{order.amount}</span>
                    </td>
                    <td className="hidden lg:table-cell p-2 sm:p-3 md:p-4">
                      <span className={`text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 md:p-4">
                      <span className="text-[10px] sm:text-xs text-slate-500">{order.date}</span>
                    </td>
                    <td className="p-2 sm:p-3 md:p-4">
                      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className='text-base sm:text-lg font-bold text-slate-800 dark:text-white'>Top Products</h3>
              <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400'>Best Performing Products</p>
            </div>
            <button className='text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium'>View All</button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {topProducts.map((product, index) => (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 md:p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-1 sm:gap-2" key={index}>
              <div className="flex-1">
                <h4 className='text-xs sm:text-sm font-semibold text-slate-800 dark:text-white'>{product.name}</h4>
                <p className='text-[10px] sm:text-xs text-slate-500 dark:text-slate-400'>{product.sales} sales</p>
              </div>
              <div className="text-right">
                <p className='text-xs sm:text-sm font-semibold text-slate-800 dark:text-white'>{product.revenue}</p>
                <div className="flex items-center justify-end gap-1">
                  {product.trend === "up" ? <TrendingUp className='w-2 h-2 sm:w-3 sm:h-3 text-emerald-500' /> : <TrendingDown className='w-2 h-2 sm:w-3 sm:h-3 text-red-500' />}
                  <span className={`text-[8px] sm:text-[10px] md:text-xs font-medium ${product.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>{product.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableSection