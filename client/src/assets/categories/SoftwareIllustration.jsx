import React from 'react';

/**
 * Risograph-style 3.5" Retro Floppy Disk & Software Licence Illustration
 * 3-Color Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper Surface)
 */
export default function SoftwareIllustration({ className = '', width = '100%', height = '100%', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="Software Licences Illustration"
    >
      {/* Background Registration Grid */}
      <pattern id="dot-grid-soft" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
      </pattern>
      <rect x="10" y="10" width="180" height="140" fill="url(#dot-grid-soft)" opacity="0.6" rx="4" />

      {/* Floppy Disk Drop Shadow */}
      <path
        d="M48 20 H 146 L 158 32 V 144 H 48 Z"
        fill="#16181D"
      />

      {/* Main Floppy Disk Plastic Housing */}
      <path
        d="M44 16 H 142 L 154 28 V 140 H 44 Z"
        fill="#ECE7DE"
        stroke="#16181D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Write-Protect Notch & High-Density Notch */}
      <rect x="49" y="132" width="6" height="5" fill="#16181D" />
      <rect x="143" y="132" width="6" height="5" fill="#16181D" />

      {/* Top Sliding Metal Shutter (Dark Ink & Orange accent) */}
      <rect x="66" y="16" width="66" height="46" rx="2" fill="#16181D" />
      <rect x="70" y="20" width="58" height="38" rx="1" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />

      {/* Shutter Oval Read/Write Head Window */}
      <rect x="86" y="24" width="16" height="30" rx="8" fill="#16181D" />
      <circle cx="94" cy="39" r="4" fill="#D8D2C5" />

      {/* Floppy Shutter Spring Retraction Groove */}
      <line x1="74" y1="24" x2="74" y2="52" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="124" y1="24" x2="124" y2="52" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />

      {/* Disk Adhesive Label Area (Cream Paper) */}
      <rect x="56" y="70" width="86" height="62" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />

      {/* Top Color Stripe on Label (Signal Orange) */}
      <rect x="56" y="70" width="86" height="12" rx="2" fill="#FF5A1F" />
      <text x="60" y="79" fontFamily="monospace" fontSize="6.5" fontWeight="bold" fill="#F4F1EA">
        LICENCE KEY #001
      </text>

      {/* Label Ruled Lines & Text */}
      <line x1="62" y1="90" x2="136" y2="90" stroke="#D8D2C5" strokeWidth="1" />
      <rect x="62" y="85" width="46" height="3.5" rx="0.5" fill="#16181D" />

      <line x1="62" y1="102" x2="136" y2="102" stroke="#D8D2C5" strokeWidth="1" />
      <rect x="62" y="97" width="58" height="3.5" rx="0.5" fill="#16181D" />

      <line x1="62" y1="114" x2="136" y2="114" stroke="#D8D2C5" strokeWidth="1" />
      <rect x="62" y="109" width="34" height="3.5" rx="0.5" fill="#16181D" />

      {/* Barcode / Authenticity Seal on Label */}
      <g transform="translate(62, 118)">
        <rect x="0" y="0" width="2" height="9" fill="#16181D" />
        <rect x="3" y="0" width="1" height="9" fill="#16181D" />
        <rect x="5" y="0" width="3" height="9" fill="#16181D" />
        <rect x="9" y="0" width="1.5" height="9" fill="#16181D" />
        <rect x="12" y="0" width="2" height="9" fill="#16181D" />
        <rect x="15" y="0" width="1" height="9" fill="#16181D" />
        <rect x="18" y="0" width="2.5" height="9" fill="#16181D" />
        <rect x="22" y="0" width="1" height="9" fill="#16181D" />
        <rect x="25" y="0" width="2" height="9" fill="#16181D" />
      </g>

      <text x="96" y="126" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="#FF5A1F">
        1.44MB HD
      </text>

      {/* Disk Drive Inset Arrow */}
      <path d="M52 34 L 56 30 V 38 Z" fill="#16181D" />
    </svg>
  );
}
