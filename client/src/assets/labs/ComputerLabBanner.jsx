import React from 'react';

/**
 * Risograph/Halftone Banner for Computer Lab 1 (Alan Turing Complex)
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function ComputerLabBanner({ className = '', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 800 160"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lab-banner-svg ${className}`}
      style={{ width: '100%', height, ...style }}
      aria-label="Computer Lab 1 Banner"
    >
      <defs>
        <pattern id="comp-lab-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#D8D2C5" />
          <line x1="0" y1="0" x2="16" y2="0" stroke="#E8E3DA" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="16" stroke="#E8E3DA" strokeWidth="0.5" />
        </pattern>
        <pattern id="halftone-dots-comp" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2" fill="#FF5A1F" opacity="0.18" />
        </pattern>
      </defs>

      {/* Canvas Paper Base */}
      <rect width="800" height="160" fill="#ECE7DE" />
      <rect width="800" height="160" fill="url(#comp-lab-grid)" />
      <rect x="520" y="0" width="280" height="160" fill="url(#halftone-dots-comp)" />

      {/* Technical Blueprint Border & Registration Marks */}
      <rect x="12" y="12" width="776" height="136" fill="none" stroke="#16181D" strokeWidth="1.5" />
      <rect x="16" y="16" width="768" height="128" fill="none" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="4 4" />

      {/* Crosshair Marks */}
      <circle cx="24" cy="24" r="5" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />
      <line x1="16" y1="24" x2="32" y2="24" stroke="#FF5A1F" strokeWidth="1" />
      <line x1="24" y1="16" x2="24" y2="32" stroke="#FF5A1F" strokeWidth="1" />

      {/* Left Station 1 */}
      <rect x="48" y="44" width="72" height="60" rx="3" fill="#16181D" />
      <rect x="44" y="40" width="72" height="60" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />
      <rect x="50" y="46" width="60" height="42" rx="2" fill="#16181D" />
      <rect x="54" y="50" width="52" height="34" rx="1" fill="#ECE7DE" />
      <line x1="58" y1="56" x2="90" y2="56" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="62" x2="98" y2="62" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="58" y1="68" x2="84" y2="68" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="58" y="74" width="4" height="6" fill="#FF5A1F" />
      <rect x="68" y="100" width="24" height="6" rx="1" fill="#16181D" />
      <rect x="40" y="108" width="80" height="8" rx="1" fill="#16181D" />

      {/* Middle Station 2 (Highlighted with Signal Orange CRT) */}
      <rect x="148" y="36" width="96" height="76" rx="4" fill="#16181D" />
      <rect x="144" y="32" width="96" height="76" rx="4" fill="#FF5A1F" stroke="#16181D" strokeWidth="2.5" />
      <rect x="152" y="40" width="80" height="54" rx="2" fill="#16181D" />
      <rect x="156" y="44" width="72" height="46" rx="1" fill="#F4F1EA" />
      <path d="M162 67 Q 174 52, 186 67 T 210 67 T 222 67" stroke="#16181D" strokeWidth="2" fill="none" />
      <circle cx="226" cy="38" r="2.5" fill="#16181D" />
      <circle cx="232" cy="38" r="2.5" fill="#F4F1EA" />
      <rect x="178" y="108" width="28" height="8" rx="1" fill="#16181D" />
      <path d="M136 122 L 148 112 H 236 L 248 122 Z" fill="#ECE7DE" stroke="#16181D" strokeWidth="2" />
      <rect x="160" y="115" width="64" height="4" rx="0.5" fill="#16181D" />

      {/* Station 3 */}
      <rect x="272" y="48" width="68" height="56" rx="3" fill="#16181D" />
      <rect x="268" y="44" width="68" height="56" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />
      <rect x="274" y="50" width="56" height="38" rx="2" fill="#16181D" />
      <rect x="278" y="54" width="48" height="30" rx="1" fill="#ECE7DE" />
      <line x1="282" y1="60" x2="314" y2="60" stroke="#FF5A1F" strokeWidth="1.5" />
      <line x1="282" y1="66" x2="320" y2="66" stroke="#16181D" strokeWidth="1.5" />
      <rect x="290" y="100" width="24" height="6" rx="1" fill="#16181D" />
      <rect x="264" y="108" width="76" height="8" rx="1" fill="#16181D" />

      {/* Facility Header Typography Stamp */}
      <g transform="translate(420, 42)">
        <rect x="0" y="0" width="340" height="76" rx="3" fill="#16181D" />
        <rect x="-3" y="-3" width="340" height="76" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />
        <rect x="10" y="10" width="8" height="50" fill="#FF5A1F" />
        <text x="26" y="28" fontFamily="sans-serif" fontSize="16" fontWeight="900" letterSpacing="-0.5" fill="#16181D">
          COMPUTER LAB 1
        </text>
        <text x="26" y="44" fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="1" fill="#FF5A1F">
          ROOM 201 • ALAN TURING COMPLEX
        </text>
        <text x="26" y="58" fontFamily="monospace" fontSize="8" fill="#4A505C">
          HIGH-PERFORMANCE COMPUTE & WORKSTATIONS
        </text>
      </g>
    </svg>
  );
}
