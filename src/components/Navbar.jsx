import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Brain, Zap } from 'lucide-react';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItem = (path, label, Icon) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition ${
        location.pathname === path
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-500 hover:text-indigo-600'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-700">SmartEMI Planner</h1>
        <div className="flex items-center gap-2">
          {navItem('/dashboard', 'Dashboard', LayoutDashboard)}
          {navItem('/analysis', 'AI Analysis', Brain)}
          {navItem('/scenarios', 'Simulator', Zap)}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition ml-2"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}