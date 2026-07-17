'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useUserStore } from '@/store/useUserStore';
import { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setProfile, clearProfile, setAuthInitialized, isAuthInitialized } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          // Prevent infinite hang when Firestore is offline
          const docSnap = await Promise.race([
            getDoc(docRef),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
          ]);
          
          if (docSnap && docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            console.warn("User authenticated but no Firestore profile found.");
            clearProfile();
          }
        } catch (error) {
          console.warn("Failed to fetch user profile - falling back to local state:", error);
          // Fallback to allow UI testing even if Firestore is offline
          setProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Offline User',
            onboardingCompleted: false,
            createdAt: new Date(),
          });
        }
      } else {
        clearProfile();
      }
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, [setProfile, clearProfile, setAuthInitialized]);

  // Don't render the app shell until auth state is known to prevent flickering redirects
  if (!isAuthInitialized) {
    return (
      <div className="w-full min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
