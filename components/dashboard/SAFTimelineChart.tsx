'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Target, TrendingUp } from 'lucide-react';

interface TimelineDataPoint {
  date: string;
  safContributed: number; // liters
  cumulativeUptake: number; // percentage
}

interface SAFTimelineChartProps {
  data: TimelineDataPoint[];
  targetMandate: number; // e.g., 1 for 1%
  targetYear: number; // e.g., 2026
}

export default function SAFTimelineChart({
  data,
  targetMandate,
  targetYear,
}: SAFTimelineChartProps) {
  // Calculate forecast based on current trend
  const calculateForecast = () => {
    if (data.length < 2) return null;

    const recent = data.slice(-6); // Last 6 months
    const first = recent[0].cumulativeUptake;
    const last = recent[recent.length - 1].cumulativeUptake;
    const monthsElapsed = recent.length - 1;
    const monthlyGrowth = monthsElapsed > 0 ? (last - first) / monthsElapsed : 0;

    const monthsToTarget = (targetYear - new Date().getFullYear()) * 12 - (12 - new Date().getMonth());
    const projectedUptake = last + (monthlyGrowth * monthsToTarget);

    return {
      projectedUptake: Math.max(0, projectedUptake),
      onTrack: projectedUptake >= targetMandate * 0.9, // 90% of target considered "on track"
    };
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-SG', { month: 'short', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-changi-gray/20">
          <p className="font-semibold text-changi-navy mb-2">
            {formatDate(payload[0].payload.date)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'safContributed' && 'SAF Contributed: '}
              {entry.name === 'cumulativeUptake' && 'Cumulative Uptake: '}
              {entry.name === 'safContributed'
                ? `${entry.value.toLocaleString()} liters`
                : `${entry.value.toFixed(2)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const forecastData = useMemo(() => calculateForecast(), [data, targetMandate, targetYear]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-changi-navy mb-1">SAF Timeline</h3>
          <p className="text-sm text-changi-gray">
            Historical contributions and progress toward {targetYear} mandate
          </p>
        </div>
        {forecastData && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              forecastData.onTrack ? 'bg-carbon-lime/20' : 'bg-red-50'
            }`}
          >
            {forecastData.onTrack ? (
              <TrendingUp className="w-4 h-4 text-carbon-leaf" />
            ) : (
              <Target className="w-4 h-4 text-changi-red" />
            )}
            <div>
              <p className="text-xs font-semibold text-changi-gray">Forecast</p>
              <p
                className={`text-sm font-bold ${
                  forecastData.onTrack ? 'text-carbon-leaf' : 'text-changi-red'
                }`}
              >
                {forecastData.projectedUptake.toFixed(2)}% by {targetYear}
              </p>
            </div>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            tickFormatter={formatDate}
          />
          <YAxis
            yAxisId="left"
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            label={{ value: 'Liters', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            label={{ value: 'Uptake %', angle: 90, position: 'insideRight' }}
            domain={[0, targetMandate * 1.2]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                safContributed: 'SAF Contributed (liters)',
                cumulativeUptake: 'Cumulative Uptake (%)',
              };
              return labels[value] || value;
            }}
          />
          {/* Target line */}
          <ReferenceLine
            yAxisId="right"
            y={targetMandate}
            stroke="#902437"
            strokeDasharray="5 5"
            label={{ value: `${targetMandate}% Target (${targetYear})`, position: 'topRight' }}
          />
          {/* SAF Contribution line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="safContributed"
            stroke="#2D8B4E"
            strokeWidth={2}
            dot={{ fill: '#2D8B4E', r: 4 }}
            name="safContributed"
          />
          {/* Cumulative Uptake line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativeUptake"
            stroke="#693874"
            strokeWidth={2}
            dot={{ fill: '#693874', r: 4 }}
            name="cumulativeUptake"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Forecast Message */}
      {forecastData && (
        <div className="mt-4 p-4 bg-changi-cream rounded-lg">
          <p className="text-sm text-changi-navy">
            <strong>Forecast:</strong> At current rate, will reach{' '}
            <span className="font-bold">{forecastData.projectedUptake.toFixed(2)}%</span> by{' '}
            {targetYear}
            {forecastData.onTrack ? (
              <span className="text-carbon-leaf font-semibold"> — On track</span>
            ) : (
              <span className="text-changi-red font-semibold"> — Needs acceleration</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

