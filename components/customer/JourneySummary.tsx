'use client';

import { useJourney } from '@/hooks/useJourney';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, Recycle, TrendingDown } from 'lucide-react';
import EmissionBreakdown from './EmissionBreakdown';
import CarbonReceipt from './CarbonReceipt';
import ComparisonContext from '@/components/shared/ComparisonContext';

export default function JourneySummary() {
  const { 
    journey, 
    totalEmissions, 
    netEmissions, 
    totalEcoPoints,
    pointsByCategory,
    totalWasteDiverted,
    flightEmissions,
    transportEmissions,
  } = useJourney();

  const [animatedGross, setAnimatedGross] = useState(0);
  const [animatedContributions, setAnimatedContributions] = useState(0);
  const [animatedNet, setAnimatedNet] = useState(0);
  const [showImpactStory, setShowImpactStory] = useState(false);

  // Animate the calculation
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const grossStep = totalEmissions / steps;
    const contributionsStep = (totalEmissions - netEmissions) / steps;
    const netStep = netEmissions / steps;

    const interval = setInterval(() => {
      step++;
      if (step <= steps) {
        setAnimatedGross(grossStep * step);
        setAnimatedContributions(contributionsStep * step);
        setAnimatedNet(netStep * step);
      } else {
        clearInterval(interval);
        setAnimatedGross(totalEmissions);
        setAnimatedContributions(totalEmissions - netEmissions);
        setAnimatedNet(netEmissions);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [totalEmissions, netEmissions]);

  const contributionsAmount = totalEmissions - netEmissions;
  const impactPercentage = totalEmissions > 0 
    ? Math.round((contributionsAmount / totalEmissions) * 100) 
    : 0;

  // Data for emission sources chart
  const emissionSourcesData = [
    {
      name: 'Sources',
      Flight: flightEmissions,
      Transport: transportEmissions,
      Shopping: journey.shopping.reduce((sum, s) => sum + (s.amount * 0.1), 0),
      Dining: journey.dining.reduce((sum, d) => sum + (d.isPlantBased ? 0 : d.amount * 0.2), 0),
    },
  ].filter(item => item.Flight > 0 || item.Transport > 0 || item.Shopping > 0 || item.Dining > 0);

  // Data for coverage chart
  const coverageData = [
    {
      name: 'Coverage',
      'SAF Covered': journey.flight?.safContribution?.emissionsReduced || 0,
      'Offset Covered': journey.flight?.offsetPurchase 
        ? journey.flight.offsetPurchase.tonnesOffset * 1000 
        : 0,
      'Remaining': Math.max(0, netEmissions),
    },
  ];

  const COLORS = {
    Flight: '#3b82f6',
    Transport: '#10b981',
    Shopping: '#8b5cf6',
    Dining: '#f59e0b',
    'SAF Covered': '#2D8B4E',
    'Offset Covered': '#4ECDC4',
    'Remaining': '#94a3b8',
  };

  return (
    <div className="space-y-6">
      {/* Hero Section: Gross - Contributions = Net */}
      <div className="bg-gradient-to-br from-changi-cream to-white rounded-xl p-8 shadow-lg border-2 border-carbon-leaf/20">
        <div className="text-center space-y-6">
          {/* Gross Emissions */}
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wider text-changi-gray font-semibold">
              Gross Emissions
            </p>
            <div className="text-5xl font-bold text-changi-gray">
              {animatedGross.toFixed(1)} kg CO₂e
            </div>
          </div>

          {/* Minus Contributions (Animated) */}
          {contributionsAmount > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px bg-changi-gray/30 flex-1" />
                <TrendingDown className="w-6 h-6 text-carbon-leaf" />
                <div className="h-px bg-changi-gray/30 flex-1" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-carbon-forest">
                  Your Contributions
                </p>
                <div className="text-3xl font-bold text-carbon-leaf">
                  -{animatedContributions.toFixed(1)} kg CO₂e
                </div>
                {journey.flight?.safContribution && (
                  <p className="text-xs text-carbon-forest/70">
                    SAF: -{journey.flight.safContribution.emissionsReduced.toFixed(1)} kg
                  </p>
                )}
                {journey.flight?.offsetPurchase && (
                  <p className="text-xs text-carbon-forest/70">
                    Offset: -{(journey.flight.offsetPurchase.tonnesOffset * 1000).toFixed(1)} kg
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Equals Net Emissions */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-changi-gray/30 flex-1" />
              <span className="text-2xl font-bold text-changi-navy">=</span>
              <div className="h-px bg-changi-gray/30 flex-1" />
            </div>
            <p className="text-sm uppercase tracking-wider text-carbon-forest font-semibold">
              Net Emissions
            </p>
            <div className="text-6xl font-bold text-carbon-leaf">
              {animatedNet.toFixed(1)} kg CO₂e
            </div>
          </div>

          {/* Impact Badge */}
          {impactPercentage > 0 && (
            <div className="inline-flex items-center gap-2 bg-carbon-leaf text-white px-6 py-3 rounded-full shadow-lg animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">
                You've addressed {impactPercentage}% of your footprint
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emission Sources Chart */}
        {emissionSourcesData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-changi-navy mb-4">Emission Sources</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={emissionSourcesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#5b5b5b" />
                <YAxis stroke="#5b5b5b" label={{ value: 'kg CO₂e', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)} kg CO₂e`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Flight" stackId="a" fill={COLORS.Flight}>
                  {emissionSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.Flight} />
                  ))}
                </Bar>
                <Bar dataKey="Transport" stackId="a" fill={COLORS.Transport}>
                  {emissionSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.Transport} />
                  ))}
                </Bar>
                <Bar dataKey="Shopping" stackId="a" fill={COLORS.Shopping}>
                  {emissionSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.Shopping} />
                  ))}
                </Bar>
                <Bar dataKey="Dining" stackId="a" fill={COLORS.Dining}>
                  {emissionSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.Dining} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Coverage Chart */}
        {coverageData.length > 0 && contributionsAmount > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-changi-navy mb-4">Coverage Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={coverageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#5b5b5b" />
                <YAxis stroke="#5b5b5b" label={{ value: 'kg CO₂e', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)} kg CO₂e`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="SAF Covered" fill={COLORS['SAF Covered']}>
                  {coverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS['SAF Covered']} />
                  ))}
                </Bar>
                <Bar dataKey="Offset Covered" fill={COLORS['Offset Covered']}>
                  {coverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS['Offset Covered']} />
                  ))}
                </Bar>
                <Bar dataKey="Remaining" fill={COLORS.Remaining}>
                  {coverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.Remaining} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Eco-Points Card */}
      <div className="bg-gradient-to-br from-carbon-leaf to-carbon-forest text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Eco-Points Earned This Journey
            </h3>
            <p className="text-sm opacity-90">
              {Object.entries(pointsByCategory)
                .filter(([_, points]) => points > 0)
                .map(([category, points]) => `${category}: ${points}`)
                .join(' • ') || 'No points earned yet'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{totalEcoPoints.toLocaleString()}</div>
            <p className="text-sm opacity-75">points</p>
          </div>
        </div>
      </div>

      {/* Circularity Actions */}
      {journey.circularity.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-changi-navy text-lg mb-4 flex items-center gap-2">
            <Recycle className="w-6 h-6 text-carbon-leaf" />
            Circularity Actions Taken
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journey.circularity.map((action) => (
              <div
                key={action.id}
                className="bg-carbon-lime/20 border border-carbon-leaf/20 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-carbon-forest">{action.actionName}</p>
                    <p className="text-sm text-carbon-forest/70 mt-1">
                      {action.wasteDiverted}g waste diverted
                    </p>
                    <p className="text-xs text-changi-gray mt-2">
                      {new Date(action.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-carbon-leaf">+{action.ecoPointsEarned}</p>
                    <p className="text-xs text-carbon-forest/70">points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalWasteDiverted > 0 && (
            <div className="mt-4 pt-4 border-t border-changi-gray/20">
              <p className="text-sm text-changi-gray">
                Total waste diverted: <span className="font-semibold text-carbon-forest">
                  {(totalWasteDiverted / 1000).toFixed(2)} kg
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Additional Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmissionBreakdown />
        <ComparisonContext 
          emissionsKg={netEmissions} 
          hasContributions={contributionsAmount > 0}
        />
      </div>

      {/* Carbon Receipt */}
      <CarbonReceipt 
        onGetImpactStory={() => setShowImpactStory(true)}
      />

      {/* Impact Story Modal (placeholder) */}
      {showImpactStory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="font-bold text-xl text-changi-navy mb-4">Your Impact Story</h3>
            <p className="text-changi-gray mb-4">
              This feature will generate a personalized AI story about your sustainability journey.
            </p>
            <button
              onClick={() => setShowImpactStory(false)}
              className="w-full bg-carbon-leaf text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

