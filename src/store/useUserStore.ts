import { create } from 'zustand';
import { UserProfile } from '@/types';

interface UserStoreState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  isAuthInitialized: boolean;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  setAuthInitialized: (val: boolean) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: (finalData: Partial<UserProfile>) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  uid: 'user_mock_123',
  email: 'trader@example.com',
  displayName: 'Trader Joe',
  demographics: {
    experienceLevel: 'beginner',
    language: 'en',
  },
  financialLiteracyScore: 0,
  currentCapital: 100000,
  totalPortfolioValue: 100000,
  gamification: {
    xp: 0,
    level: 1,
    streak: 0,
    badges: [],
  },
};

export const useUserStore = create<UserStoreState>((set) => ({
  profile: null,
  isOnboarded: false,
  isAuthInitialized: false,

  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null, isOnboarded: false }),
  setAuthInitialized: (val) => set({ isAuthInitialized: val }),

  updateProfile: (data) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...data } : null
  })),

  completeOnboarding: (finalData) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...finalData } : null,
    isOnboarded: true,
  }))
}));
