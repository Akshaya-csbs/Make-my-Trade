'use client';

import { useTradingStore } from '@/store/useTradingStore';
import { 
  Radio, ChevronDown, Wallet, Clock, BarChart3,
  TrendingUp, TrendingDown, ArrowRight, Lightbulb
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import Image from 'next/image';

const ASSET_COLORS: Record<string, string> = {
  Stocks: '#8b5cf6', // purple
  ETF: '#3b82f6', // blue
  'Mutual Funds': '#10b981', // green
  'Digital Gold': '#f59e0b', // orange
  Bonds: '#ef4444', // red
  Cryptocurrency: '#eab308' // yellow
};

// Mock data to match exactly with the image's charts
const mockSparklineGreen = [
  { val: 10 }, { val: 15 }, { val: 12 }, { val: 20 }, { val: 18 }, { val: 25 }, { val: 30 }
];
const mockSparklinePurple = [
  { val: 10 }, { val: 12 }, { val: 15 }, { val: 13 }, { val: 18 }, { val: 16 }, { val: 20 }
];

const mockMonthlyPnL = [
  { date: '1 May', val: -4000 },
  { date: '8 May', val: 0 },
  { date: '15 May', val: 5000 },
  { date: '22 May', val: 3000 },
  { date: '31 May', val: 8750 }
];

const mockGrowth = [
  { date: '1 May', val: -2 },
  { date: '8 May', val: 1 },
  { date: '15 May', val: 4 },
  { date: '22 May', val: 3 },
  { date: '31 May', val: 7.55 }
];

export function PortfolioView() {
  const { currentCapital, holdings, marketData } = useTradingStore();

  // Basic real calculations for top cards
  let totalValue = currentCapital;
  let investedAmount = 0;
  holdings.forEach(h => {
    const price = marketData[h.symbol]?.currentPrice || h.averagePrice;
    totalValue += price * h.quantity;
    investedAmount += h.averagePrice * h.quantity;
  });

  const profitLoss = totalValue - currentCapital; // In a real app this would compare to initial
  
  // Format currency in INR as requested
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  // Mock Asset Allocation to match image exactly
  const assetAllocation = [
    { name: 'Stocks', value: 45 },
    { name: 'ETF', value: 20 },
    { name: 'Mutual Funds', value: 15 },
    { name: 'Digital Gold', value: 10 },
    { name: 'Bonds', value: 5 },
    { name: 'Cryptocurrency', value: 5 }
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-10 text-white max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-[var(--secondary-foreground)] mt-2">
            Track your investments and performance overview.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-primary hover:bg-primary/10 transition-colors bg-[#0a0a0f]">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="font-semibold text-sm">Live Data</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            Simulate <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Tier: Summary & Allocation */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Portfolio Summary Container */}
        <div className="xl:col-span-2 bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6">Portfolio Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Total Value */}
            <div className="bg-[#111118] border border-[var(--border)] rounded-xl p-5 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-sm text-[var(--secondary-foreground)]">Total Value</span>
              </div>
              <div className="text-3xl font-bold mb-4">₹1,24,580.00</div>
              
              <div className="h-12 w-full -mx-2 -mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSparklinePurple}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center gap-1 text-xs mt-2 relative z-10">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">2.35%</span>
                <span className="text-[var(--secondary-foreground)]">vs yesterday</span>
              </div>
            </div>

            {/* Invested Amount */}
            <div className="bg-[#111118] border border-[var(--border)] rounded-xl p-5 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-sm text-[var(--secondary-foreground)]">Invested Amount</span>
              </div>
              <div className="text-3xl font-bold mb-4">₹1,00,000.00</div>
              
              <div className="h-12 w-full -mx-2 -mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSparklinePurple}>
                    <defs>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorInvested)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center gap-1 text-xs mt-2 relative z-10">
                <span className="text-[var(--secondary-foreground)]">— 0.00% total invested</span>
              </div>
            </div>

            {/* Profit / Loss */}
            <div className="bg-[#111118] border border-[var(--border)] rounded-xl p-5 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-sm text-[var(--secondary-foreground)]">Profit / Loss</span>
              </div>
              <div className="text-3xl font-bold mb-4">₹24,580.00</div>
              
              <div className="h-12 w-full -mx-2 -mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSparklinePurple}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center gap-1 text-xs mt-2 relative z-10">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">24.58%</span>
                <span className="text-[var(--secondary-foreground)]">total return</span>
              </div>
            </div>

          </div>
        </div>

        {/* Asset Allocation Container */}
        <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6">Asset Allocation</h2>
          <div className="flex items-center gap-6 h-48">
            <div className="flex-1 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ASSET_COLORS[entry.name]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs text-[var(--secondary-foreground)]">Total</span>
                <span className="font-bold text-sm mt-0.5">₹1,24,580.00</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center gap-3 w-40">
              {assetAllocation.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ASSET_COLORS[asset.name] }} />
                    <span className="text-[var(--secondary-foreground)]">{asset.name}</span>
                  </div>
                  <span style={{ color: ASSET_COLORS[asset.name] }}>{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Middle Tier: Monthly Analysis */}
      <div className="mt-2">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold">Monthly Analysis</h2>
          <button className="flex items-center gap-1 text-xs text-[var(--secondary-foreground)] bg-transparent border border-[var(--border)] px-3 py-1.5 rounded-lg hover:bg-[#111118]">
            May 2025 <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* Monthly P&L */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-xl p-5 flex flex-col h-64 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">Monthly P&L</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl font-bold text-emerald-400">+₹8,750.50</div>
              <div className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">+7.55%</div>
            </div>
            
            <div className="flex-1 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyPnL}>
                  <defs>
                    <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="val" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMonthly)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[10px] text-[var(--secondary-foreground)] px-2 mt-2">
              <span>1 May</span>
              <span>8 May</span>
              <span>15 May</span>
              <span>22 May</span>
              <span>31 May</span>
            </div>
          </div>

          {/* Best Trade */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-xl p-5 flex flex-col justify-between h-64">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Best Trade</span>
              <span className="text-[10px] font-bold border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-md bg-[#0a0a0f]">Profit</span>
            </div>
            
            <div className="flex items-center gap-3 mt-4 mb-auto">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image src={`https://logo.clearbit.com/apple.com`} alt="AAPL" width={24} height={24} className="object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div>
                <div className="font-bold text-sm">Apple Inc.</div>
                <div className="text-xs text-[var(--secondary-foreground)]">AAPL</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-[10px] text-[var(--secondary-foreground)] mb-1">Buy Price</div>
                <div className="text-sm font-bold">₹172.50</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--secondary-foreground)] mb-1">Sell Price</div>
                <div className="text-sm font-bold">₹195.42</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <div className="text-xs text-[var(--secondary-foreground)]">Profit</div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">+₹2,290.40</span>
                <span className="text-emerald-400 text-xs">(+13.28%)</span>
              </div>
            </div>
          </div>

          {/* Worst Trade */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-xl p-5 flex flex-col justify-between h-64">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Worst Trade</span>
              <span className="text-[10px] font-bold border border-red-500/30 text-red-400 px-2 py-0.5 rounded-md bg-[#0a0a0f]">Loss</span>
            </div>
            
            <div className="flex items-center gap-3 mt-4 mb-auto">
              <div className="w-10 h-10 rounded-full bg-black border border-[var(--border)] flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image src={`https://logo.clearbit.com/tesla.com`} alt="TSLA" width={24} height={24} className="object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div>
                <div className="font-bold text-sm">Tesla Inc.</div>
                <div className="text-xs text-[var(--secondary-foreground)]">TSLA</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div className="text-[10px] text-[var(--secondary-foreground)] mb-1">Buy Price</div>
                <div className="text-sm font-bold">₹182.30</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--secondary-foreground)] mb-1">Sell Price</div>
                <div className="text-sm font-bold">₹175.64</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <div className="text-xs text-[var(--secondary-foreground)]">Less</div>
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold">-₹1,066.00</span>
                <span className="text-red-400 text-xs">(-3.65%)</span>
              </div>
            </div>
          </div>

          {/* Growth Overview */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-xl p-5 flex flex-col h-64 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">Growth Overview</span>
              <button className="flex items-center gap-1 text-[10px] text-[var(--secondary-foreground)] hover:text-white">
                This Month <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="mb-4">
              <div className="text-[10px] text-[var(--secondary-foreground)]">Growth %</div>
              <div className="text-xl font-bold text-emerald-400">+7.55%</div>
            </div>
            
            <div className="flex-1 w-full -ml-2 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockGrowth}>
                  <Line type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[10px] text-[var(--secondary-foreground)] px-2 mt-2">
              <span>1 May</span>
              <span>8 May</span>
              <span>15 May</span>
              <span>22 May</span>
              <span>31 May</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-5 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-white mb-0.5 text-sm">Portfolio Insights</div>
            <div className="text-sm text-[var(--secondary-foreground)]">
              Great job! Your portfolio is outperforming the market this month.
            </div>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-transparent border border-[var(--border)] text-sm text-[var(--secondary-foreground)] hover:text-white hover:bg-[#111118] transition-all">
          View Detailed Report <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
