import { useTradingStore } from '@/store/useTradingStore';
import { Eye, Wallet } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export function VirtualBalanceWidget() {
  const { currentCapital, holdings, marketData } = useTradingStore();

  // Calculate total portfolio value and P&L
  let totalValue = currentCapital;
  holdings.forEach(h => {
    const price = marketData[h.symbol]?.currentPrice || h.averagePrice;
    totalValue += price * h.quantity;
  });

  const initialCapital = 100000;
  const pl = totalValue - initialCapital;
  const plPercent = (pl / initialCapital) * 100;
  const isPositive = pl >= 0;

  // Mock sparkline data for Today's P&L (since we don't track historical portfolio value yet)
  const mockSparkline = [
    { value: 0 }, { value: 20 }, { value: -10 }, { value: 50 }, { value: 30 },
    { value: 80 }, { value: 60 }, { value: 120 }, { value: 90 }, { value: 150 },
    { value: 130 }, { value: 200 }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="mx-0 mt-4 mb-2 bg-[#0a0a0f] border border-[var(--border)] rounded-2xl overflow-hidden relative shadow-lg">
      <div className="p-3 relative z-10">
        <div className="flex justify-between items-center mb-1 text-[var(--secondary-foreground)]">
          <span className="text-xs font-medium">Virtual Balance</span>
          <Eye className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
        
        <div className="text-2xl font-bold text-white tracking-tight">
          {formatCurrency(totalValue)}
        </div>
        <div className="text-[10px] text-[var(--secondary-foreground)] mt-1 mb-4">
          Available to invest
        </div>

        {/* 3D Wallet Illustration (CSS-based) */}
        <div className="w-full flex justify-center py-2 relative">
          <div className="relative w-14 h-10">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            {/* Wallet back */}
            <div className="absolute inset-0 bg-purple-900 rounded-lg transform skew-x-12 translate-x-2" />
            {/* Wallet flap inside */}
            <div className="absolute inset-x-0 bottom-0 h-6 bg-purple-800 rounded-b-lg" />
            {/* Coin/Card sticking out */}
            <div className="absolute top-1 right-2 w-6 h-4 bg-blue-500 rounded-sm transform rotate-12" />
            <div className="absolute -top-1 right-3 w-5 h-5 rounded-full bg-purple-400 border border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)] z-10 flex items-center justify-center text-[7px] font-bold text-white">8</div>
            {/* Wallet front */}
            <div className="absolute inset-0 bg-primary rounded-lg shadow-xl border-t border-purple-400/50 flex flex-col justify-end p-1.5 z-20">
              <div className="w-1 h-1 rounded-full bg-white/50 mb-0.5 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]/50 bg-[#0f0f16] p-4 pt-3 relative z-10">
        <div className="text-xs text-[var(--secondary-foreground)] mb-1">Today's P&L</div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-danger'}`}>
            {isPositive ? '+' : ''}{formatCurrency(pl)}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-danger/20 text-danger'}`}>
            {isPositive ? '+' : ''}{plPercent.toFixed(2)}%
          </span>
        </div>
        
        {/* Tiny Sparkline */}
        <div className="h-8 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSparkline}>
              <defs>
                <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? '#10b981' : '#ef4444'} 
                fillOpacity={1} 
                fill="url(#colorPl)" 
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
