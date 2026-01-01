/**
 * Eco-Points Calculation Module
 * 
 * Handles Eco-Points calculation for all action types and
 * Green Tier progress tracking.
 */

import greenTiersData from '@/data/greenTiers.json';
import circularityActionsData from '@/data/circularityActions.json';

export type ActionType = 
  | 'saf_contribution'
  | 'carbon_offset'
  | 'waste_reduction'
  | 'sustainable_merchant'
  | 'circularity_action';

export interface EcoPointsInput {
  actionType: ActionType;
  amount?: number; // For monetary actions (USD)
  actionId?: string; // For specific actions like circularity actions
  tierMultiplier?: number; // Optional tier multiplier override
}

export interface EcoPointsResult {
  basePoints: number;
  tierMultiplier: number;
  finalPoints: number;
  actionDescription: string;
  nextTier?: {
    tierName: string;
    pointsNeeded: number;
    progressPercent: number;
  };
}

export interface TierProgress {
  currentTier: {
    id: string;
    name: string;
    level: number;
    minPoints: number;
    maxPoints: number | null;
  };
  currentPoints: number;
  progressToNext: {
    nextTier: {
      id: string;
      name: string;
      level: number;
      minPoints: number;
    };
    pointsNeeded: number;
    progressPercent: number;
  } | null;
  pointsUntilNextTier: number | null;
}

// Points rates (per dollar or per action)
const POINTS_RATES: Record<ActionType, number> = {
  saf_contribution: 10, // 10 points per dollar
  carbon_offset: 5, // 5 points per dollar
  waste_reduction: 0, // Handled by specific actions
  sustainable_merchant: 0.5, // 0.5 points per dollar
  circularity_action: 0 // Handled by specific actions
};

/**
 * Calculate Eco-Points for an action
 * 
 * @param input - Action input parameters
 * @param currentPoints - Current total Eco-Points (for tier multiplier)
 * @returns Eco-Points calculation result
 */
export function calculateEcoPoints(
  input: EcoPointsInput,
  currentPoints: number = 0
): EcoPointsResult {
  // Get current tier for multiplier
  const currentTier = getCurrentTier(currentPoints);
  const tierMultiplier = input.tierMultiplier || currentTier.points_multiplier;

  let basePoints = 0;
  let actionDescription = '';

  switch (input.actionType) {
    case 'saf_contribution':
      if (!input.amount) {
        throw new Error('Amount required for SAF contribution');
      }
      basePoints = input.amount * POINTS_RATES.saf_contribution;
      actionDescription = `SAF contribution: $${input.amount.toFixed(2)}`;
      break;

    case 'carbon_offset':
      if (!input.amount) {
        throw new Error('Amount required for carbon offset');
      }
      basePoints = input.amount * POINTS_RATES.carbon_offset;
      actionDescription = `Carbon offset: $${input.amount.toFixed(2)}`;
      break;

    case 'sustainable_merchant':
      if (!input.amount) {
        throw new Error('Amount required for merchant purchase');
      }
      basePoints = input.amount * POINTS_RATES.sustainable_merchant;
      actionDescription = `Sustainable merchant purchase: $${input.amount.toFixed(2)}`;
      break;

    case 'circularity_action':
      if (!input.actionId) {
        throw new Error('Action ID required for circularity action');
      }
      const action = circularityActionsData.actions.find(a => a.id === input.actionId);
      if (!action) {
        throw new Error(`Circularity action ${input.actionId} not found`);
      }
      basePoints = action.eco_points;
      actionDescription = action.name;
      break;

    case 'waste_reduction':
      // Waste reduction is typically handled through circularity actions
      basePoints = 0;
      actionDescription = 'Waste reduction';
      break;

    default:
      throw new Error(`Unknown action type: ${input.actionType}`);
  }

  const finalPoints = Math.round(basePoints * tierMultiplier);

  // Calculate next tier progress
  const nextTier = getNextTierProgress(currentPoints + finalPoints);

  return {
    basePoints,
    tierMultiplier,
    finalPoints,
    actionDescription,
    nextTier: nextTier ? {
      tierName: nextTier.name,
      pointsNeeded: nextTier.min_eco_points - (currentPoints + finalPoints),
      progressPercent: Math.min(100, ((currentPoints + finalPoints) / nextTier.min_eco_points) * 100)
    } : undefined
  };
}

/**
 * Get current Green Tier based on points
 * 
 * @param points - Current total Eco-Points
 * @returns Current tier information
 */
export function getCurrentTier(points: number) {
  // Sort tiers by level (highest first) to find the first one the user qualifies for
  const sortedTiers = [...greenTiersData.tiers].sort((a, b) => b.level - a.level);
  
  for (const tier of sortedTiers) {
    if (points >= tier.min_eco_points) {
      return tier;
    }
  }

  // Default to Seedling if no tier matches
  return greenTiersData.tiers[0];
}

/**
 * Get next tier progress information
 * 
 * @param points - Current or projected total Eco-Points
 * @returns Next tier information or null if already at highest tier
 */
export function getNextTierProgress(points: number) {
  const currentTier = getCurrentTier(points);
  
  // Find next tier
  const nextTier = greenTiersData.tiers.find(
    tier => tier.level === currentTier.level + 1
  );

  if (!nextTier) {
    return null; // Already at highest tier
  }

  return nextTier;
}

/**
 * Calculate tier progress with detailed information
 * 
 * @param currentPoints - Current total Eco-Points
 * @returns Detailed tier progress information
 */
export function calculateTierProgress(currentPoints: number): TierProgress {
  const currentTier = getCurrentTier(currentPoints);
  const nextTier = getNextTierProgress(currentPoints);

  return {
    currentTier: {
      id: currentTier.id,
      name: currentTier.name,
      level: currentTier.level,
      minPoints: currentTier.min_eco_points,
      maxPoints: currentTier.max_eco_points ?? null
    },
    currentPoints,
    progressToNext: nextTier ? {
      nextTier: {
        id: nextTier.id,
        name: nextTier.name,
        level: nextTier.level,
        minPoints: nextTier.min_eco_points
      },
      pointsNeeded: nextTier.min_eco_points - currentPoints,
      progressPercent: Math.min(100, (currentPoints / nextTier.min_eco_points) * 100)
    } : null,
    pointsUntilNextTier: nextTier ? nextTier.min_eco_points - currentPoints : null
  };
}

/**
 * Get all tier information
 */
export function getAllTiers() {
  return greenTiersData.tiers;
}

/**
 * Get tier by ID
 * 
 * @param tierId - Tier ID
 * @returns Tier information or null if not found
 */
export function getTierById(tierId: string) {
  return greenTiersData.tiers.find(tier => tier.id === tierId) || null;
}

