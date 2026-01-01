'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plane, ShoppingBag, UtensilsCrossed, Car, Building2 } from 'lucide-react';

interface SourceData {
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SourceBreakdownProps {
  data: SourceData[];
}

const COLORS = {
  Flight: '#3b82f6',
  Shopping: '#8b5cf6',
  Dining: '#f97316',
  Transport: '#10b981',
  Operations: '#6b7280',
};

export default function SourceBreakdown({ data }: SourceBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-changi-gray/20">
          <p className="font-semibold text-changi-navy mb-1">{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {data.value.toFixed(1)} tCO₂e ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show label if slice is too small
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <h3 className="text-lg font-bold text-changi-navy mb-4">Emission Sources</h3>
      
      <div className="flex items-center justify-center mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with icons */}
      <div className="space-y-2">
        {data.map((item, index) => {
          const Icon = item.icon;
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          return (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-changi-cream transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div style={{ color: item.color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-changi-navy">{item.name}</p>
                  <p className="text-xs text-changi-gray">{percentage}% of total</p>
                </div>
              </div>
              <p className="text-sm font-bold text-changi-navy">
                {item.value.toFixed(1)} tCO₂e
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

