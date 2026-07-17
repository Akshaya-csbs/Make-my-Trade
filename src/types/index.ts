export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  demographics: {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    language: string;
    age?: number;
    learningInterests?: string[];
    domainInterest?: string;
  };
  financialLiteracyScore: number;
  currentCapital: number;
  totalPortfolioValue: number;
  gamification: {
    xp: number;
    level: number;
    streak: number;
    badges: string[];
  };
};

export type AssetClass = 'Stock' | 'Crypto' | 'Mutual Fund' | 'ETF' | 'Bond' | 'Gold' | 'REIT' | 'FD';

export type AssetHolding = {
  symbol: string;
  quantity: number;
  averagePrice: number;
  assetClass: AssetClass;
};

export type Portfolio = {
  uid: string;
  holdings: AssetHolding[];
  lastUpdated: number;
};

export type TransactionType = 'BUY' | 'SELL';

export type Transaction = {
  transactionId: string;
  uid: string;
  symbol: string;
  type: TransactionType;
  quantity: number;
  price: number;
  timestamp: number;
  context?: {
    marketTrendAtTime?: 'bullish' | 'bearish' | 'neutral';
  };
  aiAnalysis?: {
    emotionDetected?: string;
    feedback?: string;
  };
};

export type BehaviorEvent = {
  eventId: string;
  uid: string;
  eventType: string;
  timestamp: number;
  marketContext?: string;
};
