import React, { useState } from 'react';

const allReports = [
  { id: 1, name: 'Q2 Sales Performance', date: '2026-06-12', status: 'Completed', type: 'PDF', size: '2.4 MB', category: 'Sales' },
  { id: 2, name: 'User Engagement Funnel', date: '2026-06-10', status: 'Completed', type: 'PDF', size: '1.8 MB', category: 'Marketing' },
  { id: 3, name: 'Marketing ROI Analysis', date: '2026-06-08', status: 'Completed', type: 'Excel', size: '3.1 MB', category: 'Marketing' },
  { id: 4, name: 'Churn Risk Report', date: '2026-06-05', status: 'Needs review', type: 'PDF', size: '0.9 MB', category: 'Retention' },
  { id: 5, name: 'Regional Revenue Breakdown', date: '2026-06-01', status: 'Completed', type: 'Excel', size: '4.2 MB', category: 'Sales' },
  { id: 6, name: 'Customer Lifetime Value Forecast', date: '2026-05-28', status: 'Completed', type: 'PDF', size: '1.2 MB', category: 'Finance' },
  { id: 7, name: 'Social Media Performance', date: '2026-05-25', status: 'Completed', type: 'PDF', size: '1.5 MB', category: 'Marketing' },
  { id: 8, name: 'Email Campaign Analytics', date: '2026-05-20', status: 'Needs review', type: 'Excel', size: '2.1 MB', category: 'Marketing' },
];

const Reports = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(allReports.map(r => r.category))];

  const filtered = allReports.filter(r => {
    return r.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === 'all' || r.status === filterStatus) &&
      (filterCategory === 'all' || r.category === filterCategory);
  });

  const exportCSV = () => {
    const headers = ['Name', 'Date', 'Status', 'Type', 'Size', 'Category'];
    const rows = filtered.map(r => [r.name, r.date, r.status, r.type, r.size, r.category]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reports_export.csv';
    link.click();
  };

  // Summary stats
  const totalReports = filtered.length;
  const completedCount = filtered.filter(r => r.status === 'Completed').length;
  const pendingCount = filtered.filter(r => r.status === 'Needs review').length;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div><h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Reports Library</h1><p className="text-gray-500">Manage, search & export reports</p></div>
        <button onClick={exportCSV} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md transition">📎 Export CSV</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 border flex justify-between items-center"><span className="text-gray-600">📄 Total Reports</span><span className="text-2xl font-bold">{totalReports}</span></div>
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 border flex justify-between items-center"><span className="text-gray-600">✅ Completed</span><span className="text-2xl font-bold text-green-600">{completedCount}</span></div>
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 border flex justify-between items-center"><span className="text-gray-600">⚠️ Needs Review</span><span className="text-2xl font-bold text-amber-600">{pendingCount}</span></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-sm w-64 focus:ring-2 focus:ring-blue-500" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-sm">
          <option value="all">All status</option><option value="Completed">Completed</option><option value="Needs review">Needs review</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-sm">
          {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All categories' : cat}</option>)}
        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100/50 dark:bg-gray-800/50">
              <tr>{['Name', 'Date', 'Status', 'Type', 'Size', 'Category', ''].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                  <td className="px-6 py-4 text-sm">{r.date}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-sm">{r.type}</td>
                  <td className="px-6 py-4 text-sm">{r.size}</td>
                  <td className="px-6 py-4 text-sm"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">{r.category}</span></td>
                  <td className="px-6 py-4"><button className="text-blue-500 hover:text-blue-700 text-sm font-medium">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400">No reports match.</div>}
        </div>
      </div>
    </div>
  );
};
export default Reports;