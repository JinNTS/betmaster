
import React from 'react';
import { Bonus } from '../types';

interface BonusTrackerProps {
  bonus: Bonus;
}

const BonusTracker: React.FC<BonusTrackerProps> = ({ bonus }) => {
  const progress = (bonus.wageringDone / bonus.wageringRequired) * 100;
  const remaining = bonus.wageringRequired - bonus.wageringDone;

  return (
    <div className="glass rounded-xl p-4 border-l-4 border-amber-500 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xs font-bold text-amber-500 uppercase">Bônus Ativo</h3>
          <p className="text-sm font-semibold">Plataforma: Stake</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Expira em</p>
          <p className="text-xs font-mono">12/10/2024</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[10px] mb-1 uppercase font-bold text-slate-400">
          <span>Rollover Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
        <div>
          <p className="text-[10px] text-slate-400 uppercase">Total Necessário</p>
          <p className="text-sm font-mono font-bold text-white">R$ {bonus.wageringRequired.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase">Faltante</p>
          <p className="text-sm font-mono font-bold text-amber-500">R$ {remaining.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BonusTracker;
