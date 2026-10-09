import React from 'react';

/**
 * Risograph-style Managed Switch & Rack Router Illustration
 * 3-Color Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper Surface)
 */
export default function NetworkingIllustration({ className = '', width = '100%', height = '100%', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="Networking Equipment Illustration"
    >
      {/* Background Registration Grid */}
      <pattern id="dot-grid-net" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
      </pattern>
      <rect x="10" y="10" width="180" height="140" fill="url(#dot-grid-net)" opacity="0.6" rx="4" />

      {/* Top 1U Managed Switch Shadow */}
      <rect x="22" y="32" width="156" height="38" rx="3" fill="#16181D" />
      
      {/* Top 1U Managed Switch Casing */}
      <rect x="18" y="28" width="156" height="38" rx="3" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" />

      {/* Rack Ears & Mounting Screws */}
      <rect x="18" y="28" width="14" height="38" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <circle cx="25" cy="37" r="2" fill="#16181D" />
      <circle cx="25" cy="57" r="2" fill="#16181D" />

      <rect x="160" y="28" width="14" height="38" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <circle cx="167" cy="37" r="2" fill="#16181D" />
      <circle cx="167" cy="57" r="2" fill="#16181D" />

      {/* Port Bank 1 (RJ45 8-port block) */}
      <rect x="38" y="38" width="58" height="18" rx="1.5" fill="#16181D" />
      {/* RJ45 Ports */}
      {[0, 1, 2, 3].map((i) => (
        <g key={`rj45-top-${i}`}>
          <rect x={42 + i * 13} y="41" width="10" height="6" rx="0.5" fill="#F4F1EA" />
          <rect x={42 + i * 13} y="48.5" width="10" height="6" rx="0.5" fill="#F4F1EA" />
          {/* LED indicators */}
          <circle cx={47 + i * 13} cy="35" r="1.5" fill={i === 1 || i === 2 ? '#FF5A1F' : '#16181D'} />
        </g>
      ))}

      {/* Port Bank 2 (SFP+ Fiber Cages) */}
      <rect x="102" y="38" width="34" height="18" rx="1.5" fill="#16181D" />
      <rect x="105" y="41" width="13" height="13" rx="1" fill="#FF5A1F" />
      <rect x="120" y="41" width="13" height="13" rx="1" fill="#F4F1EA" stroke="#16181D" strokeWidth="1" />
      <circle cx="111.5" cy="35" r="1.5" fill="#FF5A1F" />
      <circle cx="126.5" cy="35" r="1.5" fill="#16181D" />

      {/* Console / Management Port & Status Block */}
      <rect x="141" y="41" width="13" height="13" rx="1" fill="#16181D" />
      <circle cx="147.5" cy="35" r="1.5" fill="#1B873F" />

      {/* Bottom 2U Edge Router Shadow */}
      <rect x="22" y="86" width="156" height="48" rx="3" fill="#16181D" />

      {/* Bottom 2U Edge Router Casing */}
      <rect x="18" y="82" width="156" height="48" rx="3" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" />

      {/* Bottom Rack Ears */}
      <rect x="18" y="82" width="14" height="48" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <circle cx="25" cy="92" r="2" fill="#16181D" />
      <circle cx="25" cy="120" r="2" fill="#16181D" />

      <rect x="160" y="82" width="14" height="48" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <circle cx="167" cy="92" r="2" fill="#16181D" />
      <circle cx="167" cy="120" r="2" fill="#16181D" />

      {/* LCD Telemetry Matrix Display */}
      <rect x="38" y="92" width="46" height="28" rx="2" fill="#16181D" />
      <rect x="41" y="95" width="40" height="22" rx="1" fill="#F4F1EA" />
      <text x="44" y="103" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="#FF5A1F">
        GW_ONLINE
      </text>
      <text x="44" y="111" fontFamily="monospace" fontSize="5" fontWeight="bold" fill="#16181D">
        10.0.4.1/24
      </text>

      {/* Network Activity Bar Graph on LCD */}
      <rect x="44" y="113" width="5" height="2" fill="#16181D" />
      <rect x="50" y="112" width="5" height="3" fill="#16181D" />
      <rect x="56" y="110" width="5" height="5" fill="#FF5A1F" />
      <rect x="62" y="109" width="5" height="6" fill="#FF5A1F" />
      <rect x="68" y="111" width="5" height="4" fill="#16181D" />

      {/* Gigabit Uplink Interface Modules */}
      <rect x="90" y="92" width="42" height="28" rx="1.5" fill="#16181D" />
      <rect x="94" y="96" width="15" height="9" rx="0.5" fill="#F4F1EA" />
      <rect x="113" y="96" width="15" height="9" rx="0.5" fill="#F4F1EA" />
      <rect x="94" y="107" width="15" height="9" rx="0.5" fill="#FF5A1F" />
      <rect x="113" y="107" width="15" height="9" rx="0.5" fill="#F4F1EA" />

      {/* Dual Redundant Power & Exhaust Grille */}
      <rect x="138" y="92" width="16" height="28" rx="1.5" fill="#16181D" />
      <line x1="141" y1="97" x2="151" y2="97" stroke="#ECE7DE" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="141" y1="102" x2="151" y2="102" stroke="#ECE7DE" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="141" y1="107" x2="151" y2="107" stroke="#ECE7DE" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="141" y1="112" x2="151" y2="112" stroke="#ECE7DE" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="146" cy="116.5" r="1.5" fill="#FF5A1F" />

      {/* Looping Patch Cable */}
      <path
        d="M58 44C58 66 112 66 112 44"
        stroke="#FF5A1F"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M84 44C84 76 102 76 102 96"
        stroke="#16181D"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
