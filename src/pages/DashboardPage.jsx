import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import AddLoanModal from '../components/AddLoanModal';
import AddExpenseModal from '../components/AddExpenseModal';
import { TrendingDown, Wallet, CreditCard, PiggyBank, Plus, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [income, setIncome] = useState('');
  const [savingIncome, setSavingIncome] = useState(false);

  const fetchSummary = () => {
    if (!user) return;
    setLoading(true);
    client.get(`/api/users/${user.id}/summary`)
      .then(({ data }) => { setSummary(data); setIncome(data.monthly_income || ''); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSummary(); }, [user]);

  const saveIncome = async () => {
    setSavingIncome(true);
    await client.post(`/api/users/${user.id}/income`, { amount: parseFloat(income) });
    fetchSummary();
    setSavingIncome(false);
  };

  const deleteLoan = async (id) => { await client.delete(`/api/users/${user.id}/loans/${id}`); fetchSummary(); };
  const deleteExpense = async (id) => { await client.delete(`/api/users/${user.id}/expenses/${id}`); fetchSummary(); };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="text-indigo-600 text-lg font-medium animate-pulse">Loading your finances...</div>
    </div>
  );

  const dti = summary?.monthly_income > 0
    ? ((summary.total_emi / summary.monthly_income) * 100).toFixed(1) : 0;

  const healthColor = dti < 30 ? 'text-emerald-600' : dti < 50 ? 'text-amber-500' : 'text-red-600';
  const healthBg = dti < 30
    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
    : dti < 50
    ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
  const healthLabel = dti < 30 ? 'Healthy' : dti < 50 ? 'Moderate' : 'High Risk';

  const card = "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6";
  const input = "w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Health Banner */}
        <div className={`border rounded-2xl p-5 mb-6 flex items-center justify-between ${healthBg}`}>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Debt-to-Income Ratio</p>
            <p className={`text-3xl font-bold ${healthColor}`}>{dti}% — {healthLabel}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-right hidden md:block">
            {dti < 30 ? 'Great shape! Consider prepaying high-interest loans.' :
             dti < 50 ? 'Manageable. Avoid taking on new debt.' :
             'Over 50% of income goes to EMIs. Urgent action needed.'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard title="Monthly Income" value={summary?.monthly_income ?? 0} icon={<Wallet className="text-emerald-600" size={20} />} color="green" />
          <SummaryCard title="Total EMI" value={summary?.total_emi ?? 0} icon={<CreditCard className="text-red-500" size={20} />} color="red" />
          <SummaryCard title="Total Expenses" value={summary?.total_expenses ?? 0} icon={<TrendingDown className="text-orange-500" size={20} />} color="orange" />
          <SummaryCard title="Disposable" value={summary?.disposable_income ?? 0} icon={<PiggyBank className="text-indigo-600" size={20} />} color="indigo" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Income */}
          <div className={card}>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Income</h2>
            <div className="flex gap-3">
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="Enter monthly income" className={input} />
              <button onClick={saveIncome} disabled={savingIncome}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60 whitespace-nowrap">
                {savingIncome ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Expenses */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Expenses</h2>
              <button onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium">
                <Plus size={16} /> Add
              </button>
            </div>
            {summary?.expenses?.length === 0 && <p className="text-gray-400 text-sm">No expenses added yet.</p>}
            <div className="space-y-2">
              {summary?.expenses?.map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{exp.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">₹{exp.amount?.toLocaleString()}</span>
                    <button onClick={() => deleteExpense(exp.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loans */}
        <div className={`${card} mt-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Loans & EMI</h2>
            <button onClick={() => setShowLoanModal(true)}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium">
              <Plus size={16} /> Add Loan
            </button>
          </div>
          {summary?.loans?.length === 0 && <p className="text-gray-400 text-sm">No loans added yet.</p>}
          <div className="space-y-3">
            {summary?.loans?.map(loan => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{loan.loan_type} Loan</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">₹{loan.principal?.toLocaleString()} @ {loan.interest_rate}% for {loan.tenure_months} months</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-red-600 dark:text-red-400">₹{loan.emi?.toLocaleString()}/mo</p>
                  <button onClick={() => deleteLoan(loan.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLoanModal && <AddLoanModal userId={user.id} onClose={() => setShowLoanModal(false)} onAdded={fetchSummary} />}
      {showExpenseModal && <AddExpenseModal userId={user.id} onClose={() => setShowExpenseModal(false)} onAdded={fetchSummary} />}
    </div>
  );
}