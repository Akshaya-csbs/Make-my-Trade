'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useUserStore } from '@/store/useUserStore';
import { BrainCircuit, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '@/store/useNavigationStore';
import { Logo } from '@/components/Logo';

const LEARNING_OPTIONS = [
  'Stocks', 'Crypto', 'Digital gold', 'ETF', 'Bonds'
];

const DOMAIN_OPTIONS = [
  'Tech', 'Finance', 'Health', 'Real Estate', 'Consumer', 'Energy'
];

export default function SignupPage() {
  const router = useRouter();
  const { completeOnboarding } = useUserStore();
  
  // Step State
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  
  // Preferences State
  const [learningInterests, setLearningInterests] = useState<string[]>([]);
  const [domainInterest, setDomainInterest] = useState<string>('');
  
  // UI State
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleLearningInterest = (interest: string) => {
    setLearningInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email || !password || !age) {
        setError('Please fill out your personal details.');
        return;
      }
      setError('');
      setStep(2);
    } else {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    if (learningInterests.length === 0 || !domainInterest) {
      setError('Please select your learning interests and domain.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      const extendedProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: name,
        demographics: {
          experienceLevel: 'beginner' as const,
          language: 'en',
          age: Number(age),
          learningInterests,
          domainInterest
        },
        financialLiteracyScore: 0,
        currentCapital: 100000,
        totalPortfolioValue: 100000,
        gamification: { xp: 0, level: 1, streak: 0, badges: [] },
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', user.uid), extendedProfile);
      } catch (dbErr) {
        console.warn("Firestore offline - bypassing for local testing.");
      }
      completeOnboarding({ ...extendedProfile });
      
      useNavigationStore.getState().setActiveView('onboarding');
      router.push('/');
    } catch (err: any) {
      setStep(1); // Go back to step 1 to fix credentials
      if (err.code === 'auth/email-already-in-use') setError('Email is already registered.');
      else if (err.code === 'auth/weak-password') setError('Password must be 6+ characters.');
      else setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Soft Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-6 text-primary">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-[var(--secondary-foreground)] text-sm mt-1">Start your intelligent trading journey</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm text-center border border-red-100"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleNextStep}>
          
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-1">Name</label>
                  <input 
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-1">Age</label>
                  <input 
                    type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || '')} required min="13" max="100"
                    className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-1">Email</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <button type="submit" className="w-full py-3 mt-6 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-2">I want to learn about</label>
                <div className="flex flex-wrap gap-2">
                  {LEARNING_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleLearningInterest(option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        learningInterests.includes(option) 
                          ? 'border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                          : 'border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:border-primary/50 hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-2">My target industry</label>
                <div className="grid grid-cols-3 gap-2">
                  {DOMAIN_OPTIONS.map(domain => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setDomainInterest(domain)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all text-center ${
                        domainInterest === domain 
                          ? 'border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                          : 'border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:border-primary/50 hover:text-white'
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-3 rounded-xl font-semibold text-white bg-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--border)] transition-all">
                  Back
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Signup'}
                </button>
              </div>
            </motion.div>
          )}

        </form>
      </motion.div>
      
      <p className="mt-8 text-[var(--secondary-foreground)] text-sm z-10">
        Already registered? <a href="/login" className="text-primary font-medium hover:underline hover:text-accent">Sign in</a>
      </p>
    </div>
  );
}
