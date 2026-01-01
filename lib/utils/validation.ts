/**
 * Input Validation Utilities
 * Runtime validation for API inputs
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */
export const validationSchemas = {
  userId: z.string().min(1, 'User ID is required'),
  
  routeId: z.string().min(1, 'Route ID is required'),
  
  emissions: z.number().min(0, 'Emissions must be non-negative'),
  
  amount: z.number().min(0, 'Amount must be non-negative'),
  
  safPercentage: z.number().min(0).max(100, 'SAF percentage must be between 0 and 100'),
  
  chatMessage: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  
  period: z.enum(['today', 'week', 'month']),
  
  view: z.enum(['overview', 'saf', 'circularity']),
} as const;

/**
 * Chat API request schema
 */
export const chatRequestSchema = z.object({
  message: validationSchemas.chatMessage,
  journeyContext: z.object({
    flight: z.object({
      origin: z.string().optional(),
      destination: z.string().optional(),
      emissions: z.number().min(0),
      emissionsWithRF: z.number().min(0).optional(),
      includeRF: z.boolean(),
      safContribution: z.object({
        amount: z.number().min(0),
        liters: z.number().min(0),
        emissionsReduced: z.number().min(0),
      }).optional(),
      offsetPurchase: z.object({
        amount: z.number().min(0),
        tonnesOffset: z.number().min(0),
      }).optional(),
    }).optional(),
    transport: z.array(z.object({
      mode: z.string(),
      emissions: z.number().min(0),
      ecoPointsEarned: z.number().min(0),
    })).default([]),
    shopping: z.array(z.object({
      merchantName: z.string(),
      amount: z.number().min(0),
      isGreenMerchant: z.boolean(),
      ecoPointsEarned: z.number().min(0),
    })).default([]),
    dining: z.array(z.object({
      restaurantName: z.string(),
      amount: z.number().min(0),
      isPlantBased: z.boolean(),
      emissionsReduced: z.number().min(0).optional(),
      ecoPointsEarned: z.number().min(0),
    })).default([]),
    circularity: z.array(z.object({
      actionName: z.string(),
      wasteDiverted: z.number().min(0),
      ecoPointsEarned: z.number().min(0),
    })).default([]),
    totalEcoPointsEarned: z.number().min(0),
    totalEmissions: z.number().min(0),
    netEmissions: z.number().min(0),
    totalWasteDiverted: z.number().min(0),
  }),
  greenTierContext: z.object({
    currentTier: z.object({
      id: z.string(),
      name: z.string(),
      level: z.number().min(1),
      points_multiplier: z.number().min(1),
    }),
    totalEcoPoints: z.number().min(0),
    lifetimeEcoPoints: z.number().min(0),
    pointsToNextTier: z.number().min(0).nullable(),
    progressPercent: z.number().min(0).max(100),
  }),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
});

/**
 * Calculate API request schema
 */
export const calculateRequestSchema = z.object({
  type: z.enum(['flight', 'transport', 'spending']),
  routeId: validationSchemas.routeId,
  passengers: z.number().int().min(1).optional().default(1),
  cabinClass: z.enum(['economy', 'business', 'first']).optional().default('economy'),
  includeRadiativeForcing: z.boolean().optional().default(true),
  userId: validationSchemas.userId.optional(),
});

/**
 * SAF contribution request schema
 */
export const safContributionRequestSchema = z.object({
  routeId: validationSchemas.routeId,
  emissionsKg: validationSchemas.emissions,
  contributionAmount: validationSchemas.amount,
  safType: z.enum(['waste_based', 'imported']).optional(),
  provider: z.enum(['neste_singapore', 'shell_saf']).optional(),
  userId: validationSchemas.userId,
});

/**
 * Eco-points request schema
 */
export const ecoPointsRequestSchema = z.object({
  action: z.enum(['earn', 'check', 'history']),
  userId: validationSchemas.userId,
  actionType: z.string().optional(),
  actionId: z.string().optional(),
  amount: z.number().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

/**
 * Validate request body against Zod schema
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with either validated data or error details
 * 
 * @example
 * ```typescript
 * const validation = validateRequest(chatRequestSchema, body);
 * if (!validation.success) {
 *   return NextResponse.json(createErrorResponse(validation.error), { status: 400 });
 * }
 * const { data } = validation; // Type-safe validated data
 * ```
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string; details: z.ZodError } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: errorMessage, details: error };
    }
    return { success: false, error: 'Validation failed', details: error as z.ZodError };
  }
}

