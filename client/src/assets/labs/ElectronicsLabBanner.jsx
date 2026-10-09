import React from 'react';

/**
 * Risograph/Halftone Banner for Electronics Lab (Michael Faraday Wing)
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function ElectronicsLabBanner({ className = '', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 800 160"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lab-banner-svg ${className}`}
      style={{ width: '100%', height, ...style }}
      aria-label="Electronics Lab Banner"
    >
      <defs>
        <pattern id="elec-lab-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#D8D2C5" />
          <line x1="0" y1="0" x2="16" y2="0" stroke="#E8E3DA" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="800" height="160" fill="#ECE7DE" />
      <rect width="800" height="160" fill="url(#elec-lab-grid)" />

      {/* Blueprint Border */}
      <rect x="12" y="12" width="776" height="136" fill="none" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="24" cy="136" r="5" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />

      {/* Test Bench Station 1: Function Generator */}
      <rect x="42" y="34" width="86" height="54" rx="3" fill="#16181D" />
      <rect x="38" y="30" width="86" height="54" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2.5" />
      <rect x="44" y="36" width="42" height="24" rx="1.5" fill="#16181D" />
      <text x="47" y="52" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#FF5A1F">
        10.00 kHz
      </text>
      <circle cx="102" cy="46" r="6" fill="#16181D" />
      <circle cx="102" cy="46" r="4" fill="#ECE7DE" />
      <circle cx="114" cy="46" r="3" fill="#FF5A1F" />
      <circle cx="50" cy="72" r="3.5" fill="#16181D" />
      <circle cx="62" cy="72" r="3.5" fill="#16181D" />
      <circle cx="74" cy="72" r="3.5" fill="#FF5A1F" />

      {/* Digital Storage Oscilloscope (Centerpiece, Signal Orange) */}
      <rect x="146" y="24" width="128" height="96" rx="4" fill="#16181D" />
      <rect x="142" y="20" width="128" height="96" rx="4" fill="#FF5A1F" stroke="#16181D" strokeWidth="2.5" />
      <rect x="150" y="28" width="70" height="58" rx="2" fill="#16181D" />
      <rect x="154" y="32" width="62" height="50" rx="1" fill="#F4F1EA" />

      {/* Screen Waveforms */}
      <path d="M156 57 Q 166 40, 176 57 T 196 57 T 214 57" stroke="#FF5A1F" strokeWidth="2" fill="none" />
      <path d="M156 68 H 168 V 60 H 180 V 68 H 192 V 60 H 204 V 68 H 214" stroke="#16181D" strokeWidth="1.5" fill="none" />

      {/* Scope Controls */}
      <circle cx="240" cy="42" r="8" fill="#16181D" />
      <circle cx="240" cy="42" r="6" fill="#ECE7DE" stroke="#16181D" strokeWidth="1" />
      <circle cx="240" cy="62" r="5" fill="#16181D" />
      <circle cx="254" cy="62" r="5" fill="#16181D" />
      <circle cx="236" cy="82" r="4" fill="#F4F1EA" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="248" cy="82" r="4" fill="#F4F1EA" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="260" cy="82" r="4" fill="#16181D" />

      {/* DC Linear Power Supply (Station 3) */}
      <rect x="294" y="34" width="78" height="76" rx="3" fill="#16181D" />
      <rect x="290" y="30" width="78" height="76" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2.5" />
      <rect x="296" y="36" width="30" height="18" rx="1" fill="#16181D" />
      <text x="298" y="49" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#1B873F">
        30.0 V
      </text>
      <rect x="332" y="36" width="30" height="18" rx="1" fill="#16181D" />
      <text x="334" y="49" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#FF5A1F">
        3.00 A
      </text>
      <circle cx="310" cy="70" r="5" fill="#16181D" />
      <circle cx="346" cy="70" r="5" fill="#16181D" />
      <circle cx="304" cy="92" r="3.5" fill="#DC2626" />
      <circle cx="320" cy="92" r="3.5" fill="#16181D" />
      <circle cx="336" cy="92" r="3.5" fill="#1B873F" />

      {/* Facility Header Stamp */}
      <g transform="translate(420, 42)">
        <rect x="0" y="0" width="340" height="76" rx="3" fill="#16181D" />
        <rect x="-3" y="-3" width="340" height="76" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />
        <rect x="10" y="10" width="8" height="50" fill="#FF5A1F" />
        <text x="26" y="28" fontFamily="sans-serif" fontSize="16" fontWeight="900" letterSpacing="-0.5" fill="#16181D">
          ELECTRONICS LAB
        </text>
        <text x="26" y="44" fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="1" fill="#FF5A1F">
          ROOM 305 • MICHAEL FARADAY WING
        </text>
        <text x="26" y="58" fontFamily="monospace" fontSize="8" fill="#4A505C">
          SIGNAL ANALYSIS, POWER ELECTRONICS & DIAGNOSTICS
        </text>
      </g>
    </svg>
  );
}
