import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  RefreshCw, Search, Filter, ArrowUpDown, TrendingUp, TrendingDown, 
  Zap, Calendar, DollarSign, Tag, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

// ------------------- API CONFIGURATION -------------------
const API_BASE_URL = 'https://your-api.com/api';

const fetchInsightsFromAPI = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.search) params.append('search', filters.search);
  
  // 🔁 Replace this mock with your real fetch
  await new Promise(resolve => setTimeout(resolve, 800));
  const mockData = [
    { id: 1, title: '🚀 Mobile revenue surge', description: 'Mobile users now drive 42% of total revenue (+24% WoW). Optimize checkout flow.', type: 'positive', priority: 'High', date: '2026-06-13', impact: 34000, category: 'Revenue', trend: 'up' },
    { id: 2, title: '⚠️ Cart abandonment spike', description: 'Abandonment rate at 67% on Tuesdays – launch mid‑week retargeting.', type: 'warning', priority: 'Critical', date: '2026-06-11', impact: -12000, category: 'Conversion', trend: 'down' },
    { id: 3, title: '📈 APAC upsell opportunity', description: 'APAC customers have 1.8x higher LTV. Bundle products for Q3.', type: 'neutral', priority: 'Medium', date: '2026-06-09', impact: 89000, category: 'Growth', trend: 'up' },
    { id: 4, title: '📧 Email engagement drop', description: 'Open rates -5% – test new subject lines.', type: 'warning', priority: 'High', date: '2026-06-07', impact: -5000, category: 'Marketing', trend: 'down' },
    { id: 5, title: '🤖 Chatbot efficiency', description: '32% more resolutions – positive CSAT impact.', type: 'positive', priority: 'Low', date: '2026-06-04', impact: 8000, category: 'Support', trend: 'up' },
    { id: 6, title: '📊 Dashboard usage up', description: 'Daily active users increased 18% – feature adoption growing.', type: 'positive', priority: 'Medium', date: '2026-06-01', impact: 21000, category: 'Engagement', trend: 'up' },
    { id: 7, title: '🎯 New feature adoption', description: 'AI recommendations clicked 2.5x more than expected.', type: 'positive', priority: 'High', date: '2026-05-28', impact: 15700, category: 'Product', trend: 'up' },
  ];
  let filtered = mockData;
  if (filters.type && filters.type !== 'all') filtered = filtered.filter(i => i.type === filters.type);
  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(i => i.title.toLowerCase().includes(s) || i.category.toLowerCase().includes(s));
  }
  return filtered;
};

// ------------------- SKELETON LOADER -------------------
const InsightSkeleton = () => (
  <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 md:p-5 border animate-pulse">
    <div className="flex justify-between items-start">
      <div className="h-5 md:h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="flex gap-2"><div className="h-4 w-12 bg-gray-300 rounded-full"></div><div className="h-4 w-12 bg-gray-300 rounded-full"></div></div>
    </div>
    <div className="mt-3 space-y-2">
      <div className="h-3 md:h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-3 md:h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <div className="h-3 bg-gray-300 rounded w-20"></div>
      <div className="h-6 md:h-8 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
);

// ------------------- MAIN COMPONENT -------------------
const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('impact');
  const [sortOrder, setSortOrder] = useState('desc');
  const [appliedId, setAppliedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadInsights = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const data = await fetchInsightsFromAPI({ type: filterType, search: searchTerm });
      setInsights(data);
      if (showToast) toast.success('Insights refreshed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterType, searchTerm]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  // ✅ Fix: Add handleRefresh function
  const handleRefresh = () => {
    setRefreshing(true);
    loadInsights(true);
  };

  const handleApply = (id) => {
    setAppliedId(id);
    toast.success('Insight applied! Check your dashboard.');
    setTimeout(() => setAppliedId(null), 2000);
  };

  const totalImpact = insights.reduce((sum, i) => sum + i.impact, 0);
  const positiveCount = insights.filter(i => i.type === 'positive').length;
  const warningCount = insights.filter(i => i.type === 'warning').length;

  const formatCurrency = (value) => {
    const absVal = Math.abs(value);
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0 }).format(absVal);
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getTypeStyles = (type) => {
    switch(type) {
      case 'positive': return { border: 'border-l-8 border-green-500', gradient: 'from-green-500 to-emerald-500', icon: TrendingUp, iconColor: 'text-green-500' };
      case 'warning': return { border: 'border-l-8 border-amber-500', gradient: 'from-amber-500 to-orange-500', icon: TrendingDown, iconColor: 'text-amber-500' };
      default: return { border: 'border-l-8 border-blue-500', gradient: 'from-blue-500 to-indigo-500', icon: AlertCircle, iconColor: 'text-blue-500' };
    }
  };

  const sortedInsights = [...insights].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (sortBy === 'impact') {
      aVal = Math.abs(aVal);
      bVal = Math.abs(bVal);
    }
    if (sortBy === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">AI Insights</h1>
          <p className="text-sm md:text-base text-gray-500">Real‑time intelligence & recommendations</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm md:text-base"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats + Search + Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-1 rounded-full text-xs md:text-sm flex items-center gap-1"><CheckCircle size={14}/> {positiveCount} Positive</div>
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 px-2 py-1 rounded-full text-xs md:text-sm flex items-center gap-1"><AlertCircle size={14}/> {warningCount} Warnings</div>
          <div className={`bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs md:text-sm flex items-center gap-1 ${totalImpact >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            <DollarSign size={14}/> Total: {formatCurrency(totalImpact)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full md:w-48 pl-8 pr-3 py-1.5 border rounded-xl text-sm bg-white/70 dark:bg-gray-900/70"
            />
          </div>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)} 
            className="flex-1 md:flex-none border rounded-xl px-2 py-1.5 text-sm bg-white/70 dark:bg-gray-900/70"
          >
            <option value="impact">Sort: Impact</option>
            <option value="date">Sort: Date</option>
            <option value="title">Sort: Title</option>
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} 
            className="px-2 py-1.5 border rounded-xl bg-white/70 dark:bg-gray-900/70"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {/* Type filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'positive', 'warning', 'neutral'].map(type => (
          <button 
            key={type} 
            onClick={() => setFilterType(type)} 
            className={`px-3 py-1 text-xs md:text-sm rounded-full font-medium transition capitalize ${filterType === type ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            {type === 'all' ? 'All' : type}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => <InsightSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedInsights.map(insight => {
            const styles = getTypeStyles(insight.type);
            const Icon = styles.icon;
            return (
              <div 
                key={insight.id} 
                className={`relative overflow-hidden rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${styles.border} hover:scale-[1.02] group`}
              >
                <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br ${styles.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 ${styles.iconColor}`} />
                    <h3 className="font-bold text-sm md:text-lg text-gray-800 dark:text-white">{insight.title}</h3>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium ${
                      insight.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/40' :
                      insight.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800'
                    }`}>{insight.priority}</span>
                    <span className="text-[10px] md:text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center gap-1"><Tag size={10}/>{insight.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-xs md:text-sm leading-relaxed">{insight.description}</p>
                <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
                  <div className="flex gap-2 text-[10px] md:text-xs">
                    <span className="text-gray-400 flex items-center gap-1"><Calendar size={12}/>{new Date(insight.date).toLocaleDateString()}</span>
                    <span className={`font-semibold flex items-center gap-1 ${insight.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {insight.impact >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                      {formatCurrency(insight.impact)}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleApply(insight.id)} 
                    className="text-blue-500 font-medium text-xs md:text-sm hover:underline flex items-center gap-1 transition group-hover:gap-2"
                  >
                    Apply <Zap size={12} />
                  </button>
                </div>
                {appliedId === insight.id && (
                  <div className="mt-2 text-xs text-green-600 animate-pulse flex items-center gap-1"><CheckCircle size={12}/> Applied!</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {!loading && sortedInsights.length === 0 && (
        <div className="text-center py-12 bg-white/70 dark:bg-gray-900/70 rounded-2xl">
          <XCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-400">No insights match.</p>
        </div>
      )}
    </div>
  );
};

export default Insights;