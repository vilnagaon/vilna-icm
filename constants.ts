import { Rank, Suit } from './types';

export const SUITS = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];
export const RANKS = [
  Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six,
  Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten,
  Rank.Jack, Rank.Queen, Rank.King, Rank.Ace
];

export const POSITIONS_6MAX = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
export const POSITIONS_9MAX = ['UTG', 'UTG+1', 'UTG+2', 'LJ', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

export const MATRIX_ORDER = [
  'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'
];

export const MOCK_PAYOUTS = [
  { name: 'Standard 6-Max (2 paid)', places: [0.65, 0.35] },
  { name: 'Daily Big $3 (Top Heavy)', places: [0.50, 0.30, 0.20] },
  { name: 'Hyper Satellite (3 tickets)', places: [0.33, 0.33, 0.33] },
];

// Helper to get last 5 days for dynamic chart data
const getRecentDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
  }
  return dates;
};

const recentDates = getRecentDates();

export const INITIAL_STATS = {
  handsPlayed: 142,
  correct: 112,
  streak: 4,
  history: [
    { date: recentDates[0], accuracy: 65 },
    { date: recentDates[1], accuracy: 68 },
    { date: recentDates[2], accuracy: 72 },
    { date: recentDates[3], accuracy: 78 },
    { date: recentDates[4], accuracy: 81 },
  ]
};

// Simplified Push/Fold heuristic chart for demo purposes (Nash-like)
// Values are max BB effective stack to shove. 100 = always shove.
export const MOCK_NASH_DATA: Record<string, number> = {
  // Pairs
  'AA': 100, 'KK': 100, 'QQ': 100, 'JJ': 100, 'TT': 100, '99': 100, 
  '88': 35, '77': 25, '66': 20, '55': 15, '44': 12, '33': 10, '22': 8,
  
  // Suited Aces
  'AKs': 100, 'AQs': 100, 'AJs': 100, 'ATs': 40, 'A9s': 25, 
  'A8s': 20, 'A7s': 18, 'A6s': 15, 'A5s': 20, 'A4s': 18, 'A3s': 16, 'A2s': 15,
  
  // Offsuit Aces
  'AKo': 100, 'AQo': 100, 'AJo': 30, 'ATo': 20, 'A9o': 15, 'A8o': 10, 
  'A7o': 8, 'A6o': 6, 'A5o': 6, 'A4o': 5, 'A3o': 5, 'A2o': 4,

  // Suited Broadways & Connectors
  'KQs': 50, 'KJs': 35, 'KTs': 25, 'K9s': 15, 'K8s': 10, 'K7s': 8, 'K6s': 6, 'K5s': 5, 'K4s': 5, 'K3s': 4, 'K2s': 4,
  'QJs': 30, 'QTs': 20, 'Q9s': 12, 'Q8s': 8, 'Q7s': 6, 'Q6s': 5, 'Q5s': 4, 'Q4s': 4, 'Q3s': 3, 'Q2s': 3,
  'JTs': 25, 'J9s': 15, 'J8s': 8, 'J7s': 6, 'J6s': 4, 'J5s': 4, 'J4s': 3,
  'T9s': 20, 'T8s': 10, 'T7s': 6, 'T6s': 4, 'T5s': 3,
  '98s': 18, '97s': 10, '96s': 5,
  '87s': 16, '86s': 8, '85s': 5,
  '76s': 15, '75s': 6, '74s': 4,
  '65s': 12, '64s': 5, '63s': 3,
  '54s': 10, '53s': 4, '52s': 3,
  '43s': 8, '42s': 3,
  '32s': 5,

  // Offsuit Broadways & Trash
  'KQo': 30, 'KJo': 20, 'KTo': 15, 'K9o': 8, 'K8o': 5, 'K7o': 4, 'K6o': 3,
  'QJo': 15, 'QTo': 10, 'Q9o': 6, 'Q8o': 4, 'Q7o': 3,
  'JTo': 8, 'J9o': 5, 'J8o': 3,
  'T9o': 6, 'T8o': 3,
  '98o': 5,
  '87o': 4,
  '76o': 3
};

// Define minimum stack depth (BB) where a hand prefers a standard Raise over a Push.
// If stack > value, action is Raise.
export const MOCK_RAISE_DATA: Record<string, number> = {
  'AA': 12, 'KK': 12, 'QQ': 15, 'JJ': 20,
  'AKs': 15, 'AKo': 18,
  'AQs': 20, 'AQo': 25,
  'AJs': 22,
  'KQs': 22,
  'TT': 25,
};