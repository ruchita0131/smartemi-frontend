const colorMap = {
  green:  { bg: 'bg-emerald-50 dark:bg-emerald-900/20',  text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  red:    { bg: 'bg-red-50 dark:bg-red-900/20',          text: 'text-red-700 dark:text-red-400',         border: 'border-red-200 dark:border-red-800'         },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20',    text: 'text-orange-700 dark:text-orange-400',   border: 'border-orange-200 dark:border-orange-800'   },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20',    text: 'text-indigo-700 dark:text-indigo-400',   border: 'border-indigo-200 dark:border-indigo-800'   },
};

export default function SummaryCard({ title, value, icon, color }) {
  const { bg, text, border } = colorMap[color] || colorMap.indigo;
  return (
    <div className={`${bg} ${border} rounded-2xl p-4 border hover:scale-105 transition-transform duration-200 cursor-default`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{title}</p>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${text}`}>₹{value?.toLocaleString()}</p>
    </div>
  );
}

