import React, { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, Download, Edit2, Trash2, Eye, RefreshCw, 
  ChevronLeft, ChevronRight, UserPlus, Users, DollarSign, 
  UserCheck, ChevronDown, ChevronUp, Calendar, MapPin
} from 'lucide-react';

const getAvatar = (name) => {
  const seed = name.replace(/\s/g, '').toLowerCase();
  const gender = Math.random() > 0.5 ? 'women' : 'men';
  const id = Math.floor(Math.random() * 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

// Customer Modal (Add/Edit)
const CustomerModal = ({ customer, onClose, onSave, title }) => {
  const [form, setForm] = useState(customer || { name: '', email: '', phone: '', status: 'Active', totalSpent: 0 });
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <input type="text" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
        <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-2 border rounded-lg mb-3"><option>Active</option><option>Inactive</option></select>
        <div className="flex justify-end gap-2"><button onClick={() => onSave(form)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button><button onClick={onClose} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-lg">Cancel</button></div>
      </div>
    </div>
  );
};

// Summary Card
const SummaryCard = ({ title, value, icon, color, change }) => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border hover:shadow-xl transition">
    <div className="flex justify-between">
      <div><p className="text-gray-500 text-xs uppercase">{title}</p><p className="text-2xl font-bold mt-1">{value}</p>{change && <p className="text-xs mt-1 text-green-500">+{change}% growth</p>}</div>
      <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600`}>{icon}</div>
    </div>
  </div>
);

const Customers = () => {
  const mockCustomers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 234-567-8901', status: 'Active', totalSpent: 2840, joined: '2025-03-15', address: '123 Main St, New York, NY 10001', lastOrder: '2026-06-10' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1 234-567-8902', status: 'Active', totalSpent: 1250, joined: '2025-06-20', address: '456 Oak Ave, Los Angeles, CA 90001', lastOrder: '2026-06-05' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', phone: '+1 234-567-8903', status: 'Inactive', totalSpent: 560, joined: '2024-11-01', address: '789 Pine Rd, Chicago, IL 60601', lastOrder: '2026-01-12' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', phone: '+1 234-567-8904', status: 'Active', totalSpent: 3420, joined: '2025-09-10', address: '321 Elm St, Houston, TX 77001', lastOrder: '2026-06-08' },
    { id: 5, name: 'Emma Brown', email: 'emma@example.com', phone: '+1 234-567-8905', status: 'Active', totalSpent: 890, joined: '2026-01-25', address: '654 Birch Ln, Phoenix, AZ 85001', lastOrder: '2026-05-20' },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com', phone: '+1 234-567-8906', status: 'Inactive', totalSpent: 2100, joined: '2025-05-05', address: '987 Cedar Dr, Philadelphia, PA 19101', lastOrder: '2026-02-14' },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com', phone: '+1 234-567-8907', status: 'Active', totalSpent: 4300, joined: '2025-02-18', address: '147 Maple Ave, San Antonio, TX 78201', lastOrder: '2026-06-12' },
  ];

  const [customers, setCustomers] = useState(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 8;

  // Simulate loading
  const fetchCustomers = useCallback(async (showToast = false) => {
    setLoading(true);
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
      if (showToast) toast.success('Customers updated');
    }, 500);
  }, []);

  React.useEffect(() => { fetchCustomers(); }, []);

  // Helper: get loyalty tier
  const getTier = (totalSpent) => {
    if (totalSpent >= 4000) return 'Platinum';
    if (totalSpent >= 2500) return 'Gold';
    if (totalSpent >= 1000) return 'Silver';
    return 'Bronze';
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-700';
      case 'Gold': return 'bg-yellow-100 text-yellow-700';
      case 'Silver': return 'bg-gray-200 text-gray-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  // Sorting
  const sortedCustomers = useMemo(() => {
    const sorted = [...customers];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [customers, sortField, sortDirection]);

  // Filtering
  const filtered = sortedCustomers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchTier = tierFilter === 'all' || getTier(c.totalSpent) === tierFilter;
    return matchSearch && matchStatus && matchTier;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const totalCustomers = filtered.length;
  const activeCount = filtered.filter(c => c.status === 'Active').length;
  const totalRevenue = filtered.reduce((s, c) => s + c.totalSpent, 0);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  const handleSave = (data) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...data, id: c.id, joined: c.joined, address: c.address, lastOrder: c.lastOrder } : c));
      toast.success('Updated');
    } else {
      const newC = { ...data, id: Date.now(), joined: new Date().toISOString().slice(0,10), address: 'N/A', lastOrder: 'Never' };
      setCustomers([newC, ...customers]);
      toast.success('Added');
    }
    setModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = (id) => {
    if(window.confirm('Delete customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
      toast.success('Deleted');
    }
  };

  const exportCSV = () => {
    const headers = ['Name','Email','Phone','Status','Total Spent','Tier','Joined'];
    const rows = filtered.map(c => [c.name, c.email, c.phone, c.status, c.totalSpent, getTier(c.totalSpent), c.joined]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'customers.csv';
    link.click();
    toast.success('Export started');
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div><h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Customers</h1><p className="text-gray-500">Manage customer base</p></div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"><Download size={18} /> Export</button>
          <button onClick={() => { setEditingCustomer(null); setModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"><UserPlus size={18} /> Add Customer</button>
          <button onClick={() => { setRefreshing(true); fetchCustomers(true); }} disabled={refreshing} className="bg-gray-600 text-white px-3 py-2 rounded-xl shadow"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SummaryCard title="Total Customers" value={totalCustomers} icon={<Users size={20} />} color="blue" change={12} />
        <SummaryCard title="Active" value={activeCount} icon={<UserCheck size={20} />} color="green" change={8} />
        <SummaryCard title="LTV" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} color="purple" change={15} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-xl bg-white/70" /></div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-xl px-3 py-2"><option value="all">All Status</option><option>Active</option><option>Inactive</option></select>
        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="border rounded-xl px-3 py-2"><option value="all">All Tiers</option><option>Platinum</option><option>Gold</option><option>Silver</option><option>Bronze</option></select>
      </div>

      {/* Customers Table */}
      <div className="bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-lg overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('name')}>Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('totalSpent')}>Total Spent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('status')}>Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.map(customer => {
                const tier = getTier(customer.totalSpent);
                const tierColor = getTierColor(tier);
                return (
                  <React.Fragment key={customer.id}>
                    <tr className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={getAvatar(customer.name)} alt={customer.name} className="w-8 h-8 rounded-full ring-1 ring-gray-300" />
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">{customer.email}</td>
                      <td className="px-4 py-4 font-semibold">${customer.totalSpent}</td>
                      <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColor}`}>{tier}</span></td>
                      <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{customer.status}</span></td>
                      <td className="px-4 py-4"><button onClick={() => toggleExpand(customer.id)} className="text-gray-500 hover:text-blue-500">{expandedRow === customer.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button></td>
                      <td className="px-4 py-4 flex gap-2">
                        <button onClick={() => { setEditingCustomer(customer); setModalOpen(true); }} className="text-blue-500"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(customer.id)} className="text-red-500"><Trash2 size={16} /></button>
                        <button onClick={() => setSelectedCustomer(customer)} className="text-gray-500"><Eye size={16} /></button>
                      </td>
                    </tr>
                    {expandedRow === customer.id && (
                      <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                        <td colSpan="7" className="px-4 py-3 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><span className="font-semibold">📧 Email:</span> {customer.email}</div>
                            <div><span className="font-semibold">📞 Phone:</span> {customer.phone}</div>
                            <div><span className="font-semibold">📍 Address:</span> {customer.address}</div>
                            <div><span className="font-semibold">📅 Joined:</span> {customer.joined}</div>
                            <div><span className="font-semibold">🛒 Last Order:</span> {customer.lastOrder}</div>
                            <div><span className="font-semibold">💎 Tier:</span> {tier}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {paginated.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-400">No customers match</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <button disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        )}
      </div>

      {modalOpen && <CustomerModal customer={editingCustomer} onClose={() => { setModalOpen(false); setEditingCustomer(null); }} onSave={handleSave} title={editingCustomer ? 'Edit Customer' : 'Add Customer'} />}
      {selectedCustomer && !modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-96 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <img src={getAvatar(selectedCustomer.name)} className="w-12 h-12 rounded-full" alt="" />
              <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Email:</span><span>{selectedCustomer.email}</span></div>
              <div className="flex justify-between"><span>Phone:</span><span>{selectedCustomer.phone}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className={`px-2 py-0.5 rounded-full text-xs ${selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedCustomer.status}</span></div>
              <div className="flex justify-between"><span>Total Spent:</span><span className="font-bold">${selectedCustomer.totalSpent}</span></div>
              <div className="flex justify-between"><span>Tier:</span><span className={`px-2 py-0.5 rounded-full text-xs ${getTierColor(getTier(selectedCustomer.totalSpent))}`}>{getTier(selectedCustomer.totalSpent)}</span></div>
              <div className="flex justify-between"><span>Joined:</span><span>{selectedCustomer.joined}</span></div>
              <div className="flex justify-between"><span>Address:</span><span>{selectedCustomer.address}</span></div>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;