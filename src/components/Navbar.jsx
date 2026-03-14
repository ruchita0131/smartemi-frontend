import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Brain, Zap, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

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

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3 sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">SmartEMI</h1>
        </div>

        <div className="flex items-center gap-1">
          {navItem('/dashboard', 'Dashboard', LayoutDashboard)}
          {navItem('/analysis', 'AI Analysis', Brain)}
          {navItem('/scenarios', 'Simulator', Zap)}

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="ml-2 p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-all ml-1"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}