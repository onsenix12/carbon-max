'use client';

import { useState, useCallback, useEffect } from 'react';
import { calculateEcoPoints, calculateTierProgress, getCurrentTier } from '@/lib/rewards/ecoPoints';
import type { ActionType } from '@/lib/rewards/ecoPoints';

export interface EcoPointsData {
  total: number;
  tierProgress: ReturnType<typeof calculateTierProgress>;
}

interface UseEcoPointsReturn {
  points: EcoPointsData | null;
  loading: boolean;
  error: string | null;
  earnPoints: (actionType: ActionType, amount?: number, actionId?: string) => Promise<number | null>;
  refresh: () => Promise<void>;
  checkPoints: () => Promise<void>;
}

const STORAGE_KEY = 'eco_points_data';
const USER_ID_KEY = 'user_id';

function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

function getStoredPoints(): EcoPointsData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function setStoredPoints(data: EcoPointsData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to store points:', error);
  }
}

export function useEcoPoints(): UseEcoPointsReturn {
  const [points, setPoints] = useState<EcoPointsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPoints = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = getUserId();
      const response = await fetch('/api/eco-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check',
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check points');
      }

      const data = await response.json();
      if (data.success && data.points) {
        const pointsData: EcoPointsData = {
          total: data.points.total,
          tierProgress: data.points.tierProgress,
        };
        setPoints(pointsData);
        setStoredPoints(pointsData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Check points error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const earnPoints = useCallback(async (
    actionType: ActionType,
    amount?: number,
    actionId?: string
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      const userId = getUserId();
      const currentPoints = points?.total || 0;
      const currentTier = getCurrentTier(currentPoints);

      const response = await fetch('/api/eco-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'earn',
          userId,
          actionType,
          amount,
          actionId,
          tierMultiplier: currentTier.points_multiplier,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to earn points');
      }

      const data = await response.json();
      if (data.success && data.points) {
        const pointsData: EcoPointsData = {
          total: data.points.total,
          tierProgress: data.points.tierProgress,
        };
        setPoints(pointsData);
        setStoredPoints(pointsData);
        return data.points.earned;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Earn points error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [points]);

  const refresh = useCallback(async () => {
    await checkPoints();
  }, [checkPoints]);

  // Load points on mount
  useEffect(() => {
    // Try to load from localStorage first
    const stored = getStoredPoints();
    if (stored) {
      setPoints(stored);
    }

    // Then fetch from API to ensure sync
    checkPoints();
  }, [checkPoints]);

  return {
    points,
    loading,
    error,
    earnPoints,
    refresh,
    checkPoints,
  };
}

