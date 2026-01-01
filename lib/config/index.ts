/**
 * Configuration Management
 * Centralized configuration with environment variable support
 */

/**
 * Get application base URL from environment or default
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_BASE_URL || 
         process.env.NEXT_PUBLIC_APP_URL || 
         'http://localhost:3000';
}

/**
 * Get web app URLs for different pages
 */
export const AppUrls = {
  /**
   * Get shop page URL
   */
  shop: (): string => `${getBaseUrl()}/shop`,
  
  /**
   * Get calculator page URL
   */
  calculator: (): string => `${getBaseUrl()}/calculator`,
  
  /**
   * Get journey page URL
   */
  journey: (): string => `${getBaseUrl()}/journey`,
  
  /**
   * Get rewards page URL
   */
  rewards: (): string => `${getBaseUrl()}/rewards`,
  
  /**
   * Get dashboard page URL
   */
  dashboard: (): string => `${getBaseUrl()}/dashboard`,
} as const;

