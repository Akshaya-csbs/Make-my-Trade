'use client';

import { Bell, Search, Menu, Home, LineChart, Activity, PieChart, Settings, X, BrainCircuit } from 'lucide-react';
import { useTradingStore } from '@/store/useTradingStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore, ViewState } from '@/store/useNavigationStore';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Paper Trading', path: '/trade', icon: LineChart },
  { name: 'Market Trends', path: '/market', icon: Activity },
  { name: 'Portfolio', path: '/portfolio', icon: PieChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function TopNav() {
  const { currentCapital, totalPortfolioValue } = useTradingStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeView, setActiveView } = useNavigationStore();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <header className="h-16 border-b border-[var(--border)] glass flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-[var(--secondary-foreground)] hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-foreground)]" />
          <input 
            type="text" 
            placeholder="Search assets, concepts..." 
            className="bg-[var(--secondary)] border border-[var(--border)] rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary w-64 text-white placeholder-[var(--secondary-foreground)] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-[var(--secondary-foreground)] text-xs">Buying Power</span>
            <span className="font-mono font-medium text-success">{formatCurrency(currentCapital)}</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col items-end">
            <span className="text-[var(--secondary-foreground)] text-xs">Portfolio Value</span>
            <span className="font-mono font-semibold text-white">{formatCurrency(totalPortfolioValue)}</span>
          </div>
        </div>
        
        <button className="relative text-[var(--secondary-foreground)] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-[var(--background)]" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] shadow-2xl md:hidden flex flex-col py-2 z-50"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.path.replace('/', '') || (activeView === 'dashboard' && item.path === '/');
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setActiveView((item.path === '/' ? 'dashboard' : item.path.replace('/', '')) as ViewState);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors text-left w-full ${
                    isActive 
                      ? 'bg-primary/10 text-primary-foreground font-semibold border-l-2 border-primary' 
                      : 'text-[var(--secondary-foreground)] hover:bg-[var(--secondary)] hover:text-white border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
