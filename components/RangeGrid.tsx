import React, { useState } from 'react';
import { MATRIX_ORDER, MOCK_NASH_DATA, MOCK_RAISE_DATA } from '../constants';
import { Flame, Info } from 'lucide-react';

interface RangeGridProps {
  shoveRange?: string[]; // Optional override
}

type ActionType = 'PUSH' | 'RAISE' | 'FOLD';

export const RangeGrid: React.FC<RangeGridProps> = () => {
  const [stackDepth, setStackDepth] = useState(12);
  const [viewMode, setViewMode] = useState<'SIMPLE' | 'HEATMAP'>('HEATMAP');
  const [hoveredHand, setHoveredHand] = useState<string | null>(null);

  const getHandType = (r1: string, r2: string) => {
    if (r1 === r2) return r1 + r2;
    const i1 = MATRIX_ORDER.indexOf(r1);
    const i2 = MATRIX_ORDER.indexOf(r2);
    if (i1 < i2) return `${r1}${r2}s`;
    return `${r2}${r1}o`;
  };

  const getHandAction = (hand: string, depth: number): ActionType => {
    const maxShove = MOCK_NASH_DATA[hand] || 0;
    const minRaise = MOCK_RAISE_DATA[hand];

    // Priority: If depth suggests raising is viable (deep stack), we raise.
    if (minRaise && depth >= minRaise) {
      return 'RAISE';
    }

    // Otherwise, we check if we can shove
    if (depth <= maxShove) {
      return 'PUSH';
    }

    return 'FOLD';
  };

  const getHandData = (hand: string) => {
    return MOCK_NASH_DATA[hand] || 0;
  };

  const getCellStyles = (hand: string) => {
    const action = getHandAction(hand, stackDepth);
    const maxShoveBB = getHandData(hand);

    if (action === 'FOLD') {
      return 'bg-slate-900 text-slate-700';
    }

    if (action === 'RAISE') {
      // Raise style
      return viewMode === 'SIMPLE' 
        ? 'bg-cyan-600 text-white font-bold' 
        : 'bg-cyan-500 text-white font-bold shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]';
    }

    // PUSH Styles
    if (viewMode === 'SIMPLE') {
      return 'bg-emerald-500 text-white';
    }

    // HEATMAP MODE for PUSH
    const diff = maxShoveBB - stackDepth;
    
    if (diff >= 30) return 'bg-emerald-400 text-emerald-950 font-extrabold'; // Nutted
    if (diff >= 15) return 'bg-emerald-500 text-white font-bold'; // Very Strong
    if (diff >= 8)  return 'bg-teal-500 text-white font-semibold'; // Solid Push
    if (diff >= 3)  return 'bg-yellow-500 text-black font-semibold'; // Standard
    return 'bg-orange-500 text-white font-semibold'; // Thin
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3 animate-fade-in">
      
      {/* Controls Container */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-md">
        
        {/* Stack Slider Row */}
        <div className="flex items-center space-x-4 mb-3">
           <div className="w-16 text-right">
             <span className="text-2xl font-bold text-yellow-400">{stackDepth}</span>
             <span className="text-xs text-slate-400 block -mt-1">BB</span>
           </div>
           
           <div className="flex-1 relative">
             <input 
              type="range" 
              min="1" 
              max="30" 
              step="1"
              value={stackDepth}
              onChange={(e) => setStackDepth(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 relative z-10"
            />
            {/* Ticks */}
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
              <span>1</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
            </div>
           </div>
        </div>

        {/* Mode Toggle & Legend */}
        <div className="flex justify-between items-center border-t border-slate-700 pt-3 flex-wrap gap-2">
          <div className="flex bg-slate-900 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('SIMPLE')}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${viewMode === 'SIMPLE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Binary
            </button>
            <button
              onClick={() => setViewMode('HEATMAP')}
              className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded transition-all ${viewMode === 'HEATMAP' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Flame size={12} />
              <span>Heatmap</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-slate-400 justify-end flex-1">
             <span className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-1"></span>Raise</span>
            {viewMode === 'HEATMAP' ? (
              <>
                <span className="flex items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-1"></span>Easy</span>
                <span className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>Marginal</span>
              </>
            ) : (
                <span className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>Push</span>
            )}
          </div>
        </div>
      </div>

      {/* The Grid */}
      <div className="relative bg-slate-900 p-0.5 rounded-md border border-slate-700 shadow-xl overflow-hidden">
        <div 
          className="grid gap-px bg-slate-800"
          style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
        >
          {MATRIX_ORDER.map((rowRank) => 
            MATRIX_ORDER.map((colRank) => {
              const hand = getHandType(rowRank, colRank);
              
              return (
                <div
                  key={hand}
                  onMouseEnter={() => setHoveredHand(hand)}
                  onMouseLeave={() => setHoveredHand(null)}
                  className={`
                    aspect-square flex items-center justify-center 
                    text-[8px] sm:text-[10px] cursor-help select-none transition-colors duration-150
                    ${getCellStyles(hand)}
                  `}
                >
                  <span className="leading-none tracking-tighter">{hand}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Tooltip */}
        {hoveredHand && (
          <div className="absolute inset-x-0 bottom-0 p-2 bg-slate-900/95 backdrop-blur border-t border-slate-700 text-center animate-fade-in z-20 shadow-lg">
             <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs">
                <span className="text-lg font-bold text-white">{hoveredHand}</span>
                
                {getHandAction(hoveredHand, stackDepth) === 'RAISE' ? (
                   <>
                     <span className="font-bold uppercase px-1.5 py-0.5 rounded text-[10px] bg-cyan-900 text-cyan-300 border border-cyan-800">
                        RAISE
                     </span>
                     <span className="text-slate-400">
                        (Stack &gt; {MOCK_RAISE_DATA[hoveredHand]}BB)
                     </span>
                   </>
                ) : (
                  <>
                    <span className="text-slate-300">
                      Max Shove: <span className="text-white font-mono">{getHandData(hoveredHand) >= 100 ? '100+' : getHandData(hoveredHand)} BB</span>
                    </span>
                    
                    <span className={`font-bold uppercase px-1.5 py-0.5 rounded text-[10px] ${getHandData(hoveredHand) >= stackDepth ? 'bg-green-900 text-green-300 border border-green-800' : 'bg-red-900 text-red-300 border border-red-800'}`}>
                      {getHandData(hoveredHand) >= stackDepth ? 'PUSH' : 'FOLD'}
                    </span>
                    
                    {viewMode === 'HEATMAP' && getHandData(hoveredHand) >= stackDepth && (
                      <span className="text-slate-400">
                        Diff: <span className={
                          (getHandData(hoveredHand) - stackDepth) > 10 ? 'text-emerald-400' : 
                          (getHandData(hoveredHand) - stackDepth) > 5 ? 'text-teal-400' : 'text-orange-400'
                        }>
                          +{(getHandData(hoveredHand) - stackDepth).toFixed(1)}
                        </span>
                      </span>
                    )}
                  </>
                )}
             </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <Info size={12} />
          <span>Ranges approx. Nash for 6-Max BTN vs Blinds</span>
        </p>
      </div>
    </div>
  );
};