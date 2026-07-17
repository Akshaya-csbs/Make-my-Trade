'use client';

import { useState } from 'react';
import { 
  Radio, ChevronDown, User, Lock, Sliders, Bell, Shield, Edit2, RotateCcw, Download, Trash2, Sun, Moon, Monitor, ChevronRight
} from 'lucide-react';
import { useTradingStore } from '@/store/useTradingStore';

export function SettingsView() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [alerts, setAlerts] = useState({
    price: true,
    market: true,
    weekly: true
  });
  
  // Real logic placeholder (would connect to useUserStore)
  const [profile, setProfile] = useState({
    name: 'Maggie',
    email: 'maggie.trader@aurai.com',
    experience: 'Beginner'
  });

  const { resetPortfolio } = useTradingStore();

  const handleResetBalance = () => {
    // Basic confirmation
    if (window.confirm("Are you sure you want to reset your portfolio and virtual balance? This cannot be undone.")) {
      if (typeof resetPortfolio === 'function') {
        resetPortfolio();
      } else {
        alert("Portfolio reset successful (Mock)");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-10 text-white max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-[var(--secondary-foreground)] mt-2">
            Manage your preferences and account settings.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          
          {/* Profile Settings */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Profile Settings</h2>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary relative overflow-hidden">
                   {/* Avatar circle */}
                   <div className="absolute inset-x-0 bottom-0 h-8 bg-primary opacity-80" style={{ borderRadius: '40% 40% 0 0' }} />
                   <div className="absolute top-4 w-8 h-8 bg-primary rounded-full opacity-80" />
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <Edit2 className="w-3 h-3 text-white" />
                </button>
              </div>
              <div>
                <div className="text-xl font-bold">{profile.name}</div>
                <div className="text-sm text-[var(--secondary-foreground)]">{profile.experience} Trader</div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs text-[var(--secondary-foreground)] mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-[#111118] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--secondary-foreground)] mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-[#111118] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-[var(--secondary-foreground)]"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--secondary-foreground)] mb-1.5">Experience Level</label>
                <div className="relative">
                  <select 
                    value={profile.experience}
                    onChange={(e) => setProfile({...profile, experience: e.target.value})}
                    className="w-full bg-[#111118] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-foreground)] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Account Settings</h2>
            </div>

            <div className="space-y-4">
              {/* Reset */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#111118] border border-[var(--border)] flex items-center justify-center text-[var(--secondary-foreground)]">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Reset Virtual Balance</div>
                    <div className="text-xs text-[var(--secondary-foreground)]">Reset your portfolio and virtual balance</div>
                  </div>
                </div>
                <button onClick={handleResetBalance} className="px-4 py-2 bg-[#111118] border border-[var(--border)] hover:bg-[#1a1a24] text-xs font-medium rounded-lg transition-colors">
                  Reset
                </button>
              </div>

              {/* Export */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#111118] border border-[var(--border)] flex items-center justify-center text-[var(--secondary-foreground)]">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Export Transaction History</div>
                    <div className="text-xs text-[var(--secondary-foreground)]">Download your trading history</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#111118] border border-[var(--border)] hover:bg-[#1a1a24] text-xs font-medium rounded-lg transition-colors">
                  Export
                </button>
              </div>

              {/* Delete */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#111118] border border-[var(--border)] flex items-center justify-center text-[var(--secondary-foreground)]">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Delete Account</div>
                    <div className="text-xs text-[var(--secondary-foreground)]">Permanently delete your account and data</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-red-950/30 border border-red-900/50 text-red-500 hover:bg-red-900/20 text-xs font-medium rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Preferences */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Preferences</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium mb-3">Theme</label>
                <div className="flex bg-[#111118] border border-[var(--border)] rounded-xl p-1">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-lg transition-colors ${theme === 'light' ? 'bg-[#2a2a35] text-white' : 'text-[var(--secondary-foreground)] hover:text-white'}`}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-lg transition-colors ${theme === 'dark' ? 'bg-[#2a2a35] text-white bg-primary/20 border border-primary/20' : 'text-[var(--secondary-foreground)] hover:text-white'}`}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium rounded-lg transition-colors ${theme === 'system' ? 'bg-[#2a2a35] text-white' : 'text-[var(--secondary-foreground)] hover:text-white'}`}
                  >
                    <Monitor className="w-4 h-4" /> System
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2">Currency</label>
                <div className="relative">
                  <select className="w-full bg-[#111118] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-foreground)] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2">Language</label>
                <div className="relative">
                  <select className="w-full bg-[#111118] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="fr">French</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-foreground)] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2">
                <div>
                  <div className="text-sm font-medium mb-0.5">Price Alerts</div>
                  <div className="text-xs text-[var(--secondary-foreground)]">Get notified when your assets hit target price</div>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${alerts.price ? 'bg-primary' : 'bg-gray-600'}`}
                  onClick={() => setAlerts({...alerts, price: !alerts.price})}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${alerts.price ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2">
                <div>
                  <div className="text-sm font-medium mb-0.5">Market Updates</div>
                  <div className="text-xs text-[var(--secondary-foreground)]">Stay updated with market news and trends</div>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${alerts.market ? 'bg-primary' : 'bg-gray-600'}`}
                  onClick={() => setAlerts({...alerts, market: !alerts.market})}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${alerts.market ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2">
                <div>
                  <div className="text-sm font-medium mb-0.5">Weekly Summary</div>
                  <div className="text-xs text-[var(--secondary-foreground)]">Receive your weekly performance summary</div>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${alerts.weekly ? 'bg-primary' : 'bg-gray-600'}`}
                  onClick={() => setAlerts({...alerts, weekly: !alerts.weekly})}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${alerts.weekly ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#0a0a0f] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Security</h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 cursor-pointer group">
                <div>
                  <div className="text-sm font-medium mb-0.5">Change Password</div>
                  <div className="text-xs text-[var(--secondary-foreground)]">Update your account password</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--secondary-foreground)] group-hover:text-white transition-colors" />
              </div>

              <div className="flex items-center justify-between p-2 cursor-pointer group">
                <div>
                  <div className="text-sm font-medium mb-0.5">Two-Factor Authentication</div>
                  <div className="text-xs text-[var(--secondary-foreground)]">Add an extra layer of security</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-medium">Enabled</span>
                  <ChevronRight className="w-4 h-4 text-[var(--secondary-foreground)] group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
