'use client';

import { useNavigationStore } from "@/store/useNavigationStore";
import { DashboardView } from "@/components/views/DashboardView";
import { TradeView } from "@/components/views/TradeView";
import { MarketTrendsView } from "@/components/views/MarketTrendsView";
import { PortfolioView } from "@/components/views/PortfolioView";
import { SettingsView } from "@/components/views/SettingsView";

export default function Home() {
  const { activeView } = useNavigationStore();

  switch (activeView) {
    case 'dashboard':
      return <DashboardView />;
    case 'trade':
      return <TradeView />;
    case 'market':
      return <MarketTrendsView />;
    case 'portfolio':
      return <PortfolioView />;
    case 'settings':
      return <SettingsView />;
    case 'learn':
      return <div className="p-8 text-center text-[var(--secondary-foreground)]">Learning Center (Coming Soon)</div>;
    case 'coach':
      return <div className="p-8 text-center text-[var(--secondary-foreground)]">AI Coach (Coming Soon)</div>;
    case 'onboarding':
      return <div className="p-8 text-center text-[var(--secondary-foreground)]">Onboarding Quiz (Coming Soon)</div>;
    default:
      return <DashboardView />;
  }
}
