'use client';

import StatCard from './StatCard';
import { TrendingUp } from 'lucide-react';

interface CircularityMetricsProps {
  totalWasteDiverted: number; // kg this month
  singleUseItemsAvoided: number; // count
  cupAsServiceUses: number; // count
  activeParticipants: number; // count
}

export default function CircularityMetrics({
  totalWasteDiverted,
  singleUseItemsAvoided,
  cupAsServiceUses,
  activeParticipants,
}: CircularityMetricsProps) {
  // Calculate comparisons (mock - in production, get from API)
  const wasteComparison = totalWasteDiverted - 2850; // vs last month
  const itemsComparison = singleUseItemsAvoided - 12500; // vs last month
  const cupComparison = cupAsServiceUses - 3200; // vs last month
  const participantsComparison = activeParticipants - 850; // vs last month

  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0.1) return 'up';
    if (value < -0.1) return 'down';
    return 'neutral';
  };

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" 
      role="region"
      aria-label="Circularity metrics"
    >
      <StatCard
        label="Total Waste Diverted (This Month)"
        value={totalWasteDiverted}
        unit="kg"
        comparison={{
          value: wasteComparison,
          period: 'last month',
        }}
        trend={getTrend(wasteComparison)}
        highlight={true}
      />
      <StatCard
        label="Single-Use Items Avoided"
        value={singleUseItemsAvoided}
        comparison={{
          value: itemsComparison,
          period: 'last month',
        }}
        trend={getTrend(itemsComparison)}
      />
      <StatCard
        label="Cup-as-a-Service Uses"
        value={cupAsServiceUses}
        comparison={{
          value: cupComparison,
          period: 'last month',
        }}
        trend={getTrend(cupComparison)}
      />
      <StatCard
        label="Active Circular Participants"
        value={activeParticipants}
        comparison={{
          value: participantsComparison,
          period: 'last month',
        }}
        trend={getTrend(participantsComparison)}
      />
    </div>
  );
}

