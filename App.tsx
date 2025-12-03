import React, { useState, useEffect } from 'react';
import { Activity, LayoutGrid, Settings, Play, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
import { Player, Scenario, ViewMode, UserStats } from './types';
import { INITIAL_STATS } from './constants';
import { generateScenario, isPushCorrect, getHandString } from './utils/poker';
import { PokerTable } from './components/PokerTable';
import { RangeGrid } from './components/RangeGrid';
import { Dashboard } from './components/Dashboard';
import { analyzeScenario } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('DASHBOARD');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [result, setResult] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  // Initialize a scenario when entering Trainer mode
  useEffect(() => {
    if (view === 'TRAINER' && !scenario) {
      newScenario();
    }
  }, [view]);

  const newScenario = () => {
    setScenario(generateScenario(6)); // Default 6-max for now
    setResult(null);
    setAiAnalysis(null);
  };

  const handleDecision = (decision: 'Push' | 'Fold') => {
    if (!scenario) return;

    // Calculate correctness
    const hero = scenario.players.find(p => p.isHero);
    if (!hero) return;

    // Calculate effective stack relative to big blind
    const effStack = hero.stack / scenario.blinds.bb;
    const handStr = getHandString(scenario.heroHand.card1, scenario.heroHand.card2);
    
    const shouldPush = isPushCorrect(handStr, effStack);
    const correct = (decision === 'Push' && shouldPush) || (decision === 'Fold' && !shouldPush);

    setResult(correct ? 'CORRECT' : 'WRONG');
    
    // Update Stats
    setStats(prev => ({
      ...prev,
      handsPlayed: prev.handsPlayed + 1,
      correct: correct ? prev.correct + 1 : prev.correct,
      streak: correct ? prev.streak + 1 : 0
    }));
  };

  const handleAskCoach = async () => {
    if (!scenario) return;
    setIsAnalyzing(true);
    const text = await analyzeScenario(scenario);
    setAiAnalysis(text);
    setIsAnalyzing(false);
  };

  const renderNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 pb-6 sm:pb-4 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center px-4">
        <button onClick={() => setView('DASHBOARD')} className={`flex flex-col items-center ${view === 'DASHBOARD' ? 'text-blue-400' : 'text-slate-500'}`}>
          <Activity size={24} />
          <span className="text-xs mt-1">Stats</span>
        </button>
        <button onClick={() => setView('TRAINER')} className={`flex flex-col items-center ${view === 'TRAINER' ? 'text-blue-400' : 'text-slate-500'}`}>
          <Play size={24} />
          <span className="text-xs mt-1">Train</span>
        </button>
        <button onClick={() => setView('RANGES')} className={`flex flex-col items-center ${view === 'RANGES' ? 'text-blue-400' : 'text-slate-500'}`}>
          <LayoutGrid size={24} />
          <span className="text-xs mt-1">Ranges</span>
        </button>
        <button onClick={() => setView('BUILDER')} className={`flex flex-col items-center ${view === 'BUILDER' ? 'text-blue-400' : 'text-slate-500'}`}>
          <Settings size={24} />
          <span className="text-xs mt-1">Setup</span>
        </button>
      </div>
    </nav>
  );

  const renderTrainer = () => {
    if (!scenario) return <div className="text-center mt-20">Loading...</div>;

    const hero = scenario.players.find(p => p.isHero);
    const effStack = hero ? (hero.stack / scenario.blinds.bb).toFixed(1) : '?';

    return (
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <div className="text-slate-400 text-sm">
            <span className="font-bold text-white">6-Max</span> • Bubble (3 left)
          </div>
          <div className="text-slate-400 text-sm">
            BB: {scenario.blinds.bb} • Eff: <span className="text-yellow-400 font-bold">{effStack}BB</span>
          </div>
        </div>

        <PokerTable players={scenario.players} heroHand={scenario.heroHand} />

        {result === null ? (
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <button 
              onClick={() => handleDecision('Fold')}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
            >
              FOLD
            </button>
            <button 
              onClick={() => handleDecision('Push')}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
            >
              ALL-IN
            </button>
          </div>
        ) : (
          <div className="w-full mt-4 animate-fade-in-up">
            <div className={`p-4 rounded-xl flex items-center justify-between ${result === 'CORRECT' ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
              <div className="flex items-center space-x-3">
                {result === 'CORRECT' ? <CheckCircle className="text-green-400" size={32} /> : <XCircle className="text-red-400" size={32} />}
                <div>
                  <h3 className={`font-bold text-lg ${result === 'CORRECT' ? 'text-green-400' : 'text-red-400'}`}>
                    {result === 'CORRECT' ? 'Excellent!' : 'Mistake!'}
                  </h3>
                  <p className="text-sm text-slate-300">
                    {result === 'CORRECT' ? '+0.4% ROI' : '-1.2% ROI'} (Diff)
                  </p>
                </div>
              </div>
              
              <button onClick={newScenario} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold">
                Next Hand →
              </button>
            </div>

            {/* Analysis Section */}
            <div className="mt-4">
              {!aiAnalysis && !isAnalyzing ? (
                <button 
                  onClick={handleAskCoach}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg transition-all"
                >
                  <BrainCircuit size={18} />
                  <span>Ask AI Coach Why</span>
                </button>
              ) : (
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm text-slate-300 leading-relaxed">
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing spot with Gemini...</span>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-white mb-2 flex items-center">
                        <BrainCircuit size={16} className="mr-2 text-purple-400"/> 
                        Coach's Analysis
                      </h4>
                      <p>{aiAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header */}
      <header className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              V
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white hidden sm:block">Vilna Gaon's ICM Trainer</h1>
            <h1 className="text-lg font-bold tracking-tight text-white sm:hidden">Vilna's ICM</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
              v1.0.2 MVP
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        {view === 'DASHBOARD' && <Dashboard stats={stats} onPlay={() => setView('TRAINER')} />}
        
        {view === 'TRAINER' && renderTrainer()}
        
        {view === 'RANGES' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Range Viewer</h2>
              <p className="text-slate-400">Visualizing 10BB Push Range (Equilibrium)</p>
            </div>
            <RangeGrid />
            <div className="text-center text-xs text-slate-500 mt-4">
              * Green = Push, Grey = Fold. Based on Monker/HRC approximations.
            </div>
          </div>
        )}

        {view === 'BUILDER' && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Settings size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Scenario Builder</h2>
            <p className="text-center max-w-xs">Custom scenario creation and payout editing coming in next sprint.</p>
          </div>
        )}
      </main>

      {renderNav()}
    </div>
  );
};

export default App;