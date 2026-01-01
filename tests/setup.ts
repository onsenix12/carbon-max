/**
 * Test Setup
 * Basic test configuration and utilities
 * 
 * NOTE: This is a basic test setup structure.
 * For production, add proper test framework (Jest, Vitest, etc.)
 */

/**
 * Test utilities and helpers
 */
export const testUtils = {
  /**
   * Create a mock request object for testing
   */
  createMockRequest: (body: unknown, headers?: Record<string, string>) => {
    return {
      json: async () => body,
      headers: new Headers(headers || {}),
    } as Request;
  },

  /**
   * Create a mock NextRequest for testing
   */
  createMockNextRequest: (body: unknown, searchParams?: Record<string, string>) => {
    const url = new URL('http://localhost:3000/api/test');
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    
    return {
      json: async () => body,
      nextUrl: {
        searchParams: url.searchParams,
      },
      headers: new Headers(),
    } as unknown as Request;
  },

  /**
   * Wait for a specified time (for async testing)
   */
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
};

/**
 * Test data factories
 */
export const testData = {
  /**
   * Create a mock user session
   */
  createMockSession: (overrides?: Partial<import('@/lib/storage/sessionStorage').UserSession>) => {
    return {
      userId: 'test_user_123',
      ...overrides,
    };
  },

  /**
   * Create a mock journey context
   */
  createMockJourneyContext: (overrides?: Partial<import('@/lib/claude/askMax').JourneyContext>) => {
    return {
      transport: [],
      shopping: [],
      dining: [],
      circularity: [],
      totalEcoPointsEarned: 0,
      totalEmissions: 0,
      netEmissions: 0,
      totalWasteDiverted: 0,
      ...overrides,
    };
  },
};

