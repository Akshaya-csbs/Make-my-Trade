'use client';

import { useNavigationStore, ViewState } from '@/store/useNavigationStore';
import { useRouter } from 'next/navigation';
import { Home, LineChart, Activity, PieChart, Settings, User, LogOut, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';
import { auth } from '@/lib/firebase/config';
import { Logo } from '@/components/Logo';
import { VirtualBalanceWidget } from '@/components/VirtualBalanceWidget';
import { signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Paper Trading', path: '/trade', icon: LineChart },
  { name: 'Market Trends', path: '/market', icon: Activity },
  { name: 'Portfolio', path: '/portfolio', icon: PieChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { activeView, setActiveView } = useNavigationStore();
  const router = useRouter();
  const { profile, clearProfile } = useUserStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearProfile();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <aside className="w-64 h-screen border-r border-[var(--border)] bg-[#0a0a0f] flex flex-col flex-shrink-0 z-10 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent flex items-center gap-2">
          <Logo className="text-primary w-6 h-6" />
          <span>Mark my Trade</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.path.replace('/', '') || (activeView === 'dashboard' && item.path === '/');
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => setActiveView((item.path === '/' ? 'dashboard' : item.path.replace('/', '')) as ViewState)}
              className="relative group w-full text-left"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'text-primary-foreground font-semibold' : 'text-[var(--secondary-foreground)] hover:text-white hover:bg-primary/10'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </div>
            </button>
          );
        })}

        {['trade', 'portfolio', 'settings'].includes(activeView) ? <VirtualBalanceWidget /> : null}
      </div>
      
      <div className="p-4 border-t border-[var(--border)] flex flex-col gap-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--secondary)] border border-[var(--border)]">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">{profile?.displayName || 'Trader'}</span>
            <span className="text-xs text-[var(--secondary-foreground)]">Level {profile?.gamification?.level || 1}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 p-2 rounded-lg text-[var(--secondary-foreground)] hover:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
