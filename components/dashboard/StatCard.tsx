'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string | React.ReactNode;
  value: number | string;
  unit?: string;
  comparison?: {
    value: number;
    period: 'yesterday' | 'last week' | 'last month';
  };
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  className?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  comparison,
  trend,
  highlight = false,
  className = '',
}: StatCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toFixed(1);
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-red-600';
    if (trend === 'down') return 'text-carbon-leaf';
    return 'text-changi-gray';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getComparisonText = () => {
    if (!comparison) return null;
    const periodMap = {
      yesterday: 'vs yesterday',
      'last week': 'vs last week',
      'last month': 'vs last month',
    };
    const change = comparison.value;
    const sign = change > 0 ? '+' : '';
    return `${sign}${formatValue(change)} ${unit || ''} ${periodMap[comparison.period]}`;
  };

  return (
    <div
      className={`
        bg-white rounded-xl p-6 shadow-sm transition-all duration-300
        ${highlight ? 'border-2 border-carbon-leaf shadow-carbon-leaf/20' : 'border border-changi-gray/20'}
        ${className}
      `}
      role="article"
      aria-label={typeof label === 'string' ? `${label}: ${formatValue(value)} ${unit || ''}` : `Metric: ${formatValue(value)} ${unit || ''}`}
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-sm font-medium text-changi-gray flex-1">
          {typeof label === 'string' ? label : label}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`} aria-label={`Trend: ${trend}`}>
            {getTrendIcon()}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-3xl font-bold text-changi-navy">
          {formatValue(value)}
          {unit && <span className="text-xl ml-1">{unit}</span>}
        </p>
      </div>

      {comparison && (
        <p className={`text-xs ${getTrendColor()}`}>
          {getComparisonText()}
        </p>
      )}
    </div>
  );
}

