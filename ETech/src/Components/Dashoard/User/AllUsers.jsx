import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Search, Download, UserPlus, Edit2, Trash2, 
  ChevronLeft, ChevronRight, Eye, X, ArrowUpDown
} from 'lucide-react';

const generateMockUsers = () => {
  const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Isabella', 'Jack'];
  const lastNames = ['Johnson', 'Smith', 'Davis', 'Wilson', 'Brown', 'Miller', 'Lee', 'Clark', 'Rodriguez', 'Martinez'];
  const roles = ['Admin', 'Editor', 'Viewer'];
  const statuses = ['Active', 'Inactive'];
  return Array.from({ length: 24 }, (_, i) => {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    return {
      id: i + 1,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      role: roles[i % 3],
      status: statuses[i % 2],
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0,10),
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${(i % 70) + 1}.jpg`,
      location: ['New York', 'London', 'Tokyo', 'Berlin'][i % 4],
      joinDate: new Date(2024, i % 12, (i % 28) + 1).toISOString().slice(0,10)
    };
  });
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Viewer', status: 'Active' });
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 8;

  useEffect(() => {
    setTimeout(() => {
      setUsers(generateMockUsers());
      setLoading(false);
    }, 500);
  }, []);

  const sortedUsers = [...users].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const handleAddUser = () => {
    const newUser = {
      ...formData,
      id: Date.now(),
      lastActive: new Date().toISOString().slice(0,10),
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 100)}.jpg`,
      joinDate: new Date().toISOString().slice(0,10),
      location: 'Unknown'
    };
    setUsers([newUser, ...users]);
    toast.success('User added successfully');
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'Viewer', status: 'Active' });
  };

  const handleEditUser = () => {
    setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...formData } : u));
    toast.success('User updated');
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
      toast.error('User deleted');
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    if (window.confirm(`Delete ${selectedUsers.length} users?`)) {
      setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      toast.error(`${selectedUsers.length} users deleted`);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Last Active', 'Location', 'Join Date'];
    const rows = filteredUsers.map(u => [u.name, u.email, u.role, u.status, u.lastActive, u.location, u.joinDate]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
    toast.success('Export started');
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0) setSelectedUsers([]);
    else setSelectedUsers(paginatedUsers.map(u => u.id));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-3 sm:p-4 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">All Users</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Manage system users, roles, and access</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm"><Download size={18}/> Export</button>
          <button onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', role: 'Viewer', status: 'Active' }); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm"><UserPlus size={18}/> Add User</button>
          {selectedUsers.length > 0 && <button onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow text-sm">Delete ({selectedUsers.length})</button>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-sm" />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }} className="w-full sm:w-auto border rounded-xl px-3 py-2 bg-white/70 dark:bg-gray-900/70 text-sm"><option value="all">All Roles</option><option>Admin</option><option>Editor</option><option>Viewer</option></select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="w-full sm:w-auto border rounded-xl px-3 py-2 bg-white/70 dark:bg-gray-900/70 text-sm"><option value="all">All Status</option><option>Active</option><option>Inactive</option></select>
      </div>

      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3"><input type="checkbox" checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0} onChange={toggleSelectAll} className="rounded" /></th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold cursor-pointer hover:text-blue-500" onClick={() => handleSort('name')}>User <ArrowUpDown size={12} className="inline ml-1"/></th>
                  <th className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold cursor-pointer" onClick={() => handleSort('role')}>Role</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                  <th className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold cursor-pointer" onClick={() => handleSort('lastActive')}>Last Active</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-2 sm:px-4 py-2 sm:py-3"><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)} className="rounded" /></td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3"><div className="flex items-center gap-2 sm:gap-3"><img src={user.avatar} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" /><div><p className="font-medium text-xs sm:text-sm">{user.name}</p><p className="text-[10px] text-gray-500">{user.email}</p></div></div></td>
                    <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3"><span className={`px-2 py-1 rounded-full text-[10px] font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : user.role === 'Editor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{user.role}</span></td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3"><span className={`px-2 py-1 rounded-full text-[10px] font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td>
                    <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs">{user.lastActive}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 flex gap-1 sm:gap-2">
                      <button onClick={() => { setViewingUser(user); setIsViewModalOpen(true); }} className="text-gray-500 hover:text-blue-500"><Eye size={16}/></button>
                      <button onClick={() => { setEditingUser(user); setFormData(user); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-400 text-sm">No users found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-2 sm:px-3 py-1 rounded bg-gray-200 disabled:opacity-50"><ChevronLeft size={16}/></button>
            <span className="text-xs sm:text-sm">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-2 sm:px-3 py-1 rounded bg-gray-200 disabled:opacity-50"><ChevronRight size={16}/></button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
            <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg mb-3 dark:bg-gray-700 text-sm" />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-lg mb-3 dark:bg-gray-700 text-sm" />
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm"><option>Admin</option><option>Editor</option><option>Viewer</option></select>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded-lg mb-3 text-sm"><option>Active</option><option>Inactive</option></select>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button onClick={editingUser ? handleEditUser : handleAddUser} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
              <button onClick={() => { setIsModalOpen(false); setEditingUser(null); }} className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-start">
              <h3 className="text-lg sm:text-xl font-bold">User Profile</h3>
              <button onClick={() => setIsViewModalOpen(false)}><X size={20}/></button>
            </div>
            <div className="flex flex-col items-center mt-4">
              <img src={viewingUser.avatar} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-blue-500" alt="profile" />
              <h2 className="text-lg sm:text-xl font-bold mt-3">{viewingUser.name}</h2>
              <p className="text-sm text-gray-500">{viewingUser.email}</p>
              <div className="w-full mt-4 space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row justify-between"><span className="text-gray-500">Role:</span><span className="font-medium">{viewingUser.role}</span></div>
                <div className="flex flex-col sm:flex-row justify-between"><span className="text-gray-500">Status:</span><span className={`font-medium ${viewingUser.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{viewingUser.status}</span></div>
                <div className="flex flex-col sm:flex-row justify-between"><span className="text-gray-500">Location:</span><span>{viewingUser.location}</span></div>
                <div className="flex flex-col sm:flex-row justify-between"><span className="text-gray-500">Join Date:</span><span>{viewingUser.joinDate}</span></div>
                <div className="flex flex-col sm:flex-row justify-between"><span className="text-gray-500">Last Active:</span><span>{viewingUser.lastActive}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;