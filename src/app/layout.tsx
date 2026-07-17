import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Make my Trade - Smart Investing",
  description: "AI-powered investment learning and paper trading platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] h-screen overflow-hidden flex`}>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

