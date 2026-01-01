/**
 * Proactive Nudges System
 * SAF-first messaging with circularity and tier progress nudges
 * 
 * Features:
 * - Nudge evaluation with priority ranking
 * - Rate limiting (max 1 nudge per 30 min)
 * - Dismissal tracking
 * - Web app and Telegram integration
 */

import greenTiersData from '@/data/greenTiers.json';
import merchantsData from '@/data/merchants.json';
import { SAF_CONSTANTS, OFFSET_CONSTANTS, NUDGE_CONSTANTS, MEAL_TIME_CONSTANTS, SAF_PERCENTAGE_OPTIONS, CIRCULARITY_CONSTANTS } from '@/lib/constants';

// Type definitions for journey context
export interface SAFContribution {
  amount: number;
  liters: number;
  emissionsReduced: number;
  provider?: string;
}

export interface OffsetPurchase {
  amount: number;
  tonnesOffset: number;
}

export interface FlightContext {
  emissions?: number;
  emissionsWithRF?: number;
  safContribution?: SAFContribution;
  offsetPurchase?: OffsetPurchase;
  routeId?: string;
}

export interface TransportItem {
  mode: string;
  emissions: number;
  ecoPointsEarned: number;
}

export interface ShoppingItem {
  merchantName: string;
  amount: number;
  isGreenMerchant: boolean;
  ecoPointsEarned: number;
}

export interface DiningItem {
  restaurantName: string;
  amount: number;
  isPlantBased: boolean;
  emissionsReduced?: number;
  ecoPointsEarned: number;
}

export interface JourneyContext {
  flight?: FlightContext;
  transport?: TransportItem[] | number;
  shopping?: ShoppingItem[] | number;
  dining?: DiningItem[] | number;
  totalEmissions?: number;
  netEmissions?: number;
  totalEcoPointsEarned?: number;
  totalWasteDiverted?: number;
  hasSAF?: boolean;
  hasCircularity?: boolean;
}

export interface Nudge {
  id: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionType?: 'saf' | 'offset' | 'circularity' | 'tier' | 'shop' | 'dining' | 'transport' | 'impact_story';
  actionData?: {
    routeId?: string;
    shopId?: string;
    actionId?: string;
    url?: string;
  };
  actionButton?: {
    text: string;
    action: string;
  };
}

export interface NudgeContext {
  journey?: JourneyContext;
  greenTier?: {
    currentTier?: {
      id: string;
      name: string;
      level: number;
    };
    totalEcoPoints?: number;
    pointsToNextTier?: number;
    progressPercent?: number;
    tierProgress?: {
      progressToNext?: {
        nextTier: {
          name: string;
          minPoints: number;
        };
      };
    };
  };
  location?: {
    terminal?: string;
    nearShop?: string;
    shop?: {
      id: string;
      name: string;
      cup_service_available?: boolean;
    };
  };
  time?: Date;
  lastNudgeTime?: Date;
  dismissedNudges?: string[];
}

// Nudge tracking (in-memory, in production use database)
const nudgeHistory: Map<string, { lastSent: Date; dismissed: Set<string> }> = new Map();

/**
 * Get or create nudge history for user
 */
function getNudgeHistory(userId: string) {
  if (!nudgeHistory.has(userId)) {
    nudgeHistory.set(userId, {
      lastSent: new Date(0),
      dismissed: new Set<string>(),
    });
  }
  return nudgeHistory.get(userId)!;
}

/**
 * Check if nudge should be shown (rate limiting and dismissal)
 */
function shouldShowNudge(userId: string, nudgeId: string, context: NudgeContext): boolean {
  const history = getNudgeHistory(userId);
  
  // Check if dismissed
  if (history.dismissed.has(nudgeId) || context.dismissedNudges?.includes(nudgeId)) {
    return false;
  }
  
  // Rate limiting: max 1 nudge per 30 minutes
  const timeSinceLastNudge = Date.now() - history.lastSent.getTime();
  
  if (timeSinceLastNudge < NUDGE_CONSTANTS.MIN_TIME_BETWEEN_NUDGES_MS) {
    return false;
  }
  
  return true;
}

/**
 * Mark nudge as sent
 */
export function markNudgeSent(userId: string, nudgeId: string) {
  const history = getNudgeHistory(userId);
  history.lastSent = new Date();
}

/**
 * Mark nudge as dismissed
 */
export function markNudgeDismissed(userId: string, nudgeId: string) {
  const history = getNudgeHistory(userId);
  history.dismissed.add(nudgeId);
}

/**
 * Clear dismissed nudges (for testing or reset)
 */
export function clearDismissedNudges(userId: string) {
  const history = getNudgeHistory(userId);
  history.dismissed.clear();
}

/**
 * NUDGE TEMPLATES
 */
export const PROACTIVE_NUDGES = {
  /**
   * Post-flight calculation nudge (SAF-first)
   * Trigger: After flight calculation, no SAF contribution yet
   */
  post_flight_calculation: {
    id: 'post_flight_calculation',
    priority: 'high' as const,
    condition: (context: NudgeContext) => {
      const flight = context.journey?.flight;
      if (!flight || !flight.emissions) return false;
      if (flight.safContribution || flight.offsetPurchase) return false;
      return (flight.emissionsWithRF || flight.emissions || 0) > NUDGE_CONSTANTS.MIN_EMISSIONS_FOR_NUDGE;
    },
    template: (context: NudgeContext): Nudge => {
      const emissions = context.journey!.flight!.emissionsWithRF || context.journey!.flight!.emissions!;
      const saf50Cost = ((emissions * SAF_PERCENTAGE_OPTIONS.FIFTY) / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER) * SAF_CONSTANTS.COST_PER_LITER;
      const offsetCost = (emissions / 1000) * OFFSET_CONSTANTS.COST_PER_TONNE;
      
      return {
        id: 'post_flight_calculation',
        message: `✈️ *Your flight: ${emissions.toLocaleString()} kg CO₂e*\n\n` +
          `Here's how you can take action:\n\n` +
          `🌿 *SAF Contribution: S$${saf50Cost.toFixed(2)}*\n` +
          `Funds sustainable fuel that directly reduces aviation emissions. Singapore mandates this from 2026 — you'd be ahead of the curve.\n\n` +
          `📋 *Carbon Removal: S$${offsetCost.toFixed(2)}*\n` +
          `Funds verified removal projects (not just tree planting).\n\n` +
          `*SAF has more direct impact on aviation.* Which interests you?`,
        priority: 'high',
        actionType: 'saf',
        actionData: {
          routeId: context.journey?.flight?.routeId,
        },
        actionButton: {
          text: '🌿 Contribute to SAF',
          action: 'saf_contribute',
        },
      };
    },
  },

  /**
   * Near cup station nudge (circularity)
   * Trigger: User near coffee shop with cup service
   */
  near_cup_station: {
    id: 'near_cup_station',
    priority: 'medium' as const,
    condition: (context: NudgeContext) => {
      return context.location?.shop?.cup_service_available === true;
    },
    template: (context: NudgeContext): Nudge => {
      const shop = context.location!.shop!;
      
      return {
        id: 'near_cup_station',
        message: `☕ *Hey! ${shop.name} is part of Cup-as-a-Service.*\n\n` +
          `Borrow a reusable cup, enjoy your drink, return it anywhere in the terminal. You'll:\n` +
          `• Divert ${CIRCULARITY_CONSTANTS.WASTE_DIVERTED_PER_CUP}g of plastic from landfill\n` +
          `• Earn ${CIRCULARITY_CONSTANTS.ECO_POINTS_PER_CUP} Eco-Points\n` +
          `• Help Changi hit zero single-use by 2030\n\n` +
          `Interested? Just ask the barista for a "Green Cup"!`,
        priority: 'medium',
        actionType: 'circularity',
        actionData: {
          shopId: shop.id,
          actionId: 'cup_as_a_service',
        },
        actionButton: {
          text: '♻️ Learn More',
          action: 'circularity_info',
        },
      };
    },
  },

  /**
   * Near tier upgrade nudge (gamification)
   * Trigger: User within 100 points of next tier
   */
  near_tier_upgrade: {
    id: 'near_tier_upgrade',
    priority: 'high' as const,
    condition: (context: NudgeContext) => {
      const pointsToNext = context.greenTier?.pointsToNextTier;
      if (!pointsToNext || pointsToNext > NUDGE_CONSTANTS.MAX_POINTS_TO_TIER_FOR_NUDGE) return false;
      return true;
    },
    template: (context: NudgeContext): Nudge => {
      const tier = context.greenTier!;
      const currentPoints = tier.totalEcoPoints || 0;
      const pointsToNext = tier.pointsToNextTier || 0;
      const nextTier = tier.tierProgress?.progressToNext?.nextTier;
      
      if (!nextTier) {
        // Should not happen, but handle gracefully
        return {
          id: 'near_tier_upgrade',
          message: '',
          priority: 'high',
        };
      }
      
      // Get perks from tier data
      const tierData = greenTiersData.tiers.find(t => t.name === nextTier.name);
      const perks = tierData?.perks || ['Exclusive perks', 'Bonus Eco-Points'];
      
      return {
        id: 'near_tier_upgrade',
        message: `🎯 *You're only ${pointsToNext} Eco-Points away from ${nextTier.name} status!*\n\n` +
          `*Unlock these perks:*\n` +
          perks.slice(0, 3).map(p => `• ${p}`).join('\n') + '\n\n' +
          `*Quick ways to earn:*\n` +
          `• SAF contribution (+10 pts per dollar)\n` +
          `• Plant-based meal (+50 pts)\n` +
          `• Cup-as-a-Service (+30 pts)\n\n` +
          `${pointsToNext <= NUDGE_CONSTANTS.VERY_CLOSE_TIER_THRESHOLD ? "You're SO close! 🌟" : "Keep going! 💪"}`,
        priority: 'high',
        actionType: 'tier',
        actionButton: {
          text: '📊 View Progress',
          action: 'tier_progress',
        },
      };
    },
  },

  /**
   * Meal time plant-based nudge (circularity)
   * Trigger: Lunch/dinner time (11-13, 17-19)
   */
  meal_time_plant_based: {
    id: 'meal_time_plant_based',
    priority: 'medium' as const,
    condition: (context: NudgeContext) => {
      if (!context.time) return false;
      const hour = context.time.getHours();
      return [...MEAL_TIME_CONSTANTS.LUNCH_HOURS, ...MEAL_TIME_CONSTANTS.DINNER_HOURS].includes(hour as any);
    },
    template: (context: NudgeContext): Nudge => {
      return {
        id: 'meal_time_plant_based',
        message: `🥗 *Lunch/dinner time! Did you know?*\n\n` +
          `Choosing plant-based saves ~${MEAL_TIME_CONSTANTS.CO2E_SAVED_PER_PLANT_MEAL} kg CO₂e per meal — that's like driving 13 km less.\n\n` +
          `*Today's Green Picks:*\n` +
          `• Salad Stop (T3) — Buddha bowls\n` +
          `• Grain (T2) — Power plates\n` +
          `• PS.Cafe (Jewel) — Plant burgers\n\n` +
          `Each earns you 50 Eco-Points. Hungry?`,
        priority: 'medium',
        actionType: 'dining',
        actionButton: {
          text: '🍽️ Find Restaurants',
          action: 'dining_find',
        },
      };
    },
  },

  /**
   * Pre-trip transport nudge
   * Trigger: Journey start, no transport logged
   */
  pre_trip_transport: {
    id: 'pre_trip_transport',
    priority: 'medium' as const,
    condition: (context: NudgeContext) => {
      // Check if journey just started (has flight but no transport)
      const hasFlight = !!context.journey?.flight;
      // Transport can be an array or undefined
      const transport = context.journey?.transport;
      const hasTransport = Array.isArray(transport) ? transport.length > 0 : false;
      return hasFlight && !hasTransport;
    },
    template: (context: NudgeContext): Nudge => {
      return {
        id: 'pre_trip_transport',
        message: `🚇 *How are you getting to Changi?*\n\n` +
          `*MRT/Bus:* Earn 100 Eco-Points + lowest emissions\n` +
          `*EV Taxi:* Earn 50 Eco-Points + 75% lower than regular taxi\n` +
          `*Regular Taxi/Grab:* No points, but we won't judge 😉\n\n` +
          `*Pro tip:* Green Lane members (Tree tier+) get priority security. MRT can get you there in time!`,
        priority: 'medium',
        actionType: 'transport',
        actionButton: {
          text: '🚇 Log Transport',
          action: 'transport_log',
        },
      };
    },
  },

  /**
   * Journey complete nudge (with impact story offer)
   * Trigger: Journey complete with contributions
   */
  journey_complete: {
    id: 'journey_complete',
    priority: 'high' as const,
    condition: (context: NudgeContext) => {
      const journey = context.journey;
      if (!journey) return false;
      
      // Journey is complete if has flight and at least one contribution
      const hasFlight = !!journey.flight;
      const hasContributions = journey.hasSAF || journey.hasCircularity || (journey.totalEcoPointsEarned || 0) > 0;
      
      return hasFlight && hasContributions;
    },
    template: (context: NudgeContext): Nudge => {
      const journey = context.journey!;
      const flightEmissions = journey.flight?.emissionsWithRF || journey.flight?.emissions || 0;
      const safContribution = journey.flight?.safContribution;
      const safPercent = safContribution 
        ? Math.round((safContribution.emissionsReduced / flightEmissions) * 100)
        : 0;
      
      return {
        id: 'journey_complete',
        message: `🎉 *Journey complete! Here's your carbon receipt:*\n\n` +
          `✈️ Flight: ${flightEmissions.toLocaleString()} kg CO₂e\n` +
          (safContribution 
            ? `🌿 SAF: -${safContribution.emissionsReduced.toFixed(1)} kg (${safPercent}% covered!)\n`
            : '') +
          `🛍️ Shopping: ${(Array.isArray(journey.shopping) ? journey.shopping.length : 0)} transactions\n` +
          `🍽️ Dining: ${(Array.isArray(journey.dining) ? journey.dining.length : 0)} meals\n` +
          `🚇 Transport: ${(Array.isArray(journey.transport) ? journey.transport.length : 0)} trips\n` +
          `♻️ Waste diverted: ${(journey.totalWasteDiverted || 0)}g\n\n` +
          `Want to see your personalized impact story?`,
        priority: 'high',
        actionType: 'impact_story',
        actionButton: {
          text: '🌟 View Impact Story',
          action: 'impact_story',
        },
      };
    },
  },
};

/**
 * Evaluate all nudges and return highest priority applicable one
 */
export function evaluateNudges(context: NudgeContext, userId: string): Nudge | null {
  const applicableNudges: Nudge[] = [];
  
  // Check each nudge
  for (const [key, nudgeDef] of Object.entries(PROACTIVE_NUDGES)) {
    // Check condition
    if (!nudgeDef.condition(context)) continue;
    
    // Check if should show (rate limiting, dismissal)
    if (!shouldShowNudge(userId, nudgeDef.id, context)) continue;
    
    // Generate nudge
    const nudge = nudgeDef.template(context);
    if (nudge.message) {
      applicableNudges.push(nudge);
    }
  }
  
  if (applicableNudges.length === 0) {
    return null;
  }
  
  // Sort by priority (high > medium > low)
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  applicableNudges.sort((a, b) => 
    priorityOrder[b.priority] - priorityOrder[a.priority]
  );
  
  // Return highest priority nudge
  return applicableNudges[0];
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use evaluateNudges(context, userId) instead. This function uses a hardcoded userId which is not thread-safe.
 */
export function checkForNudge(context: NudgeContext): Nudge | null {
  // Use a default userId if not provided
  // WARNING: This is not thread-safe and should only be used for backward compatibility
  // In production, always use evaluateNudges(context, userId) with a proper userId
  const userId = 'default';
  return evaluateNudges(context, userId);
}

/**
 * Get nudge for Telegram (formatted for Telegram)
 */
export interface TelegramInlineKeyboard {
  reply_markup: {
    inline_keyboard: Array<Array<{
      text: string;
      callback_data: string;
    }>>;
  };
}

export function getTelegramNudge(nudge: Nudge): {
  message: string;
  keyboard?: TelegramInlineKeyboard;
} {
  const keyboard: TelegramInlineKeyboard = {
    reply_markup: {
      inline_keyboard: [],
    },
  };
  
  if (nudge.actionButton) {
    const button = nudge.actionButton;
    
    // Map action types to callback data
    let callbackData = '';
    switch (nudge.actionType) {
      case 'saf':
        callbackData = 'nudge_saf';
        break;
      case 'circularity':
        callbackData = `nudge_eco_${nudge.actionData?.actionId || 'info'}`;
        break;
      case 'tier':
        callbackData = 'nudge_tier';
        break;
      case 'dining':
        callbackData = 'nudge_dining';
        break;
      case 'transport':
        callbackData = 'nudge_transport';
        break;
      case 'impact_story':
        callbackData = 'nudge_impact';
        break;
      default:
        callbackData = 'nudge_info';
    }
    
    keyboard.reply_markup.inline_keyboard.push([
      {
        text: button.text,
        callback_data: callbackData,
      },
      {
        text: '❌ Dismiss',
        callback_data: `nudge_dismiss_${nudge.id}`,
      },
    ]);
  } else {
    keyboard.reply_markup.inline_keyboard.push([
      {
        text: '❌ Dismiss',
        callback_data: `nudge_dismiss_${nudge.id}`,
      },
    ]);
  }
  
  return {
    message: nudge.message,
    keyboard: keyboard.reply_markup.inline_keyboard.length > 0 ? keyboard : undefined,
  };
}
