import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, Plus, RefreshCw, ChevronLeft, ChevronRight,
  FileText, Clock, Calendar, 
  Download, Eye, Trash2, Edit2, Share2, Send,
  Star, Sparkles, Zap,
  Grid, List, Home, Inbox, Archive, HardDrive,
  BarChart3, PieChart, LineChart, Users, TrendingUp,CheckCircle,
  X
} from 'lucide-react';

const mockReports = [
  { id: 1, name: 'Q2 Sales Performance Report', category: 'Sales', date: '2026-06-15', status: 'Completed', format: 'PDF', size: '2.4 MB', author: 'Alice Johnson', pages: 12, starred: true, shared: true, scheduled: false },
  { id: 2, name: 'User Engagement Analysis', category: 'Marketing', date: '2026-06-12', status: 'Completed', format: 'PDF', size: '1.8 MB', author: 'Bob Smith', pages: 8, starred: false, shared: false, scheduled: true },
  { id: 3, name: 'Marketing ROI Summary', category: 'Marketing', date: '2026-06-10', status: 'Draft', format: 'Excel', size: '3.1 MB', author: 'Carol Davis', pages: 5, starred: true, shared: false, scheduled: false },
  { id: 4, name: 'Customer Churn Analysis', category: 'Retention', date: '2026-06-08', status: 'Pending', format: 'PDF', size: '0.9 MB', author: 'David Wilson', pages: 15, starred: false, shared: true, scheduled: false },
  { id: 5, name: 'Regional Revenue Dashboard', category: 'Sales', date: '2026-06-05', status: 'Completed', format: 'Excel', size: '4.2 MB', author: 'Emma Brown', pages: 6, starred: false, shared: true, scheduled: true },
  { id: 6, name: 'Customer Lifetime Value Report', category: 'Finance', date: '2026-06-01', status: 'Completed', format: 'PDF', size: '1.2 MB', author: 'Frank Miller', pages: 20, starred: true, shared: false, scheduled: false },
  { id: 7, name: 'Social Media Performance Q2', category: 'Marketing', date: '2026-05-28', status: 'Archived', format: 'PDF', size: '1.5 MB', author: 'Grace Lee', pages: 10, starred: false, shared: false, scheduled: false },
  { id: 8, name: 'Email Campaign Analytics', category: 'Marketing', date: '2026-05-25', status: 'Draft', format: 'Excel', size: '2.1 MB', author: 'Henry Clark', pages: 7, starred: false, shared: false, scheduled: false },
  { id: 9, name: 'Product Roadmap Report', category: 'Product', date: '2026-05-22', status: 'Completed', format: 'PDF', size: '3.8 MB', author: 'Ivy Martinez', pages: 14, starred: true, shared: true, scheduled: true },
  { id: 10, name: 'Quarterly Financial Review', category: 'Finance', date: '2026-05-20', status: 'Pending', format: 'PDF', size: '5.6 MB', author: 'Jack White', pages: 25, starred: false, shared: false, scheduled: false },
];

const folders = [
  { id: 'all', name: 'All Reports', icon: <Home size={18} />, count: 10 },
  { id: 'Sales', name: 'Sales Reports', icon: <TrendingUp size={18} />, count: 2 },
  { id: 'Marketing', name: 'Marketing Reports', icon: <BarChart3 size={18} />, count: 4 },
  { id: 'Finance', name: 'Finance Reports', icon: <PieChart size={18} />, count: 2 },
  { id: 'Product', name: 'Product Reports', icon: <LineChart size={18} />, count: 1 },
  { id: 'Retention', name: 'Retention Reports', icon: <Users size={18} />, count: 1 },
];

const templates = [
  { id: 1, name: 'Sales Performance', description: 'Monthly sales overview', icon: <TrendingUp size={16} /> },
  { id: 2, name: 'Marketing Analytics', description: 'Campaign effectiveness', icon: <BarChart3 size={16} /> },
  { id: 3, name: 'Financial Summary', description: 'Revenue & expenses', icon: <PieChart size={16} /> },
  { id: 4, name: 'Customer Insights', description: 'Behavior & retention', icon: <Users size={16} /> },
];

// Folder Sidebar – Responsive
const FolderSidebar = ({ selected, onSelect, collapsed, onToggleCollapse }) => {
  return (
    <div className={`${collapsed ? 'w-16' : 'w-56'} bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-3 transition-all duration-300 overflow-hidden h-full flex-shrink-0`}>
      <div className="flex justify-between items-center mb-3">
        {!collapsed && <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Folders</span>}
        <button onClick={onToggleCollapse} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <div className="space-y-1">
        {folders.map(f => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
              selected === f.id
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-gray-500 dark:text-gray-400">{f.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">{f.name}</span>
                <span className={`text-xs ${selected === f.id ? 'text-white/70' : 'text-gray-400'}`}>{f.count}</span>
              </>
            )}
          </button>
        ))}
      </div>
      <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed ? (
          <>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Inbox size={16} /> Archived
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <HardDrive size={16} /> Trash
            </button>
          </>
        ) : (
          <button className="w-full p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <MoreVertical size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// Report Card – Responsive
const ReportCard = ({ report, onStar, onDelete, onView, onDownload }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300';
      case 'Draft': return 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300';
      case 'Archived': return 'bg-gray-500/20 text-gray-700 dark:bg-gray-500/30 dark:text-gray-300';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-2">
        <div className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium ${getStatusColor(report.status)}`}>
          {report.status}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => onStar(report.id)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {report.starred ? <Star size={14} className="text-yellow-500" fill="currentColor" /> : <Star size={14} className="text-gray-400" />}
          </button>
          <button onClick={() => onView(report)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"><Eye size={14} className="text-blue-500" /></button>
          <button onClick={() => onDownload(report.id)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"><Download size={14} className="text-green-500" /></button>
          <button onClick={() => onDelete(report.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition"><Trash2 size={14} className="text-red-500" /></button>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
          <FileText size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm truncate">{report.name}</h4>
          <p className="text-[10px] sm:text-xs text-gray-500">{report.author} • {report.date}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        <span className="text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600">{report.category}</span>
        <span className="text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600">{report.format}</span>
        <span className="text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600">{report.pages}p</span>
      </div>
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
        <span className="text-[8px] sm:text-[10px] text-gray-400">{report.size}</span>
        <div className="flex gap-2 text-[8px] sm:text-[10px] text-gray-400">
          {report.shared && <Share2 size={12} className="text-blue-400" />}
          {report.scheduled && <Clock size={12} className="text-purple-400" />}
        </div>
      </div>
    </div>
  );
};

// Generate Modal – Responsive
const GenerateModal = ({ isOpen, onClose, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Sales',
    format: 'PDF',
    schedule: 'none',
    recipients: '',
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleGenerate = () => {
    onGenerate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-[520px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            Generate Report
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><X size={20} /></button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Choose a template to get started</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`p-3 rounded-xl border-2 transition text-left ${selectedTemplate === t.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
                >
                  <div className="flex items-center gap-2 text-purple-500">{t.icon} <span className="font-medium text-gray-800 dark:text-white">{t.name}</span></div>
                  <p className="text-xs text-gray-400 mt-1">{t.description}</p>
                </button>
              ))}
            </div>
            <button onClick={handleNext} disabled={!selectedTemplate} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 text-sm">Next</button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Report name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 text-sm">
              <option>Sales</option><option>Marketing</option><option>Finance</option><option>Product</option><option>Retention</option>
            </select>
            <select value={form.format} onChange={e => setForm({...form, format: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 text-sm">
              <option>PDF</option><option>Excel</option><option>CSV</option><option>PPT</option>
            </select>
            <select value={form.schedule} onChange={e => setForm({...form, schedule: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 text-sm">
              <option value="none">Run once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <input
              type="text"
              placeholder="Recipients (email, comma separated)"
              value={form.recipients}
              onChange={e => setForm({...form, recipients: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleBack} className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm">Back</button>
              <button onClick={handleGenerate} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition text-sm">Generate</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Stat – Responsive
const QuickStat = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-200/50 dark:border-gray-700/50">
    <div className={`p-1.5 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

// Main Reports Center Component
const Reports = () => {
  const [reports, setReports] = useState(mockReports);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [folderCollapsed, setFolderCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    let result = [...reports];
    if (selectedFolder !== 'all') result = result.filter(r => r.category === selectedFolder);
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(s) || r.author.toLowerCase().includes(s));
    }
    return result;
  }, [reports, selectedFolder, search]);

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'Completed').length;
  const scheduledReports = reports.filter(r => r.scheduled).length;

  const handleStar = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, starred: !r.starred } : r));
    toast.success('Report updated');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
      toast.success('Report deleted');
    }
  };

  const handleView = (report) => setSelectedReport(report);
  const handleDownload = (id) => toast.success(`Downloading report...`);

  const handleGenerate = (data) => {
    const newReport = {
      id: Date.now(),
      name: data.name || 'New Report',
      category: data.category,
      date: new Date().toISOString().slice(0,10),
      status: 'Draft',
      format: data.format,
      size: '0.5 MB',
      author: 'You',
      pages: Math.floor(Math.random() * 10) + 5,
      starred: false,
      shared: false,
      scheduled: data.schedule !== 'none',
    };
    setReports([newReport, ...reports]);
    toast.success('Report generated!');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setReports(mockReports.map(r => ({ ...r, views: (r.views || 0) + 1 })));
      setRefreshing(false);
      toast.success('Reports refreshed');
    }, 500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-3 sm:p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">📄 Report Center</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Manage, generate, and share reports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleRefresh} disabled={refreshing} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 sm:py-2 rounded-xl shadow transition text-sm"><RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /></button>
          <button onClick={() => setIsGenerateOpen(true)} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 transition text-sm"><Sparkles size={18} /> Generate</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <QuickStat icon={<FileText size={16} />} label="Total Reports" value={totalReports} color="blue" />
        <QuickStat icon={<CheckCircle size={16} />} label="Completed" value={completedReports} color="green" />
        <QuickStat icon={<Clock size={16} />} label="Scheduled" value={scheduledReports} color="purple" />
        <QuickStat icon={<Share2 size={16} />} label="Shared" value={reports.filter(r => r.shared).length} color="teal" />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 min-h-[400px] sm:h-[calc(100vh-380px)]">
        <FolderSidebar
          selected={selectedFolder}
          onSelect={setSelectedFolder}
          collapsed={folderCollapsed}
          onToggleCollapse={() => setFolderCollapsed(!folderCollapsed)}
        />

        {/* Content Area */}
        <div className="flex-1 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center gap-2 p-2 sm:p-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex gap-2 flex-1 min-w-[150px]">
              <div className="relative flex-1 max-w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex gap-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Grid size={14} /></button>
              <button onClick={() => setViewMode('table')} className={`p-1.5 transition ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><List size={14} /></button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {paginated.map(r => <ReportCard key={r.id} report={r} onStar={handleStar} onDelete={handleDelete} onView={handleView} onDownload={handleDownload} />)}
                {paginated.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No reports in this folder</div>}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                      <tr>
                        {['Name', 'Category', 'Date', 'Status', 'Format', ''].map((h, idx) => (
                          <th key={idx} className="px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map(r => (
                        <tr key={r.id} className="border-t border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                          <td className="px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap">{r.name}</td>
                          <td className="px-3 py-2 text-[10px] sm:text-xs whitespace-nowrap">{r.category}</td>
                          <td className="px-3 py-2 text-[10px] sm:text-xs whitespace-nowrap">{r.date}</td>
                          <td className="px-3 py-2 whitespace-nowrap"><span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] ${r.status === 'Completed' ? 'bg-green-100 text-green-700' : r.status === 'Draft' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span></td>
                          <td className="px-3 py-2 text-[10px] sm:text-xs whitespace-nowrap">{r.format}</td>
                          <td className="px-3 py-2 flex gap-1 whitespace-nowrap">
                            <button onClick={() => handleStar(r.id)}>{r.starred ? <Star size={14} className="text-yellow-500" fill="currentColor" /> : <Star size={14} className="text-gray-400" />}</button>
                            <button onClick={() => handleView(r)}><Eye size={14} className="text-blue-500" /></button>
                            <button onClick={() => handleDownload(r.id)}><Download size={14} className="text-green-500" /></button>
                            <button onClick={() => handleDelete(r.id)}><Trash2 size={14} className="text-red-500" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-2 sm:p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-800/30">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p-1)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 text-sm"><ChevronLeft size={14} /></button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p+1)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 text-sm"><ChevronRight size={14} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Generate Modal */}
      <GenerateModal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} onGenerate={handleGenerate} />

      {/* View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="text-lg sm:text-xl font-bold">{selectedReport.name}</h3><p className="text-sm text-gray-500">{selectedReport.author} • {selectedReport.date}</p></div>
              <button onClick={() => setSelectedReport(null)} className="p-1 rounded hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
              <div><span className="text-gray-500">Category:</span> {selectedReport.category}</div>
              <div><span className="text-gray-500">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${selectedReport.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{selectedReport.status}</span></div>
              <div><span className="text-gray-500">Format:</span> {selectedReport.format}</div>
              <div><span className="text-gray-500">Pages:</span> {selectedReport.pages}</div>
              <div><span className="text-gray-500">Size:</span> {selectedReport.size}</div>
              <div><span className="text-gray-500">Shared:</span> {selectedReport.shared ? 'Yes' : 'No'}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t">
              <button onClick={() => handleDownload(selectedReport.id)} className="w-full sm:flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"><Download size={16} className="inline mr-2" /> Download</button>
              <button className="w-full sm:flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm"><Share2 size={16} className="inline mr-2" /> Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;