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
      .then(({ data }) => {
        setSummary(data);
        setIncome(data.monthly_income || '');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSummary(); }, [user]);

  const saveIncome = async () => {
    setSavingIncome(true);
    await client.post(`/api/users/${user.id}/income`, { amount: parseFloat(income) });
    fetchSummary();
    setSavingIncome(false);
  };

  const deleteLoan = async (loanId) => {
    await client.delete(`/api/users/${user.id}/loans/${loanId}`);
    fetchSummary();
  };

  const deleteExpense = async (expenseId) => {
    await client.delete(`/api/users/${user.id}/expenses/${expenseId}`);
    fetchSummary();
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-indigo-600 text-lg font-medium animate-pulse">Loading your finances...</div>
    </div>
  );

  const dti = summary?.monthly_income > 0
    ? ((summary.total_emi / summary.monthly_income) * 100).toFixed(1)
    : 0;

  const healthColor = dti < 30 ? 'text-green-600' : dti < 50 ? 'text-orange-500' : 'text-red-600';
  const healthBg = dti < 30 ? 'bg-green-50 border-green-200' : dti < 50 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200';
  const healthLabel = dti < 30 ? 'Healthy' : dti < 50 ? 'Moderate' : 'High Risk';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Health Banner */}
        <div className={`border rounded-xl p-4 mb-6 flex items-center justify-between ${healthBg}`}>
          <div>
            <p className="text-sm font-medium text-gray-600">Debt-to-Income Ratio</p>
            <p className={`text-2xl font-bold ${healthColor}`}>{dti}% — {healthLabel}</p>
          </div>
          <p className="text-sm text-gray-500 max-w-xs text-right">
            {dti < 30 ? 'Great shape! Consider prepaying high-interest loans.' :
             dti < 50 ? 'Manageable. Avoid taking on new debt.' :
             'Over 50% of income goes to EMIs. Urgent action needed.'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard title="Monthly Income" value={summary?.monthly_income ?? 0} icon={<Wallet className="text-green-600" />} color="green" />
          <SummaryCard title="Total EMI" value={summary?.total_emi ?? 0} icon={<CreditCard className="text-red-500" />} color="red" />
          <SummaryCard title="Total Expenses" value={summary?.total_expenses ?? 0} icon={<TrendingDown className="text-orange-500" />} color="orange" />
          <SummaryCard title="Disposable" value={summary?.disposable_income ?? 0} icon={<PiggyBank className="text-indigo-600" />} color="indigo" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Income */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Income</h2>
            <div className="flex gap-3">
              <input
                type="number"
                value={income}
                onChange={e => setIncome(e.target.value)}
                placeholder="Enter monthly income"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={saveIncome}
                disabled={savingIncome}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
              >
                {savingIncome ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Expenses</h2>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            {summary?.expenses?.length === 0 && (
              <p className="text-gray-400 text-sm">No expenses added yet.</p>
            )}
            <div className="space-y-2">
              {summary?.expenses?.map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 capitalize">{exp.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-orange-600">₹{exp.amount?.toLocaleString()}</span>
                    <button onClick={() => deleteExpense(exp.id)} className="text-gray-300 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loans */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Loans & EMI</h2>
            <button
              onClick={() => setShowLoanModal(true)}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <Plus size={16} /> Add Loan
            </button>
          </div>
          {summary?.loans?.length === 0 && (
            <p className="text-gray-400 text-sm">No loans added yet.</p>
          )}
          <div className="space-y-3">
            {summary?.loans?.map(loan => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 capitalize">{loan.loan_type} Loan</p>
                  <p className="text-sm text-gray-500">₹{loan.principal?.toLocaleString()} @ {loan.interest_rate}% for {loan.tenure_months} months</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-red-600">₹{loan.emi?.toLocaleString()}/mo</p>
                  </div>
                  <button onClick={() => deleteLoan(loan.id)} className="text-gray-300 hover:text-red-500 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLoanModal && (
        <AddLoanModal
          userId={user.id}
          onClose={() => setShowLoanModal(false)}
          onAdded={fetchSummary}
        />
      )}
      {showExpenseModal && (
        <AddExpenseModal
          userId={user.id}
          onClose={() => setShowExpenseModal(false)}
          onAdded={fetchSummary}
        />
      )}
    </div>
  );
}