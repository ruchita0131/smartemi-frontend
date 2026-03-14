import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Navbar from '../components/Navbar';
import AgentGraph from '../components/AgentGraph';
import { Brain, AlertCircle, Loader, Sparkles } from 'lucide-react';

export default function AnalysisPage() {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    setRunning(true);
    setResult(null);
    setDone(false);
    setError('');
    setActiveStep(0);

    // Animate through agents
    for (let i = 0; i < 5; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      const { data } = await client.get(`/api/users/${user.id}/analyze`);
      setResult(data);
      setDone(true);
      setActiveStep(5);
    } catch (e) {
      setError(e.response?.data?.detail || 'Analysis failed. Make sure you have income and at least one loan added.');
      setActiveStep(-1);
      setDone(false);
    } finally {
      setRunning(false);
    }
  };

  const card = "bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-full mb-4">
            <Brain className="text-indigo-600 dark:text-indigo-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Financial Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Powered by LangGraph — 5 specialized agents analyze your complete financial picture
          </p>
        </div>

        {/* Two column layout when results available */}
        <div className={`grid gap-6 ${result ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-xl mx-auto'}`}>

          {/* LEFT: Graph */}
          <div className={card}>
            <AgentGraph activeStep={activeStep} running={running} done={done} />

            {error && (
              <div className="mt-4 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={runAnalysis}
              disabled={running}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {running
                ? <><Loader size={18} className="animate-spin" /> Running Pipeline...</>
                : <><Sparkles size={18} /> Run LangGraph Analysis</>
              }
            </button>
          </div>

          {/* RIGHT: Results */}
          {result && (
            <div className="space-y-4">

              {/* Health Score */}
              <div className={card}>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Financial Health</h2>
                <div className="flex items-center gap-6">
                  <div className={`text-5xl font-bold ${
                    result.analysis.health_score >= 75 ? 'text-emerald-600' :
                    result.analysis.health_score >= 50 ? 'text-amber-500' : 'text-red-600'
                  }`}>
                    {result.analysis.health_score}
                    <span className="text-xl text-gray-400">/100</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
                      {result.analysis.health_label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      DTI: {result.analysis.dti_ratio}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Surplus: ₹{result.analysis.monthly_surplus?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategy */}
              <div className={card}>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Repayment Strategy
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {['avalanche', 'snowball'].map(method => (
                    <div key={method} className={`p-4 rounded-xl border-2 ${
                      result.strategy.recommended_method === method
                        ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize text-sm">
                          {method}
                        </p>
                        {result.strategy.recommended_method === method && (
                          <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                            Best
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {method === 'avalanche' ? 'Highest rate first' : 'Lowest balance first'}
                      </p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        ₹{result.strategy[method]?.total_interest?.toLocaleString()} interest
                      </p>
                      <p className="text-xs text-gray-400">
                        {result.strategy[method]?.months_to_payoff} months
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forecasts */}
              <div className={card}>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Loan Projections
                </h2>
                <div className="space-y-3">
                  {result.forecast.projections.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 capitalize text-sm">
                          {p.loan_type} Loan
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Closes {p.closure_date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                          ₹{p.total_interest_remaining?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">{p.months_remaining} months left</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Advice */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-indigo-600 dark:text-indigo-400" size={18} />
                  <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-300">
                    Gemini AI Report
                  </h2>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {result.advice}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}