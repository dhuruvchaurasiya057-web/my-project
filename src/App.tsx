/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Dashboard from './components/Dashboard';
import { FullScan } from './components/FullScan';
import { ManualTest } from './components/ManualTest';
import { Report } from './components/Report';
import { Settings } from './components/Settings';
import { Plugins } from './components/Plugins';
import { 
  LayoutDashboard, 
  Activity, 
  ClipboardCheck, 
  FileText, 
  Settings as SettingsIcon,
  ShieldCheck,
  Menu,
  X,
  Blocks
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'dashboard' | 'full-scan' | 'manual-test' | 'report' | 'settings' | 'plugins';

export default function App() {
  const [activePage, setActivePage] = React.useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [lastScanResults, setLastScanResults] = React.useState<any>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'full-scan', label: 'Full System Scan', icon: Activity },
    { id: 'manual-test', label: 'Manual Checklists', icon: ClipboardCheck },
    { id: 'report', label: 'Diagnostic Reports', icon: FileText },
    { id: 'plugins', label: 'Plugins & Hooks', icon: Blocks },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-hw-bg text-white flex font-sans selection:bg-hw-accent/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-hw-card border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="p-2 bg-hw-accent/20 rounded-lg">
              <ShieldCheck className="text-hw-accent" size={24} />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg leading-none">NOVA_SCAN</h1>
              <p className="text-[10px] font-mono text-hw-text-dim uppercase tracking-widest mt-1">v2.4.0 PRO</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activePage === item.id 
                    ? 'bg-hw-accent/10 text-hw-accent border border-hw-accent/20 shadow-[0_0_20px_rgba(0,255,157,0.05)]' 
                    : 'text-hw-text-dim hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={18} className={activePage === item.id ? 'text-hw-accent' : 'text-hw-text-dim group-hover:text-white'} />
                <span className="text-sm font-medium">{item.label}</span>
                {activePage === item.id && (
                  <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 bg-hw-accent rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-hw-accent animate-pulse" />
                <span className="text-[10px] font-mono text-hw-text-dim uppercase tracking-widest">System Status</span>
              </div>
              <p className="text-xs font-bold text-white mb-1">ALL NODES OPERATIONAL</p>
              <p className="text-[10px] text-hw-text-dim">Last sync: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-hw-card border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-hw-accent" size={20} />
            <span className="font-bold text-sm tracking-tight">NOVA_SCAN</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activePage === 'dashboard' && <Dashboard />}
              {activePage === 'full-scan' && <FullScan onComplete={(results) => { setLastScanResults(results); setActivePage('report'); }} />}
              {activePage === 'manual-test' && <ManualTest />}
              {activePage === 'report' && <Report results={lastScanResults} />}
              {activePage === 'plugins' && <Plugins />}
              {activePage === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
