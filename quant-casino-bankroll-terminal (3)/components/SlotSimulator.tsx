
import React, { useState, useEffect, useCallback } from 'react';

const SYMBOLS = [
  { id: 'diamond', icon: 'fa-gem', value: 50, color: 'text-cyan-400' },
  { id: 'gold', icon: 'fa-coins', value: 20, color: 'text-amber-400' },
  { id: 'cherry', icon: 'fa-apple-whole', value: 10, color: 'text-rose-500' },
  { id: 'seven', icon: 'fa-7', value: 100, color: 'text-red-600' },
  { id: 'bell', icon: 'fa-bell', value: 30, color: 'text-yellow-500' },
  { id: 'star', icon: 'fa-star', value: 40, color: 'text-purple-400' },
];

interface HistoryEntry {
  id: string;
  bet: number;
  win: number;
  balance: number;
  timestamp: number;
}

interface SlotSimulatorProps {
  onAnalyzeRequest: (element: HTMLElement) => void;
}

const SlotSimulator: React.FC<SlotSimulatorProps> = ({ onAnalyzeRequest }) => {
  const [balance, setBalance] = useState(5000);
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState<any[][]>([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[2], SYMBOLS[3], SYMBOLS[0]],
    [SYMBOLS[1], SYMBOLS[4], SYMBOLS[5]],
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const spin = useCallback(() => {
    if (balance < bet || isSpinning) return;

    setIsSpinning(true);
    const initialBalance = balance;
    const currentBet = bet;
    setBalance(prev => prev - currentBet);
    setLastWin(0);

    const spinInterval = setInterval(() => {
      setReels(prev => prev.map(reel => reel.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])));
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalReels = Array(3).fill(null).map(() => 
        Array(3).fill(null).map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      );
      setReels(finalReels);
      setIsSpinning(false);

      let winAmount = 0;
      // Simple win logic: Check middle row
      if (finalReels[0][1].id === finalReels[1][1].id && finalReels[1][1].id === finalReels[2][1].id) {
        winAmount = finalReels[0][1].value * (currentBet / 10);
        setLastWin(winAmount);
      }

      const finalBalance = (initialBalance - currentBet) + winAmount;
      setBalance(finalBalance);

      // Log to history
      const newEntry: HistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        bet: currentBet,
        win: winAmount,
        balance: finalBalance,
        timestamp: Date.now()
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
    }, 1500);
  }, [balance, bet, isSpinning]);

  return (
    <div id="demo-slot-machine" className="flex flex-col gap-6 select-none pb-20">
      <div className="glass rounded-2xl p-6 border-2 border-slate-800 shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Demo Balance</span>
            <span className="text-xl font-mono font-bold text-emerald-400">V$ {balance.toFixed(2)}</span>
          </div>
          {lastWin > 0 && (
            <div className="animate-bounce flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-tighter">Big Win!</span>
              <span className="text-xl font-mono font-bold text-amber-400">+V$ {lastWin.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden">
          {/* Win Line Indicator */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-500/30 z-0 pointer-events-none"></div>
          
          {reels.map((reel, rIdx) => (
            <div key={rIdx} className="flex flex-col gap-3">
              {reel.map((symbol, sIdx) => (
                <div 
                  key={`${rIdx}-${sIdx}`} 
                  className={`h-24 glass rounded-lg flex items-center justify-center text-3xl transition-all duration-300 ${isSpinning ? 'blur-sm opacity-50 translate-y-2' : 'scale-100'} ${sIdx === 1 && !isSpinning ? 'ring-1 ring-emerald-500/50 bg-emerald-500/5' : ''}`}
                >
                  <i className={`fa-solid ${symbol.icon} ${symbol.color}`}></i>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 glass rounded-xl p-3 flex justify-between items-center border border-slate-800">
          <button 
            onClick={() => setBet(Math.max(10, bet - 10))}
            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <div className="text-center">
            <p className="text-[8px] uppercase font-bold text-slate-500">Aposta</p>
            <p className="text-sm font-mono font-bold">V$ {bet}</p>
          </div>
          <button 
            onClick={() => setBet(bet + 10)}
            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        <button 
          onClick={spin}
          disabled={isSpinning || balance < bet}
          className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-xl ${
            isSpinning ? 'bg-slate-800 text-slate-600 scale-95' : 'bg-emerald-500 text-white hover:bg-emerald-400 active:scale-90 shadow-emerald-500/20'
          }`}
        >
          <i className={`fa-solid ${isSpinning ? 'fa-sync fa-spin' : 'fa-play'}`}></i>
        </button>
      </div>

      <div className="mt-4">
        <button 
          onClick={() => {
            const el = document.getElementById('demo-slot-machine');
            if (el) onAnalyzeRequest(el);
          }}
          className="w-full glass py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-microscope"></i>
          Enviar Estado para Quant AI
        </button>
      </div>

      {/* Bet History Log */}
      <div className="mt-2 glass rounded-xl overflow-hidden border border-slate-800">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bet History Log</h3>
          <button 
            onClick={() => setHistory([])}
            className="text-[10px] text-slate-600 hover:text-slate-400 uppercase font-bold"
          >
            Clear
          </button>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {history.length === 0 ? (
            <div className="py-8 text-center text-slate-600 text-[10px] uppercase font-bold">
              No transactions recorded
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-900 text-[8px] uppercase font-bold text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2 text-right">Bet</th>
                  <th className="px-4 py-2 text-right">Win</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-2 text-[9px] font-mono text-slate-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-4 py-2 text-[10px] font-mono text-slate-300 text-right">
                      {entry.bet.toFixed(0)}
                    </td>
                    <td className={`px-4 py-2 text-[10px] font-mono text-right ${entry.win > 0 ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                      {entry.win > 0 ? `+${entry.win.toFixed(0)}` : '-'}
                    </td>
                    <td className="px-4 py-2 text-[10px] font-mono text-slate-300 text-right">
                      {entry.balance.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-[10px] text-slate-500 leading-tight">
        <p className="font-bold uppercase mb-1 text-slate-400">Modo de Demonstração Técnico</p>
        Este simulador utiliza saldos virtuais para fins de teste de estratégias e calibração do Quant AI. Nenhum valor real é transacionado aqui.
      </div>
    </div>
  );
};

export default SlotSimulator;
