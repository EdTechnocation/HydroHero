
import React from 'react';

interface WaterContainerProps {
  percentage: number;
  currentMl: number;
}

const WaterContainer: React.FC<WaterContainerProps> = ({ percentage, currentMl }) => {
  const cappedPercentage = Math.min(percentage, 100);

  return (
    <div className="relative w-56 h-80 mx-auto bg-slate-900 rounded-[2.5rem] border-2 border-slate-800 p-1 shadow-2xl overflow-hidden group">
      {/* Inner Neon Ring */}
      <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-[2.5rem] pointer-events-none"></div>

      {/* Water Fill */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div 
          className="bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 ease-in-out relative water-glow"
          style={{ height: `${cappedPercentage}%` }}
        >
          {/* Surface Wave Overlay */}
          <div className="absolute top-0 left-0 w-[200%] h-12 -translate-y-6 flex opacity-50">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-1/2 h-full fill-cyan-400 animate-[wave_3s_linear_infinite]">
              <path d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z" />
            </svg>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-1/2 h-full fill-cyan-400 animate-[wave_3s_linear_infinite]">
              <path d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z" />
            </svg>
          </div>

          {/* Bubbles */}
          {cappedPercentage > 0 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white/20 rounded-full animate-bounce"
                  style={{
                    width: `${Math.random() * 8 + 4}px`,
                    height: `${Math.random() * 8 + 4}px`,
                    left: `${Math.random() * 100}%`,
                    bottom: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Digital Readout Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <span className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          {currentMl}
        </span>
        <span className="text-[10px] font-bold text-cyan-200 tracking-widest uppercase">Milliliters</span>
      </div>

      {/* Side Markings */}
      <div className="absolute inset-y-0 left-4 flex flex-col justify-between py-12 opacity-20 group-hover:opacity-40 transition-opacity">
        {[2000, 1500, 1000, 500, 0].map(val => (
          <div key={val} className="flex items-center space-x-2">
            <div className="w-2 h-[1px] bg-cyan-400"></div>
            <span className="text-[8px] text-cyan-400 font-mono">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterContainer;
