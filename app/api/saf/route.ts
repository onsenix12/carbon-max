import { NextRequest, NextResponse } from 'next/server';
import { calculateSAFContribution } from '@/lib/saf/bookAndClaim';
import { ActivityLogger } from '@/lib/activity/logger';
import { validateRequest, safContributionRequestSchema } from '@/lib/utils/validation';
import { createErrorResponse, createSuccessResponse, handleError, logError, ERROR_CODES } from '@/lib/utils/errors';
import { SAF_CONSTANTS, SAF_PERCENTAGE_OPTIONS } from '@/lib/constants';
import { checkRateLimit, getClientId, RATE_LIMITS } from '@/lib/utils/rateLimiter';

export interface SAFContributionRequest {
  userId: string;
  flightId?: string;
  routeId?: string;
  contributionPercent: number; // 25, 50, 75, or 100
  providerId: 'neste_singapore' | 'shell_saf';
  emissionsKg: number;
  safType?: 'waste_based' | 'imported';
}

export interface SAFContributionResponse {
  success: boolean;
  contribution: {
    litersAttributed: number;
    co2eAvoided: number;
    cost: number;
    ecoPointsEarned: number;
    verification: {
      status: 'pending' | 'verified' | 'rejected';
      registry: string;
      certificateId: string;
      timestamp: string;
      provider: string;
    };
    bookAndClaimInfo: {
      explanation: string;
      benefits: string[];
      certification: string[];
    };
  };
  activityLog?: {
    userId: string;
    action: 'saf_contribution';
    timestamp: string;
    amount: number;
    pointsEarned: number;
  };
}

/**
 * POST /api/saf
 * Process SAF contribution
 * 
 * @param request - Next.js request object with SAF contribution details
 * @returns SAF contribution result with verification and eco-points
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientId(request);
    const rateLimit = checkRateLimit(
      `saf:${clientId}`,
      RATE_LIMITS.API_REQUESTS_PER_WINDOW,
      RATE_LIMITS.API_WINDOW_MS
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
            'Retry-After': rateLimit.retryAfter?.toString() || '900',
            'X-RateLimit-Limit': RATE_LIMITS.API_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          },
        }
      );
    }
    
    const body = await request.json();

    // Validate request - Note: safContributionRequestSchema needs to be extended for contributionPercent
    // For now, validate manually
    if (!body.userId || typeof body.userId !== 'string') {
      return NextResponse.json(
        createErrorResponse('userId is required', ERROR_CODES.MISSING_PARAMETER),
        { status: 400 }
      );
    }

    if (!body.emissionsKg || typeof body.emissionsKg !== 'number' || body.emissionsKg <= 0) {
      return NextResponse.json(
        createErrorResponse('Valid emissionsKg is required', ERROR_CODES.INVALID_INPUT),
        { status: 400 }
      );
    }

    const validPercentages = [25, 50, 75, 100];
    if (!body.contributionPercent || !validPercentages.includes(body.contributionPercent)) {
      return NextResponse.json(
        createErrorResponse('contributionPercent must be 25, 50, 75, or 100', ERROR_CODES.INVALID_INPUT),
        { status: 400 }
      );
    }

    // Calculate contribution amount
    const contributionPercentDecimal = body.contributionPercent / 100;
    const emissionsToCover = body.emissionsKg * contributionPercentDecimal;
    const litersNeeded = emissionsToCover / SAF_CONSTANTS.CO2E_REDUCTION_PER_LITER;
    const contributionAmount = litersNeeded * SAF_CONSTANTS.COST_PER_LITER;

    // Calculate SAF contribution
    const safResult = calculateSAFContribution({
      routeId: body.routeId || '',
      emissionsKg: emissionsToCover,
      contributionAmount,
      safType: body.safType || 'waste_based',
      provider: body.providerId,
    });

    // Log activity for dashboard
    await ActivityLogger.logSAFContributed(body.userId, {
      provider: body.providerId,
      safType: body.safType || 'waste_based',
      amount: contributionAmount,
      liters: safResult.litersAttributed,
      emissionsAvoided: safResult.co2eAvoided,
      verificationStatus: safResult.verification.status,
      certificateId: safResult.verification.certificateId,
      routeId: body.routeId,
    });

    const activityLog = {
      userId: body.userId,
      action: 'saf_contribution' as const,
      timestamp: new Date().toISOString(),
      amount: contributionAmount,
      pointsEarned: safResult.ecoPointsEarned,
    };

    // In production, you would:
    // 1. Save the contribution to a database
    // 2. Update user's Eco-Points balance
    // 3. Send verification request to SAF provider

    return NextResponse.json<SAFContributionResponse>({
      ...createSuccessResponse(),
      contribution: {
        ...safResult,
        verification: {
          ...safResult.verification,
          certificateId: safResult.verification.certificateId || `SAF-${Date.now()}`,
        },
      },
      activityLog,
    });
  } catch (error) {
    logError(error, { endpoint: '/api/saf' });
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

// GET endpoint to check SAF contribution status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const certificateId = searchParams.get('certificateId');

  if (!certificateId) {
    return NextResponse.json(
      createErrorResponse('certificateId is required', ERROR_CODES.MISSING_PARAMETER),
      { status: 400 }
    );
  }

  // In production, this would query the database for the contribution
  // For now, return a mock response
  return NextResponse.json({
    certificateId,
    status: 'pending',
    message: 'Verification in progress',
  });
}
