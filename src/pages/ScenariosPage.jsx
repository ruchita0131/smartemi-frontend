import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Navbar from '../components/Navbar';
import { TrendingDown, Calendar, PiggyBank, Zap } from 'lucide-react';

export default function ScenariosPage() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [extraPayment, setExtraPayment] = useState(1000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    client.get(`/api/users/${user.id}/summary`).then(({ data }) => {
      setLoans(data.loans || []);
      if (data.loans?.length > 0) setSelectedLoan(data.loans[0]);
    });
  }, [user]);

  const runSimulation = async () => {
    if (!selectedLoan) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await client.post(`/api/users/${user.id}/simulate`, {
        loan_id: selectedLoan.id,
        extra_monthly_payment: extraPayment,
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when loan or payment changes
  useEffect(() => {
    if (selectedLoan && extraPayment >= 0) runSimulation();
  }, [selectedLoan, extraPayment]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Zap className="text-orange-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Scenario Simulator</h1>
          <p className="text-gray-500 mt-1">See how extra payments accelerate your debt freedom</p>
        </div>

        {loans.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
            No loans found. Add a loan from the dashboard first.
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

              {/* Loan selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Loan to Simulate
                </label>
                <div className="grid gap-2">
                  {loans.map(loan => (
                    <button
                      key={loan.id}
                      onClick={() => setSelectedLoan(loan)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition ${
                        selectedLoan?.id === loan.id
                          ? 'border-indigo-400 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{loan.loan_type} Loan</p>
                        <p className="text-sm text-gray-500">
                          ₹{loan.principal?.toLocaleString()} @ {loan.interest_rate}%
                        </p>
                      </div>
                      <p className="font-bold text-red-600">₹{loan.emi?.toLocaleString()}/mo</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra payment slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Extra Monthly Payment
                  </label>
                  <span className="text-xl font-bold text-indigo-600">
                    ₹{extraPayment.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedLoan ? selectedLoan.emi * 2 : 10000}
                  step="500"
                  value={extraPayment}
                  onChange={e => setExtraPayment(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹0</span>
                  <span>₹{selectedLoan ? (selectedLoan.emi * 2).toLocaleString() : '10,000'}</span>
                </div>
              </div>
            </div>

            {/* Results */}
            {loading && (
              <div className="text-center text-indigo-600 animate-pulse py-8">
                Calculating...
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">

                {/* Summary banner */}
                {result.months_saved > 0 ? (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
                    <p className="text-lg font-medium opacity-90">
                      By paying ₹{extraPayment.toLocaleString()} extra per month
                    </p>
                    <p className="text-4xl font-bold my-2">
                      Save {result.months_saved} months
                    </p>
                    <p className="text-lg opacity-90">
                      and ₹{result.interest_saved.toLocaleString()} in interest
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-2xl p-6 text-center text-gray-500">
                    Add an extra payment above to see savings
                  </div>
                )}

                {/* Before vs After */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Without Extra Payment
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Closes</p>
                          <p className="font-semibold text-gray-800">{result.original_closure}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Total Interest</p>
                          <p className="font-semibold text-red-600">
                            ₹{result.original_interest.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PiggyBank size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-800">{result.original_months} months</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-green-300 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-3">
                      With Extra Payment ✓
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Closes</p>
                          <p className="font-semibold text-green-700">{result.new_closure}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown size={16} className="text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Total Interest</p>
                          <p className="font-semibold text-green-700">
                            ₹{result.new_interest.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PiggyBank size={16} className="text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-semibold text-green-700">{result.new_months} months</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insight */}
                {result.months_saved > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                    <p className="text-sm text-indigo-800">
                      <span className="font-bold">💡 Insight: </span>
                      Paying ₹{extraPayment.toLocaleString()} extra monthly on your{' '}
                      {result.loan_type} loan saves you ₹{result.interest_saved.toLocaleString()} in interest
                      and closes the loan {result.months_saved} months earlier —
                      that's <span className="font-bold">{(result.months_saved / 12).toFixed(1)} years sooner</span>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}