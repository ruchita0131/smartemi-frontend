import { useState } from 'react';
import { X } from 'lucide-react';
import client from '../api/client';

export default function AddLoanModal({ userId, onClose, onAdded }) {
  const [form, setForm] = useState({
    loan_type: '', principal: '', interest_rate: '', tenure_months: '', emi: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.loan_type || !form.principal || !form.interest_rate || !form.tenure_months) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await client.post(`/api/users/${userId}/loans`, {
        loan_type: form.loan_type,
        principal: parseFloat(form.principal),
        interest_rate: parseFloat(form.interest_rate),
        tenure_months: parseInt(form.tenure_months),
        emi: parseFloat(form.emi) || 0,
      });
      onAdded();
      onClose();
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to add loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Add New Loan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
            <select
              value={form.loan_type}
              onChange={e => setForm({ ...form, loan_type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select type...</option>
              {['Home', 'Car', 'Personal', 'Education', 'Business', 'Other'].map(t => (
                <option key={t} value={t.toLowerCase()}>{t}</option>
              ))}
            </select>
          </div>

          {[
            { label: 'Principal Amount (₹)', key: 'principal', placeholder: '500000' },
            { label: 'Interest Rate (%)', key: 'interest_rate', placeholder: '10.5' },
            { label: 'Tenure (months)', key: 'tenure_months', placeholder: '48' },
            { label: 'Monthly EMI (₹)', key: 'emi', placeholder: '12000' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60"
          >
            {loading ? 'Adding...' : 'Add Loan'}
          </button>
        </div>
      </div>
    </div>
  );
}