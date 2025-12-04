import React from 'react';
import { Player, Card, Suit } from '../types';
import { VilnaLogo } from './VilnaLogo';

interface PokerTableProps {
  players: Player[];
  heroHand: { card1: Card; card2: Card };
}

const getSuitColor = (suit: Suit) => {
  switch (suit) {
    case Suit.Hearts: return 'text-red-500';
    case Suit.Diamonds: return 'text-blue-400'; // Four-color deck style preference often uses blue for diamonds
    case Suit.Clubs: return 'text-green-500';
    case Suit.Spades: return 'text-gray-200';
    default: return 'text-white';
  }
};

const getSuitIcon = (suit: Suit) => {
  switch (suit) {
    case Suit.Hearts: return '♥';
    case Suit.Diamonds: return '♦';
    case Suit.Clubs: return '♣';
    case Suit.Spades: return '♠';
  }
};

const CardView: React.FC<{ card: Card }> = ({ card }) => (
  <div className="flex flex-col items-center justify-center w-10 h-14 bg-white rounded shadow-md border border-gray-300">
    <span className={`text-lg font-bold leading-none ${getSuitColor(card.suit)}`}>
      {card.rank}
    </span>
    <span className={`text-sm leading-none ${getSuitColor(card.suit)}`}>
      {getSuitIcon(card.suit)}
    </span>
  </div>
);

export const PokerTable: React.FC<PokerTableProps> = ({ players, heroHand }) => {
  // Elliptical positioning for 2:1 aspect ratio
  // Container is w-[98%] max-w-5xl. Let's approximate dimensions for calculation.
  // We use percentage-based positioning for responsiveness or fixed mostly.
  // Let's stick to the previous logic but adjust radius X and Y separately.
  
  const radiusX = 280; // Wider
  const radiusY = 130; // Shorter
  const centerX = 320; // Approx center of 640px wide internal coordinate system? 
  // Actually, let's just use CSS percentage positioning to be safer, 
  // but keeping the current absolute px logic requires guessing the container size.
  // The container is responsive. Let's assume a coordinate system of roughly 600x300.
  
  // Find hero index to rotate table so Hero is always bottom center
  const heroIndex = players.findIndex(p => p.isHero);
  const rotateOffset = heroIndex !== -1 ? heroIndex : 0;
  
  const getPosition = (index: number, total: number) => {
    // Distribute evenly
    const angleDeg = ((index - rotateOffset + total) % total) * (360 / total) + 90; // +90 to start bottom
    const rad = (angleDeg * Math.PI) / 180;
    
    // Ellipse parametric equation
    // x = a cos t
    // y = b sin t
    // We want the visualization to look like a poker table.
    
    // Center of the container (assuming relative coordinates for styling)
    // We will use % in the style output to be responsive.
    const xPct = 50 + 40 * Math.cos(rad); // 40% radius width
    const yPct = 50 + 40 * Math.sin(rad); // 40% radius height
    
    return { x: xPct, y: yPct };
  };

  return (
    <div className="relative w-[98%] max-w-5xl mx-auto aspect-[2/1] bg-emerald-900 rounded-[10rem] border-8 border-emerald-950 shadow-2xl flex items-center justify-center mb-6">
      {/* Table Felt Branding */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none select-none z-0">
         <VilnaLogo className="w-24 h-24 text-white mb-1" />
         <div className="text-white font-black text-[10px] tracking-[0.3em] text-center leading-relaxed">
            VILNA GAON<br/>
            PRIVATE EQUITY
         </div>
      </div>

      {/* Players */}
      {players.map((player, idx) => {
        const { x, y } = getPosition(idx, players.length);
        const isHero = player.isHero;
        
        return (
          <div 
            key={player.id}
            className={`absolute flex flex-col items-center transition-all duration-500`}
            style={{ 
              left: `${x}%`, 
              top: `${y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Avatar Circle */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 shadow-lg
              ${isHero ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-700 border-gray-600'}`}>
              <span className="text-xs font-bold text-white">
                {player.position}
              </span>
            </div>
            
            {/* Stack Info */}
            <div className="mt-1 bg-black/60 px-2 py-0.5 rounded text-xs text-white font-mono border border-gray-700 whitespace-nowrap z-20">
              {(player.stack / 1000).toFixed(1)}BB
            </div>

            {/* Hero Cards - Bottom Right of Avatar */}
            {isHero && (
              <div className="absolute left-12 top-10 flex space-x-1 scale-90 origin-top-left z-30 drop-shadow-2xl">
                <CardView card={heroHand.card1} />
                <CardView card={heroHand.card2} />
              </div>
            )}
          </div>
        );
      })}

      {/* Pot Info */}
      <div className="absolute bg-black/40 px-3 py-1 rounded-full text-white text-sm font-semibold border border-emerald-700 backdrop-blur-sm shadow-sm">
        Pot: 4.5 BB
      </div>
    </div>
  );
};
