import React from 'react';

/**
 * Risograph Sad Computer CRT Illustration for "No Results Found" Empty States
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function SadComputerIllustration({ className = '', width = '120px', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="No Results Sad Computer Illustration"
    >
      <defs>
        <pattern id="dot-grid-sad" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
        </pattern>
      </defs>

      <circle cx="80" cy="80" r="72" fill="#ECE7DE" />
      <circle cx="80" cy="80" r="72" fill="url(#dot-grid-sad)" />
      <circle cx="80" cy="80" r="70" stroke="#16181D" strokeWidth="2" strokeDasharray="4 4" />

      {/* Monitor Shadow */}
      <rect x="36" y="28" width="92" height="80" rx="6" fill="#16181D" />

      {/* Monitor Main Housing */}
      <rect x="32" y="24" width="92" height="80" rx="6" fill="#F4F1EA" stroke="#16181D" strokeWidth="2.5" />

      {/* Screen Inset */}
      <rect x="40" y="32" width="76" height="54" rx="3" fill="#16181D" />
      <rect x="43" y="35" width="70" height="48" rx="2" fill="#ECE7DE" />

      {/* Scan Lines */}
      <line x1="44" y1="42" x2="112" y2="42" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="44" y1="48" x2="112" y2="48" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="44" y1="54" x2="112" y2="54" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="44" y1="60" x2="112" y2="60" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="44" y1="66" x2="112" y2="66" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="44" y1="72" x2="112" y2="72" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="44" y1="78" x2="112" y2="78" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="2 2" />

      {/* Pixel Sad Face on CRT : ( */}
      {/* Eyes */}
      <rect x="58" y="46" width="6" height="8" rx="1" fill="#16181D" />
      <rect x="92" y="46" width="6" height="8" rx="1" fill="#16181D" />

      {/* Downturned Sad Mouth */}
      <path
        d="M62 70 Q 78 58, 94 70"
        stroke="#FF5A1F"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Single Orange Pixel Tear */}
      <rect x="94" y="58" width="4" height="6" rx="1" fill="#FF5A1F" />

      {/* Floppy Drive Slot */}
      <rect x="42" y="92" width="34" height="4" rx="1" fill="#16181D" />
      <circle cx="78" cy="94" r="1.5" fill="#FF5A1F" />

      {/* Ventilation Grille */}
      <circle cx="98" cy="94" r="1.5" fill="#16181D" />
      <circle cx="104" cy="94" r="1.5" fill="#16181D" />
      <circle cx="110" cy="94" r="1.5" fill="#16181D" />

      {/* Stand Neck & Foot */}
      <rect x="68" y="104" width="20" height="10" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <rect x="54" y="114" width="48" height="6" rx="2" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />

      {/* Unplugged Disconnected Cable */}
      <path d="M102 118 C 114 118 126 128 132 124" stroke="#16181D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="134" cy="123" r="2.5" fill="#FF5A1F" />
    </svg>
  );
}
