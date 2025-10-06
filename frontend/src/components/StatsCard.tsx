interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  color?: 'green' | 'red' | 'yellow';
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = 'green',
}: StatsCardProps) {
  const trendColors = {
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${trendColors[color]}`}>
              {trend}
            </span>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}