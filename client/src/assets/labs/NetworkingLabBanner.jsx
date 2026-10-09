import React from 'react';

/**
 * Risograph/Halftone Banner for Networking Lab (Charles Babbage Hall)
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function NetworkingLabBanner({ className = '', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 800 160"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lab-banner-svg ${className}`}
      style={{ width: '100%', height, ...style }}
      aria-label="Networking Lab Banner"
    >
      <defs>
        <pattern id="net-lab-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#D8D2C5" />
          <line x1="0" y1="0" x2="16" y2="0" stroke="#E8E3DA" strokeWidth="0.5" />
        </pattern>
        <pattern id="net-halftone" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="#16181D" opacity="0.12" />
        </pattern>
      </defs>

      <rect width="800" height="160" fill="#ECE7DE" />
      <rect width="800" height="160" fill="url(#net-lab-grid)" />
      <rect x="0" y="0" width="360" height="160" fill="url(#net-halftone)" />

      {/* Blueprint Border */}
      <rect x="12" y="12" width="776" height="136" fill="none" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="776" cy="24" r="5" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />

      {/* 42U Server Rack Cabinet 1 */}
      <rect x="42" y="24" width="76" height="114" rx="3" fill="#16181D" />
      <rect x="38" y="20" width="76" height="114" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2.5" />
      
      {/* 1U Blades in Rack 1 */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={`rack1-u-${i}`}>
          <rect x="44" y={26 + i * 14} width="64" height="11" rx="1" fill="#ECE7DE" stroke="#16181D" strokeWidth="1" />
          <rect x="48" y={28 + i * 14} width="32" height="7" rx="0.5" fill="#16181D" />
          <circle cx="86" cy={31.5 + i * 14} r="1.5" fill={i % 2 === 0 ? '#FF5A1F' : '#1B873F'} />
          <circle cx="92" cy={31.5 + i * 14} r="1.5" fill={i % 3 === 0 ? '#FF5A1F' : '#16181D'} />
          <circle cx="98" cy={31.5 + i * 14} r="1.5" fill="#16181D" />
        </g>
      ))}

      {/* Server Rack Cabinet 2 (Highlighted with Signal Orange) */}
      <rect x="134" y="24" width="86" height="114" rx="3" fill="#16181D" />
      <rect x="130" y="20" width="86" height="114" rx="3" fill="#FF5A1F" stroke="#16181D" strokeWidth="2.5" />

      {/* Patch Panel in Rack 2 */}
      <rect x="136" y="26" width="74" height="20" rx="1" fill="#16181D" stroke="#16181D" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((p) => (
        <circle key={`p-${p}`} cx={142 + p * 12} cy="36" r="3" fill="#F4F1EA" />
      ))}

      {/* Core Routers in Rack 2 */}
      {[0, 1, 2, 3].map((r) => (
        <g key={`rack2-r-${r}`}>
          <rect x="136" y={50 + r * 19} width="74" height="15" rx="1" fill="#F4F1EA" stroke="#16181D" strokeWidth="1.5" />
          <rect x="140" y={53 + r * 19} width="24" height="9" rx="0.5" fill="#16181D" />
          <rect x="168" y={53 + r * 19} width="22" height="9" rx="0.5" fill="#ECE7DE" stroke="#16181D" strokeWidth="1" />
          <circle cx="196" cy={57.5 + r * 19} r="2" fill={r === 1 ? '#FF5A1F' : '#1B873F'} />
          <circle cx="203" cy={57.5 + r * 19} r="2" fill="#16181D" />
        </g>
      ))}

      {/* Network Topology Graph Overlay Lines */}
      <path d="M142 36 C 220 20 240 70 290 50" stroke="#16181D" strokeWidth="2" fill="none" strokeDasharray="4 3" />
      <path d="M178 36 C 240 60 260 110 320 90" stroke="#FF5A1F" strokeWidth="2" fill="none" />
      <circle cx="290" cy="50" r="4" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="320" cy="90" r="4" fill="#16181D" stroke="#ECE7DE" strokeWidth="1.5" />

      {/* Facility Header Stamp */}
      <g transform="translate(420, 42)">
        <rect x="0" y="0" width="340" height="76" rx="3" fill="#16181D" />
        <rect x="-3" y="-3" width="340" height="76" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />
        <rect x="10" y="10" width="8" height="50" fill="#FF5A1F" />
        <text x="26" y="28" fontFamily="sans-serif" fontSize="16" fontWeight="900" letterSpacing="-0.5" fill="#16181D">
          NETWORKING LAB
        </text>
        <text x="26" y="44" fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="1" fill="#FF5A1F">
          ROOM 204 • CHARLES BABBAGE HALL
        </text>
        <text x="26" y="58" fontFamily="monospace" fontSize="8" fill="#4A505C">
          ROUTING, SWITCHING & OPTICAL INFRASTRUCTURE
        </text>
      </g>
    </svg>
  );
}
