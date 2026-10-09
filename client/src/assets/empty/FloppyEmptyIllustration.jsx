import React from 'react';

/**
 * Risograph Empty Floppy Diskette Illustration for "No Equipment" Empty States
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function FloppyEmptyIllustration({ className = '', width = '120px', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="No Equipment Floppy Disk Illustration"
    >
      <defs>
        <pattern id="dot-grid-flop" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
        </pattern>
      </defs>

      <circle cx="80" cy="80" r="72" fill="#ECE7DE" />
      <circle cx="80" cy="80" r="72" fill="url(#dot-grid-flop)" />
      <circle cx="80" cy="80" r="70" stroke="#16181D" strokeWidth="2" strokeDasharray="4 4" />

      {/* Floppy Shadow */}
      <path d="M40 28 H 116 L 126 38 V 132 H 40 Z" fill="#16181D" />

      {/* Floppy Main Body */}
      <path
        d="M36 24 H 112 L 122 34 V 128 H 36 Z"
        fill="#F4F1EA"
        stroke="#16181D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Metal Shutter in Signal Orange */}
      <rect x="52" y="24" width="52" height="38" rx="2" fill="#FF5A1F" stroke="#16181D" strokeWidth="2" />
      <rect x="68" y="30" width="14" height="24" rx="7" fill="#16181D" />
      <circle cx="75" cy="42" r="3" fill="#F4F1EA" />

      {/* Label Area */}
      <rect x="46" y="68" width="66" height="50" rx="3" fill="#ECE7DE" stroke="#16181D" strokeWidth="1.5" />
      <rect x="46" y="68" width="66" height="10" rx="2" fill="#16181D" />
      <text x="52" y="75" fontFamily="monospace" fontSize="5.5" fontWeight="bold" fill="#FF5A1F">
        0_RECORDS_FOUND
      </text>

      {/* Empty State Dashed Lines */}
      <line x1="52" y1="88" x2="106" y2="88" stroke="#D8D2C5" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="52" y1="98" x2="106" y2="98" stroke="#D8D2C5" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="52" y1="108" x2="88" y2="108" stroke="#D8D2C5" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Empty Circular Badge Tag */}
      <circle cx="116" cy="116" r="16" fill="#16181D" />
      <circle cx="116" cy="116" r="14" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />
      <text x="110" y="120" fontFamily="monospace" fontSize="12" fontWeight="900" fill="#F4F1EA">
        0
      </text>
    </svg>
  );
}
