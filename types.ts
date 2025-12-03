export enum Suit {
  Spades = 's',
  Hearts = 'h',
  Diamonds = 'd',
  Clubs = 'c',
}

export enum Rank {
  Two = '2', Three = '3', Four = '4', Five = '5', Six = '6',
  Seven = '7', Eight = '8', Nine = '9', Ten = 'T',
  Jack = 'J', Queen = 'Q', King = 'K', Ace = 'A',
}

export interface Card {
  rank: Rank;
  suit: Suit;
}

export interface Player {
  id: number;
  name: string;
  stack: number;
  isHero: boolean;
  position: string; // "BTN", "SB", "BB", "UTG", etc.
  isActive: boolean; // Has not folded yet
}

export interface BlindLevel {
  sb: number;
  bb: number;
  ante: number;
}

export interface PayoutStructure {
  name: string;
  places: number[]; // Percentages or fixed amounts, simplified to % for now
}

export interface Scenario {
  id: string;
  players: Player[];
  blinds: BlindLevel;
  payouts: PayoutStructure;
  heroHand: { card1: Card; card2: Card };
  pot: number;
  actionLog: string[];
}

export interface RangeCell {
  hand: string; // "AA", "AKs", "AKo"
  action: 'Push' | 'Fold' | 'Call' | 'Mixed';
  ev?: number;
}

export type ViewMode = 'DASHBOARD' | 'TRAINER' | 'BUILDER' | 'RANGES' | 'ANALYSIS';

export interface UserStats {
  handsPlayed: number;
  correct: number;
  streak: number;
  history: { date: string; accuracy: number }[];
}