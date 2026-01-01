/**
 * Dashboard Data API
 * Provides comprehensive dashboard data with real-time capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActivities, getActivityStats, type Activity } from '@/lib/activity/logger';
import routesData from '@/data/routes.json';
import circularityActionsData from '@/data/circularityActions.json';

type Period = 'today' | 'week' | 'month';
type View = 'overview' | 'saf' | 'circularity';

interface DashboardResponse {
  summary: {
    grossEmissions: number; // tCO2e
    safContributed: number; // liters
    safCO2eAvoided: number; // kg
    netEmissions: number; // tCO2e
    offsetRate: number; // percentage
    circularityActions: number;
    wasteDiverted: number; // kg
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
  recentActivity: Array<Activity & { isNew?: boolean }>;
  lastUpdated: string;
}

/**
 * Generate realistic mock data for past period
 */
function generateMockData(period: Period): {
  activities: Activity[];
  timeSeries: DashboardResponse['timeSeries'];
} {
  const activities: Activity[] = [];
  const timeSeries: DashboardResponse['timeSeries'] = [];
  
  const now = new Date();
  const daysBack = period === 'today' ? 1 : period === 'week' ? 7 : 30;
  
  // Generate time series data
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate realistic daily values with positive trend
    const baseGross = 1200 + Math.random() * 200;
    const safReduction = 40 + Math.random() * 20 + (i * 0.5); // Increasing trend
    const offsetReduction = 100 + Math.random() * 30;
    const net = baseGross - safReduction - offsetReduction;
    
    timeSeries.push({
      date: dateStr,
      gross: baseGross,
      net: net,
      saf: safReduction,
      offset: offsetReduction,
    });
    
    // Generate activities for this day
    const activitiesPerDay = Math.floor(Math.random() * 50) + 20;
    
    for (let j = 0; j < activitiesPerDay; j++) {
      const activityTime = new Date(date);
      activityTime.setHours(Math.floor(Math.random() * 24));
      activityTime.setMinutes(Math.floor(Math.random() * 60));
      
      const activityType = Math.random();
      let activity: Activity;
      
      if (activityType < 0.3) {
        // Flight calculated (30%)
        // Safe array access with bounds checking
        if (routesData.routes.length === 0) continue;
        const route = routesData.routes[Math.floor(Math.random() * routesData.routes.length)];
        if (!route) continue;
        activity = {
          id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'flight_calculated',
          timestamp: activityTime.toISOString(),
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          details: {
            routeId: route.id,
            origin: route.origin,
            destination: route.destination,
            emissions: (route.distance_km * 0.1) + Math.random() * 50,
            emissionsWithRF: (route.distance_km * 0.1 * 1.9) + Math.random() * 50,
            cabinClass: (['economy', 'business', 'first'] as const)[Math.floor(Math.random() * 3)],
          },
          emissions: (route.distance_km * 0.1 * 1.9) + Math.random() * 50,
        };
      } else if (activityType < 0.5) {
        // SAF contribution (20%)
        const liters = 10 + Math.random() * 50;
        activity = {
          id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'saf_contributed',
          timestamp: activityTime.toISOString(),
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          details: {
            safProvider: Math.random() > 0.5 ? 'Neste Singapore' : 'Shell SAF',
            safType: Math.random() > 0.7 ? 'imported' : 'waste_based',
            amount: liters * 2.5,
            liters: liters,
            verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
            certificateId: `SAF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
          emissionsAvoided: liters * 2.27,
          ecoPoints: Math.round(liters * 2.5 * 10),
          safLiters: liters,
        };
      } else if (activityType < 0.7) {
        // Circularity action (20%)
        // Safe array access with bounds checking
        if (circularityActionsData.actions.length === 0) continue;
        const action = circularityActionsData.actions[Math.floor(Math.random() * circularityActionsData.actions.length)];
        if (!action) continue;
        activity = {
          id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'circularity_action',
          timestamp: activityTime.toISOString(),
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          details: {
            actionId: action.id,
            actionName: action.name,
          },
          wasteDiverted: action.waste_diverted_grams,
          ecoPoints: action.eco_points,
        };
      } else if (activityType < 0.85) {
        // Offset purchase (15%)
        const tonnes = 0.1 + Math.random() * 0.5;
        activity = {
          id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'offset_purchased',
          timestamp: activityTime.toISOString(),
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          details: {
            offsetProvider: 'Gold Standard',
            offsetType: 'removal',
            amount: tonnes * 15,
            tonnesOffset: tonnes,
          },
          emissionsAvoided: tonnes * 1000,
          ecoPoints: Math.round(tonnes * 15 * 5),
        };
      } else {
        // Other activities (15%)
        activity = {
          id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'green_shop_visited',
          timestamp: activityTime.toISOString(),
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          details: {
            shopId: `shop_${Math.floor(Math.random() * 50)}`,
            shopName: `Green Shop ${Math.floor(Math.random() * 50)}`,
            category: 'retail',
            amount: 20 + Math.random() * 100,
          },
          ecoPoints: Math.floor(Math.random() * 50),
        };
      }
      
      activities.push(activity);
    }
  }
  
  return { activities, timeSeries };
}

/**
 * Calculate date range for period
 */
function getDateRange(period: Period): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  
  let startDate: Date;
  if (period === 'today') {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 1);
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate,
  };
}

/**
 * Aggregate dashboard data from activities
 */
async function aggregateDashboardData(
  period: Period,
  view: View,
  lastActivityTimestamp?: string
): Promise<DashboardResponse> {
  const { startDate, endDate } = getDateRange(period);
  
  // Get real activities
  const realActivities = await getActivities({
    startDate,
    endDate,
  });
  
  // Generate mock data if needed (for demo)
  const { activities: mockActivities, timeSeries: mockTimeSeries } = generateMockData(period);
  
  // Combine real and mock activities (in production, only use real)
  const allActivities = [...realActivities, ...mockActivities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Mark new activities (within last 10 seconds)
  const tenSecondsAgo = new Date(Date.now() - 10000);
  const recentActivity = allActivities.slice(0, 20).map((activity) => ({
    ...activity,
    isNew: new Date(activity.timestamp) > tenSecondsAgo,
  }));
  
  // Calculate summary metrics
  const stats = await getActivityStats({ startDate, endDate });
  
  // Calculate SAF metrics
  const safActivities = allActivities.filter((a) => a.type === 'saf_contributed');
  const totalSAFLiters = safActivities.reduce((sum, a) => sum + (a.safLiters || 0), 0);
  const safCO2eAvoided = safActivities.reduce((sum, a) => sum + (a.emissionsAvoided || 0), 0);
  
  // Calculate emissions
  const totalEmissions = (stats.totalEmissions || 0) / 1000; // Convert to tonnes
  const totalEmissionsAvoided = (stats.totalEmissionsAvoided || 0) / 1000; // Convert to tonnes
  const netEmissions = totalEmissions - totalEmissionsAvoided;
  const offsetRate = totalEmissions > 0 ? (totalEmissionsAvoided / totalEmissions) * 100 : 0;
  
  // Calculate circularity metrics
  const circularityActivities = allActivities.filter((a) => a.type === 'circularity_action');
  const wasteDiverted = (stats.totalWasteDiverted || 0) / 1000; // Convert to kg
  
  // Group by action type
  const byActionType: Record<string, number> = {};
  circularityActivities.forEach((activity) => {
    const actionName = activity.details.actionName || 'Unknown';
    byActionType[actionName] = (byActionType[actionName] || 0) + 1;
  });
  
  // Group by terminal (mock - in production, get from activity details)
  const terminals = ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4', 'Jewel'];
  const byTerminal: Record<string, number> = {};
  terminals.forEach((terminal) => {
    byTerminal[terminal] = Math.floor(Math.random() * 500) + 100;
  });
  
  // Generate trend data
  const trend: Array<{ date: string; wasteDiverted: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toISOString().split('T')[0],
      wasteDiverted: 80 + Math.random() * 30 + (i * 2), // Positive trend
    });
  }
  
  // Calculate SAF progress
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthStart = new Date(new Date().getFullYear(), lastMonth, 1);
  const lastMonthEnd = new Date(new Date().getFullYear(), lastMonth + 1, 0);
  
  const lastMonthActivities = await getActivities({
    startDate: lastMonthStart.toISOString().split('T')[0],
    endDate: lastMonthEnd.toISOString().split('T')[0],
  });
  const lastMonthSAF = lastMonthActivities
    .filter((a) => a.type === 'saf_contributed')
    .reduce((sum, a) => sum + (a.safLiters || 0), 0);
  
  // Mock SAF progress calculation (in production, calculate from actual data)
  const totalFlights = allActivities.filter((a) => a.type === 'flight_calculated').length;
  const flightsWithSAF = safActivities.length;
  const currentPercent = totalFlights > 0 ? (flightsWithSAF / totalFlights) * 0.5 : 0.35; // Mock calculation
  const targetPercent = 1.0; // 2026 mandate
  const litersSinceLastMonth = totalSAFLiters - lastMonthSAF;
  
  // Forecast calculation (simplified)
  const monthsTo2026 = (2026 - new Date().getFullYear()) * 12 - (12 - new Date().getMonth());
  const monthlyGrowth = (currentPercent - 0.25) / 6; // Assume started 6 months ago
  const forecastFor2026 = Math.min(currentPercent + monthlyGrowth * monthsTo2026, targetPercent * 1.2);
  
  // Calculate by source
  const bySource = {
    Flight: totalEmissions * 0.65,
    Shopping: totalEmissions * 0.10,
    Dining: totalEmissions * 0.08,
    Transport: totalEmissions * 0.05,
    Operations: totalEmissions * 0.12,
  };
  
  // Top routes
  const routeCounts: Record<string, { emissions: number; saf: number; passengers: number }> = {};
  allActivities
    .filter((a) => a.type === 'flight_calculated' && a.details.routeId)
    .forEach((activity) => {
      const routeId = activity.details.routeId!;
      if (!routeCounts[routeId]) {
        routeCounts[routeId] = { emissions: 0, saf: 0, passengers: 0 };
      }
      routeCounts[routeId].emissions += activity.emissions || 0;
      routeCounts[routeId].passengers += 1;
    });
  
  // Add SAF coverage
  safActivities.forEach((activity) => {
    const routeId = activity.details.routeId;
    if (routeId && routeCounts[routeId]) {
      routeCounts[routeId].saf += activity.safLiters || 0;
    }
  });
  
  const topRoutes = Object.entries(routeCounts)
    .map(([route, data]) => ({
      route,
      emissions: data.emissions / 1000, // Convert to tonnes
      safCoverage: data.emissions > 0 ? (data.saf / (data.emissions / 0.1)) * 100 : 0, // Simplified
      passengers: data.passengers,
    }))
    .sort((a, b) => b.emissions - a.emissions)
    .slice(0, 10);
  
  return {
    summary: {
      grossEmissions: totalEmissions,
      safContributed: totalSAFLiters,
      safCO2eAvoided: safCO2eAvoided / 1000, // Convert to tonnes
      netEmissions: netEmissions,
      offsetRate,
      circularityActions: circularityActivities.length,
      wasteDiverted,
    },
    safProgress: {
      currentPercent,
      targetPercent,
      litersSinceLastMonth,
      forecastFor2026,
    },
    circularity: {
      byActionType,
      byTerminal,
      trend,
    },
    bySource,
    timeSeries: mockTimeSeries,
    topRoutes,
    recentActivity,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * GET /api/dashboard
 * Get comprehensive dashboard data
 * Query params:
 * - period: 'today' | 'week' | 'month' (default: 'week')
 * - view: 'overview' | 'saf' | 'circularity' (default: 'overview')
 * - lastActivityTimestamp: ISO timestamp to detect new activities
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get('period') || 'week') as Period;
    const view = (searchParams.get('view') || 'overview') as View;
    const lastActivityTimestamp = searchParams.get('lastActivityTimestamp') || undefined;
    
    // Validate period
    if (!['today', 'week', 'month'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be: today, week, or month' },
        { status: 400 }
      );
    }
    
    // Validate view
    if (!['overview', 'saf', 'circularity'].includes(view)) {
      return NextResponse.json(
        { error: 'Invalid view. Must be: overview, saf, or circularity' },
        { status: 400 }
      );
    }
    
    const data = await aggregateDashboardData(period, view, lastActivityTimestamp);
    
    return NextResponse.json({
      success: true,
      period,
      view,
      data,
    });
  } catch (error) {
    const { logError } = await import('@/lib/utils/errors');
    logError(error, { endpoint: '/api/dashboard', period, view });
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

