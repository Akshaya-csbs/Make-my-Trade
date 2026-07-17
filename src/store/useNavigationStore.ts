import { create } from 'zustand';

export type ViewState = 'dashboard' | 'trade' | 'market' | 'portfolio' | 'settings';

interface NavigationState {
  activeView: ViewState;
  tradeParams: { category: string; symbol: string } | null;
  setActiveView: (view: ViewState) => void;
  navigateToTrade: (category: string, symbol: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeView: 'dashboard',
  tradeParams: null,
  setActiveView: (view) => set({ activeView: view }),
  navigateToTrade: (category, symbol) => set({ activeView: 'trade', tradeParams: { category, symbol } }),
}));
