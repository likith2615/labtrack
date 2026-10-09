import React from 'react';

/**
 * Risograph/Halftone Banner for IoT & Embedded Systems Lab (James Clerk Maxwell Hall)
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function IoTLabBanner({ className = '', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 800 160"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lab-banner-svg ${className}`}
      style={{ width: '100%', height, ...style }}
      aria-label="IoT and Embedded Systems Lab Banner"
    >
      <defs>
        <pattern id="iot-lab-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#D8D2C5" />
          <line x1="0" y1="0" x2="16" y2="0" stroke="#E8E3DA" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="800" height="160" fill="#ECE7DE" />
      <rect width="800" height="160" fill="url(#iot-lab-grid)" />

      {/* Blueprint Border */}
      <rect x="12" y="12" width="776" height="136" fill="none" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="776" cy="136" r="5" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />

      {/* Breadboard Setup (Left) */}
      <rect x="38" y="34" width="112" height="74" rx="3" fill="#16181D" />
      <rect x="34" y="30" width="112" height="74" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2.5" />
      
      {/* Power Rails (Red and Blue) */}
      <line x1="38" y1="36" x2="142" y2="36" stroke="#DC2626" strokeWidth="1.5" />
      <line x1="38" y1="40" x2="142" y2="40" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="38" y1="94" x2="142" y2="94" stroke="#DC2626" strokeWidth="1.5" />
      <line x1="38" y1="98" x2="142" y2="98" stroke="#2563EB" strokeWidth="1.5" />

      {/* DIP Integrated Circuit (8-pin) on Breadboard */}
      <rect x="68" y="52" width="44" height="28" rx="2" fill="#16181D" />
      <circle cx="74" cy="58" r="1.5" fill="#ECE7DE" />
      <text x="80" y="69" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#FF5A1F">
        ATTINY
      </text>

      {/* Jumper Wires (Signal Orange, Blue, Ink) */}
      <path d="M46 54 C 46 44 64 44 68 56" stroke="#FF5A1F" strokeWidth="2" fill="none" />
      <path d="M112 56 C 124 44 136 50 136 70" stroke="#16181D" strokeWidth="2" fill="none" />
      <path d="M46 80 C 58 92 84 92 90 80" stroke="#2563EB" strokeWidth="2" fill="none" />

      {/* Single Board Computer Node (Centerpiece, Signal Orange PCB) */}
      <rect x="174" y="24" width="124" height="96" rx="5" fill="#16181D" />
      <rect x="170" y="20" width="124" height="96" rx="5" fill="#FF5A1F" stroke="#16181D" strokeWidth="2.5" />

      {/* USB and Ethernet Ports */}
      <rect x="160" y="32" width="14" height="26" rx="1.5" fill="#16181D" />
      <rect x="160" y="66" width="14" height="22" rx="1.5" fill="#D8D2C5" stroke="#16181D" strokeWidth="1.5" />

      {/* SoC Chip with Metallic Heatspreader */}
      <rect x="210" y="44" width="42" height="42" rx="3" fill="#16181D" />
      <rect x="214" y="48" width="34" height="34" rx="2" fill="#ECE7DE" stroke="#16181D" strokeWidth="1.5" />
      <text x="220" y="68" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#16181D">
        ARM64
      </text>

      {/* 40-Pin GPIO Header */}
      <rect x="180" y="24" width="80" height="9" rx="1" fill="#16181D" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
        <circle key={`gpio-${p}`} cx={184 + p * 8} cy="28.5" r="1.5" fill="#F4F1EA" />
      ))}

      {/* Wireless RF Telemetry Waves (Broadcast Symbol) */}
      <path d="M320 50 A 18 18 0 0 1 320 86" stroke="#FF5A1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M328 42 A 28 28 0 0 1 328 94" stroke="#16181D" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M336 34 A 38 38 0 0 1 336 102" stroke="#FF5A1F" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Facility Header Stamp */}
      <g transform="translate(420, 42)">
        <rect x="0" y="0" width="340" height="76" rx="3" fill="#16181D" />
        <rect x="-3" y="-3" width="340" height="76" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />
        <rect x="10" y="10" width="8" height="50" fill="#FF5A1F" />
        <text x="26" y="28" fontFamily="sans-serif" fontSize="16" fontWeight="900" letterSpacing="-0.5" fill="#16181D">
          IoT & EMBEDDED SYSTEMS
        </text>
        <text x="26" y="44" fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="1" fill="#FF5A1F">
          ROOM 402 • JAMES CLERK MAXWELL HALL
        </text>
        <text x="26" y="58" fontFamily="monospace" fontSize="8" fill="#4A505C">
          SINGLE-BOARD COMPUTING & SENSOR TELEMETRY
        </text>
      </g>
    </svg>
  );
}
