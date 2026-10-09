import React from 'react';

/**
 * Risograph-style 3D Printer Extruder & Prototyping Fabrication Tool Illustration
 * 3-Color Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper Surface)
 */
export default function PeripheralsIllustration({ className = '', width = '100%', height = '100%', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="Fabrication, Prototyping, and Peripherals Illustration"
    >
      {/* Background Registration Grid */}
      <pattern id="dot-grid-periph" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
      </pattern>
      <rect x="10" y="10" width="180" height="140" fill="url(#dot-grid-periph)" opacity="0.6" rx="4" />

      {/* Heated Bed Base Shadow */}
      <rect x="28" y="126" width="144" height="16" rx="3" fill="#16181D" />

      {/* Heated Print Bed (Magnetic Spring Steel) */}
      <rect x="24" y="122" width="144" height="16" rx="3" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" />
      <line x1="24" y1="126" x2="168" y2="126" stroke="#D8D2C5" strokeWidth="1" />

      {/* Grid Pattern on Build Plate */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={`bed-grid-${i}`}
          x1={38 + i * 16}
          y1="126"
          x2={38 + i * 16}
          y2="138"
          stroke="#D8D2C5"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      ))}

      {/* Dual Z-Axis Guide Rods & Lead Screws */}
      <rect x="34" y="16" width="10" height="108" rx="1" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <line x1="39" y1="16" x2="39" y2="124" stroke="#16181D" strokeWidth="1" strokeDasharray="3 3" />

      <rect x="154" y="16" width="10" height="108" rx="1" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <line x1="159" y1="16" x2="159" y2="124" stroke="#16181D" strokeWidth="1" strokeDasharray="3 3" />

      {/* X-Axis Gantry Beam */}
      <rect x="26" y="52" width="146" height="18" rx="2" fill="#16181D" />
      <line x1="26" y1="61" x2="172" y2="61" stroke="#FF5A1F" strokeWidth="2" />

      {/* Extruder Carriage Shadow */}
      <rect x="76" y="38" width="56" height="54" rx="4" fill="#16181D" />

      {/* Extruder Motor & Hotend Assembly */}
      <rect x="72" y="34" width="56" height="54" rx="4" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" />

      {/* Stepper Motor Heatsink Fins */}
      <rect x="78" y="40" width="22" height="24" rx="2" fill="#16181D" />
      <line x1="82" y1="44" x2="96" y2="44" stroke="#ECE7DE" strokeWidth="1.5" />
      <line x1="82" y1="48" x2="96" y2="48" stroke="#ECE7DE" strokeWidth="1.5" />
      <line x1="82" y1="52" x2="96" y2="52" stroke="#ECE7DE" strokeWidth="1.5" />
      <line x1="82" y1="56" x2="96" y2="56" stroke="#ECE7DE" strokeWidth="1.5" />
      <line x1="82" y1="60" x2="96" y2="60" stroke="#ECE7DE" strokeWidth="1.5" />

      {/* Part Cooling Fan Grille (Radial) */}
      <circle cx="114" cy="52" r="10" fill="#16181D" />
      <circle cx="114" cy="52" r="8" fill="#FF5A1F" />
      <circle cx="114" cy="52" r="3" fill="#16181D" />
      <path d="M114 44 V 60 M106 52 H 122" stroke="#16181D" strokeWidth="1.5" />

      {/* Heater Block & Brass Nozzle (Signal Orange) */}
      <rect x="92" y="88" width="16" height="12" rx="1" fill="#16181D" />
      <polygon points="95,100 105,100 100,107" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />

      {/* Molten Filament Extrusion Line */}
      <line x1="100" y1="107" x2="100" y2="114" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" />

      {/* 3D Printed Polygonal Crystal / Calibration Cube in Progress */}
      <path
        d="M78 122 L 100 114 L 122 122 L 100 125 Z"
        fill="#FF5A1F"
        stroke="#16181D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M78 122 V 124 L 100 127 V 125 Z"
        fill="#16181D"
      />
      <path
        d="M122 122 V 124 L 100 127 V 125 Z"
        fill="#D8D2C5"
        stroke="#16181D"
        strokeWidth="1.5"
      />

      {/* Filament Spool Guide Tube */}
      <path
        d="M100 34 C 100 18 126 14 136 22"
        stroke="#FF5A1F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
