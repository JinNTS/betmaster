
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import { View, Platform, Transaction, Bonus, AnalysisResult } from './types';
import BonusTracker from './components/BonusTracker';
import SlotSimulator from './components/SlotSimulator';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { analyzeGameScreenshot } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('DASHBOARD');
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: '1', name: 'Stake', balance: 12540.50, currency: 'BRL' },
    { id: '2', name: 'Bet365', balance: 4200.00, currency: 'BRL' },
    { id: '3', name: 'Blaze', balance: 850.25, currency: 'BRL' },
  ]);
  const [activeBonus] = useState<Bonus>({
    id: 'b1',
    platformId: '1',
    amount: 500,
    multiplier: 40,
    wageringRequired: 20000,
    wageringDone: 14500,
    expiryDate: Date.now() + 86400000 * 5,
    isActive: true
  });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalBalance = platforms.reduce((acc, p) => acc + p.balance, 0);

  // Mock data for chart
  const pnlData = [
    { day: '01', value: 10000 },
    { day: '05', value: 11500 },
    { day: '10', value: 10800 },
    { day: '15', value: 13200 },
    { day: '20', value: 12400 },
    { day: '25', value: 15600 },
    { day: '30', value: 17590 },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    processImageFile(file);
  };

  const processImageFile = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setView('ANALYZER');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(',')[1];
      if (base64) {
        try {
          const result = await analyzeGameScreenshot(base64);
          setAnalysis(result);
        } catch (error) {
          console.error(error);
          alert("Erro na análise quantitativa.");
        } finally {
          setIsAnalyzing(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDemoAnalyze = async (element: HTMLElement) => {
    setIsAnalyzing(true);
    setView('ANALYZER');
    setAnalysis(null);

    // In a real environment we might use html2canvas, but since we are simulating
    // a "Bloomberg Terminal", we'll simulate the "capture" by sending a pre-defined
    // high-quality screenshot or just a mock request that uses the current game state description.
    // For this implementation, we will use a small delay to simulate processing.
    
    setTimeout(async () => {
      try {
        // We'll use a placeholder analysis for the demo to save API tokens or provide 
        // instant feedback, but the structure remains the same as the real API.
        const mockResult: AnalysisResult = {
          diagnosticoVisual: "Simulação de Slot 3x3 (Demo Mode). Elementos detectados: Sete, Estrela, Diamante. Saldo virtual estável.",
          leituraTecnica: "Volatilidade média. Retorno Teórico (RTP) de 96.5% no ambiente de simulação. Frequência de acerto: 1:5.",
          estadoSessao: "Ambiente de teste controlado. O usuário está testando mecânicas de aposta progressiva.",
          planoAcao: {
            tempoGiros: "100 giros virtuais",
            stopLoss: "V$ 500.00",
            takeProfit: "V$ 2000.00",
            condicoesSaida: [
              "Atingir limite de perda virtual",
              "Completar ciclo de 100 giros para análise de variância"
            ]
          },
          instrucaoDireta: "CONTINUAR TESTE EM MODO DEMO PARA CALIBRAÇÃO DE STOP-LOSS ANTES DE OPERAR EM MERCADO REAL."
        };
        setAnalysis(mockResult);
      } catch (error) {
        console.error(error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <div className="glass rounded-2xl p-6 gradient-border">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bankroll Consolidado</p>
        <h2 className="text-3xl font-bold font-mono text-white">R$ {totalBalance.toLocaleString()}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded">+12.4% este mês</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass rounded-2xl p-4 h-48">
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">Evolução Patrimonial (30D)</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pnlData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bonus Tracker */}
      <BonusTracker bonus={activeBonus} />

      {/* Quick Access to Demo */}
      <div 
        onClick={() => setView('DEMO_GAME')}
        className="glass rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <i className="fa-solid fa-gamepad"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold">Modo de Simulação</h4>
            <p className="text-[10px] text-slate-400">Teste estratégias sem risco real.</p>
          </div>
        </div>
        <i className="fa-solid fa-chevron-right text-slate-600"></i>
      </div>

      {/* Platform List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase px-1">Exposição por Casa</h3>
        {platforms.map(p => (
          <div key={p.id} className="glass rounded-xl p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors cursor-pointer border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                <i className="fa-solid fa-building-columns text-xs"></i>
              </div>
              <span className="font-semibold text-sm">{p.name}</span>
            </div>
            <span className="font-mono text-sm font-bold">R$ {p.balance.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyzer = () => (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 text-center border-dashed border-2 border-slate-700">
        <i className="fa-solid fa-robot text-4xl text-emerald-500 mb-4"></i>
        <h2 className="text-lg font-bold mb-2">Quant Vision Scanner</h2>
        <p className="text-sm text-slate-400 mb-6">Capture um print do jogo para análise matemática autônoma.</p>
        
        <label className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full cursor-pointer transition-all inline-block shadow-lg shadow-emerald-900/20">
          <i className="fa-solid fa-camera mr-2"></i>
          SCANNER DE TELA
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {isAnalyzing && (
        <div className="glass rounded-xl p-8 text-center animate-pulse border border-emerald-500/30">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-mono text-emerald-500">DECODIFICANDO ELEMENTOS VISUAIS...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-4 pb-12">
          <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
              <i className="fa-solid fa-microchip"></i> Diagnóstico Visual
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">{analysis.diagnosticoVisual}</p>
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Leitura Técnica</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{analysis.leituraTecnica}</p>
          </div>

          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Estado da Sessão</h3>
            <p className="text-xs text-slate-300">{analysis.estadoSessao}</p>
          </div>

          <div className="glass rounded-xl p-4 border-l-4 border-blue-500">
            <h3 className="text-xs font-bold text-blue-400 uppercase mb-4">Plano Matemático de Ação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Duração/Giros</p>
                <p className="text-xs font-bold">{analysis.planoAcao.tempoGiros}</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase font-bold text-rose-400">Stop-Loss</p>
                <p className="text-xs font-bold">{analysis.planoAcao.stopLoss}</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase font-bold text-emerald-400">Take-Profit</p>
                <p className="text-xs font-bold">{analysis.planoAcao.takeProfit}</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Saída Imediata</p>
                <ul className="text-[9px] list-disc ml-3 mt-1 text-slate-400">
                  {analysis.planoAcao.condicoesSaida.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white text-slate-950 rounded-xl p-5 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <i className="fa-solid fa-gavel"></i> Instrução Direta
            </h3>
            <p className="text-sm font-bold uppercase italic leading-tight">{analysis.instrucaoDireta}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return renderDashboard();
      case 'ANALYZER': return renderAnalyzer();
      case 'DEMO_GAME': return <SlotSimulator onAnalyzeRequest={handleDemoAnalyze} />;
      case 'WALLET': return (
        <div className="text-center py-20 px-6">
          <i className="fa-solid fa-briefcase text-4xl text-slate-700 mb-4"></i>
          <h2 className="text-lg font-bold">Carteira Transacional</h2>
          <p className="text-sm text-slate-500 mb-8">Gestão de depósitos, saques e P&L por plataforma.</p>
          <div className="grid grid-cols-1 gap-3">
             <button className="glass py-4 rounded-xl border border-slate-800 text-sm font-bold">+ NOVO DEPÓSITO</button>
             <button className="glass py-4 rounded-xl border border-slate-800 text-sm font-bold">+ NOVO SAQUE</button>
          </div>
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
