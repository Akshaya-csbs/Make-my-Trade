import { useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, LineChart, Wallet, PieChart as PieChartIcon, ChevronDown, BookOpen } from "lucide-react";
import { useTradingStore } from "@/store/useTradingStore";
import { useUserStore } from "@/store/useUserStore";
import { Area, AreaChart, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const MOCK_GAUGE_DATA = [
  { name: "Score", value: 68 },
  { name: "Empty", value: 32 }
];

export function DashboardView() {
  const { profile } = useUserStore();
  const { totalPortfolioValue, holdings, marketData, fetchLiveMarketData } = useTradingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch live market data for key assets
    fetchLiveMarketData([
      { symbol: 'AAPL', assetClass: 'STOCKS' },
      { symbol: 'MSFT', assetClass: 'STOCKS' },
      { symbol: 'BTC-USD', assetClass: 'CRYPTO' },
      { symbol: 'GC=F', assetClass: 'COMMODITIES' } // Gold
    ]);

    // Poll every 60 seconds
    const interval = setInterval(() => {
      fetchLiveMarketData([
        { symbol: 'AAPL', assetClass: 'STOCKS' },
        { symbol: 'MSFT', assetClass: 'STOCKS' },
        { symbol: 'BTC-USD', assetClass: 'CRYPTO' },
        { symbol: 'GC=F', assetClass: 'COMMODITIES' }
      ]);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchLiveMarketData]);

  if (!mounted) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  // Calculate Overall Profit
  const initialCapital = 100000;
  const overallProfit = totalPortfolioValue - initialCapital;
  const overallReturnPct = (overallProfit / initialCapital) * 100;

  // Derive today's P&L (simplified for now using 24h change of holdings)
  let todayPnL = 0;
  holdings.forEach(h => {
    const market = marketData[h.symbol];
    if (market && market.previousClose) {
      const diff = market.currentPrice - market.previousClose;
      todayPnL += diff * h.quantity;
    }
  });
  const todayPnLPct = totalPortfolioValue ? (todayPnL / totalPortfolioValue) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 h-full text-white">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Good morning, {profile?.displayName ? profile.displayName.split(' ')[0] : 'Trader'}! 👋
          </h1>
          <p className="text-[var(--secondary-foreground)] mt-2">
            Stay consistent, stay profitable.
          </p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Current Asset Value */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-colors h-40">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-sm font-medium text-[var(--secondary-foreground)]">Current Asset Value</span>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2 relative z-10">₹{formatCurrency(totalPortfolioValue).replace('₹', '')}</div>
          <div className="flex items-center gap-2 text-sm relative z-10">
            <span className="text-success font-medium flex items-center">↑ 6.45%</span>
            <span className="text-[var(--secondary-foreground)]">vs yesterday</span>
          </div>
          {/* Sparkline Background */}
          <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData['AAPL']?.sparkline || []}>
                <defs>
                  <linearGradient id="colorAura" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorAura)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Overall Profit */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-accent/50 transition-colors h-40">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-sm font-medium text-[var(--secondary-foreground)]">Overall Profit / Return</span>
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2 relative z-10">₹{formatCurrency(overallProfit).replace('₹', '')}</div>
          <div className="flex items-center gap-2 text-sm relative z-10">
            <span className={`${overallReturnPct >= 0 ? 'text-success' : 'text-red-500'} font-medium flex items-center`}>
              {overallReturnPct >= 0 ? '↑' : '↓'} {Math.abs(overallReturnPct).toFixed(2)}%
            </span>
            <span className="text-[var(--secondary-foreground)]">total return</span>
          </div>
          {/* Sparkline Background */}
          <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData['MSFT']?.sparkline || []}>
                <defs>
                  <linearGradient id="colorAccent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" stroke="#d946ef" fillOpacity={1} fill="url(#colorAccent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Today's P&L */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-success/50 transition-colors h-40">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-sm font-medium text-[var(--secondary-foreground)]">Today's P&L</span>
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
              <LineChart className="w-4 h-4 text-success" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-2 relative z-10">₹{formatCurrency(todayPnL).replace('₹', '')}</div>
          <div className="flex items-center gap-2 text-sm relative z-10">
            <span className={`${todayPnLPct >= 0 ? 'text-success' : 'text-red-500'} font-medium flex items-center`}>
              {todayPnLPct >= 0 ? '↑' : '↓'} {Math.abs(todayPnLPct).toFixed(2)}%
            </span>
            <span className="text-[var(--secondary-foreground)]">today</span>
          </div>
          {/* Sparkline Background */}
          <div className="absolute bottom-0 left-0 right-0 h-20 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData['BTC-USD']?.sparkline || []}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" stroke="#22c55e" fillOpacity={1} fill="url(#colorSuccess)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Section: Active Portfolio */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold">Active Portfolio</h3>
            <p className="text-[var(--secondary-foreground)] text-sm">Invested In</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Live Data
            </button>
            <button className="bg-[var(--secondary)] border border-[var(--border)] hover:bg-[var(--border)] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
              Simulate <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
          {/* Bitcoin */}
          <div className="flex-shrink-0 bg-[var(--secondary)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">₿</div>
              <div>
                <div className="font-semibold text-sm">Bitcoin</div>
                <div className="text-xs text-[var(--secondary-foreground)]">BTC</div>
              </div>
            </div>
            <div className="text-primary font-bold text-sm">40%</div>
          </div>
          
          {/* Apple */}
          <div className="flex-shrink-0 bg-[var(--secondary)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-300 font-bold"></div>
              <div>
                <div className="font-semibold text-sm">Apple</div>
                <div className="text-xs text-[var(--secondary-foreground)]">AAPL</div>
              </div>
            </div>
            <div className="text-primary font-bold text-sm">30%</div>
          </div>

          {/* Gold */}
          <div className="flex-shrink-0 bg-[var(--secondary)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">Au</div>
              <div>
                <div className="font-semibold text-sm">Gold</div>
                <div className="text-xs text-[var(--secondary-foreground)]">XAU</div>
              </div>
            </div>
            <div className="text-primary font-bold text-sm">15%</div>
          </div>

          {/* Microsoft */}
          <div className="flex-shrink-0 bg-[var(--secondary)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">❖</div>
              <div>
                <div className="font-semibold text-sm">Microsoft</div>
                <div className="text-xs text-[var(--secondary-foreground)]">MSFT</div>
              </div>
            </div>
            <div className="text-primary font-bold text-sm">10%</div>
          </div>

          {/* More */}
          <div className="flex-shrink-0 bg-[var(--secondary)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-center min-w-[120px] cursor-pointer hover:bg-[var(--border)] transition-colors">
            <div className="text-sm font-medium text-[var(--secondary-foreground)]">+2 More Assets</div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
        
        {/* Financial Literacy Score */}
        <div className="glass-card rounded-2xl p-6 flex flex-col relative min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold">Financial Literacy Score</h3>
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_GAUGE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    startAngle={225}
                    endAngle={-45}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                  >
                    <Cell fill="#8b5cf6" />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                <span className="text-2xl font-bold text-white">68</span>
                <span className="text-[10px] text-[var(--secondary-foreground)]">/100</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary mb-1">Intermediate</span>
              <p className="text-sm text-[var(--secondary-foreground)]">
                Great job! Keep learning to level up.
              </p>
            </div>
          </div>

          <button className="mt-4 text-primary text-sm font-semibold flex items-center group w-fit hover:text-white transition-colors">
            Improve Score <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Current Market Trend */}
        <div className="glass-card rounded-2xl p-6 flex flex-col relative min-h-[220px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold">Current Market Trend</h3>
            <div className="text-xs text-[var(--secondary-foreground)] bg-[var(--secondary)] px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer hover:bg-[var(--border)] transition-colors">
              Overall Market <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success">
              <ArrowRight className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <div className="font-bold text-success text-base">Bullish</div>
              <div className="text-[10px] text-[var(--secondary-foreground)]">Market is up by 1.35% today</div>
            </div>
          </div>

          <div className="h-16 w-full -mx-2 opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketData['AAPL']?.sparkline || []}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" stroke="#22c55e" fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-auto pt-2">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[var(--secondary-foreground)]">Market Sentiment</span>
              <span className="text-success font-bold">72%</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-success to-primary rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>

        {/* User Behavior Insights */}
        <div className="glass-card rounded-2xl p-6 flex flex-col relative min-h-[220px]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold">User Behavior Insights</h3>
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-accent" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-lg font-bold text-accent mb-2">You tend to sell during dips</h4>
            <p className="text-sm text-[var(--secondary-foreground)] leading-relaxed">
              Try holding longer during market downturns to maximize returns based on historical recovery patterns.
            </p>
          </div>

          <button className="mt-4 text-accent text-sm font-semibold flex items-center group w-fit hover:text-white transition-colors">
            See Insights <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
