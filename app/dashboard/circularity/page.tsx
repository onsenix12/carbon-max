'use client';

import { useState, useEffect } from 'react';
import CircularityMetrics from '@/components/dashboard/CircularityMetrics';
import ActionsBreakdown from '@/components/dashboard/ActionsBreakdown';
import TerminalHeatmap from '@/components/dashboard/TerminalHeatmap';
import CircularityTrend from '@/components/dashboard/CircularityTrend';
import TopParticipants from '@/components/dashboard/TopParticipants';
import circularityActionsData from '@/data/circularityActions.json';

/**
 * Circularity Tracking Page
 * Dedicated view for tracking circularity actions, waste diversion,
 * and participant engagement. Addresses "Novel Entities" planetary boundary.
 */

// Mock data - in production, this would come from API calls
const generateMockTrendData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const wasteDiverted = 85 + Math.random() * 30;
    const previousWaste = 75 + Math.random() * 25; // Previous period baseline
    
    data.push({
      date: date.toISOString().split('T')[0],
      wasteDiverted,
      previousPeriod: i < 15 ? previousWaste : undefined, // Show comparison for first half
    });
  }
  return data;
};

const generateMockActionsData = () => {
  const actions = circularityActionsData.actions;
  return actions.map((action) => ({
    actionName: action.name,
    count: Math.floor(Math.random() * 5000) + 1000,
    wasteDiverted: (Math.floor(Math.random() * 5000) + 1000) * (action.waste_diverted_grams / 1000), // Convert to kg
    category: action.category,
  }));
};

const generateMockTerminalData = () => {
  return [
    { terminal: 'Terminal 1', actions: 12500, wasteDiverted: 185.5, participants: 850 },
    { terminal: 'Terminal 2', actions: 15200, wasteDiverted: 225.3, participants: 1020 },
    { terminal: 'Terminal 3', actions: 18900, wasteDiverted: 280.7, participants: 1250 },
    { terminal: 'Terminal 4', actions: 8500, wasteDiverted: 125.2, participants: 580 },
    { terminal: 'Jewel', actions: 11200, wasteDiverted: 165.8, participants: 920 },
  ];
};

const generateMockParticipants = () => {
  const participants = [];
  const tiers = ['Green', 'Silver', 'Gold', 'Platinum'];
  
  for (let i = 0; i < 50; i++) {
    const actions = Math.floor(Math.random() * 500) + 50;
    const wasteDiverted = actions * 0.015; // Average 15g per action
    const tier = tiers.length > 0 ? tiers[Math.floor(Math.random() * tiers.length)] : tiers[0];
    const points = actions * 10; // Average 10 points per action
    
    participants.push({
      rank: i + 1,
      userId: `User-${String(i + 1).padStart(4, '0')}`,
      actions,
      wasteDiverted,
      tier,
      points,
    });
  }
  
  // Sort by actions descending
  return participants.sort((a, b) => b.actions - a.actions).map((p, i) => ({
    ...p,
    rank: i + 1,
  }));
};

export default function CircularityTrackingPage() {
  // Generate data only on client side to avoid hydration mismatch
  const [trendData, setTrendData] = useState<ReturnType<typeof generateMockTrendData>>([]);
  const [actionsData, setActionsData] = useState<ReturnType<typeof generateMockActionsData>>([]);
  const [terminalData] = useState(generateMockTerminalData()); // Static data, no random
  const [participantsData, setParticipantsData] = useState<ReturnType<typeof generateMockParticipants>>([]);

  useEffect(() => {
    // Generate random data only on client side
    setTrendData(generateMockTrendData());
    setActionsData(generateMockActionsData());
    setParticipantsData(generateMockParticipants());
  }, []);

  // Calculate metrics (with fallback for initial empty state)
  const totalWasteDiverted = trendData.length > 0 ? trendData.reduce((sum, d) => sum + d.wasteDiverted, 0) : 0;
  const singleUseItemsAvoided = actionsData.length > 0 ? actionsData.reduce((sum, a) => sum + a.count, 0) : 0;
  const cupAsServiceUses = actionsData.length > 0 ? (actionsData.find((a) => a.actionName === 'Cup-as-a-Service')?.count || 0) : 0;
  const activeParticipants = participantsData.length;

  // Show loading state while data is being generated
  if (trendData.length === 0 || actionsData.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 bg-changi-gray/20 rounded w-64 mb-2 animate-pulse" />
          <div className="h-5 bg-changi-gray/20 rounded w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
              <div className="h-4 bg-changi-gray/20 rounded w-32 mb-4 animate-pulse" />
              <div className="h-8 bg-changi-gray/20 rounded w-24 mb-2 animate-pulse" />
              <div className="h-3 bg-changi-gray/20 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-changi-navy mb-2">Circularity Tracking</h1>
        <p className="text-changi-gray">
          Monitor waste diversion, circularity actions, and participant engagement. Tracking progress toward reducing novel entities and waste.
        </p>
      </div>

      {/* Hero Metrics */}
      <CircularityMetrics
        totalWasteDiverted={totalWasteDiverted}
        singleUseItemsAvoided={singleUseItemsAvoided}
        cupAsServiceUses={cupAsServiceUses}
        activeParticipants={activeParticipants}
      />

      {/* Actions Breakdown */}
      <ActionsBreakdown data={actionsData} />

      {/* Two-Column Layout: Terminal Heatmap and Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal Heatmap */}
        <div className="lg:col-span-1">
          <TerminalHeatmap data={terminalData} />
        </div>

        {/* Trend Over Time */}
        <div className="lg:col-span-1">
          <CircularityTrend data={trendData} previousPeriodLabel="Previous Month" />
        </div>
      </div>

      {/* Top Participants */}
      <TopParticipants participants={participantsData} />
    </div>
  );
}

