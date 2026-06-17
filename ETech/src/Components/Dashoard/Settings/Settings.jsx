import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  User, Mail, Lock, Bell, Moon, Sun, Globe, Clock,
  Shield, Smartphone, Palette, Save, Edit2, Camera,
  CheckCircle, XCircle, AlertCircle, ChevronRight,
  LogOut, Key, Fingerprint, Server, Database, Eye,
  EyeOff, RefreshCw
} from 'lucide-react';
// ✅ Import your profile image
import Profile from '../../../Image/Profile.jpg';

// ---------- TABS ----------
const tabs = [
  { id: 'profile', label: 'Profile', icon: <User size={18} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  { id: 'preferences', label: 'Preferences', icon: <Globe size={18} /> },
];

// ---------- SUBCOMPONENTS ----------

// Profile Tab – With Your Image
const ProfileTab = ({ user, onUpdate }) => {
  const [form, setForm] = useState(user);
  const [editing, setEditing] = useState(false);

  // Get initials for fallback
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
    toast.success('Profile updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          {/* Profile Image – same as sidebar */}
          <img
            src={Profile}
            alt="Profile"
            className="w-20 h-20 rounded-full ring-4 ring-purple-500/30 object-cover"
            onError={(e) => {
              // Fallback: if image fails, show gradient initials
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              const fallback = document.createElement('div');
              fallback.className = 'w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-purple-500/30';
              fallback.textContent = getInitials(form.name);
              parent.appendChild(fallback);
            }}
          />
          <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{form.name}</h3>
          <p className="text-gray-500 dark:text-gray-400">{form.email}</p>
          <p className="text-sm text-gray-400">Member since {form.joined}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            disabled={!editing}
            className={`w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none ${!editing ? 'opacity-60' : ''}`}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            disabled={!editing}
            className={`w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none ${!editing ? 'opacity-60' : ''}`}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            rows={3}
            value={form.bio || ''}
            onChange={e => setForm({...form, bio: e.target.value})}
            disabled={!editing}
            className={`w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none ${!editing ? 'opacity-60' : ''}`}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      <div className="flex gap-3">
        {!editing ? (
          <button onClick={() => setEditing(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <Save size={16} /> Save
            </button>
            <button onClick={() => setEditing(false)} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

// Appearance Tab – unchanged
const AppearanceTab = ({ settings, onUpdate }) => {
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [fontSize, setFontSize] = useState(settings.fontSize || 'medium');

  const handleChange = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    onUpdate({ darkMode: newDark, fontSize });
    toast.success('Appearance updated');
  };

  const handleFontChange = (size) => {
    setFontSize(size);
    onUpdate({ darkMode, fontSize: size });
    toast.success(`Font size set to ${size}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {darkMode ? <Moon size={20} className="text-purple-500" /> : <Sun size={20} className="text-yellow-500" />}
          <div>
            <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
            <p className="text-xs text-gray-500">Switch between light and dark themes</p>
          </div>
        </div>
        <button
          onClick={handleChange}
          className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-800 dark:text-white mb-3">Font Size</p>
        <div className="flex gap-2">
          {['small', 'medium', 'large'].map(size => (
            <button
              key={size}
              onClick={() => handleFontChange(size)}
              className={`px-4 py-2 rounded-lg transition capitalize ${fontSize === size ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-800 dark:text-white mb-3">Accent Color</p>
        <div className="flex gap-3">
          {['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'].map(color => (
            <button
              key={color}
              onClick={() => {
                onUpdate({ darkMode, fontSize, accentColor: color });
                toast.success('Accent color changed');
              }}
              className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-gray-400 transition"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Notifications Tab – unchanged
const NotificationsTab = ({ settings, onUpdate }) => {
  const [notifs, setNotifs] = useState(settings.notifications || {
    email: true,
    push: true,
    sms: false,
    marketing: false,
    security: true,
  });

  const toggle = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    onUpdate({ notifications: updated });
    toast.success(`${key} notifications updated`);
  };

  return (
    <div className="space-y-4">
      {Object.entries(notifs).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div>
            <p className="font-medium text-gray-800 dark:text-white capitalize">{key}</p>
            <p className="text-xs text-gray-500">Receive {key} notifications</p>
          </div>
          <button
            onClick={() => toggle(key)}
            className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Security Tab – unchanged
const SecurityTab = ({ settings, onUpdate }) => {
  const [twoFactor, setTwoFactor] = useState(settings.twoFactor || false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const handleTwoFactor = () => {
    const newVal = !twoFactor;
    setTwoFactor(newVal);
    onUpdate({ twoFactor: newVal });
    toast.success(`Two-factor ${newVal ? 'enabled' : 'disabled'}`);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Fingerprint size={20} className="text-purple-500" />
          <div>
            <p className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</p>
            <p className="text-xs text-gray-500">Add an extra layer of security</p>
          </div>
        </div>
        <button
          onClick={handleTwoFactor}
          className={`relative w-12 h-6 rounded-full transition-colors ${twoFactor ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2"><Lock size={16} /> Change Password</p>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 pr-10"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">New Password</label>
            <input
              type="password"
              value={passwordForm.new}
              onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70"
              required
            />
          </div>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Update Password</button>
        </form>
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-white">Sessions</p>
            <p className="text-xs text-gray-500">Manage active sessions</p>
          </div>
          <button className="text-red-500 text-sm hover:underline">Log out all devices</button>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex justify-between py-1"><span>Chrome • Windows</span><span className="text-green-500">Active now</span></div>
          <div className="flex justify-between py-1"><span>Firefox • Mac</span><span className="text-gray-400">Last used 2 hours ago</span></div>
        </div>
      </div>
    </div>
  );
};

// Preferences Tab – unchanged
const PreferencesTab = ({ settings, onUpdate }) => {
  const [prefs, setPrefs] = useState(settings.preferences || {
    language: 'English',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
  });

  const handleChange = (key, value) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    onUpdate({ preferences: updated });
    toast.success(`${key} updated`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
        <select
          value={prefs.language}
          onChange={e => handleChange('language', e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option>English</option><option>Spanish</option><option>French</option><option>German</option><option>Chinese</option>
        </select>
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
        <select
          value={prefs.timezone}
          onChange={e => handleChange('timezone', e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option>UTC-5</option><option>UTC-4</option><option>UTC+0</option><option>UTC+1</option><option>UTC+5:30</option>
        </select>
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
        <select
          value={prefs.dateFormat}
          onChange={e => handleChange('dateFormat', e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );
};

// ---------- MAIN COMPONENT ----------
const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Admin Profile Data (same as sidebar)
  const [settings, setSettings] = useState({
    name: 'Muntazir Mehdi',
    email: 'muntazir@etech.com',
    joined: 'January 2024',
    bio: 'Administrator & Lead Developer at ETech.',
    darkMode: false,
    fontSize: 'medium',
    accentColor: '#4F46E5',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      security: true,
    },
    twoFactor: false,
    preferences: {
      language: 'English',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
    },
  });

  const updateSettings = (updates) => {
    setSettings({ ...settings, ...updates });
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return <ProfileTab user={settings} onUpdate={updateSettings} />;
      case 'appearance':
        return <AppearanceTab settings={settings} onUpdate={updateSettings} />;
      case 'notifications':
        return <NotificationsTab settings={settings} onUpdate={updateSettings} />;
      case 'security':
        return <SecurityTab settings={settings} onUpdate={updateSettings} />;
      case 'preferences':
        return <PreferencesTab settings={settings} onUpdate={updateSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">⚙️ Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account preferences</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { toast.success('Settings saved'); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow transition flex items-center gap-2">
            <Save size={18} /> Save All
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="md:w-56 p-4 border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-gray-700/50">
            <div className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;