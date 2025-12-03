import { Card, Rank, Suit, Player, BlindLevel } from '../types';
import { RANKS, SUITS, MOCK_NASH_DATA } from '../constants';

export const getRandomCard = (): Card => {
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  return { rank, suit };
};

export const getHandString = (c1: Card, c2: Card): string => {
  // Sort by rank index (descending)
  const r1Idx = RANKS.indexOf(c1.rank);
  const r2Idx = RANKS.indexOf(c2.rank);
  
  let high = c1;
  let low = c2;
  
  if (r2Idx > r1Idx) {
    high = c2;
    low = c1;
  }

  const suited = high.suit === low.suit ? 's' : 'o';
  if (high.rank === low.rank) return `${high.rank}${low.rank}`;
  return `${high.rank}${low.rank}${suited}`;
};

export const isPushCorrect = (hand: string, effectiveStackBB: number): boolean => {
  // Simple heuristic based on the mock Nash data
  // If the hand is in our chart and the stack is <= the chart value, it's a shove.
  // If not in chart, assume fold (or very strong hand implied 100bb).
  
  // Normalize hand string for pair (e.g. "AA" doesn't have 's' or 'o')
  const lookup = MOCK_NASH_DATA[hand];
  
  if (lookup !== undefined) {
    return effectiveStackBB <= lookup;
  }
  
  // Default loose/tight fallback for hands not in the top-level mock map
  // For MVP, we assume if it's not in the 'Good' list, you shouldn't shove it > 5bb
  return effectiveStackBB <= 3; 
};

export const generateScenario = (playerCount: 6 | 9): any => {
    // Helper to create a random setup
    const positions = playerCount === 6 ? ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'] : ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    const heroPosIndex = Math.floor(Math.random() * playerCount);
    
    const bb = 1000;
    const sb = 500;
    const ante = 100;

    const players: Player[] = positions.map((pos, idx) => ({
        id: idx,
        name: idx === heroPosIndex ? 'Hero' : `Villain ${idx + 1}`,
        position: pos,
        isHero: idx === heroPosIndex,
        isActive: true,
        stack: Math.floor(Math.random() * 15 * bb) + (2 * bb) // Random stack 2bb to 17bb
    }));

    const hero = players[heroPosIndex];
    const c1 = getRandomCard();
    let c2 = getRandomCard();
    while (c1.rank === c2.rank && c1.suit === c2.suit) {
        c2 = getRandomCard();
    }

    return {
        id: Date.now().toString(),
        players,
        blinds: { sb, bb, ante },
        payouts: { name: 'Standard', places: [50, 30, 20] },
        heroHand: { card1: c1, card2: c2 },
        pot: sb + bb + (ante * playerCount),
        actionLog: []
    };
};