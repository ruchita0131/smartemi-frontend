import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import { TrendingDown, Wallet, CreditCard, PiggyBank } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    client.get(`/api/users/${user.id}/summary`)
      .then(({ data }) => setSummary(data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-indigo-600 text-lg font-medium animate-pulse">Loading your finances...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Financial Overview</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Monthly Income"
            value={summary?.monthly_income ?? 0}
            icon={<Wallet className="text-green-600" />}
            color="green"
          />
          <SummaryCard
            title="Total EMI"
            value={summary?.total_emi ?? 0}
            icon={<CreditCard className="text-red-500" />}
            color="red"
          />
          <SummaryCard
            title="Total Expenses"
            value={summary?.total_expenses ?? 0}
            icon={<TrendingDown className="text-orange-500" />}
            color="orange"
          />
          <SummaryCard
            title="Disposable"
            value={summary?.disposable_income ?? 0}
            icon={<PiggyBank className="text-indigo-600" />}
            color="indigo"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Loans</h2>
          {summary?.loans?.length === 0 && (
            <p className="text-gray-400 text-sm">No loans added yet.</p>
          )}
          <div className="space-y-3">
            {summary?.loans?.map(loan => (
              <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 capitalize">{loan.loan_type} Loan</p>
                  <p className="text-sm text-gray-500">₹{loan.principal?.toLocaleString()} @ {loan.interest_rate}%</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">₹{loan.emi?.toLocaleString()}/mo</p>
                  <p className="text-xs text-gray-400">{loan.tenure_months} months</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}