import { CheckCircle, Loader, Circle } from 'lucide-react';

const NODES = [
  { id: 'data_agent',      label: 'Data Agent',      desc: 'Validates input',         color: 'blue'   },
  { id: 'analysis_agent',  label: 'Analysis Agent',  desc: 'Health score & DTI',      color: 'indigo' },
  { id: 'optimizer_agent', label: 'Optimizer Agent', desc: 'Avalanche vs Snowball',   color: 'violet' },
  { id: 'forecast_agent',  label: 'Forecast Agent',  desc: 'Loan closure dates',      color: 'purple' },
  { id: 'advisor_agent',   label: 'Advisor Agent',   desc: 'Gemini AI reasoning',     color: 'pink'   },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-300 dark:border-blue-700',     text: 'text-blue-700 dark:text-blue-300',     icon: 'text-blue-500',   dot: 'bg-blue-400'   },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-300 dark:border-indigo-700', text: 'text-indigo-700 dark:text-indigo-300', icon: 'text-indigo-500', dot: 'bg-indigo-400' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-700', text: 'text-violet-700 dark:text-violet-300', icon: 'text-violet-500', dot: 'bg-violet-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', icon: 'text-purple-500', dot: 'bg-purple-400' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20',     border: 'border-pink-300 dark:border-pink-700',     text: 'text-pink-700 dark:text-pink-300',     icon: 'text-pink-500',   dot: 'bg-pink-400'   },
};

export default function AgentGraph({ activeStep, running, done }) {
  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
        LangGraph Pipeline
      </p>

      {/* Graph nodes + edges */}
      <div className="flex flex-col items-center gap-0">
        {NODES.map((node, i) => {
          const isDone    = done || activeStep > i;
          const isActive  = running && activeStep === i;
          const isPending = !isDone && !isActive;
          const colors    = colorMap[node.color];

          return (
            <div key={node.id} className="flex flex-col items-center w-full">

              {/* Node card */}
              <div className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-500 ${
                isDone   ? `${colors.bg} ${colors.border} shadow-sm` :
                isActive ? `${colors.bg} ${colors.border} shadow-lg scale-[1.02]` :
                           'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700'
              }`}>

                {/* Status icon */}
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle size={22} className={colors.icon} />
                  ) : isActive ? (
                    <Loader size={22} className={`${colors.icon} animate-spin`} />
                  ) : (
                    <Circle size={22} className="text-gray-300 dark:text-slate-600" />
                  )}
                </div>

                {/* Node info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${
                    isDone || isActive ? colors.text : 'text-gray-400 dark:text-slate-500'
                  }`}>
                    {node.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 truncate">
                    {node.desc}
                  </p>
                </div>

                {/* Active pulse dot */}
                {isActive && (
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${colors.dot} animate-ping`} />
                    <span className={`text-xs font-medium ${colors.text}`}>Running</span>
                  </div>
                )}

                {/* Done badge */}
                {isDone && (
                  <div className="flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                      Done
                    </span>
                  </div>
                )}
              </div>

              {/* Edge connector */}
              {i < NODES.length - 1 && (
                <div className="flex flex-col items-center my-1">
                  <div className={`w-0.5 h-4 transition-all duration-500 ${
                    isDone ? colors.dot : 'bg-gray-200 dark:bg-slate-700'
                  }`} />
                  <div className={`w-2 h-2 rotate-45 border-r-2 border-b-2 transition-all duration-500 ${
                    isDone ? colors.border : 'border-gray-200 dark:border-slate-700'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final END node */}
      <div className="flex flex-col items-center mt-1">
        <div className="flex flex-col items-center my-1">
          <div className={`w-0.5 h-4 transition-all duration-500 ${done ? 'bg-green-400' : 'bg-gray-200 dark:bg-slate-700'}`} />
          <div className={`w-2 h-2 rotate-45 border-r-2 border-b-2 transition-all duration-500 ${done ? 'border-green-400' : 'border-gray-200 dark:border-slate-700'}`} />
        </div>
        <div className={`px-6 py-2 rounded-full border-2 text-sm font-bold transition-all duration-500 ${
          done
            ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-400'
            : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-300 dark:text-slate-600'
        }`}>
          {done ? '✅ END — Analysis Complete' : 'END'}
        </div>
      </div>
    </div>
  );
}