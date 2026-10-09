import React from 'react';

/**
 * Risograph/Halftone Banner for Mechanical Workshop (Hangar 1 Annex)
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function MechanicalLabBanner({ className = '', height = '120px', style = {} }) {
  return (
    <svg
      viewBox="0 0 800 160"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`lab-banner-svg ${className}`}
      style={{ width: '100%', height, ...style }}
      aria-label="Mechanical Workshop Banner"
    >
      <defs>
        <pattern id="mech-lab-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#D8D2C5" />
          <line x1="0" y1="0" x2="16" y2="0" stroke="#E8E3DA" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="800" height="160" fill="#ECE7DE" />
      <rect width="800" height="160" fill="url(#mech-lab-grid)" />

      {/* Blueprint Border */}
      <rect x="12" y="12" width="776" height="136" fill="none" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="5" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />

      {/* Heavy Engineering Tool Workbench / CNC Bed */}
      <rect x="38" y="34" width="112" height="84" rx="3" fill="#16181D" />
      <rect x="34" y="30" width="112" height="84" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2.5" />

      {/* Rotary Chuck & Gear Transmission Mechanism */}
      <circle cx="80" cy="64" r="24" fill="#16181D" />
      <circle cx="80" cy="64" r="20" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="80" cy="64" r="12" fill="#ECE7DE" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="80" cy="64" r="4" fill="#16181D" />
      {/* Gear Teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={`gear-tooth-${angle}`}
          x="77.5"
          y="36"
          width="5"
          height="7"
          rx="1"
          fill="#16181D"
          transform={`rotate(${angle} 80 64)`}
        />
      ))}

      {/* Digital Vernier Caliper (Station 2, Centerpiece) */}
      <g transform="translate(170, 30)">
        <rect x="4" y="4" width="136" height="74" rx="4" fill="#16181D" />
        <rect x="0" y="0" width="136" height="74" rx="4" fill="#FF5A1F" stroke="#16181D" strokeWidth="2.5" />
        
        {/* Caliper Main Stainless Steel Beam */}
        <rect x="10" y="24" width="116" height="14" rx="1" fill="#F4F1EA" stroke="#16181D" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((t) => (
          <line
            key={`scale-${t}`}
            x1={16 + t * 7.5}
            y1="24"
            x2={16 + t * 7.5}
            y2={t % 5 === 0 ? 34 : 29}
            stroke="#16181D"
            strokeWidth="1"
          />
        ))}

        {/* Digital LCD Slider Head */}
        <rect x="46" y="14" width="46" height="34" rx="2" fill="#16181D" />
        <rect x="50" y="18" width="38" height="18" rx="1" fill="#ECE7DE" />
        <text x="54" y="31" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#16181D">
          25.40mm
        </text>

        {/* Caliper Measuring Jaws */}
        <path d="M10 24 L 6 56 L 14 56 L 18 38" fill="#F4F1EA" stroke="#16181D" strokeWidth="1.5" />
        <path d="M46 24 L 42 56 L 50 56 L 54 38" fill="#16181D" stroke="#16181D" strokeWidth="1.5" />
      </g>

      {/* 3D Fabricator Hotend & Linear Rail (Station 3) */}
      <rect x="324" y="34" width="60" height="84" rx="3" fill="#16181D" />
      <rect x="320" y="30" width="60" height="84" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2.5" />
      <rect x="326" y="38" width="48" height="8" rx="1" fill="#D8D2C5" stroke="#16181D" strokeWidth="1" />
      <rect x="338" y="46" width="24" height="30" rx="2" fill="#16181D" />
      <circle cx="350" cy="56" r="6" fill="#FF5A1F" />
      <polygon points="345,76 355,76 350,84" fill="#FF5A1F" stroke="#16181D" strokeWidth="1" />
      <rect x="330" y="96" width="40" height="8" rx="1" fill="#16181D" />

      {/* Facility Header Stamp */}
      <g transform="translate(420, 42)">
        <rect x="0" y="0" width="340" height="76" rx="3" fill="#16181D" />
        <rect x="-3" y="-3" width="340" height="76" rx="3" fill="#F4F1EA" stroke="#16181D" strokeWidth="2" />
        <rect x="10" y="10" width="8" height="50" fill="#FF5A1F" />
        <text x="26" y="28" fontFamily="sans-serif" fontSize="16" fontWeight="900" letterSpacing="-0.5" fill="#16181D">
          MECHANICAL WORKSHOP
        </text>
        <text x="26" y="44" fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="1" fill="#FF5A1F">
          GROUND FLOOR • HANGAR 1 ANNEX
        </text>
        <text x="26" y="58" fontFamily="monospace" fontSize="8" fill="#4A505C">
          ADDITIVE FABRICATION, CNC MACHINING & METROLOGY
        </text>
      </g>
    </svg>
  );
}
