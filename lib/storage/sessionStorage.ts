/**
 * Session Storage Module
 * Centralized in-memory storage for demo purposes
 * 
 * NOTE: This is for demo only. In production, replace with database.
 */

/**
 * User Session Storage
 * Stores user sessions keyed by chatId (Telegram) or userId (web)
 */
export interface UserSession {
  userId: string;
  currentFlight?: {
    routeId: string;
    destination: string;
    destinationCity: string;
    emissionsKg: number;
    emissionsWithRF: number;
    class: 'economy' | 'business' | 'first';
  };
  journey?: {
    totalEmissions: number;
    netEmissions: number;
    totalPoints: number;
    wasteDiverted: number;
    hasSAF: boolean;
    hasCircularity: boolean;
  };
  safContribution?: {
    percent: number;
    amount: number;
    liters: number;
    co2eAvoided: number;
    pending: boolean;
  };
  conversationState?: 'awaiting_destination' | 'awaiting_class' | 'awaiting_saf_confirm';
}

/**
 * Eco-Points Storage
 */
export interface PointsHistoryEntry {
  id: string;
  actionType: string;
  points: number;
  timestamp: string;
  description: string;
}

export interface UserPointsData {
  total: number;
  history: PointsHistoryEntry[];
}

/**
 * Session Storage Manager
 * 
 * @remarks
 * This is an in-memory storage implementation for demo purposes.
 * In production, replace with a database (PostgreSQL, MongoDB, etc.)
 * or use Redis for session management.
 */
class SessionStorage {
  private sessions: Map<string, UserSession> = new Map();
  private pointsData: Map<string, UserPointsData> = new Map();

  /**
   * Get or create user session
   * 
   * @param key - Session key (chatId for Telegram, userId for web)
   * @returns User session object
   */
  getSession(key: string): UserSession {
    if (!this.sessions.has(key)) {
      this.sessions.set(key, {
        userId: key,
      });
    }
    return this.sessions.get(key)!;
  }

  /**
   * Set user session
   * 
   * @param key - Session key
   * @param session - Session data to store
   */
  setSession(key: string, session: UserSession): void {
    this.sessions.set(key, session);
  }

  /**
   * Delete user session
   * 
   * @param key - Session key to delete
   * @returns True if session was deleted, false if it didn't exist
   */
  deleteSession(key: string): boolean {
    return this.sessions.delete(key);
  }

  /**
   * Get user points data
   * 
   * @param userId - User ID
   * @returns User points data with total and history
   */
  getPointsData(userId: string): UserPointsData {
    if (!this.pointsData.has(userId)) {
      this.pointsData.set(userId, {
        total: 0,
        history: [],
      });
    }
    return this.pointsData.get(userId)!;
  }

  /**
   * Set user points data
   * 
   * @param userId - User ID
   * @param data - Points data to store
   */
  setPointsData(userId: string, data: UserPointsData): void {
    this.pointsData.set(userId, data);
  }

  /**
   * Add points to user and update history
   * 
   * @param userId - User ID
   * @param points - Points to add
   * @param historyEntry - History entry to add
   */
  addPoints(userId: string, points: number, historyEntry: PointsHistoryEntry): void {
    const data = this.getPointsData(userId);
    data.total += points;
    data.history.unshift(historyEntry);
    // Keep only last 1000 entries to prevent memory issues
    if (data.history.length > 1000) {
      data.history = data.history.slice(0, 1000);
    }
    this.setPointsData(userId, data);
  }

  /**
   * Get points history with pagination
   * 
   * @param userId - User ID
   * @param limit - Maximum number of entries to return (default: 50)
   * @param offset - Number of entries to skip (default: 0)
   * @returns Array of history entries
   */
  getPointsHistory(userId: string, limit: number = 50, offset: number = 0): PointsHistoryEntry[] {
    const data = this.getPointsData(userId);
    return data.history.slice(offset, offset + limit);
  }

  /**
   * Clear all data (for testing)
   */
  clearAll(): void {
    this.sessions.clear();
    this.pointsData.clear();
  }

  /**
   * Get all session keys (for debugging)
   * 
   * @returns Array of all session keys
   */
  getAllSessionKeys(): string[] {
    return Array.from(this.sessions.keys());
  }

  /**
   * Get all user IDs with points (for debugging)
   * 
   * @returns Array of all user IDs
   */
  getAllUserIds(): string[] {
    return Array.from(this.pointsData.keys());
  }
}

// Export singleton instance
export const sessionStorage = new SessionStorage();
