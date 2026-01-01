'use client';

import StatCard from './StatCard';
import { TrendingUp } from 'lucide-react';

interface SAFTrackerProps {
  totalSAFContributed: number; // liters this month
  co2eAvoided: number; // kg CO2e
  passengerFlightsCovered: number; // percentage
  progressToMandate: number; // percentage (e.g., 0.35 for 0.35%)
  targetMandate: number; // e.g., 1 for 1%
  targetYear: number; // e.g., 2026
}

export default function SAFTracker({
  totalSAFContributed,
  co2eAvoided,
  passengerFlightsCovered,
  progressToMandate,
  targetMandate,
  targetYear,
}: SAFTrackerProps) {
  // Calculate comparisons (mock - in production, get from API)
  const safComparison = totalSAFContributed - 285000; // vs last month
  const co2eComparison = co2eAvoided - 12500; // vs last month
  const coverageComparison = passengerFlightsCovered - 12.5; // vs last month
  const progressComparison = progressToMandate - 0.28; // vs last month

  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0.1) return 'up';
    if (value < -0.1) return 'down';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total SAF Contributed (This Month)"
          value={totalSAFContributed}
          unit="liters"
          comparison={{
            value: safComparison,
            period: 'last month',
          }}
          trend={getTrend(safComparison)}
          highlight={true}
        />
        <StatCard
          label="CO₂e Avoided via SAF"
          value={co2eAvoided}
          unit="kg"
          comparison={{
            value: co2eComparison,
            period: 'last month',
          }}
          trend={getTrend(co2eComparison)}
        />
        <StatCard
          label="% of Passenger Flights Covered"
          value={passengerFlightsCovered}
          unit="%"
          comparison={{
            value: coverageComparison,
            period: 'last month',
          }}
          trend={getTrend(coverageComparison)}
        />
        <StatCard
          label="Progress to 2026 Mandate"
          value={progressToMandate}
          unit="%"
          comparison={{
            value: progressComparison,
            period: 'last month',
          }}
          trend={getTrend(progressComparison)}
        />
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-changi-navy mb-1">
              {targetYear} Mandate Progress
            </h3>
            <p className="text-sm text-changi-gray">
              Target: {targetMandate}% SAF blend requirement
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-changi-navy">
              {progressToMandate.toFixed(2)}%
            </p>
            <p className="text-xs text-changi-gray">of {targetMandate}% target</p>
          </div>
        </div>
        <div className="w-full bg-changi-cream rounded-full h-4 mb-2">
          <div
            className="h-4 rounded-full bg-carbon-leaf transition-all duration-500"
            style={{ width: `${Math.min((progressToMandate / targetMandate) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-changi-gray">
          <span>0%</span>
          <span className="font-semibold">{targetMandate}% target ({targetYear})</span>
        </div>
      </div>
    </div>
  );
}

