'use client';

import { useEffect, useState } from 'react';
import { useTradingStore } from '@/store/useTradingStore';
import { useNavigationStore } from '@/store/useNavigationStore';
import { MarketStreamService } from '@/services/MarketStreamService';
import { 
  LineChart, Monitor, Gem, PieChart, Scroll, Bitcoin, 
  Wallet, ArrowRightLeft, TrendingUp, TrendingDown, Clock, Activity,
  Radio, ChevronDown, Repeat, BarChart2, ShieldCheck,
  Briefcase,
  Landmark,
  Hexagon,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryModal, CategoryInfo } from '@/components/CategoryModal';

const CATEGORIES: CategoryInfo[] = [
  { id: 'stocks', name: 'Stocks', description: 'Ownership shares in publicly traded companies. Offers high growth potential but comes with higher volatility.', riskLevel: 'High', timeHorizon: 'Long-term', benchmarkSymbol: 'AAPL', icon: LineChart, color: 'purple', subtitle: 'Invest in company equity shares' },
  { id: 'etfs', name: 'ETF', description: 'Exchange-Traded Funds hold a basket of assets, offering instant diversification and trading like regular stocks.', riskLevel: 'Medium', timeHorizon: 'Medium to Long-term', benchmarkSymbol: 'SPY', icon: Monitor, color: 'blue', subtitle: 'Exchange Traded Funds' },
  { id: 'gold', name: 'Digital Gold', description: 'Digital representation of physical gold. Acts as a traditional safe-haven asset and hedge against inflation.', riskLevel: 'Low', timeHorizon: 'Long-term', benchmarkSymbol: 'GLD', icon: Gem, color: 'yellow', subtitle: 'Invest in 24K digital gold' },
  { id: 'mutual', name: 'Mutual Funds', description: 'Professionally managed investment pools. Great for hands-off investors looking for diversified growth.', riskLevel: 'Medium', timeHorizon: 'Long-term', benchmarkSymbol: 'MSFT', icon: PieChart, color: 'green', subtitle: 'Professionally managed investment funds' },
  { id: 'bonds', name: 'Bonds', description: 'Fixed-income instruments representing a loan to a borrower. Offers steady interest payments with lower risk.', riskLevel: 'Low', timeHorizon: 'Medium to Long-term', benchmarkSymbol: 'TSLA', icon: Scroll, color: 'orange', subtitle: 'Lend money & earn fixed returns' },
  { id: 'crypto', name: 'Cryptocurrency', description: 'Digital or virtual currencies secured by cryptography. Highly volatile, speculative assets operating 24/7.', riskLevel: 'High', timeHorizon: 'Short to Long-term', benchmarkSymbol: 'BTC-USD', icon: Bitcoin, color: 'pink', subtitle: 'Decentralized digital currencies' },
];

const COLOR_MAP: Record<string, string> = {
  purple: 'text-purple-400 bg-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.4)]',
  blue: 'text-blue-400 bg-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.4)]',
  yellow: 'text-yellow-400 bg-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.4)]',
  green: 'text-emerald-400 bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.4)]',
  orange: 'text-orange-400 bg-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.4)]',
  pink: 'text-pink-400 bg-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.4)]'
};

export function TradeView() {
  const { holdings, marketData, executeTrade } = useTradingStore();
  
  // Grid & Modal State
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<CategoryInfo | null>(null);
  const [activeSimulationCategory, setActiveSimulationCategory] = useState<string | null>(null);

  // Trading Desk State
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [feedback, setFeedback] = useState<{msg: string, success: boolean} | null>(null);
  
  const { tradeParams } = useNavigationStore();

  useEffect(() => {
    MarketStreamService.startStreaming();
    return () => {
      MarketStreamService.stopStreaming();
    };
  }, []);

  useEffect(() => {
    if (tradeParams) {
      setActiveSimulationCategory(tradeParams.category);
      setSelectedAsset(tradeParams.symbol);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [tradeParams]);

  const handleSimulate = (categoryId: string) => {
    setSelectedCategoryModal(null);
    setActiveSimulationCategory(categoryId);
    const cat = CATEGORIES.find(c => c.id === categoryId);
    if (cat) setSelectedAsset(cat.benchmarkSymbol);
    
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleTrade = () => {
    if (!selectedAsset) return;
    const res = executeTrade(selectedAsset, tradeQuantity, tradeType);
    setFeedback({ msg: res.message, success: res.success });
    setTimeout(() => setFeedback(null), 3000);
  };

  const selectedAssetData = selectedAsset ? marketData[selectedAsset] : null;

  return (
    <div className="flex flex-col gap-6 h-full pb-10 text-white max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paper Trading</h1>
          <p className="text-[var(--secondary-foreground)] mt-2">
            Practice trading with virtual money. Learn, explore and grow.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-primary hover:bg-primary/10 transition-colors">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-semibold text-sm">Live Data</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            Simulate <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!activeSimulationCategory ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Grid Section */}
          <div className="bg-[#0a0a0f] rounded-2xl border border-[var(--border)] p-6">
            <h2 className="text-xl font-bold mb-1">Choose an asset class</h2>
            <p className="text-[var(--secondary-foreground)] text-sm mb-8">Select any asset class to explore live data and practice trading.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategoryModal(cat)}
                    className={`cursor-pointer group flex flex-col items-center justify-center p-4 rounded-3xl bg-[#0a0a0f] border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-[#111116] text-center h-56`}
                  >
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity ${(cat.color === 'purple' ? 'bg-purple-500' : cat.color === 'blue' ? 'bg-blue-500' : cat.color === 'yellow' ? 'bg-yellow-500' : cat.color === 'green' ? 'bg-emerald-500' : cat.color === 'orange' ? 'bg-orange-500' : 'bg-pink-500')}`} />
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border border-white/10 relative z-10 transition-all duration-300 ${COLOR_MAP[cat.color as keyof typeof COLOR_MAP]}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-1 group-hover:text-white transition-colors">{cat.name}</h3>
                        <p className="text-xs text-[var(--secondary-foreground)] leading-tight px-2">{cat.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* How it works Section */}
          <div className="bg-[#0a0a0f] rounded-2xl border border-[var(--border)] p-8 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="flex-1 space-y-8">
                <h2 className="text-xl font-bold">How Paper Trading Works</h2>
                <div className="flex items-start gap-6">
                  {/* Step 1 */}
                  <div className="flex flex-col gap-3 flex-1 relative">
                    <div className="w-12 h-12 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-primary z-10 relative">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="absolute top-6 left-12 right-0 h-px bg-gradient-to-r from-[var(--border)] to-transparent z-0 hidden md:block" />
                    <div>
                      <h3 className="font-bold text-sm mb-1">1. Choose Asset</h3>
                      <p className="text-xs text-[var(--secondary-foreground)]">Select an asset class to explore live data.</p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex flex-col gap-3 flex-1 relative">
                    <div className="w-12 h-12 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-white z-10 relative">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div className="absolute top-6 left-12 right-0 h-px bg-gradient-to-r from-[var(--border)] to-transparent z-0 hidden md:block" />
                    <div>
                      <h3 className="font-bold text-sm mb-1">2. Simulate Trades</h3>
                      <p className="text-xs text-[var(--secondary-foreground)]">Buy or sell using virtual money.</p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex flex-col gap-3 flex-1 relative">
                    <div className="w-12 h-12 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-primary z-10 relative">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">3. Track & Improve</h3>
                      <p className="text-xs text-[var(--secondary-foreground)]">Track performance and improve your strategy.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Graphics */}
              <div className="w-64 h-48 relative hidden lg:block opacity-80">
                 {/* CSS Based 3D-ish Illustration matching screenshot */}
                 <div className="absolute right-10 top-4 w-40 h-28 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl transform rotate-6 shadow-2xl p-2 flex flex-col justify-end gap-1">
                    <div className="w-full flex items-end gap-1 h-full px-2">
                       <div className="w-1/5 bg-primary/40 h-[30%] rounded-sm" />
                       <div className="w-1/5 bg-primary/60 h-[50%] rounded-sm" />
                       <div className="w-1/5 bg-primary/80 h-[80%] rounded-sm" />
                       <div className="w-1/5 bg-primary/50 h-[40%] rounded-sm" />
                       <div className="w-1/5 bg-primary h-[90%] rounded-sm" />
                    </div>
                 </div>
                 <div className="absolute right-0 bottom-4 w-24 h-24 bg-blue-600/30 backdrop-blur-xl border border-blue-500/40 rounded-full transform -rotate-12 shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center justify-center">
                    <div className="w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-full" />
                 </div>
                 {/* Sparkles */}
                 <div className="absolute left-0 top-10 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,1)]" />
                 <div className="absolute right-20 -top-2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,1)]" />
              </div>
            </div>
          </div>

          {/* Footer Banner */}
          <div className="bg-[#0a0a0f] rounded-2xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-white mb-0.5">
                100% Virtual <span className="text-[var(--secondary-foreground)] px-2">•</span> Risk-Free <span className="text-[var(--secondary-foreground)] px-2">•</span> Learn & Grow
              </div>
              <div className="text-sm text-[var(--secondary-foreground)]">
                No real money is involved. Perfect for beginners to practice and build confidence.
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Simulation Desk */
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xl:flex-row gap-6 mt-4 pt-4"
        >
          {/* Left Column - Market Overview */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="text-primary" /> Live Order Book & Trends
              </h2>
              <button 
                onClick={() => setActiveSimulationCategory(null)}
                className="text-sm text-[var(--secondary-foreground)] hover:text-white transition-colors underline"
              >
                Back to Assets
              </button>
            </div>
            
            <div className="bg-[#0a0a0f] rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-secondary/30">
                <h3 className="font-semibold text-lg">Live Assets</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  Streaming Live
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[var(--secondary-foreground)] text-sm border-b border-[var(--border)]">
                      <th className="font-medium p-3">Asset</th>
                      <th className="font-medium p-3 hidden md:table-cell">Class</th>
                      <th className="font-medium p-3 text-right">Price</th>
                      <th className="font-medium p-3 text-right">24h Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(marketData).map(([symbol, data]) => {
                      const isPositive = data.change24h >= 0;
                      const isSelected = selectedAsset === symbol;
                      
                      return (
                        <tr 
                          key={symbol} 
                          onClick={() => setSelectedAsset(symbol)}
                          className={`cursor-pointer border-b border-[var(--border)] transition-colors group ${isSelected ? 'bg-primary/10 border-primary/30' : 'hover:bg-[var(--secondary)]/50'}`}
                        >
                          <td className="p-3">
                            <div className="font-semibold flex items-center gap-2">
                              {symbol}
                              {isSelected && <ArrowRightLeft className="w-3 h-3 text-primary ml-1" />}
                            </div>
                          </td>
                          <td className="p-3 text-sm text-[var(--secondary-foreground)] hidden md:table-cell">{data.assetClass}</td>
                          <td className="p-3 text-right font-mono font-medium">
                            ${data.currentPrice.toFixed(2)}
                          </td>
                          <td className="p-3 text-right">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {Math.abs(data.change24h).toFixed(2)}%
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Trade Execution & Portfolio */}
          <div className="w-full xl:w-96 flex flex-col gap-6">
            
            <div className="glass-card rounded-2xl p-5 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <h2 className="font-semibold text-lg mb-4 flex items-center justify-between relative z-10">
                <span>Execute Trade</span>
                {selectedAsset && <span className="bg-secondary px-2 py-1 rounded text-sm text-primary">{selectedAsset}</span>}
              </h2>

              {selectedAssetData ? (
                <div className="relative z-10">
                  <div className="flex bg-background rounded-lg p-1 mb-4 border border-[var(--border)]">
                    <button 
                      onClick={() => setTradeType('BUY')}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tradeType === 'BUY' ? 'bg-success text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      BUY
                    </button>
                    <button 
                      onClick={() => setTradeType('SELL')}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tradeType === 'SELL' ? 'bg-danger text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                      SELL
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[var(--secondary-foreground)] mb-1 block">Quantity</label>
                      <input 
                        type="number" 
                        min="1"
                        value={tradeQuantity}
                        onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg border border-[var(--border)]">
                      <span className="text-sm text-[var(--secondary-foreground)]">Estimated Cost</span>
                      <span className="font-mono font-bold text-lg">
                        ${(selectedAssetData.currentPrice * tradeQuantity).toFixed(2)}
                      </span>
                    </div>

                    <button 
                      onClick={handleTrade}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${tradeType === 'BUY' ? 'bg-success hover:bg-success/90 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-danger hover:bg-danger/90 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                    >
                      Confirm {tradeType}
                    </button>

                    <AnimatePresence>
                      {feedback && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`p-3 text-sm rounded-lg text-center ${feedback.success ? 'bg-success/20 text-success border border-success/30' : 'bg-danger/20 text-danger border border-danger/30'}`}
                        >
                          {feedback.msg}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm">
                  Select an asset from the market overview to execute a trade.
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-5 flex-1 flex flex-col min-h-[300px]">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="text-accent" /> Recent Holdings
              </h2>
              
              <div className="flex-1 overflow-y-auto pr-1">
                {holdings.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-[var(--secondary-foreground)] text-center px-4">
                    You don't own any assets yet. Execute your first paper trade above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {holdings.map((h, i) => {
                      const currentPrice = marketData[h.symbol]?.currentPrice || h.averagePrice;
                      const pl = (currentPrice - h.averagePrice) * h.quantity;
                      const plPercent = ((currentPrice - h.averagePrice) / h.averagePrice) * 100;
                      const isProfit = pl >= 0;

                      return (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors">
                          <div>
                            <div className="font-bold">{h.symbol}</div>
                            <div className="text-xs text-[var(--secondary-foreground)]">{h.quantity} shares</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm">${(currentPrice * h.quantity).toFixed(2)}</div>
                            <div className={`text-xs font-medium ${isProfit ? 'text-success' : 'text-danger'}`}>
                              {isProfit ? '+' : ''}{pl.toFixed(2)} ({plPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </motion.div>
      )}

      <CategoryModal 
        isOpen={!!selectedCategoryModal}
        onClose={() => setSelectedCategoryModal(null)}
        category={selectedCategoryModal}
        onSimulate={handleSimulate}
      />
    </div>
  );
}
