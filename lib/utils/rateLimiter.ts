/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting for API protection
 * 
 * NOTE: For production, use Redis-based rate limiting (e.g., @upstash/ratelimit)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limit store (for demo only)
// In production, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  /** API requests per window */
  API_REQUESTS_PER_WINDOW: 100,
  /** Window duration in milliseconds (15 minutes) */
  API_WINDOW_MS: 15 * 60 * 1000,
  
  /** Chat requests per window */
  CHAT_REQUESTS_PER_WINDOW: 20,
  /** Chat window duration in milliseconds (1 minute) */
  CHAT_WINDOW_MS: 60 * 1000,
  
  /** Calculate requests per window */
  CALCULATE_REQUESTS_PER_WINDOW: 30,
  /** Calculate window duration in milliseconds (5 minutes) */
  CALCULATE_WINDOW_MS: 5 * 60 * 1000,
} as const;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a given key
 * 
 * @param key - Unique identifier for rate limiting (e.g., userId, IP address)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result with allowed status and remaining requests
 */
export function checkRateLimit(
  key: string,
  limit: number = RATE_LIMITS.API_REQUESTS_PER_WINDOW,
  windowMs: number = RATE_LIMITS.API_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  // If no entry or window expired, create new entry
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newEntry);
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newEntry.resetTime,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request (IP address or userId)
 */
export function getClientId(request: Request): string {
  // Try to get IP from headers (for production with proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Clear rate limit for a key (for testing)
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Clear all rate limits (for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

