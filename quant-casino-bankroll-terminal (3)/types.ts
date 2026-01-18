
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'WIN' | 'LOSS';
export type GameType = 'SLOTS' | 'LIVE_CASINO' | 'SPORTS' | 'POKER';

export interface Platform {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  platformId: string;
  type: TransactionType;
  gameType?: GameType;
  amount: number;
  date: number;
  note?: string;
}

export interface Bonus {
  id: string;
  platformId: string;
  amount: number;
  multiplier: number;
  wageringRequired: number;
  wageringDone: number;
  expiryDate: number;
  isActive: boolean;
}

export interface AnalysisResult {
  diagnosticoVisual: string;
  leituraTecnica: string;
  estadoSessao: string;
  planoAcao: {
    tempoGiros: string;
    stopLoss: string;
    takeProfit: string;
    condicoesSaida: string[];
  };
  instrucaoDireta: string;
}

export type View = 'DASHBOARD' | 'WALLET' | 'ANALYZER' | 'ANALYTICS' | 'SETTINGS' | 'DEMO_GAME';

export interface SlotSymbol {
  id: string;
  icon: string;
  value: number;
  color: string;
}
