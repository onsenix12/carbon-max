/**
 * Error Handling Utilities
 * Standardized error handling across the application
 */

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

/**
 * Standard error codes
 */
export const ERROR_CODES = {
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  INVALID_INPUT: 'INVALID_INPUT',
  INVALID_ROUTE: 'INVALID_ROUTE',
  CALCULATION_ERROR: 'CALCULATION_ERROR',
  AI_ERROR: 'AI_ERROR',
  TELEGRAM_ERROR: 'TELEGRAM_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/**
 * Create a standardized error response
 * 
 * @param error - Error message to return to client
 * @param code - Optional error code for programmatic handling
 * @param details - Optional additional error details (only in development)
 * @returns Standardized API error response
 * 
 * @example
 * ```typescript
 * return createErrorResponse('Invalid input', ERROR_CODES.INVALID_INPUT);
 * ```
 */
export function createErrorResponse(
  error: string,
  code?: string,
  details?: unknown
): ApiError {
  return {
    success: false,
    error,
    ...(code && { code }),
    ...(details && { details }),
  };
}

/**
 * Create a standardized success response
 * 
 * @param data - Optional data to include in response
 * @returns Standardized API success response
 * 
 * @example
 * ```typescript
 * return createSuccessResponse({ userId: '123', points: 100 });
 * ```
 */
export function createSuccessResponse<T>(data?: T): ApiSuccess<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
  };
}

/**
 * Handle errors consistently and convert to API error response
 * 
 * @param error - Error object (Error instance or unknown)
 * @returns Standardized API error response with appropriate error code
 * 
 * @example
 * ```typescript
 * try {
 *   // some operation
 * } catch (error) {
 *   return handleError(error);
 * }
 * ```
 */
export function handleError(error: unknown): ApiError {
  if (error instanceof Error) {
    return createErrorResponse(
      error.message,
      ERROR_CODES.INTERNAL_ERROR,
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
  }

  return createErrorResponse(
    'An unknown error occurred',
    ERROR_CODES.INTERNAL_ERROR
  );
}

/**
 * Log error with context for debugging and monitoring
 * 
 * @param error - Error object to log
 * @param context - Optional context information (endpoint, userId, etc.)
 * 
 * @remarks
 * In production, this should integrate with a logging service (Winston, Pino, etc.)
 * or error tracking service (Sentry, Rollbar, etc.)
 * 
 * @example
 * ```typescript
 * logError(error, { endpoint: '/api/chat', userId: 'user123' });
 * ```
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // In production, this should use a proper logging service
  console.error('Error:', {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
  });
}

