
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const navItems: { id: View; icon: string; label: string }[] = [
    { id: 'DASHBOARD', icon: 'fa-chart-pie', label: 'Terminal' },
    { id: 'WALLET', icon: 'fa-wallet', label: 'Carteira' },
    { id: 'DEMO_GAME', icon: 'fa-gamepad', label: 'Demo' },
    { id: 'ANALYZER', icon: 'fa-microscope', label: 'Quant AI' },
    { id: 'ANALYTICS', icon: 'fa-arrow-trend-up', label: 'Análise' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative border-x border-slate-800 shadow-2xl overflow-hidden bg-slate-950">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-slate-400">Quant Terminal v1.0</h1>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-bell"></i>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-slate-800 flex justify-around items-center py-3 px-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              currentView === item.id ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[10px] uppercase font-bold tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
