'use client';

import { useGreenTierContext } from '@/context/GreenTierContext';
import type { GreenTierContextType } from '@/context/GreenTierContext';

/**
 * Hook to access Green Tier context with tier info, progress, and perks
 * 
 * Provides:
 * - Current tier information
 * - Points and progress tracking
 * - Tier perks and benefits
 * - Methods to add points and check upgrades
 */
export function useGreenTier() {
  const context = useGreenTierContext();

  // Tier info
  const tierInfo = {
    id: context.currentTier.id,
    name: context.currentTier.name,
    level: context.currentTier.level,
    description: context.currentTier.description,
    icon: context.currentTier.social_signaling.badge_icon,
    perks: context.currentTier.perks,
    multiplier: context.tierMultiplier,
  };

  // Progress info
  const progress = {
    currentPoints: context.totalEcoPoints,
    lifetimePoints: context.lifetimeEcoPoints,
    pointsToNextTier: context.pointsToNextTier,
    progressPercent: context.progressPercent,
    tierProgress: context.tierProgress,
  };

  // Next tier info
  const nextTier = context.tierProgress.progressToNext
    ? {
        name: context.tierProgress.progressToNext.nextTier.name,
        level: context.tierProgress.progressToNext.nextTier.level,
        pointsNeeded: context.tierProgress.progressToNext.pointsNeeded,
        progressPercent: context.tierProgress.progressToNext.progressPercent,
        minPoints: context.tierProgress.progressToNext.nextTier.minPoints,
      }
    : null;

  // All tiers for reference
  const allTiers = context.allTiers.map(tier => ({
    id: tier.id,
    name: tier.name,
    level: tier.level,
    minPoints: tier.min_eco_points,
    maxPoints: tier.max_eco_points,
    multiplier: tier.points_multiplier,
    perks: tier.perks,
    icon: tier.social_signaling.badge_icon,
    isCurrent: tier.id === context.currentTier.id,
    isUnlocked: context.totalEcoPoints >= tier.min_eco_points,
  }));

  return {
    // Tier information
    tierInfo,
    allTiers,
    nextTier,
    
    // Progress
    progress,
    
    // Points
    totalEcoPoints: context.totalEcoPoints,
    lifetimeEcoPoints: context.lifetimeEcoPoints,
    tierMultiplier: context.tierMultiplier,
    
    // Methods
    addPoints: context.addPoints,
    checkTierUpgrade: context.checkTierUpgrade,
    getTier: context.getTier,
    
    // Celebration
    showCelebration: context.showCelebration,
    dismissCelebration: context.dismissCelebration,
  };
}

