'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { BrainCircuit, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useNavigationStore } from '@/store/useNavigationStore';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      useNavigationStore.getState().setActiveView('dashboard');
      router.push('/');
    } catch (err: any) {
      console.warn("Login error:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Failed to log in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Soft Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]"></div>
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-[var(--secondary-foreground)] text-sm mt-1">Log in to continue your trading journey</p>
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

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button type="submit" disabled={isLoading} className="w-full py-3 mt-6 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </motion.div>
      
      <p className="mt-8 text-[var(--secondary-foreground)] text-sm z-10">
        Don't have an account? <Link href="/signup" className="text-primary font-medium hover:underline hover:text-accent">Sign up</Link>
      </p>
    </div>
  );
}
