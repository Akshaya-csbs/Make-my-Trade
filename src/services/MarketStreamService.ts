import { AssetClass } from '@/types';
import { useTradingStore } from '@/store/useTradingStore';

const INITIAL_ASSETS = [
  { symbol: 'AAPL', class: 'Stock' as AssetClass, basePrice: 150 },
  { symbol: 'MSFT', class: 'Stock' as AssetClass, basePrice: 310 },
  { symbol: 'TSLA', class: 'Stock' as AssetClass, basePrice: 220 },
  { symbol: 'BTC', class: 'Crypto' as AssetClass, basePrice: 42000 },
  { symbol: 'ETH', class: 'Crypto' as AssetClass, basePrice: 2200 },
  { symbol: 'GLD', class: 'Gold' as AssetClass, basePrice: 180 },
  { symbol: 'SPY', class: 'ETF' as AssetClass, basePrice: 450 },
];

export class MarketStreamService {
  private static interval: NodeJS.Timeout | null = null;

  static startStreaming() {
    if (this.interval) return;

    // Initialize base prices
    const initialData: Record<string, any> = {};
    INITIAL_ASSETS.forEach(asset => {
      initialData[asset.symbol] = {
        currentPrice: asset.basePrice,
        change24h: 0,
        assetClass: asset.class,
      };
    });
    
    useTradingStore.getState().updateMarketPrices(initialData);

    // Simulate price fluctuations every 2 seconds
    this.interval = setInterval(() => {
      const currentData = useTradingStore.getState().marketData;
      const updatedData: Record<string, any> = {};

      INITIAL_ASSETS.forEach(asset => {
        const prevPrice = currentData[asset.symbol]?.currentPrice || asset.basePrice;
        
        // Random volatility: -1% to +1% for Stocks/ETFs, -3% to +3% for Crypto
        const volatility = asset.class === 'Crypto' ? 0.03 : 0.01;
        const changePercent = (Math.random() * volatility * 2) - volatility; 
        const newPrice = prevPrice * (1 + changePercent);
        
        updatedData[asset.symbol] = {
          currentPrice: parseFloat(newPrice.toFixed(2)),
          change24h: parseFloat((((newPrice - asset.basePrice) / asset.basePrice) * 100).toFixed(2)),
          assetClass: asset.class,
        };
      });

      useTradingStore.getState().updateMarketPrices(updatedData);
    }, 2000);
  }

  static stopStreaming() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
