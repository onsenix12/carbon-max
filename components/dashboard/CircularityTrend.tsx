'use client';

import { useState } from 'react';
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
import { Calendar } from 'lucide-react';

interface TrendDataPoint {
  date: string;
  wasteDiverted: number; // kg
  previousPeriod?: number; // kg for comparison
}

interface CircularityTrendProps {
  data: TrendDataPoint[];
  previousPeriodLabel?: string;
}

export default function CircularityTrend({
  data,
  previousPeriodLabel = 'Previous Period',
}: CircularityTrendProps) {
  const [showComparison, setShowComparison] = useState(true);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' });
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
              {entry.name === 'wasteDiverted' && 'Waste Diverted: '}
              {entry.name === 'previousPeriod' && `${previousPeriodLabel}: `}
              {entry.value.toFixed(1)} kg
            </p>
          ))}
          {payload.length === 2 && payload[0].payload.previousPeriod && (
            <p className="text-xs text-changi-gray mt-2 pt-2 border-t border-changi-gray/20">
              Change: {(
                ((payload[0].value - payload[1].value) / payload[1].value) * 100
              ).toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate average for current and previous period
  const currentAvg = data.reduce((sum, d) => sum + d.wasteDiverted, 0) / data.length;
  const previousAvg = data
    .filter((d) => d.previousPeriod !== undefined)
    .reduce((sum, d) => sum + (d.previousPeriod || 0), 0) / 
    data.filter((d) => d.previousPeriod !== undefined).length;

  const changePercent = previousAvg > 0 
    ? ((currentAvg - previousAvg) / previousAvg) * 100 
    : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-changi-navy mb-1">Trend Over Time</h3>
          <p className="text-sm text-changi-gray">
            Daily waste diverted from landfill
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                showComparison
                  ? 'bg-carbon-leaf text-white'
                  : 'bg-changi-cream text-changi-gray hover:bg-carbon-lime'
              }
            `}
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-changi-cream rounded-lg p-4">
          <p className="text-xs text-changi-gray mb-1">Current Avg (Daily)</p>
          <p className="text-2xl font-bold text-changi-navy">
            {currentAvg.toFixed(1)} kg
          </p>
        </div>
        <div className="bg-carbon-lime/20 rounded-lg p-4">
          <p className="text-xs text-changi-gray mb-1">Previous Avg (Daily)</p>
          <p className="text-2xl font-bold text-carbon-forest">
            {previousAvg > 0 ? previousAvg.toFixed(1) : 'N/A'} kg
          </p>
        </div>
        <div className={`rounded-lg p-4 ${changePercent >= 0 ? 'bg-carbon-lime/20' : 'bg-red-50'}`}>
          <p className="text-xs text-changi-gray mb-1">Change</p>
          <p className={`text-2xl font-bold ${changePercent >= 0 ? 'text-carbon-forest' : 'text-changi-red'}`}>
            {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
          </p>
        </div>
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
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            label={{ value: 'Waste Diverted (kg)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                wasteDiverted: 'Current Period',
                previousPeriod: previousPeriodLabel,
              };
              return labels[value] || value;
            }}
          />
          {/* Current Period Line */}
          <Line
            type="monotone"
            dataKey="wasteDiverted"
            stroke="#2D8B4E"
            strokeWidth={2}
            dot={{ fill: '#2D8B4E', r: 4 }}
            name="wasteDiverted"
          />
          {/* Previous Period Line (if enabled and data exists) */}
          {showComparison && data.some((d) => d.previousPeriod !== undefined) && (
            <Line
              type="monotone"
              dataKey="previousPeriod"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#9ca3af', r: 3 }}
              name="previousPeriod"
            />
          )}
          {/* Average Reference Line */}
          <ReferenceLine
            y={currentAvg}
            stroke="#693874"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            label={{ value: `Avg: ${currentAvg.toFixed(1)}kg`, position: 'right' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

