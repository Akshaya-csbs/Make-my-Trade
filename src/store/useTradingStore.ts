import { create } from 'zustand';
import { AssetHolding, TransactionType, AssetClass } from '@/types';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useUserStore } from './useUserStore';

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
  _hydrateFromFirebase: (capital: number, holdings: AssetHolding[]) => void;
}

export const useTradingStore = create<TradingStoreState>((set, get) => ({
  currentCapital: 100000, // Default 100k
  totalPortfolioValue: 100000,
  holdings: [],
  marketData: {},
  isInitializing: true,

  _hydrateFromFirebase: (capital, holdings) => {
    set({ currentCapital: capital, holdings, isInitializing: false });
    get().calculatePortfolioValue();
  },

  initializePortfolio: (capital, holdings) => {
    const uid = useUserStore.getState().profile?.uid;
    if (uid && uid !== 'user_mock_123') {
      updateDoc(doc(db, 'users', uid), { currentCapital: capital }).catch(err => console.error(err));
      setDoc(doc(db, 'portfolios', uid), { holdings, lastUpdated: Date.now() }).catch(err => console.error(err));
    }
    set({ currentCapital: capital, holdings, isInitializing: false });
    get().calculatePortfolioValue();
  },

  resetPortfolio: () => {
    const uid = useUserStore.getState().profile?.uid;
    if (uid && uid !== 'user_mock_123') {
      updateDoc(doc(db, 'users', uid), { currentCapital: 100000 }).catch(err => console.error(err));
      setDoc(doc(db, 'portfolios', uid), { holdings: [], lastUpdated: Date.now() }).catch(err => console.error(err));
    }
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
    const uid = useUserStore.getState().profile?.uid;

    if (!marketAsset) {
      return { success: false, message: 'Market data not available for this symbol.' };
    }

    const price = marketAsset.currentPrice;
    const totalCost = price * quantity;

    if (type === 'BUY') {
      if (currentCapital < totalCost) {
        return { success: false, message: 'Insufficient funds.' };
      }

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

      const newCapital = currentCapital - totalCost;
      set({ currentCapital: newCapital, holdings: newHoldings });
      get().calculatePortfolioValue();

      if (uid && uid !== 'user_mock_123') {
        updateDoc(doc(db, 'users', uid), { currentCapital: newCapital }).catch(err => console.error(err));
        setDoc(doc(db, 'portfolios', uid), { holdings: newHoldings, lastUpdated: Date.now() }).catch(err => console.error(err));
        addDoc(collection(db, `users/${uid}/transactions`), {
          symbol, type, quantity, price, timestamp: Date.now()
        }).catch(err => console.error(err));
      }

      return { success: true, message: `Successfully bought ${quantity} shares of ${symbol}.` };
    } 
    
    if (type === 'SELL') {
      const existingHolding = holdings.find(h => h.symbol === symbol);
      
      if (!existingHolding || existingHolding.quantity < quantity) {
        return { success: false, message: 'Insufficient holdings to sell.' };
      }

      let newHoldings = [...holdings];
      if (existingHolding.quantity === quantity) {
        newHoldings = newHoldings.filter(h => h.symbol !== symbol);
      } else {
        newHoldings = newHoldings.map(h =>
          h.symbol === symbol
            ? { ...h, quantity: h.quantity - quantity }
            : h
        );
      }

      const newCapital = currentCapital + totalCost;
      set({ currentCapital: newCapital, holdings: newHoldings });
      get().calculatePortfolioValue();

      if (uid && uid !== 'user_mock_123') {
        updateDoc(doc(db, 'users', uid), { currentCapital: newCapital }).catch(err => console.error(err));
        setDoc(doc(db, 'portfolios', uid), { holdings: newHoldings, lastUpdated: Date.now() }).catch(err => console.error(err));
        addDoc(collection(db, `users/${uid}/transactions`), {
          symbol, type, quantity, price, timestamp: Date.now()
        }).catch(err => console.error(err));
      }

      return { success: true, message: `Successfully sold ${quantity} shares of ${symbol}.` };
    }

    return { success: false, message: 'Invalid transaction type.' };
  }
}));

// Sync TradingStore when UserStore authenticates
useUserStore.subscribe(async (state) => {
  const uid = state.profile?.uid;
  if (uid && uid !== 'user_mock_123' && state.isAuthInitialized) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const portfolioDoc = await getDoc(doc(db, 'portfolios', uid));
      
      const capital = userDoc.exists() ? userDoc.data().currentCapital : 100000;
      const holdings = portfolioDoc.exists() ? portfolioDoc.data().holdings : [];
      
      useTradingStore.getState()._hydrateFromFirebase(capital, holdings);
    } catch (err) {
      console.error("Failed to hydrate portfolio from Firestore", err);
    }
  } else if (!uid) {
    // Reset if logged out
    useTradingStore.getState()._hydrateFromFirebase(100000, []);
  }
});
