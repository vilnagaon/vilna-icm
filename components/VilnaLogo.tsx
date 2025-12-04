import React from 'react';

export const VilnaLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="6" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Left Leg */}
    <path d="M 30 75 L 55 10" />
    {/* Right Leg */}
    <path d="M 52 10 L 80 85" />
    {/* Crossbar - slightly curved/angled based on sketch */}
    <path d="M 25 38 Q 50 32 82 58" />
    {/* Teeth/Fangs */}
    <path d="M 45 40 L 44 58" strokeWidth="7" />
    <path d="M 60 46 L 58 62" strokeWidth="7" />
    {/* Dot */}
    <circle cx="56" cy="28" r="6" fill="currentColor" stroke="none" />
  </svg>
);
