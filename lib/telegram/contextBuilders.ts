/**
 * Context Builders for Telegram Bot
 * Builds context objects for Ask Max and other AI features
 */

import type { JourneyContext, GreenTierContext } from '@/lib/claude/askMax';

export interface TelegramUserSession {
  userId: string;
  currentFlight?: {
    routeId: string;
    destination: string;
    destinationCity: string;
    emissionsKg: number;
    emissionsWithRF: number;
    class: 'economy' | 'business' | 'first';
  };
  journey?: {
    totalEmissions: number;
    netEmissions: number;
    totalPoints: number;
    wasteDiverted: number;
    hasSAF: boolean;
    hasCircularity: boolean;
  };
  safContribution?: {
    percent: number;
    amount: number;
    liters: number;
    co2eAvoided: number;
    pending: boolean;
  };
}

export interface TierInfo {
  tier: {
    id: string;
    name: string;
    level: number;
    points_multiplier: number;
    social_signaling: {
      badge_icon: string;
      color: string;
    };
  };
  points: number;
  progress: {
    progressPercent: number;
    pointsToNextTier: number | null;
    progressToNext?: {
      nextTier: {
        name: string;
        minPoints: number;
      };
    };
  };
}

/**
 * Build JourneyContext from Telegram user session
 * Converts Telegram session data to the format expected by Ask Max
 * 
 * @param session - Telegram user session with flight and journey data
 * @returns JourneyContext object for AI advisor
 */
export function buildJourneyContext(
  session: TelegramUserSession
): JourneyContext {
  return {
    flight: session.currentFlight ? {
      origin: 'SIN',
      destination: session.currentFlight.destination,
      emissions: session.currentFlight.emissionsKg,
      emissionsWithRF: session.currentFlight.emissionsWithRF,
      includeRF: true,
      safContribution: session.safContribution ? {
        amount: session.safContribution.amount,
        liters: session.safContribution.liters,
        emissionsReduced: session.safContribution.co2eAvoided,
      } : undefined,
    } : undefined,
    transport: [],
    shopping: [],
    dining: [],
    circularity: session.journey?.hasCircularity ? [{
      actionName: 'Circularity Action',
      wasteDiverted: session.journey.wasteDiverted,
      ecoPointsEarned: 10,
    }] : [],
    totalEcoPointsEarned: session.journey?.totalPoints || 0,
    totalEmissions: session.currentFlight?.emissionsKg || 0,
    netEmissions: session.currentFlight 
      ? session.currentFlight.emissionsKg - (session.currentFlight.emissionsKg * 0.1)
      : 0,
    totalWasteDiverted: session.journey?.wasteDiverted || 0,
  };
}

/**
 * Build GreenTierContext from tier information
 * Converts tier info to the format expected by Ask Max
 * 
 * @param tierInfo - User's tier information with progress data
 * @returns GreenTierContext object for AI advisor
 */
export function buildGreenTierContext(tierInfo: TierInfo): GreenTierContext {
  return {
    currentTier: {
      id: tierInfo.tier.id,
      name: tierInfo.tier.name,
      level: tierInfo.tier.level,
      points_multiplier: tierInfo.tier.points_multiplier,
    },
    totalEcoPoints: tierInfo.points,
    lifetimeEcoPoints: tierInfo.points,
    pointsToNextTier: tierInfo.progress.pointsToNextTier,
    progressPercent: tierInfo.progress.progressPercent,
  };
}

