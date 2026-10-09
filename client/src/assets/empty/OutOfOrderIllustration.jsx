import React from 'react';

/**
 * Risograph "OUT OF ORDER" Service Tag Illustration for Damaged Equipment / Maintenance Empty States
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #DC2626 (Warning Red)
 */
export default function OutOfOrderIllustration({ className = '', width = '120px', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="Out of Order Damaged Equipment Illustration"
    >
      <defs>
        <pattern id="dot-grid-ooo" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
        </pattern>
        <pattern id="hazard-stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="12" fill="#16181D" />
          <rect x="6" width="6" height="12" fill="#FF5A1F" />
        </pattern>
      </defs>

      <circle cx="80" cy="80" r="72" fill="#ECE7DE" />
      <circle cx="80" cy="80" r="72" fill="url(#dot-grid-ooo)" />
      <circle cx="80" cy="80" r="70" stroke="#16181D" strokeWidth="2" strokeDasharray="4 4" />

      {/* Hanging Service Tag Shadow */}
      <g transform="rotate(-6 80 80)">
        <path d="M54 22 L 106 22 L 122 38 L 122 138 L 38 138 L 38 38 Z" fill="#16181D" />

        {/* Tag Body */}
        <path
          d="M50 18 L 102 18 L 118 34 L 118 134 L 34 134 L 34 34 Z"
          fill="#F4F1EA"
          stroke="#16181D"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Brass Reinforcement Eyelet Hole */}
        <circle cx="76" cy="30" r="5" fill="#ECE7DE" stroke="#16181D" strokeWidth="2" />
        <circle cx="76" cy="30" r="2.5" fill="#16181D" />

        {/* Top Diagonal Hazard Stripe Header */}
        <rect x="37" y="42" width="78" height="16" fill="url(#hazard-stripes)" stroke="#16181D" strokeWidth="1.5" />

        {/* Tag Title Block */}
        <rect x="42" y="64" width="68" height="20" rx="2" fill="#16181D" />
        <text x="46" y="77" fontFamily="sans-serif" fontSize="8" fontWeight="900" letterSpacing="0.5" fill="#F4F1EA">
          OUT OF ORDER
        </text>

        {/* Wrench and Lightning Bolt Symbol */}
        <g transform="translate(62, 90)">
          <circle cx="14" cy="14" r="14" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />
          <path
            d="M8 8 L 14 14 L 20 8 L 22 10 L 16 16 L 20 20 L 18 22 L 14 18 L 10 22 L 8 20 L 12 16 L 6 10 Z"
            fill="#F4F1EA"
            stroke="#16181D"
            strokeWidth="1"
          />
        </g>

        {/* Footer Technical Serial */}
        <text x="40" y="126" fontFamily="monospace" fontSize="6.5" fontWeight="bold" fill="#16181D">
          TAG #NIST-CAL-FLT
        </text>
      </g>
    </svg>
  );
}
