import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import client from '../api/client';
import { Moon, Sun, Brain } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await client.post('/auth/signup', form);
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.detail || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  const fields = [
    { label: 'Full Name',  key: 'name',     type: 'text',     placeholder: 'Ruchita Sharma'        },
    { label: 'Email',      key: 'email',    type: 'email',    placeholder: 'you@example.com'        },
    { label: 'Password',   key: 'password', type: 'password', placeholder: '••••••••'               },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">

      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition-all"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100 dark:border-slate-800">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">SmartEMI</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create your free account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {fields.map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className={inputClass}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
              />
            </div>
          ))}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-400 dark:text-gray-600">
          <span>🔒 Secure</span>
          <span>🤖 AI-powered</span>
          <span>📊 Free</span>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}