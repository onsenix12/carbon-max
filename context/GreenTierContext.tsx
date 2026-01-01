'use client';

import { createContext, useContext, ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { getCurrentTier, calculateTierProgress, getAllTiers, getTierById } from '@/lib/rewards/ecoPoints';
import greenTiersData from '@/data/greenTiers.json';

export interface GreenTierState {
  currentTier: ReturnType<typeof getCurrentTier>;
  totalEcoPoints: number;
  lifetimeEcoPoints: number;
  tierMultiplier: number;
  lastTierUpgrade?: {
    fromTier: string;
    toTier: string;
    timestamp: string;
  };
}

export interface GreenTierContextType {
  // State
  currentTier: ReturnType<typeof getCurrentTier>;
  totalEcoPoints: number;
  lifetimeEcoPoints: number;
  tierMultiplier: number;
  allTiers: ReturnType<typeof getAllTiers>;
  
  // Progress
  tierProgress: ReturnType<typeof calculateTierProgress>;
  pointsToNextTier: number | null;
  progressPercent: number;
  
  // Methods
  addPoints: (points: number) => void;
  checkTierUpgrade: () => boolean; // Returns true if tier upgraded
  getTier: (tierId: string) => ReturnType<typeof getTierById>;
  
  // Celebration
  showCelebration: boolean;
  dismissCelebration: () => void;
}

const GreenTierContext = createContext<GreenTierContextType | undefined>(undefined);

const STORAGE_KEY = 'green_tier_state';

// Demo data for presentation
const DEMO_STATE: GreenTierState = {
  currentTier: getCurrentTier(498),
  totalEcoPoints: 498,
  lifetimeEcoPoints: 498,
  tierMultiplier: 1.0,
};

function loadState(): GreenTierState {
  if (typeof window === 'undefined') return DEMO_STATE;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEMO_STATE;
    const parsed = JSON.parse(stored);
    
    // Ensure we have valid tier data
    const points = parsed.totalEcoPoints || 0;
    return {
      currentTier: getCurrentTier(points),
      totalEcoPoints: points,
      lifetimeEcoPoints: parsed.lifetimeEcoPoints || points,
      tierMultiplier: getCurrentTier(points).points_multiplier,
      lastTierUpgrade: parsed.lastTierUpgrade,
    };
  } catch {
    return DEMO_STATE;
  }
}

function saveState(state: GreenTierState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save tier state:', error);
  }
}

export function GreenTierProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GreenTierState>(loadState());
  const [showCelebration, setShowCelebration] = useState(false);
  const previousTierRef = useRef<string>(state.currentTier.id);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Update tier when points change
  useEffect(() => {
    const newTier = getCurrentTier(state.totalEcoPoints);
    const newMultiplier = newTier.points_multiplier;
    
    setState(prev => ({
      ...prev,
      currentTier: newTier,
      tierMultiplier: newMultiplier,
    }));
  }, [state.totalEcoPoints]);

  // Check for tier upgrade
  useEffect(() => {
    if (state.currentTier.id !== previousTierRef.current) {
      // Tier changed - check if it's an upgrade
      const previousTier = getTierById(previousTierRef.current);
      const currentTier = state.currentTier;
      
      if (previousTier && currentTier.level > previousTier.level) {
        // It's an upgrade!
        setState(prev => ({
          ...prev,
          lastTierUpgrade: {
            fromTier: previousTier.name,
            toTier: currentTier.name,
            timestamp: new Date().toISOString(),
          },
        }));
        setShowCelebration(true);
      }
      
      previousTierRef.current = state.currentTier.id;
    }
  }, [state.currentTier.id]);

  const addPoints = useCallback((points: number) => {
    if (points <= 0) return;
    
    setState(prev => {
      const newTotal = prev.totalEcoPoints + points;
      const newLifetime = prev.lifetimeEcoPoints + points;
      
      return {
        ...prev,
        totalEcoPoints: newTotal,
        lifetimeEcoPoints: newLifetime,
      };
    });
  }, []);

  const checkTierUpgrade = useCallback((): boolean => {
    const currentTier = getCurrentTier(state.totalEcoPoints);
    const previousTierId = previousTierRef.current;
    
    if (currentTier.id !== previousTierId) {
      const previousTier = getTierById(previousTierId);
      
      if (previousTier && currentTier.level > previousTier.level) {
        previousTierRef.current = currentTier.id;
        return true;
      }
      
      previousTierRef.current = currentTier.id;
    }
    
    return false;
  }, [state.totalEcoPoints]);

  const getTier = useCallback((tierId: string) => {
    return getTierById(tierId);
  }, []);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const tierProgress = calculateTierProgress(state.totalEcoPoints);
  const pointsToNextTier = tierProgress.pointsUntilNextTier;
  const progressPercent = tierProgress.progressToNext?.progressPercent || 0;

  const value: GreenTierContextType = {
    currentTier: state.currentTier,
    totalEcoPoints: state.totalEcoPoints,
    lifetimeEcoPoints: state.lifetimeEcoPoints,
    tierMultiplier: state.tierMultiplier,
    allTiers: getAllTiers(),
    tierProgress,
    pointsToNextTier,
    progressPercent,
    addPoints,
    checkTierUpgrade,
    getTier,
    showCelebration,
    dismissCelebration,
  };

  return (
    <GreenTierContext.Provider value={value}>
      {children}
    </GreenTierContext.Provider>
  );
}

export function useGreenTierContext(): GreenTierContextType {
  const context = useContext(GreenTierContext);
  if (context === undefined) {
    throw new Error('useGreenTierContext must be used within a GreenTierProvider');
  }
  return context;
}

// Backward compatibility wrapper
// For new code, prefer importing from '@/hooks/useGreenTier' for enhanced tier info
export function useGreenTier() {
  const context = useGreenTierContext();
  
  // Provide enhanced interface with tier info, progress, and perks
  const tierInfo = {
    id: context.currentTier.id,
    name: context.currentTier.name,
    level: context.currentTier.level,
    description: context.currentTier.description,
    icon: context.currentTier.social_signaling.badge_icon,
    perks: context.currentTier.perks,
    multiplier: context.tierMultiplier,
  };

  const progress = {
    currentPoints: context.totalEcoPoints,
    lifetimePoints: context.lifetimeEcoPoints,
    pointsToNextTier: context.pointsToNextTier,
    progressPercent: context.progressPercent,
    tierProgress: context.tierProgress,
  };

  const nextTier = context.tierProgress.progressToNext
    ? {
        name: context.tierProgress.progressToNext.nextTier.name,
        level: context.tierProgress.progressToNext.nextTier.level,
        pointsNeeded: context.tierProgress.progressToNext.pointsNeeded,
        progressPercent: context.tierProgress.progressToNext.progressPercent,
        minPoints: context.tierProgress.progressToNext.nextTier.minPoints,
      }
    : null;

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
    // Enhanced structure (preferred)
    tierInfo,
    allTiers,
    nextTier,
    progress,
    totalEcoPoints: context.totalEcoPoints,
    lifetimeEcoPoints: context.lifetimeEcoPoints,
    tierMultiplier: context.tierMultiplier,
    
    // Backward compatibility
    currentTier: context.currentTier,
    tierProgress: context.tierProgress,
    totalPoints: context.totalEcoPoints,
    pointsUntilNextTier: context.pointsUntilNextTier,
    progressPercent: context.progressPercent,
    allTiers: context.allTiers,
    getTier: context.getTier,
    earnPoints: async (actionType: string, amount?: number, actionId?: string) => {
      // Calculate points based on action type
      // This is a simplified version - full implementation would use the ecoPoints library
      const points = amount ? Math.round(amount * 10) : 10; // Simplified
      context.addPoints(points);
      return points;
    },
    refreshPoints: async () => {
      // No-op for now, points are managed in context
    },
    loading: false,
    error: null,
    
    // New methods
    addPoints: context.addPoints,
    checkTierUpgrade: context.checkTierUpgrade,
    showCelebration: context.showCelebration,
    dismissCelebration: context.dismissCelebration,
  };
}
