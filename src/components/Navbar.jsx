import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import client from '../api/client';
import {
  LogOut, LayoutDashboard, Brain, Zap,
  Sun, Moon, User, ChevronDown, Mail, Hash
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      client.get(`/api/users/${user.id}/profile`)
        .then(({ data }) => setProfile(data))
        .catch(() => {});
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItem = (path, label, Icon) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
        location.pathname === path
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
          : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  // Avatar initials
  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 border-b border-gray-200 dark:border-slate-700 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">SmartEMI</h1>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navItem('/dashboard', 'Dashboard', LayoutDashboard)}
          {navItem('/analysis', 'AI Analysis', Brain)}
          {navItem('/scenarios', 'Simulator', Zap)}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-24 truncate">
                {profile?.name?.split(' ')[0] || 'User'}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">

                {/* Profile header */}
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 dark:text-gray-100 truncate">
                        {profile?.name || 'Loading...'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        SmartEMI Member
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <Mail size={14} className="text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {profile?.email || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <Hash size={14} className="text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      User ID: {profile?.id || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <User size={14} className="text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Free Account
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-slate-700 mx-3" />

                {/* Logout */}
                <div className="p-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-1 mt-2 pt-2 border-t border-gray-100 dark:border-slate-800">
        {navItem('/dashboard', 'Dashboard', LayoutDashboard)}
        {navItem('/analysis', 'AI Analysis', Brain)}
        {navItem('/scenarios', 'Simulator', Zap)}
      </div>
    </nav>
  );
}