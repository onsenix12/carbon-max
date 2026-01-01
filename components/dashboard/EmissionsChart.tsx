'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface EmissionsDataPoint {
  date: string;
  gross: number;
  safReduction: number;
  offsetReduction: number;
  net: number;
}

interface EmissionsChartProps {
  data: EmissionsDataPoint[];
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

export default function EmissionsChart({ data }: EmissionsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const formatDate = (dateStr: string, range: TimeRange): string => {
    const date = new Date(dateStr);
    if (range === 'daily') {
      return date.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' });
    }
    if (range === 'weekly') {
      return `Week ${getWeekNumber(date)}`;
    }
    return date.toLocaleDateString('en-SG', { month: 'short', year: 'numeric' });
  };

  // Format data based on selected time range
  const chartData = data.map((point) => ({
    ...point,
    dateLabel: formatDate(point.date, timeRange),
    // SAF and offset reductions should be negative for visual representation
    safReductionDisplay: -point.safReduction,
    offsetReductionDisplay: -point.offsetReduction,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-changi-gray/20">
          <p className="font-semibold text-changi-navy mb-2">{payload[0].payload.dateLabel}</p>
          {payload.map((entry: any, index: number) => {
            const value = entry.name === 'safReduction' || entry.name === 'offsetReduction'
              ? Math.abs(entry.value)
              : entry.value;
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name === 'gross' && 'Gross Emissions: '}
                {entry.name === 'safReduction' && 'SAF Reduction: -'}
                {entry.name === 'offsetReduction' && 'Offset Reduction: -'}
                {entry.name === 'net' && 'Net Emissions: '}
                {value.toFixed(1)} tCO₂e
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-changi-navy mb-1">Emissions Overview</h3>
          <p className="text-sm text-changi-gray">Gross emissions, reductions, and net emissions</p>
        </div>
        <div className="flex items-center gap-2 bg-changi-cream rounded-lg p-1">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                ${
                  timeRange === range
                    ? 'bg-white text-changi-navy shadow-sm'
                    : 'text-changi-gray hover:text-changi-navy'
                }
              `}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorSAF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2D8B4E" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2D8B4E" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="dateLabel"
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                gross: 'Gross Emissions',
                safReduction: 'SAF Reduction',
                offsetReduction: 'Offset Reduction',
                net: 'Net Emissions',
              };
              return labels[value] || value;
            }}
          />
          {/* Gross Emissions (stacked area) */}
          <Area
            type="monotone"
            dataKey="gross"
            stackId="1"
            stroke="#9ca3af"
            fill="url(#colorGross)"
            name="gross"
          />
          {/* SAF Reduction (negative, below zero) */}
          <Area
            type="monotone"
            dataKey="safReductionDisplay"
            stackId="2"
            stroke="#2D8B4E"
            fill="url(#colorSAF)"
            name="safReduction"
          />
          {/* Offset Reduction (negative, below zero) */}
          <Area
            type="monotone"
            dataKey="offsetReductionDisplay"
            stackId="2"
            stroke="#3b82f6"
            fill="url(#colorOffset)"
            name="offsetReduction"
          />
          {/* Net Emissions (line) */}
          <Area
            type="monotone"
            dataKey="net"
            stroke="#0f1133"
            strokeWidth={2}
            fill="none"
            name="net"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


