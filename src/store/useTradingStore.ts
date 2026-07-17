import { create } from 'zustand';
import { AssetHolding, TransactionType, AssetClass } from '@/types';

interface MarketData {
  [symbol: string]: {
    currentPrice: number;
    change24h: number;
    previousClose: number;
    volume?: number;
    sparkline: { time: number; price: number }[];
    assetClass: AssetClass;
  };
}

interface TradingStoreState {
  currentCapital: number;
  totalPortfolioValue: number;
  holdings: AssetHolding[];
  marketData: MarketData;
  isInitializing: boolean;
  
  // Actions
  initializePortfolio: (capital: number, holdings: AssetHolding[]) => void;
  updateMarketPrices: (newMarketData: MarketData) => void;
  resetPortfolio: () => void;
  fetchLiveMarketData: (symbols: { symbol: string, assetClass: AssetClass }[]) => Promise<void>;
  executeTrade: (symbol: string, quantity: number, type: TransactionType) => { success: boolean; message: string };
  calculatePortfolioValue: () => void;
}

export const useTradingStore = create<TradingStoreState>((set, get) => ({
  currentCapital: 100000, // Default 100k
  totalPortfolioValue: 100000,
  holdings: [],
  marketData: {},
  isInitializing: true,

  initializePortfolio: (capital, holdings) => {
    set({ currentCapital: capital, holdings, isInitializing: false });
    get().calculatePortfolioValue();
  },

  resetPortfolio: () => {
    set({ currentCapital: 100000, totalPortfolioValue: 100000, holdings: [] });
  },

  updateMarketPrices: (newMarketData) => {
    set((state) => ({
      marketData: { ...state.marketData, ...newMarketData }
    }));
    get().calculatePortfolioValue();
  },

  fetchLiveMarketData: async (symbolsToFetch) => {
    const newMarketData: MarketData = {};
    
    await Promise.all(symbolsToFetch.map(async ({ symbol, assetClass }) => {
      try {
        const res = await fetch(`/api/finance?symbol=${symbol}`);
        if (res.ok) {
          const data = await res.json();
          newMarketData[symbol] = {
            currentPrice: data.currentPrice,
            change24h: data.change24h,
            previousClose: data.previousClose,
            volume: data.volume,
            sparkline: data.sparkline,
            assetClass
          };
        }
      } catch (err) {
        console.warn(`Failed to fetch ${symbol} data`, err);
      }
    }));

    if (Object.keys(newMarketData).length > 0) {
      get().updateMarketPrices(newMarketData);
    }
  },

  calculatePortfolioValue: () => {
    const { currentCapital, holdings, marketData } = get();
    let assetValue = 0;
    
    holdings.forEach(holding => {
      const marketPrice = marketData[holding.symbol]?.currentPrice || holding.averagePrice;
      assetValue += marketPrice * holding.quantity;
    });

    set({ totalPortfolioValue: currentCapital + assetValue });
  },

  executeTrade: (symbol, quantity, type) => {
    const { currentCapital, holdings, marketData } = get();
    const marketAsset = marketData[symbol];

    if (!marketAsset) {
      return { success: false, message: 'Market data not available for this symbol.' };
    }

    const price = marketAsset.currentPrice;
    const totalCost = price * quantity;

    if (type === 'BUY') {
      if (currentCapital < totalCost) {
        return { success: false, message: 'Insufficient funds.' };
      }

      // Update holdings
      const existingHolding = holdings.find(h => h.symbol === symbol);
      let newHoldings = [...holdings];

      if (existingHolding) {
        const newQuantity = existingHolding.quantity + quantity;
        const newTotalCost = (existingHolding.averagePrice * existingHolding.quantity) + totalCost;
        const newAveragePrice = newTotalCost / newQuantity;

        newHoldings = newHoldings.map(h => 
          h.symbol === symbol 
            ? { ...h, quantity: newQuantity, averagePrice: newAveragePrice }
            : h
        );
      } else {
        newHoldings.push({
          symbol,
          quantity,
          averagePrice: price,
          assetClass: marketAsset.assetClass,
        });
      }

      set({
        currentCapital: currentCapital - totalCost,
        holdings: newHoldings,
      });
      
      get().calculatePortfolioValue();
      return { success: true, message: `Successfully bought ${quantity} shares of ${symbol}.` };
    } 
    
    if (type === 'SELL') {
      const existingHolding = holdings.find(h => h.symbol === symbol);
      
      if (!existingHolding || existingHolding.quantity < quantity) {
        return { success: false, message: 'Insufficient holdings to sell.' };
      }

      let newHoldings = [...holdings];
      if (existingHolding.quantity === quantity) {
        // Remove holding completely
        newHoldings = newHoldings.filter(h => h.symbol !== symbol);
      } else {
        // Reduce quantity
        newHoldings = newHoldings.map(h =>
          h.symbol === symbol
            ? { ...h, quantity: h.quantity - quantity }
            : h
        );
      }

      set({
        currentCapital: currentCapital + totalCost,
        holdings: newHoldings,
      });

      get().calculatePortfolioValue();
      return { success: true, message: `Successfully sold ${quantity} shares of ${symbol}.` };
    }

    return { success: false, message: 'Invalid transaction type.' };
  }
}));
