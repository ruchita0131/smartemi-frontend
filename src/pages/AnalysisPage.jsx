import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Navbar from '../components/Navbar';
import { Brain, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const AGENTS = [
  { key: 'profile',  label: 'Data Agent',     desc: 'Validating financial profile...'   },
  { key: 'analysis', label: 'Analysis Agent',  desc: 'Calculating health score & DTI...' },
  { key: 'strategy', label: 'Optimizer Agent', desc: 'Comparing Avalanche vs Snowball...' },
  { key: 'forecast', label: 'Forecast Agent',  desc: 'Projecting loan closure dates...'  },
  { key: 'advice',   label: 'Advisor Agent',   desc: 'Claude generating your report...'  },
];

export default function AnalysisPage() {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    setRunning(true);
    setResult(null);
    setError('');

    // Animate through steps while waiting
    for (let i = 0; i < AGENTS.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const { data } = await client.get(`/api/users/${user.id}/analyze`);
      setResult(data);
      setActiveStep(5);
    } catch (e) {
      setError(e.response?.data?.detail || 'Analysis failed. Make sure you have income and at least one loan added.');
      setActiveStep(-1);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Brain className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AI Financial Analysis</h1>
          <p className="text-gray-500 mt-1">5 specialized agents analyze your complete financial picture</p>
        </div>

        {/* Agent Pipeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Agent Pipeline</h2>
          <div className="space-y-3">
            {AGENTS.map((agent, i) => {
              const isDone = activeStep > i || activeStep === 5;
              const isActive = activeStep === i && running;
              return (
                <div key={agent.key} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-50 border border-indigo-200' :
                  isDone   ? 'bg-green-50 border border-green-200' :
                             'bg-gray-50 border border-gray-100'
                }`}>
                  <div className="flex-shrink-0">
                    {isDone ? <CheckCircle className="text-green-500" size={20} /> :
                     isActive ? <Loader className="text-indigo-500 animate-spin" size={20} /> :
                     <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? 'text-indigo-700' : isDone ? 'text-green-700' : 'text-gray-500'}`}>
                      {agent.label}
                    </p>
                    <p className="text-xs text-gray-400">{agent.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={runAnalysis}
            disabled={running}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {running ? <><Loader size={18} className="animate-spin" /> Running Analysis...</> : <><Brain size={18} /> Run AI Analysis</>}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Health Score */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Financial Health</h2>
              <div className="flex items-center gap-6">
                <div className={`text-5xl font-bold ${
                  result.analysis.health_score >= 75 ? 'text-green-600' :
                  result.analysis.health_score >= 50 ? 'text-orange-500' : 'text-red-600'
                }`}>
                  {result.analysis.health_score}
                  <span className="text-xl text-gray-400">/100</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-lg">{result.analysis.health_label}</p>
                  <p className="text-sm text-gray-500">DTI Ratio: {result.analysis.dti_ratio}%</p>
                </div>
              </div>
            </div>

            {/* Strategy */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recommended Strategy</h2>
              <div className="grid grid-cols-2 gap-4">
                {['avalanche', 'snowball'].map(method => (
                  <div key={method} className={`p-4 rounded-xl border-2 ${
                    result.strategy.recommended_method === method
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800 capitalize">{method}</p>
                      {result.strategy.recommended_method === method && (
                        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {method === 'avalanche' ? 'Highest interest first' : 'Smallest balance first'}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      ₹{result.strategy[method]?.total_interest?.toLocaleString()} total interest
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.strategy[method]?.months_to_payoff} months to debt-free
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Forecasts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Loan Projections</h2>
              <div className="space-y-3">
                {result.forecast.projections.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{p.loan_type} Loan</p>
                      <p className="text-sm text-gray-500">Closes {p.closure_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">₹{p.total_interest_remaining?.toLocaleString()} interest left</p>
                      <p className="text-xs text-gray-400">{p.months_remaining} months</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Claude's Advice */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-indigo-600" size={20} />
                <h2 className="text-lg font-bold text-indigo-800">AI Advisor Report</h2>
              </div>
              <div className="prose prose-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {result.advice}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}