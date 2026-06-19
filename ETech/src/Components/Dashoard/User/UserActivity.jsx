import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Download, Filter, Clock, Globe, User, Calendar } from 'lucide-react';

const initialLogs = [
  { id: 1, user: 'Alice Johnson', action: 'Created user Bob Smith', timestamp: '2026-06-15 10:32', ip: '192.168.1.1', type: 'create', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 2, user: 'Bob Smith', action: 'Updated report settings', timestamp: '2026-06-15 09:15', ip: '192.168.1.2', type: 'update', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 3, user: 'Carol Davis', action: 'Logged in', timestamp: '2026-06-14 14:22', ip: '192.168.1.3', type: 'login', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 4, user: 'David Wilson', action: 'Deleted user John Doe', timestamp: '2026-06-14 11:05', ip: '192.168.1.4', type: 'delete', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 5, user: 'Alice Johnson', action: 'Changed role for Bob Smith to Editor', timestamp: '2026-06-13 16:45', ip: '192.168.1.1', type: 'role_change', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 6, user: 'Emma Brown', action: 'Exported users list', timestamp: '2026-06-13 08:30', ip: '192.168.1.5', type: 'export', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { id: 7, user: 'Frank Miller', action: 'Updated user permissions', timestamp: '2026-06-12 19:20', ip: '192.168.1.6', type: 'update', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
];

const UserActivity = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
    return matchesSearch && matchesType && matchesDate;
  });

  const groupedLogs = filteredLogs.reduce((groups, log) => {
    const date = log.timestamp.split(' ')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort().reverse();
  const paginatedDates = sortedDates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedDates.length / itemsPerPage);

  const exportCSV = () => {
    const headers = ['User', 'Action', 'Timestamp', 'IP Address', 'Type'];
    const rows = filteredLogs.map(l => [l.user, l.action, l.timestamp, l.ip, l.type]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_activity.csv';
    link.click();
    toast.success('Export started');
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'create': return '➕'; case 'update': return '✏️'; case 'delete': return '🗑️'; 
      case 'login': return '🔑'; case 'role_change': return '🔄'; case 'export': return '📎';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">User Activity</h1>
          <p className="text-sm md:text-base text-gray-500">Audit trail of all user actions</p>
        </div>
        <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm w-full sm:w-auto"><Download size={18}/> Export CSV</button>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by user or action..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-3 py-2 border rounded-xl bg-white/70 dark:bg-gray-900/70 text-sm" />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="w-full sm:w-auto border rounded-xl px-3 py-2 bg-white/70 text-sm">
          <option value="all">All Types</option>
          <option value="create">Create</option><option value="update">Update</option>
          <option value="delete">Delete</option><option value="login">Login</option>
          <option value="role_change">Role Change</option><option value="export">Export</option>
        </select>
        <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }} className="w-full sm:w-auto border rounded-xl px-3 py-2 bg-white/70 text-sm" />
      </div>

      <div className="space-y-4 sm:space-y-6">
        {paginatedDates.map(date => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2 sm:mb-3"><Calendar size={18} className="text-blue-500"/><h3 className="text-base sm:text-lg font-semibold">{date}</h3></div>
            <div className="space-y-2 sm:space-y-3">
              {groupedLogs[date].map(log => (
                <div key={log.id} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <img src={log.avatar} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" alt="avatar" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-1">
                      <div><span className="font-bold text-sm sm:text-base">{log.user}</span> <span className="text-gray-600 dark:text-gray-300 text-sm">• {log.action}</span></div>
                      <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0"><Clock size={12}/> {log.timestamp.split(' ')[1]}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Globe size={12}/> {log.ip}</span>
                      <span className="flex items-center gap-1">{getTypeIcon(log.type)} {log.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredLogs.length === 0 && <div className="text-center py-8 text-gray-400">No activity found</div>}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2 sm:pt-4">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 text-sm">&lt;</button>
          <span className="px-3 py-1 text-sm">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 text-sm">&gt;</button>
        </div>
      )}
    </div>
  );
};

export default UserActivity;