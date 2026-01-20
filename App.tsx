
import React, { useState, useEffect, useCallback } from 'react';
import WaterContainer from './components/WaterContainer';
import DigitalPlant from './components/DigitalPlant';
import { fetchHydrationTip } from './services/geminiService';
import { HydrationTip, UserStats } from './types';

const App: React.FC = () => {
  const GOAL = 2000;
  
  // Initial state from LocalStorage
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('hydrohero_stats');
    const today = new Date().toISOString().split('T')[0];
    
    if (saved) {
      try {
        const parsed: UserStats = JSON.parse(saved);
        const lastUpdateDate = (parsed.lastUpdated || new Date().toISOString()).split('T')[0];
        
        // If it's a new day, reset currentMl but check streak
        if (lastUpdateDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          let newStreak = parsed.streak;
          // If yesterday they didn't finish, or it's been more than 1 day since last update
          if (lastUpdateDate !== yesterdayStr || parsed.currentMl < parsed.dailyGoal) {
            newStreak = 0;
          }

          return {
            currentMl: 0,
            dailyGoal: GOAL,
            streak: newStreak,
            lastUpdated: new Date().toISOString()
          };
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing stats", e);
      }
    }
    
    return {
      currentMl: 0,
      dailyGoal: GOAL,
      streak: 0,
      lastUpdated: new Date().toISOString()
    };
  });

  const [tip, setTip] = useState<HydrationTip | null>(null);
  const [loadingTip, setLoadingTip] = useState<boolean>(false);
  const [dismissedCelebration, setDismissedCelebration] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Sync with LocalStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('hydrohero_stats', JSON.stringify(stats));
  }, [stats]);

  const loadNewTip = useCallback(async () => {
    setLoadingTip(true);
    const newTip = await fetchHydrationTip();
    setTip(newTip);
    setLoadingTip(false);
  }, []);

  useEffect(() => {
    loadNewTip();
  }, [loadNewTip]);

  const addWater = (amount: number) => {
    setStats(prev => {
      const newMl = prev.currentMl + amount;
      let newStreak = prev.streak;
      
      const today = new Date().toISOString().split('T')[0];
      const lastUpdateDate = prev.lastUpdated.split('T')[0];
      
      if (prev.currentMl < GOAL && newMl >= GOAL) {
        newStreak += 1;
        setDismissedCelebration(false);
      }
      
      return {
        ...prev,
        currentMl: newMl,
        streak: newStreak,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  const handleReset = () => {
    if (!isResetting) {
      setIsResetting(true);
      // Brief timeout for visual feedback
      setTimeout(() => setIsResetting(false), 2000);
      return;
    }

    // Actual reset logic
    setStats(prev => ({ 
      ...prev, 
      currentMl: 0,
      lastUpdated: new Date().toISOString()
    }));
    setDismissedCelebration(false);
    setIsResetting(false);
  };

  const progress = stats.currentMl / stats.dailyGoal;
  const percentage = Math.round(progress * 100);

  return (
    <div className="max-w-md mx-auto px-6 py-8 flex flex-col min-h-screen text-slate-100">
      {/* Header & Streak */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            HYDRO<span className="text-slate-100">HERO</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Version 1.0</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-full border border-orange-500/30">
            <span className="text-orange-500 text-lg">🔥</span>
            <span className="text-sm font-bold text-slate-100">{stats.streak} Day Streak</span>
          </div>
        </div>
      </header>

      {/* AI Intelligence / Tips */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
        {loadingTip ? (
          <div className="flex space-x-2 py-2">
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
          </div>
        ) : (
          <p className="text-sm text-slate-200 italic group-hover:text-cyan-100 transition-colors leading-relaxed">
            <span className="text-cyan-400 font-bold uppercase text-[9px] block mb-1">Intelligence Relay</span>
            "{tip?.text}"
          </p>
        )}
      </div>

      {/* Visual Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="flex flex-col items-center">
          <DigitalPlant progress={progress} />
          <WaterContainer percentage={percentage} currentMl={stats.currentMl} />
        </div>

        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-tighter">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-medium">Daily Objective: {stats.dailyGoal}ml</p>
        </div>
      </main>

      {/* Tactical Controls */}
      <footer className="mt-12 grid grid-cols-2 gap-4">
        <button
          onClick={() => addWater(250)}
          className="group relative flex flex-col items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl p-4 transition-all hover:border-cyan-500/50 active:scale-95"
        >
          <span className="text-2xl mb-1 group-hover:animate-float">🥛</span>
          <span className="text-sm font-bold text-white">Small Glass</span>
          <span className="text-[10px] text-cyan-400 font-mono">250ml</span>
        </button>

        <button
          onClick={() => addWater(500)}
          className="group relative flex flex-col items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl p-4 transition-all hover:border-cyan-500/50 active:scale-95"
        >
          <span className="text-2xl mb-1 group-hover:animate-float">🍼</span>
          <span className="text-sm font-bold text-white">Large Bottle</span>
          <span className="text-[10px] text-cyan-400 font-mono">500ml</span>
        </button>

        <button
          onClick={handleReset}
          className={`col-span-2 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-xl border ${
            isResetting 
            ? 'bg-red-950/30 border-red-500/50 text-red-400' 
            : 'text-slate-400 border-transparent hover:text-red-400'
          }`}
        >
          {isResetting ? 'TAP AGAIN TO CONFIRM RESET' : 'System Reset'}
        </button>
      </footer>

      {/* Goal Reached Celebration Overlay */}
      {percentage >= 100 && !dismissedCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>
          <div className="relative bg-slate-900 border-2 border-cyan-400 p-8 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.3)] animate-[bounce_2s_infinite] w-full max-sm">
             <div className="text-center mb-6">
               <div className="text-5xl mb-4">🏆</div>
               <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">TARGET MET</h2>
               <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest">Hero, your vitals are peak.</p>
             </div>
             
             <div className="space-y-3">
               <button 
                  onClick={handleReset} 
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 transition-colors rounded-xl text-white font-bold shadow-lg shadow-cyan-900/20 active:scale-95"
               >
                 Start Fresh
               </button>
               <button 
                  onClick={() => setDismissedCelebration(true)} 
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl text-slate-200 font-bold active:scale-95"
               >
                 Keep Going
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
