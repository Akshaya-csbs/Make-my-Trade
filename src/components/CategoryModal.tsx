'use client';

import { X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '@/store/useTradingStore';

export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeHorizon: string;
  benchmarkSymbol: string;
  icon?: any;
  color?: string;
  subtitle?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryInfo | null;
  onSimulate: (categoryId: string) => void;
}

export function CategoryModal({ isOpen, onClose, category, onSimulate }: CategoryModalProps) {
  const { marketData } = useTradingStore();

  if (!category) return null;

  const benchmarkData = marketData[category.benchmarkSymbol];
  const isPositive = benchmarkData && benchmarkData.change24h >= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)] max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)] bg-secondary/30 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {category.name}
                </h2>
                <div className="flex gap-3 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${category.riskLevel === 'Low' ? 'border-success text-success bg-success/10' : category.riskLevel === 'Medium' ? 'border-warning text-warning bg-warning/10' : 'border-danger text-danger bg-danger/10'}`}>
                    {category.riskLevel} Risk
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full border border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)]">
                    {category.timeHorizon}
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors text-[var(--secondary-foreground)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-2">What is it?</h3>
                <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                  {category.description}
                </p>
              </div>

              {/* Live Data Widget */}
              <div className="bg-[var(--secondary)] rounded-xl p-5 border border-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                
                <h3 className="text-sm font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-4 relative z-10">Live Benchmark Preview</h3>
                
                {benchmarkData ? (
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <div className="text-3xl font-mono font-bold">${benchmarkData.currentPrice.toFixed(2)}</div>
                      <div className="text-sm text-[var(--secondary-foreground)] mt-1">{category.benchmarkSymbol} live price</div>
                    </div>
                    <div className={`flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-lg ${isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      {Math.abs(benchmarkData.change24h).toFixed(2)}%
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse flex space-x-4 relative z-10">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-6 bg-secondary rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-secondary rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="p-6 border-t border-[var(--border)] bg-background/50">
              <button
                onClick={() => onSimulate(category.id)}
                className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2 group"
              >
                Simulate {category.name} Trades
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
