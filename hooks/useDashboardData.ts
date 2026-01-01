/**
 * Dashboard Data Hook
 * Provides real-time dashboard data with polling
 */

import { useState, useEffect, useRef } from 'react';

type Period = 'today' | 'week' | 'month';
type View = 'overview' | 'saf' | 'circularity';

interface DashboardData {
  summary: {
    grossEmissions: number;
    safContributed: number;
    safCO2eAvoided: number;
    netEmissions: number;
    offsetRate: number;
    circularityActions: number;
    wasteDiverted: number;
  };
  safProgress: {
    currentPercent: number;
    targetPercent: number;
    litersSinceLastMonth: number;
    forecastFor2026: number;
  };
  circularity: {
    byActionType: Record<string, number>;
    byTerminal: Record<string, number>;
    trend: Array<{ date: string; wasteDiverted: number }>;
  };
  bySource: {
    Flight: number;
    Shopping: number;
    Dining: number;
    Transport: number;
    Operations: number;
  };
  timeSeries: Array<{
    date: string;
    gross: number;
    net: number;
    saf: number;
    offset: number;
  }>;
  topRoutes: Array<{
    route: string;
    emissions: number;
    safCoverage: number;
    passengers: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    timestamp: string;
    userId: string;
    details: Record<string, any>;
    emissions?: number;
    emissionsAvoided?: number;
    wasteDiverted?: number;
    ecoPoints?: number;
    safLiters?: number;
    isNew?: boolean;
  }>;
  lastUpdated: string;
}

interface UseDashboardDataOptions {
  period?: Period;
  view?: View;
  pollInterval?: number; // milliseconds, default 10000 (10 seconds)
  enabled?: boolean; // Enable/disable polling
}

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: string | null;
  newActivitiesCount: number;
  refetch: () => Promise<void>;
}

export function useDashboardData(options: UseDashboardDataOptions = {}): UseDashboardDataReturn {
  const {
    period = 'week',
    view = 'overview',
    pollInterval = 10000,
    enabled = true,
  } = options;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [newActivitiesCount, setNewActivitiesCount] = useState(0);
  
  const lastActivityTimestampRef = useRef<string | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        period,
        view,
        ...(lastActivityTimestampRef.current && {
          lastActivityTimestamp: lastActivityTimestampRef.current,
        }),
      });

      const response = await fetch(`/api/dashboard?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      const newData = result.data as DashboardData;
      
      // Count new activities
      const newCount = newData.recentActivity.filter((a) => a.isNew).length;
      setNewActivitiesCount(newCount);
      
      // Update last activity timestamp
      if (newData.recentActivity.length > 0) {
        lastActivityTimestampRef.current = newData.recentActivity[0].timestamp;
      }
      
      setData(newData);
      setLastUpdated(newData.lastUpdated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [period, view, enabled]);

  // Set up polling
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const poll = () => {
      fetchData();
      
      // Schedule next poll
      pollTimeoutRef.current = setTimeout(poll, pollInterval);
    };

    // Start polling after initial load
    if (!loading && data) {
      pollTimeoutRef.current = setTimeout(poll, pollInterval);
    }

    // Cleanup
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [enabled, pollInterval, loading, data]);

  const refetch = async () => {
    await fetchData();
  };

  return {
    data,
    loading,
    error,
    lastUpdated,
    newActivitiesCount,
    refetch,
  };
}

