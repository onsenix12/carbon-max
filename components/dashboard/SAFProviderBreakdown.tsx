'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CheckCircle2, Award } from 'lucide-react';
import safProjectsData from '@/data/safProjects.json';

interface ProviderData {
  providerId: string;
  providerName: string;
  liters: number;
  percentage: number;
}

interface SAFProviderBreakdownProps {
  data: ProviderData[];
}

const COLORS = ['#2D8B4E', '#3b82f6', '#8b5cf6', '#f97316', '#10b981'];

export default function SAFProviderBreakdown({ data }: SAFProviderBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.liters, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-changi-gray/20">
          <p className="font-semibold text-changi-navy mb-1">{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {data.value.toLocaleString()} liters ({data.payload.percentage.toFixed(1)}%)
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

  // Get provider certification info
  const getProviderInfo = (providerId: string) => {
    return safProjectsData.providers.find((p) => p.id === providerId);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <h3 className="text-lg font-bold text-changi-navy mb-4">SAF by Provider</h3>
      
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
              dataKey="liters"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Provider Details with Certifications */}
      <div className="space-y-3">
        {data.map((provider, index) => {
          const providerInfo = getProviderInfo(provider.providerId);
          return (
            <div
              key={provider.providerId}
              className="p-4 rounded-lg border border-changi-gray/20 hover:bg-changi-cream transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-changi-navy">{provider.providerName}</h4>
                    {providerInfo && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-carbon-lime/20 rounded-full">
                        <Award className="w-3 h-3 text-carbon-leaf" />
                        <span className="text-xs font-medium text-carbon-leaf">Certified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-changi-gray">
                    {provider.liters.toLocaleString()} liters ({provider.percentage.toFixed(1)}%)
                  </p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
              </div>
              
              {/* Certifications */}
              {providerInfo && providerInfo.certification && providerInfo.certification.length > 0 && (
                <div className="mt-2 pt-2 border-t border-changi-gray/10">
                  <div className="flex flex-wrap gap-2">
                    {providerInfo.certification.map((cert, certIndex) => (
                      <div
                        key={certIndex}
                        className="flex items-center gap-1 px-2 py-1 bg-white rounded border border-changi-gray/20"
                      >
                        <CheckCircle2 className="w-3 h-3 text-carbon-leaf" />
                        <span className="text-xs text-changi-gray">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

