import React, { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, ChevronLeft, ChevronRight, Download, Eye, RefreshCw, 
  Calendar, TrendingUp, Package, DollarSign, Clock, Filter,
  User, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp,
  MapPin, CreditCard, ShoppingBag
} from 'lucide-react';

const getAvatar = (name) => {
  const seed = name.replace(/\s/g, '').toLowerCase();
  const gender = Math.random() > 0.5 ? 'women' : 'men';
  const id = Math.floor(Math.random() * 99) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
};

const mockOrders = [
  { 
    id: 1001, customer: 'Alice Johnson', date: '2026-06-15', total: 1240, 
    status: 'Delivered', items: 3, 
    shipping: '123 Main St, New York, NY 10001',
    payment: 'Visa **** 1234',
    productList: ['Gaming Laptop x1', 'Wireless Mouse x2', 'USB-C Cable x1'],
    timeline: ['Order placed', 'Processing', 'Shipped', 'Delivered']
  },
  // ... (keep all mock orders)
];

// Order Details Modal (responsive)
const OrderModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <img src={getAvatar(order.customer)} alt={order.customer} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-blue-500" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-500">Customer</span><span className="font-medium">{order.customer}</span></div>
          <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-500">Total</span><span className="font-bold text-green-600">${order.total}</span></div>
          <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-500">Status</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></div>
          <div className="flex justify-between items-center py-2"><span className="text-gray-500">Items</span><span>{order.items}</span></div>
          <div className="py-2"><span className="text-gray-500">Shipping</span><p className="text-sm mt-1">{order.shipping}</p></div>
          <div className="py-2"><span className="text-gray-500">Payment</span><p className="text-sm mt-1">{order.payment}</p></div>
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">Close</button>
      </div>
    </div>
  );
};

// Summary Card (responsive)
const SummaryCard = ({ title, value, icon, color, change }) => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border hover:shadow-xl transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs uppercase">{title}</p>
        <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
        {change && <p className="text-xs mt-1 text-green-500">+{change}% vs last month</p>}
      </div>
      <div className={`p-2 sm:p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600`}>{icon}</div>
    </div>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [minTotal, setMinTotal] = useState('');
  const [maxTotal, setMaxTotal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 8;

  const fetchOrders = useCallback(async (showToast = false) => {
    setLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
      if (showToast) toast.success('Orders updated');
    }, 500);
  }, []);

  React.useEffect(() => { fetchOrders(); }, []);

  const sortedOrders = useMemo(() => {
    const sorted = [...orders];
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
  }, [orders, sortField, sortDirection]);

  const filtered = sortedOrders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toString().includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchDate = (!dateRange.start || o.date >= dateRange.start) && (!dateRange.end || o.date <= dateRange.end);
    const matchTotal = (!minTotal || o.total >= parseFloat(minTotal)) && (!maxTotal || o.total <= parseFloat(maxTotal));
    return matchSearch && matchStatus && matchDate && matchTotal;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0);
  const avgOrder = totalOrders ? (totalRevenue / totalOrders).toFixed(0) : 0;
  const pendingOrders = filtered.filter(o => o.status === 'Pending').length;

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  const exportCSV = () => {
    const headers = ['Order ID','Customer','Date','Total','Status','Items','Shipping','Payment'];
    const rows = filtered.map(o => [o.id, o.customer, o.date, o.total, o.status, o.items, o.shipping, o.payment]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
    toast.success('Export started');
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Orders</h1>
          <p className="text-sm md:text-base text-gray-500">Track and manage customer orders</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm sm:text-base"><Download size={18} /> Export</button>
          <button onClick={() => { setRefreshing(true); fetchOrders(true); }} disabled={refreshing} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 sm:py-2 rounded-xl shadow"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <SummaryCard title="Total Orders" value={totalOrders} icon={<Package size={20} />} color="blue" change={12} />
        <SummaryCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} color="green" change={8} />
        <SummaryCard title="Avg Order" value={`$${avgOrder}`} icon={<TrendingUp size={20} />} color="purple" change={5} />
        <SummaryCard title="Pending" value={pendingOrders} icon={<Clock size={20} />} color="orange" change={-2} />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search ID or customer..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-xl bg-white/70 dark:bg-gray-900/70 text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto border rounded-xl px-3 py-2 text-sm bg-white/70">
          <option value="all">All Status</option><option>Pending</option><option>Processing</option><option>Delivered</option>
        </select>
        <div className="flex flex-wrap items-center gap-2 bg-white/70 rounded-xl px-3 py-1 border text-sm">
          <Calendar size={16} className="flex-shrink-0" />
          <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="bg-transparent outline-none text-sm w-24 sm:w-auto" />
          <span>to</span>
          <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="bg-transparent outline-none text-sm w-24 sm:w-auto" />
        </div>
        <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-1 border text-sm">
          <DollarSign size={16} className="flex-shrink-0" />
          <input type="number" placeholder="Min" value={minTotal} onChange={e => setMinTotal(e.target.value)} className="w-16 bg-transparent outline-none text-sm" />
          <span>to</span>
          <input type="number" placeholder="Max" value={maxTotal} onChange={e => setMaxTotal(e.target.value)} className="w-16 bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div className="bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-lg overflow-hidden border">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('id')}>Order ID</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('customer')}>Customer</th>
                  <th className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('date')}>Date</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('total')}>Total</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('status')}>Status</th>
                  <th className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold">Items</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold"></th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginated.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group">
                      <td className="px-3 sm:px-4 py-3 sm:py-4 font-mono text-sm font-semibold">#{order.id}</td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img src={getAvatar(order.customer)} alt={order.customer} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-1 ring-gray-300 dark:ring-gray-600" />
                          <span className="font-medium text-sm sm:text-base">{order.customer}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-bold text-green-600">${order.total}</td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'Delivered' && <CheckCircle size={10} />}
                          {order.status === 'Processing' && <Truck size={10} />}
                          {order.status === 'Pending' && <Clock size={10} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 text-sm">{order.items}</td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <button onClick={() => toggleExpand(order.id)} className="text-gray-500 hover:text-blue-500 transition">
                          {expandedRow === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <button onClick={() => setSelectedOrder(order)} className="text-blue-500 hover:text-blue-700 transition"><Eye size={16} /></button>
                      </td>
                    </tr>
                    {expandedRow === order.id && (
                      <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                        <td colSpan="8" className="px-3 sm:px-4 py-3 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div>
                              <p className="font-semibold flex items-center gap-1"><MapPin size={14} /> Shipping</p>
                              <p className="text-gray-600 dark:text-gray-400">{order.shipping}</p>
                            </div>
                            <div>
                              <p className="font-semibold flex items-center gap-1"><CreditCard size={14} /> Payment</p>
                              <p className="text-gray-600 dark:text-gray-400">{order.payment}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-semibold flex items-center gap-1"><ShoppingBag size={14} /> Products</p>
                              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                                {order.productList.map((item, idx) => <li key={idx}>{item}</li>)}
                              </ul>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-semibold">Timeline</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {order.timeline.map((step, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-xs">
                                    {idx < order.timeline.length - 1 ? <CheckCircle size={10} className="text-green-500" /> : <Clock size={10} />}
                                    {step}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {paginated.length === 0 && <tr><td colSpan="8" className="text-center py-12 text-gray-400">No orders match</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-3 sm:p-4 border-t">
            <button disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"><ChevronRight size={16} /></button>
          </div>
        )}
      </div>

      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default Orders;