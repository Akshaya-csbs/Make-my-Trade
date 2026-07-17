import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '@/store/useTradingStore';
import { useNavigationStore } from '@/store/useNavigationStore';
import { AssetClass } from '@/types';
import { Area, AreaChart, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  LineChart, 
  Bitcoin, 
  Activity, 
  Wallet, 
  Coins, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Radio, 
  RefreshCw,
  Search
} from 'lucide-react';

const ASSET_LISTS = {
  Stocks: [
    { name: 'Apple Inc.', symbol: 'AAPL', icon: 'https://logo.clearbit.com/apple.com' },
    { name: 'Microsoft Corp.', symbol: 'MSFT', icon: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Tesla Inc.', symbol: 'TSLA', icon: 'https://logo.clearbit.com/tesla.com' },
    { name: 'Amazon.com Inc.', symbol: 'AMZN', icon: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Alphabet Inc.', symbol: 'GOOGL', icon: 'https://logo.clearbit.com/abc.xyz' },
    { name: 'NVIDIA Corp.', symbol: 'NVDA', icon: 'https://logo.clearbit.com/nvidia.com' },
    { name: 'Meta Platforms Inc.', symbol: 'META', icon: 'https://logo.clearbit.com/meta.com' },
  ],
  Crypto: [
    { name: 'Bitcoin', symbol: 'BTC-USD', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { name: 'Ethereum', symbol: 'ETH-USD', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { name: 'Binance Coin', symbol: 'BNB-USD', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    { name: 'Solana', symbol: 'SOL-USD', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { name: 'XRP', symbol: 'XRP-USD', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
  ],
  ETF: [
    { name: 'SPDR S&P 500 ETF', symbol: 'SPY', icon: 'https://logo.clearbit.com/spdrs.com' },
    { name: 'Invesco QQQ Trust', symbol: 'QQQ', icon: 'https://logo.clearbit.com/invesco.com' },
    { name: 'Vanguard S&P 500 ETF', symbol: 'VOO', icon: 'https://logo.clearbit.com/vanguard.com' },
  ],
  Bonds: [
    { name: 'iShares 20+ Year Treasury Bond ETF', symbol: 'TLT', icon: 'https://logo.clearbit.com/ishares.com' },
    { name: 'iShares 7-10 Year Treasury Bond ETF', symbol: 'IEF', icon: 'https://logo.clearbit.com/ishares.com' },
  ],
  Gold: [
    { name: 'Gold Futures', symbol: 'GC=F', icon: 'https://cryptologos.cc/logos/pax-gold-paxg-logo.png' },
    { name: 'SPDR Gold Shares', symbol: 'GLD', icon: 'https://logo.clearbit.com/spdrs.com' },
  ]
};

const TAB_ICONS = {
  Stocks: LineChart,
  Crypto: Bitcoin,
  ETF: Activity,
  Bonds: Wallet,
  Gold: Coins
};

export function MarketTrendsView() {
  const [activeTab, setActiveTab] = useState<keyof typeof ASSET_LISTS>('Stocks');
  const { marketData, fetchLiveMarketData } = useTradingStore();
  const { navigateToTrade } = useNavigationStore();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchCurrentTab = async () => {
      setIsFetching(true);
      const symbolsToFetch = ASSET_LISTS[activeTab].map(asset => ({
        symbol: asset.symbol,
        assetClass: activeTab.toLowerCase() as AssetClass
      }));
      await fetchLiveMarketData(symbolsToFetch);
      setIsFetching(false);
    };

    fetchCurrentTab();
  }, [activeTab, fetchLiveMarketData]);

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null) return '---';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const formatNumber = (val: number) => {
    if (val === undefined || val === null) return '---';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();
  };

  return (
    <div className="flex flex-col gap-6 h-full text-white">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Trends</h1>
          <p className="text-[var(--secondary-foreground)] mt-2">
            Track live market movements across different asset classes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-primary hover:bg-primary/10 transition-colors">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-semibold text-sm">Live Data</span>
          </button>
          <button 
            onClick={() => {
              if (ASSET_LISTS[activeTab].length > 0) {
                navigateToTrade(activeTab.toLowerCase(), ASSET_LISTS[activeTab][0].symbol);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            Simulate <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[var(--secondary)] p-1.5 rounded-2xl border border-[var(--border)] overflow-x-auto">
        {(Object.keys(ASSET_LISTS) as (keyof typeof ASSET_LISTS)[]).map((tab) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors whitespace-nowrap z-10 ${
                isActive ? 'text-white' : 'text-[var(--secondary-foreground)] hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="marketTab"
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4" />
              {tab}
            </button>
          );
        })}
      </div>

      {/* Table Area */}
      <div className="glass-card rounded-2xl border border-[var(--border)] overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--secondary-foreground)] text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Asset Name</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold flex items-center gap-1 cursor-pointer hover:text-white">
                  Change % <ChevronDown className="w-3 h-3" />
                </th>
                <th className="px-6 py-4 font-semibold">Volume</th>
                <th className="px-6 py-4 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {ASSET_LISTS[activeTab].map((asset, idx) => {
                  const data = marketData[asset.symbol];
                  const isLoading = !data && isFetching;
                  const isUp = data?.change24h >= 0;

                  return (
                    <motion.tr 
                      key={asset.symbol}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => navigateToTrade(activeTab.toLowerCase(), asset.symbol)}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--secondary)]/50 transition-colors group cursor-pointer"
                    >
                      {/* Asset Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {asset.icon ? (
                              <img src={asset.icon} alt={asset.symbol} className="w-full h-full object-cover" onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="%232e2e38"/><text x="16" y="21" font-size="14" font-family="sans-serif" fill="%23fff" text-anchor="middle">' + asset.symbol.charAt(0) + '</text></svg>';
                              }}/>
                            ) : (
                              <span className="text-xs font-bold">{asset.symbol.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">{asset.name}</div>
                            <div className="text-xs text-[var(--secondary-foreground)]">{asset.symbol}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 font-mono font-medium">
                        {isLoading ? <div className="h-4 w-16 bg-[var(--border)] rounded animate-pulse" /> : formatCurrency(data?.currentPrice)}
                      </td>
                      
                      {/* Change % */}
                      <td className="px-6 py-4">
                        {isLoading ? (
                          <div className="h-4 w-12 bg-[var(--border)] rounded animate-pulse" />
                        ) : (
                          <div className={`font-mono font-semibold ${isUp ? 'text-success' : 'text-danger'}`}>
                            {isUp ? '+' : ''}{data?.change24h?.toFixed(2)}%
                          </div>
                        )}
                      </td>
                      
                      {/* Volume */}
                      <td className="px-6 py-4 font-mono text-sm text-[var(--secondary-foreground)]">
                        {isLoading ? <div className="h-4 w-12 bg-[var(--border)] rounded animate-pulse" /> : formatNumber(data?.volume)}
                      </td>
                      
                      {/* Trend */}
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-24 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                          {data?.sparkline?.length > 0 && (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={data.sparkline}>
                                <defs>
                                  <linearGradient id={`grad-${asset.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isUp ? 'var(--success)' : 'var(--danger)'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={isUp ? 'var(--success)' : 'var(--danger)'} stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="price"
                                  stroke={isUp ? 'var(--success)' : 'var(--danger)'}
                                  strokeWidth={1.5}
                                  fill={`url(#grad-${asset.symbol})`}
                                  isAnimationActive={false}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${isUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isUp ? 'Up' : 'Down'}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--secondary-foreground)]">
          <div>* All data is delayed by 15 minutes</div>
          <div className="flex items-center gap-2">
            Last updated: {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            <button onClick={() => {
                const symbolsToFetch = ASSET_LISTS[activeTab].map(asset => ({ symbol: asset.symbol, assetClass: activeTab.toLowerCase() as AssetClass }));
                fetchLiveMarketData(symbolsToFetch);
              }} className="hover:text-white transition-colors">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
