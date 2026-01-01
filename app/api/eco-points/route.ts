import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { calculateEcoPoints, calculateTierProgress, getCurrentTier } from '@/lib/rewards/ecoPoints';
import type { ActionType } from '@/lib/rewards/ecoPoints';
import { validateRequest, ecoPointsRequestSchema } from '@/lib/utils/validation';
import { createErrorResponse, createSuccessResponse, handleError, logError, ERROR_CODES } from '@/lib/utils/errors';
import { sessionStorage } from '@/lib/storage/sessionStorage';
import { checkRateLimit, getClientId, RATE_LIMITS } from '@/lib/utils/rateLimiter';

export interface EcoPointsRequest {
  action: 'earn' | 'check' | 'history';
  userId: string;
  // For 'earn' action
  actionType?: ActionType;
  amount?: number;
  actionId?: string;
  tierMultiplier?: number;
  // For 'history' action
  limit?: number;
  offset?: number;
}

export interface EcoPointsResponse {
  success: boolean;
  points?: {
    earned: number;
    total: number;
    tierProgress: {
      currentTier: {
        id: string;
        name: string;
        level: number;
        minPoints: number;
        maxPoints: number | null;
      };
      currentPoints: number;
      progressToNext: {
        nextTier: {
          id: string;
          name: string;
          level: number;
          minPoints: number;
        };
        pointsNeeded: number;
        progressPercent: number;
      } | null;
      pointsUntilNextTier: number | null;
    };
  };
  history?: Array<{
    id: string;
    actionType: string;
    points: number;
    timestamp: string;
    description: string;
  }>;
  error?: string;
}

/**
 * POST /api/eco-points
 * Manage eco-points: earn, check balance, or view history
 * 
 * @param request - Next.js request object with action and user data
 * @returns Eco-points response with balance, tier progress, or history
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request);
    const rateLimit = checkRateLimit(
      `ecopoints:${clientId}`,
      RATE_LIMITS.API_REQUESTS_PER_WINDOW,
      RATE_LIMITS.API_WINDOW_MS
    );
    
    if (!rateLimit.allowed) {
      return NextResponse.json<EcoPointsResponse>(
        {
          ...createErrorResponse(
            `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} seconds.`,
            ERROR_CODES.INTERNAL_ERROR
          ),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '900',
            'X-RateLimit-Limit': RATE_LIMITS.API_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          },
        }
      );
    }
    
    const body = await request.json();

    // Validate request
    const validation = validateRequest(ecoPointsRequestSchema, body);
    if (!validation.success) {
      const zodError: ZodError = validation.details;
      return NextResponse.json<EcoPointsResponse>(
        {
          ...createErrorResponse(
            `Validation failed: ${validation.error}`,
            ERROR_CODES.INVALID_INPUT,
            zodError.issues
          ),
        },
        { status: 400 }
      );
    }

    const validatedBody = validation.data;

    if (validatedBody.action === 'earn') {
      if (!validatedBody.actionType) {
        return NextResponse.json<EcoPointsResponse>(
          {
            ...createErrorResponse(
              'actionType is required for earn action',
              ERROR_CODES.MISSING_PARAMETER
            ),
          },
          { status: 400 }
        );
      }

      const pointsData = sessionStorage.getPointsData(validatedBody.userId);
      const currentTier = getCurrentTier(pointsData.total);

      // Calculate points earned
      const pointsResult = calculateEcoPoints(
        {
          actionType: validatedBody.actionType as ActionType,
          amount: validatedBody.amount,
          actionId: validatedBody.actionId,
          tierMultiplier: currentTier.points_multiplier,
        },
        pointsData.total
      );

      // Add points and history entry
      const historyEntry = {
        id: `points-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        actionType: validatedBody.actionType,
        points: pointsResult.finalPoints,
        timestamp: new Date().toISOString(),
        description: pointsResult.actionDescription,
      };
      
      sessionStorage.addPoints(validatedBody.userId, pointsResult.finalPoints, historyEntry);
      
      const updatedData = sessionStorage.getPointsData(validatedBody.userId);
      const tierProgress = calculateTierProgress(updatedData.total);

      return NextResponse.json<EcoPointsResponse>({
        ...createSuccessResponse(),
        points: {
          earned: pointsResult.finalPoints,
          total: updatedData.total,
          tierProgress,
        },
      });
    }

    if (validatedBody.action === 'check') {
      const pointsData = sessionStorage.getPointsData(validatedBody.userId);
      const tierProgress = calculateTierProgress(pointsData.total);

      return NextResponse.json<EcoPointsResponse>({
        ...createSuccessResponse(),
        points: {
          earned: 0,
          total: pointsData.total,
          tierProgress,
        },
      });
    }

    if (validatedBody.action === 'history') {
      const limit = validatedBody.limit || 50;
      const offset = validatedBody.offset || 0;
      const history = sessionStorage.getPointsHistory(validatedBody.userId, limit, offset);

      return NextResponse.json<EcoPointsResponse>({
        ...createSuccessResponse(),
        history,
      });
    }

    return NextResponse.json<EcoPointsResponse>(
      {
        ...createErrorResponse('Invalid action', ERROR_CODES.INVALID_INPUT),
      },
      { status: 400 }
    );
  } catch (error) {
    logError(error, { endpoint: '/api/eco-points' });
    const errorResponse = handleError(error);
    return NextResponse.json<EcoPointsResponse>(
      {
        ...errorResponse,
        error: `Failed to process Eco-Points request: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
