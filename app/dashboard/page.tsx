'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import SAFProgressCard from '@/components/dashboard/SAFProgressCard';
import EmissionsChart from '@/components/dashboard/EmissionsChart';
import SourceBreakdown from '@/components/dashboard/SourceBreakdown';
import TopRoutesTable from '@/components/dashboard/TopRoutesTable';
import { StatCardSkeleton, ChartSkeleton, TableSkeleton, SAFProgressSkeleton } from '@/components/dashboard/SkeletonLoader';
import EmptyState from '@/components/dashboard/EmptyState';
import MethodologyLink from '@/components/dashboard/MethodologyLink';
import DemoMode from '@/components/dashboard/DemoMode';
import ExportReport from '@/components/dashboard/ExportReport';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Plane, ShoppingBag, UtensilsCrossed, Car, Building2 } from 'lucide-react';

/**
 * Dashboard Overview Page
 * Main landing page for operations dashboard with SAF and circularity metrics
 */

// Mock data - in production, this would come from API calls
const generateMockEmissionsData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      gross: 1250 + Math.random() * 200,
      safReduction: 45 + Math.random() * 15,
      offsetReduction: 120 + Math.random() * 30,
      net: 1085 + Math.random() * 180,
    });
  }
  return data;
};

const generateMockSourceData = () => {
  return [
    {
      name: 'Flight',
      value: 850.5,
      color: '#3b82f6',
      icon: Plane,
    },
    {
      name: 'Shopping',
      value: 125.3,
      color: '#8b5cf6',
      icon: ShoppingBag,
    },
    {
      name: 'Dining',
      value: 98.7,
      color: '#f97316',
      icon: UtensilsCrossed,
    },
    {
      name: 'Transport',
      value: 45.2,
      color: '#10b981',
      icon: Car,
    },
    {
      name: 'Operations',
      value: 130.8,
      color: '#6b7280',
      icon: Building2,
    },
  ];
};

const generateMockRoutesData = () => {
  return [
    { routeId: 'SIN-LHR', emissions: 245.5, passengers: 1250, safLiters: 12500 },
    { routeId: 'SIN-JFK', emissions: 312.8, passengers: 980, safLiters: 9800 },
    { routeId: 'SIN-SYD', emissions: 198.3, passengers: 1450, safLiters: 14500 },
    { routeId: 'SIN-NRT', emissions: 156.2, passengers: 2100, safLiters: 10500 },
    { routeId: 'SIN-HKG', emissions: 98.5, passengers: 3200, safLiters: 6400 },
    { routeId: 'SIN-BKK', emissions: 87.3, passengers: 2800, safLiters: 4200 },
  ];
};

export default function DashboardPage() {
  const [demoMode, setDemoMode] = useState(false);
  const { data, loading, error, newActivitiesCount } = useDashboardData({
    period: 'week',
    view: 'overview',
    enabled: true,
  });

  // Use API data if available, otherwise fall back to mock
  // Generate random data only on client side to avoid hydration mismatch
  const [emissionsData, setEmissionsData] = useState<ReturnType<typeof generateMockEmissionsData>>([]);
  const [sourceData, setSourceData] = useState(generateMockSourceData()); // Static data, no random
  const [routesData, setRoutesData] = useState(generateMockRoutesData()); // Static data, no random

  useEffect(() => {
    // Generate random data only on client side
    setEmissionsData(generateMockEmissionsData());
  }, []);

  // Calculate today's metrics (with fallback for initial empty state)
  const todayData = emissionsData.length > 0 ? emissionsData[emissionsData.length - 1] : { gross: 1250, safReduction: 45, offsetReduction: 120, net: 1085 };
  const yesterdayData = emissionsData.length > 1 ? emissionsData[emissionsData.length - 2] : todayData;
  const lastWeekData = emissionsData.length > 8 ? emissionsData[emissionsData.length - 8] : todayData;

  // Today's metrics
  const grossEmissionsToday = todayData.gross;
  const safContributionsToday = 12500; // liters
  const netEmissionsToday = todayData.net;
  const offsetRate = ((todayData.offsetReduction / todayData.gross) * 100);
  const circularityActionsToday = 342;
  const wasteDivertedToday = 1250; // kg

  // SAF metrics
  const currentSAFUptake = 0.35; // 0.35% current uptake
  const safLitersToday = safContributionsToday;
  const targetMandate = 1; // 1% by 2026
  const targetYear = 2026;

  // Comparisons
  const grossComparison = grossEmissionsToday - yesterdayData.gross;
  const safComparison = safContributionsToday - 11800; // Mock yesterday value
  const netComparison = netEmissionsToday - yesterdayData.net;
  const offsetComparison = offsetRate - ((yesterdayData.offsetReduction / yesterdayData.gross) * 100);
  const circularityComparison = circularityActionsToday - 298; // Mock yesterday value
  const wasteComparison = wasteDivertedToday - 980; // Mock yesterday value

  // Determine trends
  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0.1) return 'up';
    if (value < -0.1) return 'down';
    return 'neutral';
  };

  // Update data when API data is available
  useEffect(() => {
    if (data) {
      if (data.timeSeries) {
        setEmissionsData(data.timeSeries.map((ts) => ({
          date: ts.date,
          gross: ts.gross,
          safReduction: ts.saf,
          offsetReduction: ts.offset,
          net: ts.net,
        })));
      }
      if (data.bySource) {
        setSourceData([
          { name: 'Flight', value: data.bySource.Flight, color: '#3b82f6', icon: Plane },
          { name: 'Shopping', value: data.bySource.Shopping, color: '#8b5cf6', icon: ShoppingBag },
          { name: 'Dining', value: data.bySource.Dining, color: '#f97316', icon: UtensilsCrossed },
          { name: 'Transport', value: data.bySource.Transport, color: '#10b981', icon: Car },
          { name: 'Operations', value: data.bySource.Operations, color: '#6b7280', icon: Building2 },
        ]);
      }
      if (data.topRoutes) {
        setRoutesData(data.topRoutes.map((r) => ({
          routeId: r.route,
          emissions: r.emissions,
          passengers: r.passengers,
          safLiters: (r.emissions * r.safCoverage) / 100, // Approximate
        })));
      }
    }
  }, [data]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 bg-changi-gray/20 rounded w-64 mb-2 animate-pulse" />
          <div className="h-5 bg-changi-gray/20 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <SAFProgressSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to Load Dashboard"
        message={error.message || 'There was an error loading the dashboard data. Please try refreshing the page.'}
        icon="inbox"
        action={{
          label: 'Refresh Page',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-changi-navy mb-2">Dashboard Overview</h1>
          <p className="text-changi-gray">
            Real-time SAF and circularity metrics for {new Date().toLocaleDateString('en-SG', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DemoMode enabled={demoMode} onToggle={setDemoMode} />
          {data && <ExportReport data={data} period="week" view="overview" />}
        </div>
      </div>

      {newActivitiesCount > 0 && (
        <div className="bg-carbon-lime/20 border border-carbon-leaf rounded-lg p-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-carbon-leaf rounded-full animate-pulse" />
          <span className="text-sm font-medium text-carbon-forest">
            {newActivitiesCount} new activit{newActivitiesCount === 1 ? 'y' : 'ies'} in the last 10 seconds
          </span>
        </div>
      )}

      {/* Key Metrics Row 1 - SAF First */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label={
            <div className="flex items-center gap-2">
              <span>SAF Contributions Today</span>
              <MethodologyLink
                metric="SAF Contributions"
                source="IATA Book-and-Claim Registry"
                citation="IATA. (2023). Book-and-Claim for Sustainable Aviation Fuel."
                methodology="SAF contributions are tracked via book-and-claim system, where environmental attributes are separated from physical fuel and attributed to specific flights."
              />
            </div>
          }
          value={data?.summary?.safContributed || safContributionsToday}
          unit="liters"
          comparison={{
            value: safComparison,
            period: 'yesterday',
          }}
          trend={getTrend(safComparison)}
          highlight={true}
        />
        <StatCard
          label={
            <div className="flex items-center gap-2">
              <span>Today's Gross Emissions</span>
              <MethodologyLink
                metric="Gross Emissions"
                source="IATA Carbon Offset Program"
                citation="IATA. (2023). Carbon Offset Program Methodology."
                isEstimate={false}
              />
            </div>
          }
          value={data?.summary?.grossEmissions || grossEmissionsToday}
          unit="tCO₂e"
          comparison={{
            value: grossComparison,
            period: 'yesterday',
          }}
          trend={getTrend(grossComparison)}
        />
        <StatCard
          label={
            <div className="flex items-center gap-2">
              <span>Net Emissions (after SAF/offsets)</span>
              <MethodologyLink
                metric="Net Emissions"
                source="Changi Airport Group"
                citation="Calculated as gross emissions minus SAF reductions and offset purchases."
              />
            </div>
          }
          value={data?.summary?.netEmissions || netEmissionsToday}
          unit="tCO₂e"
          comparison={{
            value: netComparison,
            period: 'yesterday',
          }}
          trend={getTrend(-netComparison)}
        />
      </div>

      {/* Key Metrics Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Offset Rate"
          value={offsetRate}
          unit="%"
          comparison={{
            value: offsetComparison,
            period: 'yesterday',
          }}
          trend={getTrend(offsetComparison)}
        />
        <StatCard
          label="Circularity Actions Today"
          value={circularityActionsToday}
          comparison={{
            value: circularityComparison,
            period: 'yesterday',
          }}
          trend={getTrend(circularityComparison)}
        />
        <StatCard
          label="Waste Diverted"
          value={wasteDivertedToday}
          unit="kg"
          comparison={{
            value: wasteComparison,
            period: 'yesterday',
          }}
          trend={getTrend(wasteComparison)}
        />
      </div>

      {/* SAF Progress Section - HERO METRIC */}
      <div className="relative">
        <SAFProgressCard
          currentUptake={data?.safProgress?.currentPercent || currentSAFUptake}
          litersToday={data?.summary?.safContributed || safLitersToday}
          targetMandate={targetMandate}
          targetYear={targetYear}
        />
        <div className="absolute top-4 right-4">
          <MethodologyLink
            metric="SAF Progress"
            source="Singapore CAAS"
            citation="Civil Aviation Authority of Singapore. (2023). Singapore Sustainable Air Hub Blueprint."
            methodology="SAF uptake percentage is calculated as the ratio of flights with SAF contributions to total flights, using book-and-claim attribution."
          />
        </div>
      </div>

      {/* Emissions Chart */}
      <EmissionsChart data={emissionsData} />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Source Breakdown */}
        <SourceBreakdown data={sourceData} />

        {/* Right: Top Routes Table */}
        <TopRoutesTable routes={routesData} />
      </div>
    </div>
  );
}
