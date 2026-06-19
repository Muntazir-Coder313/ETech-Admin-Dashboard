import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Shield, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const initialRoles = [
  { id: 1, name: 'Admin', permissions: ['read_users', 'write_users', 'delete_users', 'manage_roles', 'view_activity'], description: 'Full system access' },
  { id: 2, name: 'Editor', permissions: ['read_users', 'write_users', 'view_activity'], description: 'Can manage users and view activity' },
  { id: 3, name: 'Viewer', permissions: ['read_users'], description: 'Read‑only access to users' },
];

const allPermissions = [
  { key: 'read_users', label: 'Read Users', description: 'View user list and details', icon: '👁️' },
  { key: 'write_users', label: 'Write Users', description: 'Create, edit users', icon: '✏️' },
  { key: 'delete_users', label: 'Delete Users', description: 'Remove users from system', icon: '🗑️' },
  { key: 'manage_roles', label: 'Manage Roles', description: 'Create/delete roles, change permissions', icon: '🔐' },
  { key: 'view_activity', label: 'View Activity', description: 'Access audit logs', icon: '📋' },
];

const RolesPermissions = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const togglePermission = (roleId, permKey) => {
    setRoles(roles.map(role => {
      if (role.id !== roleId) return role;
      const has = role.permissions.includes(permKey);
      const updatedPerms = has ? role.permissions.filter(p => p !== permKey) : [...role.permissions, permKey];
      toast.success(`${has ? 'Removed' : 'Added'} "${permKey.replace('_', ' ')}" for ${role.name}`);
      return { ...role, permissions: updatedPerms };
    }));
  };

  const updateRoleName = (roleId, newName, newDesc) => {
    setRoles(roles.map(role => role.id === roleId ? { ...role, name: newName, description: newDesc } : role));
    setEditingRoleId(null);
    toast.success('Role updated');
  };

  const addRole = () => {
    if (!newRoleName.trim()) return;
    const newRole = { id: Date.now(), name: newRoleName, permissions: [], description: newRoleDesc || 'No description' };
    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setShowAddForm(false);
    toast.success('Role added');
  };

  const deleteRole = (roleId) => {
    if (window.confirm('Delete this role?')) {
      setRoles(roles.filter(r => r.id !== roleId));
      toast.error('Role deleted');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Roles & Permissions</h1>
          <p className="text-sm md:text-base text-gray-500">Define access control for your team</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow flex items-center gap-2 text-sm w-full sm:w-auto"><Plus size={18}/> Add Role</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
              <div className="flex-1">
                {editingRoleId === role.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input type="text" defaultValue={role.name} onBlur={(e) => updateRoleName(role.id, e.target.value, role.description)} autoFocus className="px-2 py-1 border rounded w-full sm:w-auto" />
                    <input type="text" defaultValue={role.description} onBlur={(e) => updateRoleName(role.id, role.name, e.target.value)} placeholder="Description" className="px-2 py-1 border rounded w-full sm:w-auto flex-1" />
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <h2 className="text-lg sm:text-xl font-bold">{role.name}</h2>
                      <button onClick={() => setEditingRoleId(role.id)} className="text-blue-500"><Edit size={14}/></button>
                      <button onClick={() => deleteRole(role.id)} className="text-red-500"><Trash2 size={14}/></button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mt-4">
              {allPermissions.map(perm => {
                const isEnabled = role.permissions.includes(perm.key);
                return (
                  <div key={perm.key} className={`flex items-center justify-between p-2 sm:p-3 rounded-xl transition cursor-pointer ${isEnabled ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200'}`} onClick={() => togglePermission(role.id, perm.key)}>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-base sm:text-lg">{perm.icon}</span>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">{perm.label}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 hidden md:block">{perm.description}</p>
                      </div>
                    </div>
                    {isEnabled ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Create New Role</h3>
            <input type="text" placeholder="Role name" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} className="w-full p-2 border rounded-lg mb-3 text-sm" />
            <input type="text" placeholder="Description (optional)" value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} className="w-full p-2 border rounded-lg mb-4 text-sm" />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button onClick={addRole} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Create</button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;