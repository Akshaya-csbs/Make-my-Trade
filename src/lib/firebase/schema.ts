import { UserProfile, Portfolio, Transaction, BehaviorEvent } from '@/types';

/**
 * Firebase Firestore Schema Definitions
 * 
 * Collections & Documents:
 * 
 * 1. `users` Collection
 *    - Document ID: `uid`
 *    - Data Type: `UserProfile`
 *    - Purpose: Stores demographic info, learning progress, global capital, and gamification state.
 * 
 * 2. `portfolios` Collection
 *    - Document ID: `uid`
 *    - Data Type: `Portfolio`
 *    - Purpose: 1-to-1 mapping with users. Stores current asset holdings. 
 *      Separated from `users` to allow fast reads on just user profile vs portfolio data.
 * 
 * 3. `transactions` Collection
 *    - Document ID: Auto-generated ID (`transactionId`)
 *    - Data Type: `Transaction`
 *    - Purpose: Immutable ledger. Heavy writes, optimized for querying by `uid` and `timestamp`.
 *      Used by the AI Coach to analyze trading behavior over time.
 * 
 * 4. `behavior_events` Collection
 *    - Document ID: Auto-generated ID (`eventId`)
 *    - Data Type: `BehaviorEvent`
 *    - Purpose: Logs specific app interactions (e.g. panic app open during market crash, FOMO buying).
 *      Fed into the AI Behavioral Intelligence engine.
 */

// Mock utility functions that would interface with Firebase SDK
export const FirebaseAPI = {
  // --- USERS ---
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    // Mock implementation
    console.log(`Fetching user profile for ${uid}`);
    return null; 
  },
  
  updateUserProfile: async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    console.log(`Updating user ${uid} with data`, data);
  },

  // --- PORTFOLIOS ---
  getPortfolio: async (uid: string): Promise<Portfolio | null> => {
    console.log(`Fetching portfolio for ${uid}`);
    return null;
  },

  updatePortfolio: async (uid: string, data: Partial<Portfolio>): Promise<void> => {
    console.log(`Updating portfolio ${uid} with data`, data);
  },

  // --- TRANSACTIONS ---
  logTransaction: async (transaction: Omit<Transaction, 'transactionId'>): Promise<string> => {
    const mockId = `txn_${Date.now()}`;
    console.log(`Logging transaction ${mockId}`, transaction);
    return mockId;
  },

  getUserTransactions: async (uid: string, limit = 50): Promise<Transaction[]> => {
    console.log(`Fetching last ${limit} transactions for ${uid}`);
    return [];
  },

  // --- BEHAVIOR EVENTS ---
  logBehaviorEvent: async (event: Omit<BehaviorEvent, 'eventId'>): Promise<string> => {
    const mockId = `evt_${Date.now()}`;
    console.log(`Logging behavior event ${mockId}`, event);
    return mockId;
  }
};
