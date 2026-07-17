'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { AICoachOverlay } from "@/components/AICoachOverlay";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useUserStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const isAuthPage = pathname === '/signup' || pathname === '/login';
      if (!profile && !isAuthPage) {
        router.push('/signup');
      } else if (profile && isAuthPage) {
        router.push('/');
      }
    }
  }, [mounted, profile, pathname, router]);

  // Auth pages don't show the sidebar and topnav
  const isAuthPage = pathname === '/signup' || pathname === '/login';

  if (isAuthPage) {
    return <main className="h-screen w-full overflow-y-auto">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          {children}
        </main>
        <AICoachOverlay />
      </div>
    </>
  );
}
