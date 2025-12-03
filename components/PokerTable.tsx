import React from 'react';
import { Player, Card, Suit } from '../types';

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
  // Simple radial positioning
  const radius = 130;
  const centerX = 160;
  const centerY = 120;
  
  // Find hero index to rotate table so Hero is always bottom center
  const heroIndex = players.findIndex(p => p.isHero);
  const rotateOffset = heroIndex !== -1 ? heroIndex : 0;
  
  const getPosition = (index: number, total: number) => {
    // Adjust index so Hero is at position (total - 1) or 0 visually at bottom
    // Visual index 0 is bottom center.
    // The player array order is usually positional (UTG...BB). 
    // We want Hero to be at the bottom.
    
    // Let's just distribute evenly for now.
    const angle = ((index - rotateOffset + total) % total) * (360 / total) + 90; // +90 to start bottom
    const rad = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);
    return { x, y };
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-emerald-900 rounded-full border-8 border-emerald-950 shadow-2xl flex items-center justify-center overflow-hidden mb-6">
      {/* Table Felt Branding */}
      <div className="absolute text-emerald-800 font-bold opacity-30 text-2xl tracking-widest select-none pointer-events-none">
        VILNA GAON
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
              left: `${x}px`, 
              top: `${y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Avatar Circle */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 
              ${isHero ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-700 border-gray-600'}`}>
              <span className="text-xs font-bold text-white">
                {player.position}
              </span>
            </div>
            
            {/* Stack Info */}
            <div className="mt-1 bg-black/60 px-2 py-0.5 rounded text-xs text-white font-mono border border-gray-700">
              {(player.stack / 1000).toFixed(1)}BB
            </div>

            {/* Hero Cards */}
            {isHero && (
              <div className="absolute -top-16 flex space-x-1 scale-90">
                <CardView card={heroHand.card1} />
                <CardView card={heroHand.card2} />
              </div>
            )}
          </div>
        );
      })}

      {/* Pot Info */}
      <div className="absolute bg-black/40 px-3 py-1 rounded-full text-white text-sm font-semibold border border-emerald-700 backdrop-blur-sm">
        Pot: 4.5 BB
      </div>
    </div>
  );
};