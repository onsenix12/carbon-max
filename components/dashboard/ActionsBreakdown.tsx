'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import circularityActionsData from '@/data/circularityActions.json';

interface ActionData {
  actionName: string;
  count: number;
  wasteDiverted: number; // kg
  category: string;
}

interface ActionsBreakdownProps {
  data: ActionData[];
}

const COLORS: Record<string, string> = {
  waste_reduction: '#2D8B4E',
  sustainable_dining: '#f97316',
  default: '#6b7280',
};

export default function ActionsBreakdown({ data }: ActionsBreakdownProps) {
  // Get action details from circularityActions.json
  const getActionDetails = (actionName: string) => {
    return circularityActionsData.actions.find(
      (a) => a.name === actionName
    );
  };

  const chartData = data.map((item) => ({
    ...item,
    color: COLORS[item.category] || COLORS.default,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-changi-gray/20">
          <p className="font-semibold text-changi-navy mb-2">{data.actionName}</p>
          <p className="text-sm text-changi-gray mb-1">
            Actions: <span className="font-semibold text-changi-navy">{data.count.toLocaleString()}</span>
          </p>
          <p className="text-sm text-changi-gray">
            Waste Diverted: <span className="font-semibold text-carbon-forest">{data.wasteDiverted.toFixed(1)} kg</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="bg-gradient-to-br from-carbon-sage/5 via-white to-carbon-mint/5 rounded-xl p-6 shadow-sm border-2 border-carbon-sage/30"
      role="region"
      aria-label="Circularity actions breakdown"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-changi-navy mb-1">Actions Breakdown</h3>
        <p className="text-sm text-changi-gray">
          Circularity actions by type and their impact
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="actionName"
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            yAxisId="left"
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#5b5b5b"
            style={{ fontSize: '12px' }}
            label={{ value: 'Waste Diverted (kg)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                count: 'Action Count',
                wasteDiverted: 'Waste Diverted (kg)',
              };
              return labels[value] || value;
            }}
          />
          <Bar yAxisId="left" dataKey="count" fill="#2D8B4E" name="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <Bar
            yAxisId="right"
            dataKey="wasteDiverted"
            fill="#693874"
            name="wasteDiverted"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-changi-gray/20 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-changi-gray mb-1">Total Actions</p>
          <p className="text-2xl font-bold text-changi-navy">
            {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-changi-gray mb-1">Total Waste Diverted</p>
          <p className="text-2xl font-bold text-carbon-forest">
            {data.reduce((sum, item) => sum + item.wasteDiverted, 0).toFixed(1)} kg
          </p>
        </div>
      </div>
    </div>
  );
}

