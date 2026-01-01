/**
 * Activity API Route
 * Handles activity logging and retrieval for operations dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  logActivity, 
  getActivities, 
  getActivityStats, 
  getActivityFeed,
  ActivityLogger,
  type Activity,
  type ActivityType 
} from '@/lib/activity/logger';

/**
 * POST /api/activity
 * Log a new activity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, details, emissions, emissionsAvoided, wasteDiverted, ecoPoints, safLiters } = body;

    // Validate required fields
    if (!type || !userId) {
      return NextResponse.json(
        { error: 'Type and userId are required' },
        { status: 400 }
      );
    }

    // Use helper function if available, otherwise use generic logActivity
    let activity: Activity;

    switch (type as ActivityType) {
      case 'flight_calculated':
        if (!details?.routeId || !details?.origin || !details?.destination) {
          return NextResponse.json(
            { error: 'Missing required fields for flight_calculated' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logFlightCalculated(userId, {
          routeId: details.routeId,
          origin: details.origin,
          destination: details.destination,
          emissions: details.emissions || emissions || 0,
          emissionsWithRF: details.emissionsWithRF || emissions || 0,
          cabinClass: details.cabinClass || 'economy',
          aircraftEfficiency: details.aircraftEfficiency,
        });
        break;

      case 'saf_contributed':
        if (!details?.provider || !details?.amount || !details?.liters) {
          return NextResponse.json(
            { error: 'Missing required fields for saf_contributed' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logSAFContributed(userId, {
          provider: details.provider,
          safType: details.safType || 'waste_based',
          amount: details.amount,
          liters: details.liters,
          emissionsAvoided: emissionsAvoided || details.emissionsAvoided || 0,
          verificationStatus: details.verificationStatus || 'pending',
          certificateId: details.certificateId,
          routeId: details.routeId,
        });
        break;

      case 'offset_purchased':
        if (!details?.provider || !details?.tonnesOffset) {
          return NextResponse.json(
            { error: 'Missing required fields for offset_purchased' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logOffsetPurchased(userId, {
          provider: details.provider,
          offsetType: details.offsetType || 'removal',
          amount: details.amount || 0,
          tonnesOffset: details.tonnesOffset,
        });
        break;

      case 'circularity_action':
        if (!details?.actionId || !details?.actionName) {
          return NextResponse.json(
            { error: 'Missing required fields for circularity_action' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logCircularityAction(userId, {
          actionId: details.actionId,
          actionName: details.actionName,
          wasteDiverted: wasteDiverted || details.wasteDiverted || 0,
          ecoPoints: ecoPoints || details.ecoPoints || 0,
        });
        break;

      case 'green_shop_visited':
        if (!details?.shopId || !details?.shopName) {
          return NextResponse.json(
            { error: 'Missing required fields for green_shop_visited' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logGreenShopVisited(userId, {
          shopId: details.shopId,
          shopName: details.shopName,
          category: details.category || 'unknown',
          amount: details.amount || 0,
          ecoPoints: ecoPoints || details.ecoPoints || 0,
        });
        break;

      case 'plant_based_meal':
        if (!details?.restaurantId || !details?.restaurantName) {
          return NextResponse.json(
            { error: 'Missing required fields for plant_based_meal' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logPlantBasedMeal(userId, {
          restaurantId: details.restaurantId,
          restaurantName: details.restaurantName,
          amount: details.amount || details.mealAmount || 0,
          emissionsReduced: emissionsAvoided || details.emissionsReduced || 0,
          ecoPoints: ecoPoints || details.ecoPoints || 0,
        });
        break;

      case 'transport_mode_selected':
        if (!details?.mode) {
          return NextResponse.json(
            { error: 'Missing required fields for transport_mode_selected' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logTransportMode(userId, {
          mode: details.mode,
          distance: details.distance || 0,
          emissions: emissions || details.emissions || 0,
          ecoPoints: ecoPoints || details.ecoPoints || 0,
        });
        break;

      case 'tier_upgraded':
        if (!details?.fromTier || !details?.toTier) {
          return NextResponse.json(
            { error: 'Missing required fields for tier_upgraded' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logTierUpgrade(userId, {
          fromTier: details.fromTier,
          toTier: details.toTier,
          tierLevel: details.tierLevel || 0,
          totalPoints: ecoPoints || details.totalPoints || 0,
        });
        break;

      case 'badge_earned':
        if (!details?.badgeId || !details?.badgeName) {
          return NextResponse.json(
            { error: 'Missing required fields for badge_earned' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logBadgeEarned(userId, {
          badgeId: details.badgeId,
          badgeName: details.badgeName,
          badgeIcon: details.badgeIcon || '🏆',
        });
        break;

      case 'impact_story_generated':
        if (!details?.storyTitle) {
          return NextResponse.json(
            { error: 'Missing required fields for impact_story_generated' },
            { status: 400 }
          );
        }
        activity = await ActivityLogger.logImpactStoryGenerated(userId, {
          storyTitle: details.storyTitle,
          emissionsReduced: emissionsAvoided || details.emissionsReduced || 0,
          totalEcoPoints: ecoPoints || details.totalEcoPoints || 0,
        });
        break;

      default:
        // Generic activity logging
        activity = await logActivity({
          type: type as ActivityType,
          userId,
          details: details || {},
          emissions,
          emissionsAvoided,
          wasteDiverted,
          ecoPoints,
          safLiters,
        });
    }

    return NextResponse.json({ success: true, activity }, { status: 201 });
  } catch (error) {
    const { logError } = await import('@/lib/utils/errors');
    logError(error, { endpoint: '/api/activity' });
    return NextResponse.json(
      { error: 'Failed to log activity', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/activity
 * Get activities with optional filters
 * Query params:
 * - userId: Filter by user
 * - type: Filter by activity type
 * - startDate: ISO date string
 * - endDate: ISO date string
 * - limit: Number of results (default: 100)
 * - feed: Return formatted feed (true/false)
 * - stats: Return aggregated stats (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const type = searchParams.get('type') as ActivityType | null;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const feed = searchParams.get('feed') === 'true';
    const stats = searchParams.get('stats') === 'true';

    // Return formatted feed
    if (feed) {
      const feedLimit = limit || 50;
      const feedData = await getActivityFeed(feedLimit);
      return NextResponse.json({ success: true, feed: feedData });
    }

    // Return aggregated stats
    if (stats) {
      const statsData = await getActivityStats({
        userId,
        startDate,
        endDate,
      });
      return NextResponse.json({ success: true, stats: statsData });
    }

    // Return raw activities
    const activities = await getActivities({
      userId,
      type: type || undefined,
      startDate,
      endDate,
      limit,
    });

    return NextResponse.json({ success: true, activities, count: activities.length });
  } catch (error) {
    const { logError } = await import('@/lib/utils/errors');
    logError(error, { endpoint: '/api/activity', method: 'GET' });
    return NextResponse.json(
      { error: 'Failed to fetch activities', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

