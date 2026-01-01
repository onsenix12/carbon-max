'use client';

import { Users, Eye, DollarSign, TrendingUp } from 'lucide-react';

interface PassengerEngagementProps {
  totalPassengers: number;
  sawSAFOption: number; // count
  contributed: number; // count
  averageContribution: number; // USD
}

export default function PassengerEngagement({
  totalPassengers,
  sawSAFOption,
  contributed,
  averageContribution,
}: PassengerEngagementProps) {
  const sawPercentage = (sawSAFOption / totalPassengers) * 100;
  const contributedPercentage = (contributed / totalPassengers) * 100;
  const conversionRate = sawSAFOption > 0 ? (contributed / sawSAFOption) * 100 : 0;

  const funnelSteps = [
    {
      label: 'Total Passengers',
      value: totalPassengers,
      percentage: 100,
      color: 'bg-changi-navy',
    },
    {
      label: 'Saw SAF Option',
      value: sawSAFOption,
      percentage: sawPercentage,
      color: 'bg-changi-purple',
    },
    {
      label: 'Contributed',
      value: contributed,
      percentage: contributedPercentage,
      color: 'bg-carbon-leaf',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-changi-navy">Passenger Engagement</h3>
        <div className="flex items-center gap-2 text-sm text-changi-gray">
          <TrendingUp className="w-4 h-4" />
          <span>{conversionRate.toFixed(1)}% conversion rate</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-changi-cream rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-changi-purple" />
            <p className="text-sm font-medium text-changi-gray">Saw SAF Option</p>
          </div>
          <p className="text-2xl font-bold text-changi-navy">
            {sawPercentage.toFixed(1)}%
          </p>
          <p className="text-xs text-changi-gray mt-1">
            {sawSAFOption.toLocaleString()} of {totalPassengers.toLocaleString()} passengers
          </p>
        </div>

        <div className="bg-carbon-lime/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-carbon-leaf" />
            <p className="text-sm font-medium text-changi-gray">Contributed</p>
          </div>
          <p className="text-2xl font-bold text-carbon-forest">
            {contributedPercentage.toFixed(1)}%
          </p>
          <p className="text-xs text-changi-gray mt-1">
            {contributed.toLocaleString()} passengers
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-medium text-changi-gray">Avg Contribution</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${averageContribution.toFixed(2)}
          </p>
          <p className="text-xs text-changi-gray mt-1">
            per contributing passenger
          </p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div>
        <h4 className="text-sm font-semibold text-changi-navy mb-4">Conversion Funnel</h4>
        <div className="space-y-3">
          {funnelSteps.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${step.color}`} />
                  <p className="text-sm font-medium text-changi-navy">{step.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-changi-navy">
                    {step.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-changi-gray">{step.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full bg-changi-cream rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${step.color}`}
                  style={{ width: `${step.percentage}%` }}
                />
              </div>
              {index < funnelSteps.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-changi-gray/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Rate Breakdown */}
      <div className="mt-6 pt-6 border-t border-changi-gray/20">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-changi-gray mb-1">View to Contribution</p>
            <p className="text-lg font-bold text-carbon-leaf">
              {conversionRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-changi-gray mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-changi-navy">
              ${(contributed * averageContribution).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

