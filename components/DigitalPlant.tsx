
import React from 'react';

interface DigitalPlantProps {
  progress: number; // 0 to 1
}

const DigitalPlant: React.FC<DigitalPlantProps> = ({ progress }) => {
  // Scale from 0.4 to 1.2
  const scale = 0.4 + (progress * 0.8);
  // Transition from dusty brown/green to vibrant neon green
  const leafColor = progress < 0.3 ? '#71717a' : progress < 0.7 ? '#22c55e' : '#4ade80';
  const glowIntensity = progress * 20;

  return (
    <div className="flex flex-col items-center justify-center p-4 transition-all duration-1000">
      <div 
        className="relative transition-transform duration-1000 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <svg width="120" height="150" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pot */}
          <path d="M35 120H85L95 150H25L35 120Z" fill="#1e293b" />
          <rect x="20" y="115" width="80" height="8" rx="2" fill="#334155" />
          
          {/* Stem */}
          <path d="M60 115V50" stroke="#3f6212" strokeWidth="4" strokeLinecap="round" />
          
          {/* Leaves */}
          <g style={{ filter: `drop-shadow(0 0 ${glowIntensity}px ${leafColor})` }}>
            <path d="M60 90C40 90 30 70 60 50C90 70 80 90 60 90Z" fill={leafColor} className="transition-colors duration-1000" />
            {progress > 0.4 && (
              <>
                <path d="M60 70C30 70 20 50 60 30C100 50 90 70 60 70Z" fill={leafColor} opacity="0.8" className="transition-colors duration-1000" />
                <path d="M60 80L30 65" stroke="#3f6212" strokeWidth="2" strokeLinecap="round" />
                <path d="M60 80L90 65" stroke="#3f6212" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
            {progress > 0.8 && (
              <path d="M60 45C45 45 40 35 60 20C80 35 75 45 60 45Z" fill="#86efac" className="animate-pulse" />
            )}
          </g>
        </svg>
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Life Essence</p>
        <p className="text-[10px] text-slate-300 italic mt-1 max-w-[140px] leading-tight font-medium">This plant grows and glows as you meet your goal.</p>
      </div>
    </div>
  );
};

export default DigitalPlant;
