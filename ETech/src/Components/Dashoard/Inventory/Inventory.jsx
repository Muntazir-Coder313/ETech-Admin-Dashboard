import React, { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, 
  Download, RefreshCw, Package, Box, AlertTriangle, TrendingDown, 
  CheckCircle, XCircle, TrendingUp, ChevronDown, ChevronUp,
  Warehouse, Calendar, DollarSign, Minus, Plus as PlusIcon,
  MapPin, BarChart3
} from 'lucide-react';

const getProductImage = (name) => {
  const seed = name.replace(/\s/g, '').toLowerCase();
  return `https://picsum.photos/seed/${seed}/80/80`;
};

const InventoryModal = ({ isOpen, onClose, onSubmit, item, title }) => {
  const [form, setForm] = useState(item || { 
    name: '', category: '', stock: '', reorderLevel: '', 
    price: '', warehouse: '', status: 'In Stock' 
  });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold mb-4">{title}</h3>
        <input type="text" placeholder="Product name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm sm:text-base" />
        <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm sm:text-base" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm sm:text-base" />
        <input type="number" placeholder="Reorder Level" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm sm:text-base" />
        <input type="number" placeholder="Price ($)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm sm:text-base" />
        <input type="text" placeholder="Warehouse" value={form.warehouse} onChange={e => setForm({...form, warehouse: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm sm:text-base" />
        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm sm:text-base">
          <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
        </select>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button onClick={() => { onSubmit(form); onClose(); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base">Save</button>
          <button onClick={onClose} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-lg text-sm sm:text-base">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, change, subtitle }) => (
  <div className="bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-900/90 dark:to-gray-800/60 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 dark:text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition`}>
        {icon}
      </div>
    </div>
    {change && (
      <div className="mt-3 flex items-center gap-1 text-xs">
        {change >= 0 ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
        <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>{Math.abs(change)}%</span>
        <span className="text-gray-400">vs last month</span>
      </div>
    )}
  </div>
);

const StockProgress = ({ stock, reorderLevel }) => {
  const maxStock = reorderLevel * 3 || 100;
  const percentage = Math.min((stock / maxStock) * 100, 100);
  const color = stock <= reorderLevel ? 'bg-red-500' : stock <= reorderLevel * 1.5 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

const Inventory = () => {
  const mockInventory = [
    { id: 1, name: 'Gaming Laptop', category: 'Electronics', stock: 45, reorderLevel: 10, price: 1299, warehouse: 'A-12', status: 'In Stock', lastUpdated: '2026-06-15', supplier: 'TechDistro', movement: '+5' },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', stock: 120, reorderLevel: 30, price: 29, warehouse: 'B-05', status: 'In Stock', lastUpdated: '2026-06-14', supplier: 'OfficeSupply', movement: '+12' },
    { id: 3, name: 'Mechanical Keyboard', category: 'Accessories', stock: 8, reorderLevel: 20, price: 89, warehouse: 'B-07', status: 'Low Stock', lastUpdated: '2026-06-13', supplier: 'MechWorld', movement: '-3' },
    { id: 4, name: '4K Monitor', category: 'Electronics', stock: 0, reorderLevel: 5, price: 399, warehouse: 'A-15', status: 'Out of Stock', lastUpdated: '2026-06-10', supplier: 'DisplayPro', movement: '-2' },
    { id: 5, name: 'USB-C Cable', category: 'Cables', stock: 340, reorderLevel: 50, price: 12, warehouse: 'C-03', status: 'In Stock', lastUpdated: '2026-06-12', supplier: 'CableMasters', movement: '+45' },
    { id: 6, name: 'Laptop Stand', category: 'Accessories', stock: 67, reorderLevel: 15, price: 45, warehouse: 'B-09', status: 'In Stock', lastUpdated: '2026-06-11', supplier: 'ErgoTech', movement: '+8' },
    { id: 7, name: 'Noise Cancelling Headphones', category: 'Audio', stock: 34, reorderLevel: 10, price: 199, warehouse: 'D-01', status: 'In Stock', lastUpdated: '2026-06-09', supplier: 'AudioPro', movement: '+3' },
    { id: 8, name: 'Smart Watch', category: 'Wearables', stock: 12, reorderLevel: 15, price: 249, warehouse: 'D-04', status: 'Low Stock', lastUpdated: '2026-06-08', supplier: 'WearTech', movement: '-1' },
  ];

  const [items, setItems] = useState(mockInventory);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 8;

  const fetchInventory = useCallback(async (showToast = false) => {
    setLoading(true);
    setTimeout(() => {
      setItems(mockInventory);
      setLoading(false);
      if (showToast) toast.success('Inventory updated');
    }, 500);
  }, []);

  React.useEffect(() => { fetchInventory(); }, []);

  const sortedItems = useMemo(() => {
    const sorted = [...items];
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
  }, [items, sortField, sortDirection]);

  const filtered = sortedItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalItems = filtered.length;
  const lowStockItems = filtered.filter(i => i.status === 'Low Stock').length;
  const outOfStock = filtered.filter(i => i.status === 'Out of Stock').length;
  const totalValue = filtered.reduce((sum, i) => sum + (i.stock * i.price), 0);
  const categories = ['all', ...new Set(items.map(i => i.category))];

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  const handleAdd = (data) => {
    const newItem = { ...data, id: Date.now(), lastUpdated: new Date().toISOString().slice(0,10), supplier: 'N/A', movement: '0' };
    setItems([newItem, ...items]);
    toast.success('Item added');
  };

  const handleEdit = (data) => {
    setItems(items.map(i => i.id === editingItem.id ? { ...data, id: i.id, lastUpdated: new Date().toISOString().slice(0,10) } : i));
    toast.success('Item updated');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete item?')) {
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    }
  };

  const handleAdjustStock = (id, amount) => {
    setItems(items.map(i => {
      if (i.id === id) {
        const newStock = Math.max(0, i.stock + amount);
        const status = newStock === 0 ? 'Out of Stock' : newStock <= i.reorderLevel ? 'Low Stock' : 'In Stock';
        return { ...i, stock: newStock, status, lastUpdated: new Date().toISOString().slice(0,10) };
      }
      return i;
    }));
    toast.success(`Stock ${amount > 0 ? 'increased' : 'decreased'}`);
  };

  const exportCSV = () => {
    const headers = ['Name','Category','Stock','Reorder Level','Price','Warehouse','Status','Supplier','Last Updated'];
    const rows = filtered.map(i => [i.name, i.category, i.stock, i.reorderLevel, i.price, i.warehouse, i.status, i.supplier, i.lastUpdated]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory.csv';
    link.click();
    toast.success('Export started');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Out of Stock': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'In Stock': return <CheckCircle size={18} className="text-green-500" />;
      case 'Low Stock': return <AlertTriangle size={18} className="text-yellow-500" />;
      case 'Out of Stock': return <XCircle size={18} className="text-red-500" />;
      default: return null;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">📦 Inventory</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Warehouse & stock management</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="bg-teal-600 hover:bg-teal-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm sm:text-base"><Download size={18} /> Export</button>
          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm sm:text-base"><Plus size={18} /> Add Item</button>
          <button onClick={() => { setRefreshing(true); fetchInventory(true); }} disabled={refreshing} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 sm:py-2 rounded-xl shadow"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard title="Total Items" value={totalItems} icon={<Package size={22} className="text-white" />} color="from-teal-500 to-cyan-500" change={8} />
        <StatCard title="Low Stock" value={lowStockItems} icon={<AlertTriangle size={22} className="text-white" />} color="from-amber-500 to-orange-500" change={-2} />
        <StatCard title="Out of Stock" value={outOfStock} icon={<XCircle size={22} className="text-white" />} color="from-red-500 to-pink-500" change={5} />
        <StatCard title="Total Value" value={`$${totalValue.toLocaleString()}`} icon={<DollarSign size={22} className="text-white" />} color="from-purple-500 to-indigo-500" subtitle={`${categories.length - 1} categories`} />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name or category..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 transition text-sm" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white/70 dark:bg-gray-900/70 text-sm">
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white/70 dark:bg-gray-900/70 text-sm">
          <option value="all">All Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
        </select>
      </div>

      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-teal-50/80 to-cyan-50/80 dark:from-gray-800/80 dark:to-gray-700/80">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-teal-600" onClick={() => handleSort('name')}>Product</th>
                  <th className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-teal-600" onClick={() => handleSort('category')}>Category</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-teal-600" onClick={() => handleSort('stock')}>Stock</th>
                  <th className="hidden md:table-cell px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Warehouse</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:text-teal-600" onClick={() => handleSort('status')}>Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"></th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginated.map(item => {
                  const isCritical = item.stock <= item.reorderLevel;
                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group ${isCritical ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <img src={getProductImage(item.name)} alt={item.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-gray-300 dark:ring-gray-600" />
                            <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{item.name}</span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-600 dark:text-gray-400"><span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">{item.category}</span></td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex flex-col gap-1 min-w-[80px]">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 dark:text-white text-sm">{item.stock}</span>
                              <span className="text-xs text-gray-400 hidden sm:inline">/ reorder: {item.reorderLevel}</span>
                            </div>
                            <StockProgress stock={item.stock} reorderLevel={item.reorderLevel} />
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium">
                            <MapPin size={12} /> {item.warehouse}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)} <span className="hidden sm:inline">{item.status}</span>
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleAdjustStock(item.id, 1)} className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600"><PlusIcon size={14} /></button>
                            <button onClick={() => handleAdjustStock(item.id, -1)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"><Minus size={14} /></button>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 flex gap-1 sm:gap-2">
                          <button onClick={() => toggleExpand(item.id)} className="text-gray-500 hover:text-teal-600 transition">
                            {expandedRow === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                      {expandedRow === item.id && (
                        <tr className="bg-teal-50/30 dark:bg-teal-900/10">
                          <td colSpan="7" className="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                              <div><span className="font-semibold flex items-center gap-1"><Warehouse size={14} /> Warehouse:</span> {item.warehouse}</div>
                              <div><span className="font-semibold flex items-center gap-1"><AlertTriangle size={14} /> Reorder Level:</span> {item.reorderLevel}</div>
                              <div><span className="font-semibold flex items-center gap-1"><Calendar size={14} /> Last Updated:</span> {item.lastUpdated}</div>
                              <div><span className="font-semibold flex items-center gap-1"><DollarSign size={14} /> Price:</span> ${item.price}</div>
                              <div><span className="font-semibold flex items-center gap-1"><Package size={14} /> Supplier:</span> {item.supplier}</div>
                              <div><span className="font-semibold flex items-center gap-1"><BarChart3 size={14} /> Movement:</span> {item.movement} this week</div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Stock is {item.stock <= item.reorderLevel ? '⚠️ below reorder level' : '✅ above reorder level'}</div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {paginated.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-400">No inventory items match</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
            <button disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"><ChevronLeft size={16} /></button>
            <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"><ChevronRight size={16} /></button>
          </div>
        )}
      </div>

      <InventoryModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }} onSubmit={editingItem ? handleEdit : handleAdd} item={editingItem} title={editingItem ? 'Edit Item' : 'Add Item'} />
    </div>
  );
};

export default Inventory;