import React, { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, 
  Download, RefreshCw, Package, DollarSign, Tag, Box,
  TrendingUp, ChevronDown, ChevronUp, Eye
} from 'lucide-react';

// Generate a consistent product image using picsum (seed based on product name)
const getProductImage = (name) => {
  const seed = name.replace(/\s/g, '').toLowerCase();
  return `https://picsum.photos/seed/${seed}/80/80`;
};

// Product Modal (Add/Edit)
const ProductModal = ({ isOpen, onClose, onSubmit, product, title }) => {
  const [form, setForm] = useState(product || { name: '', price: '', category: '', stock: '', status: 'Active' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <input type="text" placeholder="Product name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded-lg mb-3 dark:bg-gray-700" />
        <input type="number" placeholder="Price ($)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
        <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full p-2 border rounded-lg mb-3" />
        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-2 border rounded-lg mb-3">
          <option>Active</option><option>Inactive</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={() => { onSubmit(form); onClose(); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button>
          <button onClick={onClose} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Summary Card
const StatCard = ({ title, value, icon, color, change }) => (
  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border hover:shadow-xl transition">
    <div className="flex justify-between items-start">
      <div><p className="text-gray-500 text-xs uppercase">{title}</p><p className="text-2xl font-bold mt-1">{value}</p></div>
      <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600`}>{icon}</div>
    </div>
    {change && <p className="text-xs mt-2 text-green-500 flex items-center gap-1"><TrendingUp size={10}/> {change}% from last month</p>}
  </div>
);

const Products = () => {
  const mockProducts = [
    { id: 1, name: 'Gaming Laptop', price: 1299, category: 'Electronics', stock: 45, status: 'Active', description: 'High-performance laptop with RTX 4060' },
    { id: 2, name: 'Wireless Mouse', price: 29, category: 'Accessories', stock: 120, status: 'Active', description: 'Ergonomic wireless mouse' },
    { id: 3, name: 'Mechanical Keyboard', price: 89, category: 'Accessories', stock: 78, status: 'Active', description: 'RGB mechanical keyboard with blue switches' },
    { id: 4, name: '4K Monitor', price: 399, category: 'Electronics', stock: 23, status: 'Inactive', description: '27-inch 4K UHD monitor' },
    { id: 5, name: 'USB-C Cable', price: 12, category: 'Cables', stock: 340, status: 'Active', description: 'Fast charging USB-C cable' },
    { id: 6, name: 'Laptop Stand', price: 45, category: 'Accessories', stock: 67, status: 'Active', description: 'Adjustable laptop stand' },
    { id: 7, name: 'Noise Cancelling Headphones', price: 199, category: 'Audio', stock: 34, status: 'Active', description: 'Premium noise-cancelling headphones' },
    { id: 8, name: 'Smart Watch', price: 249, category: 'Wearables', stock: 56, status: 'Active', description: 'Fitness tracker with GPS' },
  ];

  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 8;

  // Simulate loading
  const fetchProducts = useCallback(async (showToast = false) => {
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
      if (showToast) toast.success('Products updated');
    }, 500);
  }, []);

  React.useEffect(() => { fetchProducts(); }, []);

  // Sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
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
  }, [products, sortField, sortDirection]);

  // Filtering
  const filtered = sortedProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchPrice = (!minPrice || p.price >= parseFloat(minPrice)) && (!maxPrice || p.price <= parseFloat(maxPrice));
    return matchSearch && matchCategory && matchPrice;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const totalProducts = filtered.length;
  const totalStock = filtered.reduce((s, p) => s + p.stock, 0);
  const activeProducts = filtered.filter(p => p.status === 'Active').length;
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  const handleAdd = (data) => {
    const newP = { ...data, id: Date.now(), description: 'New product' };
    setProducts([newP, ...products]);
    toast.success('Product added');
  };

  const handleEdit = (data) => {
    setProducts(products.map(p => p.id === editingProduct.id ? { ...data, id: p.id, description: p.description } : p));
    toast.success('Product updated');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete product?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Deleted');
    }
  };

  const exportCSV = () => {
    const headers = ['Name','Price','Category','Stock','Status'];
    const rows = filtered.map(p => [p.name, p.price, p.category, p.stock, p.status]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
    toast.success('Export started');
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div><h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Products</h1><p className="text-gray-500">Manage product catalog</p></div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"><Download size={18} /> Export</button>
          <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow flex items-center gap-2"><Plus size={18} /> Add Product</button>
          <button onClick={() => { setRefreshing(true); fetchProducts(true); }} disabled={refreshing} className="bg-gray-600 text-white px-3 py-2 rounded-xl shadow"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Products" value={totalProducts} icon={<Package size={20} />} color="blue" change={5} />
        <StatCard title="Total Stock" value={totalStock} icon={<Box size={20} />} color="green" change={12} />
        <StatCard title="Active Products" value={activeProducts} icon={<Tag size={20} />} color="purple" change={3} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input type="text" placeholder="Search product..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-xl bg-white/70" /></div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded-xl px-3 py-2 bg-white/70">
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-1 border"><DollarSign size={16} /><input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-16 bg-transparent outline-none text-sm" /><span>to</span><input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-16 bg-transparent outline-none text-sm" /></div>
      </div>

      {/* Products Table */}
      <div className="bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-lg overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('name')}>Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('price')}>Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('stock')}>Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('status')}>Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.map(product => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={getProductImage(product.name)} alt={product.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-300 dark:ring-gray-600" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold">${product.price}</td>
                    <td className="px-4 py-4"><span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">{product.category}</span></td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${product.stock > 100 ? 'bg-green-100 text-green-700' : product.stock > 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 100 ? 'High' : product.stock > 20 ? 'Medium' : 'Low'} ({product.stock})
                      </span>
                    </td>
                    <td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.status}</span></td>
                    <td className="px-4 py-4"><button onClick={() => toggleExpand(product.id)} className="text-gray-500 hover:text-blue-500">{expandedRow === product.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button></td>
                    <td className="px-4 py-4 flex gap-2">
                      <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="text-blue-500"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                  {/* Expandable detail row */}
                  {expandedRow === product.id && (
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                      <td colSpan="7" className="px-4 py-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div><span className="font-semibold">Description:</span> {product.description || 'No description'}</div>
                          <div><span className="font-semibold">Status:</span> {product.status}</div>
                          <div><span className="font-semibold">Stock:</span> {product.stock} units</div>
                          <div><span className="font-semibold">Price:</span> ${product.price}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {paginated.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-400">No products match</td></tr>}
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

      <ProductModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} onSubmit={editingProduct ? handleEdit : handleAdd} product={editingProduct} title={editingProduct ? 'Edit Product' : 'Add Product'} />
    </div>
  );
};

export default Products;