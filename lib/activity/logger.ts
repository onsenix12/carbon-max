/**
 * Activity Logger
 * Comprehensive activity tracking for operations dashboard
 */

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Activity types
export type ActivityType =
  | 'flight_calculated'
  | 'saf_contributed'
  | 'offset_purchased'
  | 'circularity_action'
  | 'green_shop_visited'
  | 'plant_based_meal'
  | 'transport_mode_selected'
  | 'tier_upgraded'
  | 'badge_earned'
  | 'impact_story_generated';

// Activity schema
export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string;
  userId: string;
  details: {
    // Flight calculated
    routeId?: string;
    origin?: string;
    destination?: string;
    emissions?: number;
    emissionsWithRF?: number;
    cabinClass?: 'economy' | 'business' | 'first';
    aircraftEfficiency?: string;
    
    // SAF contribution
    safProvider?: string;
    safType?: 'waste_based' | 'imported';
    amount?: number;
    liters?: number;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    certificateId?: string;
    
    // Offset purchase
    offsetProvider?: string;
    offsetType?: string;
    tonnesOffset?: number;
    
    // Circularity action
    actionId?: string;
    actionName?: string;
    
    // Green shop
    shopId?: string;
    shopName?: string;
    category?: string;
    amount?: number;
    
    // Plant-based meal
    restaurantId?: string;
    restaurantName?: string;
    mealAmount?: number;
    
    // Transport
    transportMode?: 'mrt' | 'bus' | 'ev_taxi' | 'taxi' | 'grab' | 'private_car';
    distance?: number;
    
    // Tier upgrade
    fromTier?: string;
    toTier?: string;
    tierLevel?: number;
    
    // Badge
    badgeId?: string;
    badgeName?: string;
    badgeIcon?: string;
    
    // Impact story
    storyTitle?: string;
    emissionsReduced?: number;
  };
  emissions?: number; // kg CO2e
  emissionsAvoided?: number; // kg CO2e
  wasteDiverted?: number; // grams
  ecoPoints?: number;
  safLiters?: number;
}

// Storage path (for MVP, using JSON file)
const ACTIVITY_FILE = path.join(process.cwd(), 'data', 'activities.json');
const ACTIVITY_DIR = path.join(process.cwd(), 'data');

// In-memory cache for performance
let activityCache: Activity[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  if (!existsSync(ACTIVITY_DIR)) {
    await mkdir(ACTIVITY_DIR, { recursive: true });
  }
}

/**
 * Load activities from file
 */
async function loadActivities(): Promise<Activity[]> {
  // Check cache first
  const now = Date.now();
  if (activityCache && (now - cacheTimestamp) < CACHE_TTL) {
    return activityCache;
  }

  try {
    await ensureDataDir();
    
    if (!existsSync(ACTIVITY_FILE)) {
      // Initialize empty file
      await writeFile(ACTIVITY_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }

    const content = await readFile(ACTIVITY_FILE, 'utf-8');
    const activities = JSON.parse(content) as Activity[];
    
    // Update cache
    activityCache = activities;
    cacheTimestamp = now;
    
    return activities;
  } catch (error) {
    console.error('Error loading activities:', error);
    return [];
  }
}

/**
 * Save activities to file
 */
async function saveActivities(activities: Activity[]) {
  try {
    await ensureDataDir();
    await writeFile(ACTIVITY_FILE, JSON.stringify(activities, null, 2), 'utf-8');
    
    // Update cache
    activityCache = activities;
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('Error saving activities:', error);
    throw error;
  }
}

/**
 * Log a new activity
 */
export async function logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
  const fullActivity: Activity = {
    ...activity,
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  const activities = await loadActivities();
  activities.push(fullActivity);
  await saveActivities(activities);

  return fullActivity;
}

/**
 * Get activities with filters
 */
export async function getActivities(filters?: {
  userId?: string;
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<Activity[]> {
  let activities = await loadActivities();

  // Apply filters
  if (filters?.userId) {
    activities = activities.filter(a => a.userId === filters.userId);
  }

  if (filters?.type) {
    activities = activities.filter(a => a.type === filters.type);
  }

  if (filters?.startDate) {
    const start = new Date(filters.startDate);
    activities = activities.filter(a => new Date(a.timestamp) >= start);
  }

  if (filters?.endDate) {
    const end = new Date(filters.endDate);
    activities = activities.filter(a => new Date(a.timestamp) <= end);
  }

  // Sort by timestamp (newest first)
  activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Apply limit
  if (filters?.limit) {
    activities = activities.slice(0, filters.limit);
  }

  return activities;
}

/**
 * Get aggregated statistics
 */
export async function getActivityStats(filters?: {
  userId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{
  totalActivities: number;
  totalEmissions: number;
  totalEmissionsAvoided: number;
  totalWasteDiverted: number;
  totalEcoPoints: number;
  totalSAFLiters: number;
  byType: Record<ActivityType, number>;
  byDate: Array<{ date: string; count: number }>;
}> {
  const activities = await getActivities(filters);

  const stats = {
    totalActivities: activities.length,
    totalEmissions: 0,
    totalEmissionsAvoided: 0,
    totalWasteDiverted: 0,
    totalEcoPoints: 0,
    totalSAFLiters: 0,
    byType: {} as Record<ActivityType, number>,
    byDate: [] as Array<{ date: string; count: number }>,
  };

  const dateCounts: Record<string, number> = {};

  activities.forEach(activity => {
    // Sum metrics
    if (activity.emissions) stats.totalEmissions += activity.emissions;
    if (activity.emissionsAvoided) stats.totalEmissionsAvoided += activity.emissionsAvoided;
    if (activity.wasteDiverted) stats.totalWasteDiverted += activity.wasteDiverted;
    if (activity.ecoPoints) stats.totalEcoPoints += activity.ecoPoints;
    if (activity.safLiters) stats.totalSAFLiters += activity.safLiters;

    // Count by type
    stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;

    // Count by date
    const date = new Date(activity.timestamp).toISOString().split('T')[0];
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });

  // Convert date counts to array
  stats.byDate = Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return stats;
}

/**
 * Get recent activity feed (formatted for dashboard)
 */
export async function getActivityFeed(limit: number = 50): Promise<Array<{
  id: string;
  type: ActivityType;
  timestamp: string;
  userId: string;
  description: string;
  icon: string;
  metrics: {
    emissions?: number;
    emissionsAvoided?: number;
    wasteDiverted?: number;
    ecoPoints?: number;
    safLiters?: number;
  };
}>> {
  const activities = await getActivities({ limit });

  return activities.map(activity => {
    let description = '';
    let icon = '📊';

    switch (activity.type) {
      case 'flight_calculated':
        description = `Flight calculated: ${activity.details.origin} → ${activity.details.destination}`;
        icon = '✈️';
        break;
      case 'saf_contributed':
        description = `SAF contribution: ${activity.safLiters?.toFixed(1)}L via ${activity.details.safProvider || 'Neste'}`;
        icon = '🌿';
        break;
      case 'offset_purchased':
        description = `Carbon offset: ${activity.details.tonnesOffset?.toFixed(2)} tonnes`;
        icon = '📋';
        break;
      case 'circularity_action':
        description = `Circularity: ${activity.details.actionName || 'Action logged'}`;
        icon = '♻️';
        break;
      case 'green_shop_visited':
        description = `Green shop: ${activity.details.shopName || 'Shop visited'}`;
        icon = '🛍️';
        break;
      case 'plant_based_meal':
        description = `Plant-based meal: ${activity.details.restaurantName || 'Restaurant'}`;
        icon = '🥗';
        break;
      case 'transport_mode_selected':
        description = `Transport: ${activity.details.transportMode?.toUpperCase() || 'Mode selected'}`;
        icon = '🚇';
        break;
      case 'tier_upgraded':
        description = `Tier upgrade: ${activity.details.fromTier} → ${activity.details.toTier}`;
        icon = '🎉';
        break;
      case 'badge_earned':
        description = `Badge earned: ${activity.details.badgeName || 'Badge'}`;
        icon = activity.details.badgeIcon || '🏆';
        break;
      case 'impact_story_generated':
        description = `Impact story: ${activity.details.storyTitle || 'Story generated'}`;
        icon = '🌟';
        break;
    }

    return {
      id: activity.id,
      type: activity.type,
      timestamp: activity.timestamp,
      userId: activity.userId,
      description,
      icon,
      metrics: {
        emissions: activity.emissions,
        emissionsAvoided: activity.emissionsAvoided,
        wasteDiverted: activity.wasteDiverted,
        ecoPoints: activity.ecoPoints,
        safLiters: activity.safLiters,
      },
    };
  });
}

/**
 * Helper functions for common activity types
 */
export const ActivityLogger = {
  /**
   * Log flight calculation
   */
  async logFlightCalculated(
    userId: string,
    data: {
      routeId: string;
      origin: string;
      destination: string;
      emissions: number;
      emissionsWithRF: number;
      cabinClass: 'economy' | 'business' | 'first';
      aircraftEfficiency?: string;
    }
  ) {
    return logActivity({
      type: 'flight_calculated',
      userId,
      details: {
        routeId: data.routeId,
        origin: data.origin,
        destination: data.destination,
        emissions: data.emissions,
        emissionsWithRF: data.emissionsWithRF,
        cabinClass: data.cabinClass,
        aircraftEfficiency: data.aircraftEfficiency,
      },
      emissions: data.emissionsWithRF || data.emissions,
    });
  },

  /**
   * Log SAF contribution
   */
  async logSAFContributed(
    userId: string,
    data: {
      provider: string;
      safType: 'waste_based' | 'imported';
      amount: number;
      liters: number;
      emissionsAvoided: number;
      verificationStatus: 'pending' | 'verified' | 'rejected';
      certificateId?: string;
      routeId?: string;
    }
  ) {
    return logActivity({
      type: 'saf_contributed',
      userId,
      details: {
        safProvider: data.provider,
        safType: data.safType,
        amount: data.amount,
        liters: data.liters,
        verificationStatus: data.verificationStatus,
        certificateId: data.certificateId,
        routeId: data.routeId,
      },
      emissionsAvoided: data.emissionsAvoided,
      ecoPoints: Math.round(data.amount * 10), // 10 points per dollar
      safLiters: data.liters,
    });
  },

  /**
   * Log offset purchase
   */
  async logOffsetPurchased(
    userId: string,
    data: {
      provider: string;
      offsetType: string;
      amount: number;
      tonnesOffset: number;
    }
  ) {
    return logActivity({
      type: 'offset_purchased',
      userId,
      details: {
        offsetProvider: data.provider,
        offsetType: data.offsetType,
        amount: data.amount,
        tonnesOffset: data.tonnesOffset,
      },
      emissionsAvoided: data.tonnesOffset * 1000, // Convert to kg
      ecoPoints: Math.round(data.amount * 5), // 5 points per dollar
    });
  },

  /**
   * Log circularity action
   */
  async logCircularityAction(
    userId: string,
    data: {
      actionId: string;
      actionName: string;
      wasteDiverted: number;
      ecoPoints: number;
    }
  ) {
    return logActivity({
      type: 'circularity_action',
      userId,
      details: {
        actionId: data.actionId,
        actionName: data.actionName,
      },
      wasteDiverted: data.wasteDiverted,
      ecoPoints: data.ecoPoints,
    });
  },

  /**
   * Log green shop visit
   */
  async logGreenShopVisited(
    userId: string,
    data: {
      shopId: string;
      shopName: string;
      category: string;
      amount: number;
      ecoPoints: number;
    }
  ) {
    return logActivity({
      type: 'green_shop_visited',
      userId,
      details: {
        shopId: data.shopId,
        shopName: data.shopName,
        category: data.category,
        amount: data.amount,
      },
      ecoPoints: data.ecoPoints,
    });
  },

  /**
   * Log plant-based meal
   */
  async logPlantBasedMeal(
    userId: string,
    data: {
      restaurantId: string;
      restaurantName: string;
      amount: number;
      emissionsReduced: number;
      ecoPoints: number;
    }
  ) {
    return logActivity({
      type: 'plant_based_meal',
      userId,
      details: {
        restaurantId: data.restaurantId,
        restaurantName: data.restaurantName,
        mealAmount: data.amount,
        emissionsReduced: data.emissionsReduced,
      },
      emissionsAvoided: data.emissionsReduced,
      ecoPoints: data.ecoPoints,
    });
  },

  /**
   * Log transport mode selection
   */
  async logTransportMode(
    userId: string,
    data: {
      mode: 'mrt' | 'bus' | 'ev_taxi' | 'taxi' | 'grab' | 'private_car';
      distance: number;
      emissions: number;
      ecoPoints: number;
    }
  ) {
    return logActivity({
      type: 'transport_mode_selected',
      userId,
      details: {
        transportMode: data.mode,
        distance: data.distance,
      },
      emissions: data.emissions,
      ecoPoints: data.ecoPoints,
    });
  },

  /**
   * Log tier upgrade
   */
  async logTierUpgrade(
    userId: string,
    data: {
      fromTier: string;
      toTier: string;
      tierLevel: number;
      totalPoints: number;
    }
  ) {
    return logActivity({
      type: 'tier_upgraded',
      userId,
      details: {
        fromTier: data.fromTier,
        toTier: data.toTier,
        tierLevel: data.tierLevel,
      },
      ecoPoints: data.totalPoints,
    });
  },

  /**
   * Log badge earned
   */
  async logBadgeEarned(
    userId: string,
    data: {
      badgeId: string;
      badgeName: string;
      badgeIcon: string;
    }
  ) {
    return logActivity({
      type: 'badge_earned',
      userId,
      details: {
        badgeId: data.badgeId,
        badgeName: data.badgeName,
        badgeIcon: data.badgeIcon,
      },
    });
  },

  /**
   * Log impact story generation
   */
  async logImpactStoryGenerated(
    userId: string,
    data: {
      storyTitle: string;
      emissionsReduced: number;
      totalEcoPoints: number;
    }
  ) {
    return logActivity({
      type: 'impact_story_generated',
      userId,
      details: {
        storyTitle: data.storyTitle,
        emissionsReduced: data.emissionsReduced,
      },
      emissionsAvoided: data.emissionsReduced,
      ecoPoints: data.totalEcoPoints,
    });
  },
};

