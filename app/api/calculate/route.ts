import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { calculateFlightEmissions } from '@/lib/emissions/flightCalculator';
import { ActivityLogger } from '@/lib/activity/logger';
import routesData from '@/data/routes.json';
import { validateRequest, calculateRequestSchema } from '@/lib/utils/validation';
import { createErrorResponse, handleError, logError, ERROR_CODES } from '@/lib/utils/errors';
import { checkRateLimit, getClientId, RATE_LIMITS } from '@/lib/utils/rateLimiter';

export interface CalculateRequest {
  type: 'flight' | 'transport' | 'spending';
  // Flight-specific
  routeId?: string;
  travelClass?: 'economy' | 'business' | 'first';
  includeRadiativeForcing?: boolean;
  passengers?: number;
  userId?: string;
  // Transport-specific (for future)
  transportType?: string;
  distanceKm?: number;
  // Spending-specific (for future)
  amount?: number;
  merchantId?: string;
}

/**
 * POST /api/calculate
 * Calculate flight emissions
 * 
 * @param request - Next.js request object with calculation parameters
 * @returns Flight emission calculation result with methodology and actions
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request);
    const rateLimit = checkRateLimit(
      `calculate:${clientId}`,
      RATE_LIMITS.CALCULATE_REQUESTS_PER_WINDOW,
      RATE_LIMITS.CALCULATE_WINDOW_MS
    );
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        createErrorResponse(
          `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} seconds.`,
          ERROR_CODES.INTERNAL_ERROR
        ),
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '300',
            'X-RateLimit-Limit': RATE_LIMITS.CALCULATE_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          },
        }
      );
    }
    
    const body = await request.json();

    // Validate request
    const validation = validateRequest(calculateRequestSchema, body);
    if (!validation.success) {
      const zodError: ZodError = validation.details;
      return NextResponse.json(
        createErrorResponse(
          `Validation failed: ${validation.error}`,
          ERROR_CODES.INVALID_INPUT,
          zodError.issues
        ),
        { status: 400 }
      );
    }

    const validatedBody = validation.data;

    if (validatedBody.type === 'flight') {

      const result = calculateFlightEmissions({
        routeId: validatedBody.routeId,
        passengers: validatedBody.passengers,
        cabinClass: validatedBody.cabinClass,
      });

      // Log activity (if userId provided)
      const userId = validatedBody.userId;
      if (userId) {
        const route = routesData.routes.find(r => r.id === validatedBody.routeId);
        if (route) {
          await ActivityLogger.logFlightCalculated(userId, {
            routeId: validatedBody.routeId,
            origin: route.origin || 'SIN',
            destination: route.destination,
            emissions: result.result.perPassenger.emissions,
            emissionsWithRF: result.result.perPassenger.emissionsWithRF,
            cabinClass: validatedBody.cabinClass,
            aircraftEfficiency: route.aircraft_efficiency_rating,
          });
        }
      }

      // If radiative forcing is disabled, return CO2-only emissions
      if (validatedBody.includeRadiativeForcing === false) {
        return NextResponse.json({
          type: 'flight',
          result: {
            emissions: result.result.emissions,
            emissionsWithRF: result.result.emissions,
            perPassenger: {
              emissions: result.result.perPassenger.emissions,
              emissionsWithRF: result.result.perPassenger.emissions,
            },
          },
          methodology: result.methodology,
          uncertainty: {
            ...result.uncertainty,
            // Adjust uncertainty for CO2-only (no RF uncertainty)
            rangePercent: result.uncertainty.rangePercent * 0.5, // Rough estimate
            min: result.result.emissions * 0.95,
            max: result.result.emissions * 1.05,
          },
          actions: result.actions,
          route: result.route,
        });
      }

      return NextResponse.json({
        type: 'flight',
        ...result,
      });
    }

    // Future: transport and spending calculations
    if (validatedBody.type === 'transport') {
      return NextResponse.json(
        createErrorResponse(
          'Transport calculations not yet implemented',
          ERROR_CODES.NOT_FOUND
        ),
        { status: 501 }
      );
    }

    if (validatedBody.type === 'spending') {
      return NextResponse.json(
        createErrorResponse(
          'Spending calculations not yet implemented',
          ERROR_CODES.NOT_FOUND
        ),
        { status: 501 }
      );
    }

    return NextResponse.json(
      createErrorResponse(
        'Invalid calculation type',
        ERROR_CODES.INVALID_INPUT
      ),
      { status: 400 }
    );
  } catch (error) {
    logError(error, { endpoint: '/api/calculate' });
    const errorResponse = handleError(error);
    return NextResponse.json(
      {
        ...errorResponse,
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

