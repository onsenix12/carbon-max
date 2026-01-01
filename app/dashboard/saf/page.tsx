'use client';

import SAFTracker from '@/components/dashboard/SAFTracker';
import SAFTimelineChart from '@/components/dashboard/SAFTimelineChart';
import SAFByRouteTable from '@/components/dashboard/SAFByRouteTable';
import SAFProviderBreakdown from '@/components/dashboard/SAFProviderBreakdown';
import PassengerEngagement from '@/components/dashboard/PassengerEngagement';
import VerificationStatus from '@/components/dashboard/VerificationStatus';

/**
 * SAF Tracking Page
 * Dedicated view for tracking SAF contributions, progress toward 2026 mandate,
 * and passenger engagement metrics.
 */

// Mock data - in production, this would come from API calls
const generateMockTimelineData = () => {
  const data = [];
  const today = new Date();
  let cumulativeUptake = 0.15; // Start at 0.15%
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    const monthlyContribution = 25000 + Math.random() * 15000;
    cumulativeUptake += 0.02 + Math.random() * 0.03; // Gradual growth
    
    data.push({
      date: date.toISOString().split('T')[0],
      safContributed: monthlyContribution,
      cumulativeUptake: Math.min(cumulativeUptake, 1.0), // Cap at 1%
    });
  }
  return data;
};

const generateMockRouteData = () => {
  return [
    { routeId: 'SIN-LHR', flights: 1250, safContributions: 12500, coverage: 45.2 },
    { routeId: 'SIN-JFK', flights: 980, safContributions: 9800, coverage: 38.5 },
    { routeId: 'SIN-SYD', flights: 1450, safContributions: 14500, coverage: 52.1 },
    { routeId: 'SIN-NRT', flights: 2100, safContributions: 10500, coverage: 28.3 },
    { routeId: 'SIN-HKG', flights: 3200, safContributions: 6400, coverage: 12.5 },
    { routeId: 'SIN-BKK', flights: 2800, safContributions: 4200, coverage: 8.9 },
    { routeId: 'SIN-DXB', flights: 1850, safContributions: 0, coverage: 0 },
    { routeId: 'SIN-KUL', flights: 4200, safContributions: 0, coverage: 0 },
  ];
};

const generateMockProviderData = () => {
  return [
    {
      providerId: 'neste_singapore',
      providerName: 'Neste Singapore',
      liters: 285000,
      percentage: 68.5,
    },
    {
      providerId: 'shell_saf',
      providerName: 'Shell SAF',
      liters: 131000,
      percentage: 31.5,
    },
  ];
};

const generateMockVerifications = () => {
  const verifications = [];
  const providers = ['Neste Singapore', 'Shell SAF'];
  const statuses: Array<'pending' | 'verified' | 'rejected'> = ['pending', 'verified', 'verified', 'verified'];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    verifications.push({
      id: `ver-${i}`,
      certificateId: `SAF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      provider: providers.length > 0 ? providers[Math.floor(Math.random() * providers.length)] : providers[0] || 'Neste Singapore',
      liters: 500 + Math.random() * 2000,
      status: statuses.length > 0 ? statuses[Math.floor(Math.random() * statuses.length)] : statuses[0] || 'verified',
      timestamp: date.toISOString(),
      registry: 'IATA Book-and-Claim Registry',
    });
  }
  
  return verifications;
};

export default function SAFTrackingPage() {
  // Mock data
  const timelineData = generateMockTimelineData();
  const routeData = generateMockRouteData();
  const providerData = generateMockProviderData();
  const verifications = generateMockVerifications();

  // Calculate metrics
  const currentMonth = timelineData[timelineData.length - 1];
  const totalSAFContributed = currentMonth.safContributed;
  const co2eAvoided = totalSAFContributed * 2.27; // 2.27 kg CO2e per liter reduction
  const passengerFlightsCovered = 15.8; // percentage
  const progressToMandate = currentMonth.cumulativeUptake;
  const targetMandate = 1; // 1% by 2026
  const targetYear = 2026;

  // Passenger engagement metrics
  const totalPassengers = 125000;
  const sawSAFOption = 45000;
  const contributed = 8500;
  const averageContribution = 12.50;

  // Verification metrics
  const pendingCount = verifications.filter((v) => v.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-changi-navy mb-2">SAF Tracking</h1>
        <p className="text-changi-gray">
          Monitor SAF contributions, progress toward {targetYear} mandate, and passenger engagement
        </p>
      </div>

      {/* Hero Metrics */}
      <SAFTracker
        totalSAFContributed={totalSAFContributed}
        co2eAvoided={co2eAvoided}
        passengerFlightsCovered={passengerFlightsCovered}
        progressToMandate={progressToMandate}
        targetMandate={targetMandate}
        targetYear={targetYear}
      />

      {/* SAF Timeline Chart */}
      <SAFTimelineChart
        data={timelineData}
        targetMandate={targetMandate}
        targetYear={targetYear}
      />

      {/* Two-Column Layout: Routes and Provider */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SAF by Route Table */}
        <div className="lg:col-span-1">
          <SAFByRouteTable routes={routeData} />
        </div>

        {/* Provider Breakdown */}
        <div className="lg:col-span-1">
          <SAFProviderBreakdown data={providerData} />
        </div>
      </div>

      {/* Two-Column Layout: Engagement and Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passenger Engagement */}
        <div className="lg:col-span-1">
          <PassengerEngagement
            totalPassengers={totalPassengers}
            sawSAFOption={sawSAFOption}
            contributed={contributed}
            averageContribution={averageContribution}
          />
        </div>

        {/* Verification Status */}
        <div className="lg:col-span-1">
          <VerificationStatus
            verifications={verifications}
            pendingCount={pendingCount}
          />
        </div>
      </div>
    </div>
  );
}

