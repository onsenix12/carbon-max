'use client';

import { useJourneyContext } from '@/context/JourneyContext';
import type { JourneyContextType } from '@/context/JourneyContext';

/**
 * Hook to access journey context with computed values
 * 
 * Provides:
 * - Access to all journey state (flight, transport, shopping, dining, circularity)
 * - Computed values: totalEmissions, netEmissions, totalEcoPoints
 * - Methods to modify journey state
 */
export function useJourney() {
  const context = useJourneyContext();

  // Computed values
  const totalEmissions = context.totalEmissions;
  const netEmissions = context.netEmissions;
  const totalEcoPoints = context.journey.totalEcoPointsEarned;
  const totalWasteDiverted = context.totalWasteDiverted;

  // Breakdown by category
  const flightEmissions = context.journey.flight
    ? (context.journey.flight.includeRF && context.journey.flight.emissionsWithRF
        ? context.journey.flight.emissionsWithRF
        : context.journey.flight.emissions)
    : 0;

  const transportEmissions = context.journey.transport.reduce(
    (sum, t) => sum + t.emissions,
    0
  );

  const emissionsReduced = 
    (context.journey.flight?.safContribution?.emissionsReduced || 0) +
    (context.journey.flight?.offsetPurchase
      ? context.journey.flight.offsetPurchase.tonnesOffset * 1000
      : 0) +
    context.journey.dining.reduce(
      (sum, d) => sum + (d.emissionsReduced || 0),
      0
    );

  // Points breakdown
  const pointsByCategory = {
    flight: context.journey.flight?.safContribution
      ? Math.round(context.journey.flight.safContribution.amount * 10)
      : 0,
    transport: context.journey.transport.reduce((sum, t) => sum + t.ecoPointsEarned, 0),
    shopping: context.journey.shopping.reduce((sum, s) => sum + s.ecoPointsEarned, 0),
    dining: context.journey.dining.reduce((sum, d) => sum + d.ecoPointsEarned, 0),
    circularity: context.journey.circularity.reduce((sum, c) => sum + c.ecoPointsEarned, 0),
  };

  return {
    // State
    journey: context.journey,
    
    // Computed emissions
    totalEmissions,
    netEmissions,
    flightEmissions,
    transportEmissions,
    emissionsReduced,
    
    // Computed points
    totalEcoPoints,
    pointsByCategory,
    
    // Waste
    totalWasteDiverted,
    
    // Methods
    setFlight: context.setFlight,
    addSAFContribution: context.addSAFContribution,
    addOffsetPurchase: context.addOffsetPurchase,
    toggleRF: context.toggleRF,
    addTransport: context.addTransport,
    addTransaction: context.addTransaction,
    addDiningTransaction: context.addDiningTransaction,
    addCircularityAction: context.addCircularityAction,
    resetJourney: context.resetJourney,
  };
}

