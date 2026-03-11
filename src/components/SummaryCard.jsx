const colorMap = {
  green:  { bg: 'bg-green-50',  text: 'text-green-700'  },
  red:    { bg: 'bg-red-50',    text: 'text-red-700'    },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
};

export default function SummaryCard({ title, value, icon, color }) {
  const { bg, text } = colorMap[color] || colorMap.indigo;
  return (
    <div className={`${bg} rounded-2xl p-4 border border-gray-100`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${text}`}>₹{value?.toLocaleString()}</p>
    </div>
  );
}