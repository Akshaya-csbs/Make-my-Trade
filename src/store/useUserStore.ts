import { create } from 'zustand';
import { UserProfile } from '@/types';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

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

export const useUserStore = create<UserStoreState>((set, get) => ({
  profile: null,
  isOnboarded: false,
  isAuthInitialized: false,

  setProfile: (profile) => set({ profile, isOnboarded: (profile as any).onboardingCompleted ?? false }),
  clearProfile: () => set({ profile: null, isOnboarded: false }),
  setAuthInitialized: (val) => set({ isAuthInitialized: val }),

  updateProfile: (data) => {
    const state = get();
    if (state.profile && state.profile.uid && state.profile.uid !== 'user_mock_123') {
      const userRef = doc(db, 'users', state.profile.uid);
      updateDoc(userRef, data).catch(err => console.error(err));
    }
    set((s) => ({
      profile: s.profile ? { ...s.profile, ...data } : null
    }));
  },

  completeOnboarding: (finalData) => {
    const state = get();
    if (state.profile && state.profile.uid && state.profile.uid !== 'user_mock_123') {
      const userRef = doc(db, 'users', state.profile.uid);
      updateDoc(userRef, { ...finalData, onboardingCompleted: true }).catch(err => console.error(err));
    }
    set((s) => ({
      profile: s.profile ? { ...s.profile, ...finalData } : null,
      isOnboarded: true,
    }));
  }
}));
