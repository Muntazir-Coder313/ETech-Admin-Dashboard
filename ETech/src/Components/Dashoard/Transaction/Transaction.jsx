import React, { useState, useCallback, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, 
  Download, RefreshCw, TrendingUp, TrendingDown, 
  ArrowUpCircle, ArrowDownCircle, CreditCard, Wallet,
  Calendar, DollarSign, Filter, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Clock, User, Eye
} from 'lucide-react';

const getAvatar = (name) => {
  const seed = name.replace(/\s/g, '').toLowerCase();
  const gender = Math.random() > 0.5 ? 'women' : 'men';
  const id = Math.floor(Math.random() * 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

// Transaction Modal
const TransactionModal = ({ isOpen, onClose, onSubmit, transaction, title }) => {
  const [form, setForm] = useState(transaction || { 
    description: '', amount: '', type: 'Income', status: 'Completed', 
    paymentMethod: 'Bank Transfer', category: '' 
  });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4">{title}</h3>
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm" />
        <input type="number" placeholder="Amount ($)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm" />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm">
          <option>Income</option><option>Expense</option><option>Transfer</option>
        </select>
        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm">
          <option>Completed</option><option>Pending</option><option>Failed</option>
        </select>
        <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm">
          <option>Bank Transfer</option><option>Credit Card</option><option>PayPal</option><option>Cash</option>
        </select>
        <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm" />
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button onClick={() => { onSubmit(form); onClose(); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
          <button onClick={onClose} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-lg text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Stat Card
const StatCard = ({ title, value, icon, color, change, prefix }) => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-base sm:text-lg md:text-xl font-black text-gray-800 dark:text-white mt-1">{prefix}{value}</p>
      </div>
      <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition flex-shrink-0`}>
        {icon}
      </div>
    </div>
    {change && (
      <div className="mt-2 flex items-center gap-1 text-[10px] sm:text-xs">
        {change >= 0 ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
        <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>{Math.abs(change)}%</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    )}
  </div>
);

// Status Badge
const StatusBadge = ({ status }) => {
  const config = {
    Completed: { icon: <CheckCircle size={12} />, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    Pending: { icon: <Clock size={12} />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    Failed: { icon: <XCircle size={12} />, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  };
  const { icon, color } = config[status] || config.Pending;
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-medium ${color}`}>{icon} {status}</span>;
};

const Transaction = () => {
  const mockTransactions = [
    { id: 1, description: 'Salary Payment', amount: 3500, type: 'Income', status: 'Completed', paymentMethod: 'Bank Transfer', category: 'Salary', date: '2026-06-15', user: 'John Doe', notes: 'Monthly salary' },
    { id: 2, description: 'Office Rent', amount: 1200, type: 'Expense', status: 'Completed', paymentMethod: 'Credit Card', category: 'Rent', date: '2026-06-14', user: 'Alice Johnson', notes: 'June office rent' },
    { id: 3, description: 'Client Payment', amount: 540, type: 'Income', status: 'Pending', paymentMethod: 'PayPal', category: 'Freelance', date: '2026-06-13', user: 'Bob Smith', notes: 'Web design project' },
    { id: 4, description: 'Office Supplies', amount: 230, type: 'Expense', status: 'Completed', paymentMethod: 'Credit Card', category: 'Supplies', date: '2026-06-12', user: 'Carol Davis', notes: 'Stationery and printer ink' },
    { id: 5, description: 'Refund Customer', amount: 89, type: 'Expense', status: 'Failed', paymentMethod: 'Bank Transfer', category: 'Refund', date: '2026-06-11', user: 'David Wilson', notes: 'Product return refund' },
    { id: 6, description: 'Consulting Fee', amount: 750, type: 'Income', status: 'Completed', paymentMethod: 'Bank Transfer', category: 'Consulting', date: '2026-06-10', user: 'Emma Brown', notes: 'Strategy consulting' },
    { id: 7, description: 'Software License', amount: 299, type: 'Expense', status: 'Pending', paymentMethod: 'Credit Card', category: 'Software', date: '2026-06-09', user: 'Frank Miller', notes: 'Annual license renewal' },
    { id: 8, description: 'Transfer to Savings', amount: 500, type: 'Transfer', status: 'Completed', paymentMethod: 'Bank Transfer', category: 'Savings', date: '2026-06-08', user: 'Grace Lee', notes: 'Monthly savings transfer' },
    { id: 9, description: 'Event Sponsorship', amount: 1500, type: 'Expense', status: 'Completed', paymentMethod: 'PayPal', category: 'Marketing', date: '2026-06-07', user: 'Henry Clark', notes: 'Tech conference sponsorship' },
    { id: 10, description: 'Dividend Payment', amount: 200, type: 'Income', status: 'Pending', paymentMethod: 'Bank Transfer', category: 'Investment', date: '2026-06-06', user: 'Ivy Martinez', notes: 'Quarterly dividend' },
  ];

  const [transactions, setTransactions] = useState(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    setLoading(false);
  }, []);

  const sortedItems = useMemo(() => {
    const sorted = [...transactions];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'amount') { aVal = parseFloat(aVal); bVal = parseFloat(bVal); }
      else if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [transactions, sortField, sortDirection]);

  const filtered = sortedItems.filter(item => {
    const matchSearch = item.description.toLowerCase().includes(search.toLowerCase()) || item.user.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchDate = (!dateRange.start || item.date >= dateRange.start) && (!dateRange.end || item.date <= dateRange.end);
    return matchSearch && matchType && matchStatus && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalIncome = filtered.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const pendingCount = filtered.filter(t => t.status === 'Pending').length;

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  const handleAdd = (data) => {
    const newItem = { ...data, id: Date.now(), date: new Date().toISOString().slice(0,10), user: 'Current User' };
    setTransactions([newItem, ...transactions]);
    toast.success('Transaction added');
  };

  const handleEdit = (data) => {
    setTransactions(transactions.map(t => t.id === editingTransaction.id ? { ...data, id: t.id, date: t.date, user: t.user } : t));
    toast.success('Transaction updated');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
      toast.success('Deleted');
    }
  };

  const exportCSV = () => {
    const headers = ['Date','Description','User','Type','Amount','Status','Payment Method','Category','Notes'];
    const rows = filtered.map(t => [t.date, t.description, t.user, t.type, t.amount, t.status, t.paymentMethod, t.category, t.notes || '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
    toast.success('Export started');
  };

  const getTypeIcon = (type) => {
    if (type === 'Income') return <ArrowUpCircle size={18} className="text-green-500" />;
    if (type === 'Expense') return <ArrowDownCircle size={18} className="text-red-500" />;
    return <CreditCard size={18} className="text-blue-500" />;
  };

  const getTypeColor = (type) => {
    if (type === 'Income') return 'text-green-600 dark:text-green-400';
    if (type === 'Expense') return 'text-red-600 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-3 sm:p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">💰 Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track all financial transactions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm"><Download size={18} /> Export</button>
          <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm"><Plus size={18} /> Add Transaction</button>
          <button onClick={() => { setRefreshing(true); }} disabled={refreshing} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 sm:py-2 rounded-xl shadow"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Income" value={totalIncome.toLocaleString()} icon={<TrendingUp size={20} className="text-white" />} color="from-green-500 to-emerald-500" prefix="$" change={12} />
        <StatCard title="Total Expense" value={totalExpense.toLocaleString()} icon={<TrendingDown size={20} className="text-white" />} color="from-red-500 to-pink-500" prefix="$" change={-5} />
        <StatCard title="Net Profit" value={netProfit.toLocaleString()} icon={<DollarSign size={20} className="text-white" />} color={netProfit >= 0 ? 'from-blue-500 to-indigo-500' : 'from-red-500 to-orange-500'} prefix="$" change={8} />
        <StatCard title="Pending" value={pendingCount} icon={<Clock size={20} className="text-white" />} color="from-yellow-500 to-amber-500" change={-2} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-blue-500 transition text-sm" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white/70 dark:bg-gray-900/70 text-sm">
          <option value="all">All Types</option><option>Income</option><option>Expense</option><option>Transfer</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white/70 dark:bg-gray-900/70 text-sm">
          <option value="all">All Status</option><option>Completed</option><option>Pending</option><option>Failed</option>
        </select>
        <div className="flex flex-wrap items-center gap-2 bg-white/70 dark:bg-gray-900/70 rounded-xl px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm">
          <Calendar size={16} className="flex-shrink-0" />
          <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="bg-transparent outline-none text-sm w-24 sm:w-28" />
          <span>to</span>
          <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="bg-transparent outline-none text-sm w-24 sm:w-28" />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-700/80">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-blue-600 whitespace-nowrap" onClick={() => handleSort('date')}>Date</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-blue-600 whitespace-nowrap" onClick={() => handleSort('description')}>Description</th>
                  <th className="hidden sm:table-cell px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-blue-600 whitespace-nowrap" onClick={() => handleSort('amount')}>Amount</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"></th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginated.map(item => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group">
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{item.date}</td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800 dark:text-white font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{item.description}</span>
                          <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hidden sm:inline`}>{item.category}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <div className="flex items-center gap-2">
                          <img src={getAvatar(item.user)} alt={item.user} className="w-6 h-6 rounded-full flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate max-w-[80px]">{item.user}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                        <span className={`flex items-center gap-1 font-bold text-xs sm:text-sm ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)} ${item.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <button onClick={() => toggleExpand(item.id)} className="text-gray-500 hover:text-blue-600 transition">
                          {expandedRow === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 flex gap-1 sm:gap-2">
                        <button onClick={() => { setEditingTransaction(item); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                    {expandedRow === item.id && (
                      <tr className="bg-blue-50/30 dark:bg-blue-900/10">
                        <td colSpan="7" className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-sm">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                            <div><span className="font-semibold">💳 Payment:</span> {item.paymentMethod}</div>
                            <div><span className="font-semibold">📂 Category:</span> {item.category}</div>
                            <div><span className="font-semibold">📝 Notes:</span> <span className="break-words">{item.notes || 'No notes'}</span></div>
                            <div><span className="font-semibold">📅 Date:</span> {item.date}</div>
                            <div><span className="font-semibold">👤 User:</span> {item.user}</div>
                            <div><span className="font-semibold">🆔 ID:</span> #{item.id}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {paginated.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-400 text-sm">No transactions match</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-2 sm:p-3 md:p-4 border-t border-gray-200 dark:border-gray-700">
            <button disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)} className="px-2 sm:px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 transition text-xs sm:text-sm"><ChevronLeft size={14} /></button>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)} className="px-2 sm:px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 transition text-xs sm:text-sm"><ChevronRight size={14} /></button>
          </div>
        )}
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} onSubmit={editingTransaction ? handleEdit : handleAdd} transaction={editingTransaction} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'} />
    </div>
  );
};

export default Transaction;