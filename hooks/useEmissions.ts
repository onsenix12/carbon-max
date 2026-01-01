'use client';

import { useState, useCallback } from 'react';
import type { CalculateRequest } from '@/app/api/calculate/route';

export interface FlightEmissionResult {
  type: 'flight';
  result: {
    emissions: number;
    emissionsWithRF: number;
    perPassenger: {
      emissions: number;
      emissionsWithRF: number;
    };
  };
  methodology: {
    formula: string;
    factorsUsed: Array<{
      name: string;
      value: number;
      unit: string;
      source: string;
      citation: string;
      year: number;
    }>;
    sources: Array<{
      name: string;
      citation: string;
      year: number;
    }>;
    calculationMethod: string;
  };
  uncertainty: {
    rangePercent: number;
    min: number;
    max: number;
    explanation: string;
  };
  actions: {
    saf: {
      type: 'saf';
      priority: number;
      description: string;
      cost?: number;
      ecoPointsEarned?: number;
      emissionsReduced?: number;
    };
    offset: {
      type: 'offset';
      priority: number;
      description: string;
      cost?: number;
      ecoPointsEarned?: number;
      emissionsReduced?: number;
    };
  };
  route: {
    id: string;
    origin: string;
    destination: string;
    distanceKm: number;
    aircraftEfficiencyRating: string;
  };
}

interface UseEmissionsReturn {
  calculate: (request: CalculateRequest) => Promise<FlightEmissionResult | null>;
  result: FlightEmissionResult | null;
  loading: boolean;
  error: string | null;
  clearResult: () => void;
}

const CACHE_KEY_PREFIX = 'emissions_calc_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(request: CalculateRequest): string {
  if (request.type === 'flight') {
    return `${CACHE_KEY_PREFIX}flight_${request.routeId}_${request.travelClass}_${request.includeRadiativeForcing}`;
  }
  return `${CACHE_KEY_PREFIX}${request.type}_${JSON.stringify(request)}`;
}

function getCachedResult(key: string): FlightEmissionResult | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function setCachedResult(key: string, result: FlightEmissionResult): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify({
      data: result,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.warn('Failed to cache emission result:', error);
  }
}

export function useEmissions(): UseEmissionsReturn {
  const [result, setResult] = useState<FlightEmissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (request: CalculateRequest): Promise<FlightEmissionResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = getCacheKey(request);
      const cached = getCachedResult(cacheKey);
      if (cached) {
        setResult(cached);
        setLoading(false);
        return cached;
      }

      // Make API call
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate emissions');
      }

      const data = await response.json() as FlightEmissionResult;

      // Cache the result
      setCachedResult(cacheKey, data);
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Emission calculation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    calculate,
    result,
    loading,
    error,
    clearResult,
  };
}

