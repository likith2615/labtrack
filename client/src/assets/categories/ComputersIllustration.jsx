import React from 'react';

/**
 * Risograph-style CRT Workstation & Keyboard Illustration
 * 3-Color Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper Surface)
 */
export default function ComputersIllustration({ className = '', width = '100%', height = '100%', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="Computing Systems Illustration"
    >
      {/* Background Registration Grid / Dot Halftone */}
      <pattern id="dot-grid-comp" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
      </pattern>
      <rect x="10" y="10" width="180" height="140" fill="url(#dot-grid-comp)" opacity="0.6" rx="4" />

      {/* CRT Shadow / Block Base */}
      <rect x="42" y="18" width="116" height="96" rx="6" fill="#16181D" />
      
      {/* CRT Main Casing */}
      <rect x="38" y="14" width="116" height="96" rx="6" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" />
      
      {/* Ventilation Slits */}
      <line x1="50" y1="22" x2="74" y2="22" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="26" x2="74" y2="26" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="30" x2="74" y2="30" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />

      {/* Screen Bezel Inset */}
      <rect x="48" y="36" width="96" height="64" rx="4" fill="#16181D" stroke="#16181D" strokeWidth="2" />

      {/* Phosphor Screen */}
      <rect x="52" y="40" width="88" height="56" rx="3" fill="#F4F1EA" />

      {/* Scan Lines on Screen */}
      <line x1="54" y1="46" x2="138" y2="46" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="54" y1="52" x2="138" y2="52" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="54" y1="58" x2="138" y2="58" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="54" y1="64" x2="138" y2="64" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="54" y1="70" x2="138" y2="70" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="54" y1="76" x2="138" y2="76" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="54" y1="82" x2="138" y2="82" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="3 2" />

      {/* Terminal Code / Waveform on Screen */}
      <rect x="58" y="48" width="28" height="4" rx="1" fill="#FF5A1F" />
      <rect x="58" y="56" width="48" height="3" rx="1" fill="#16181D" />
      <rect x="58" y="62" width="38" height="3" rx="1" fill="#16181D" />
      <rect x="58" y="68" width="56" height="3" rx="1" fill="#16181D" />

      {/* Blinking Prompt Cursor */}
      <rect x="58" y="76" width="6" height="8" rx="0.5" fill="#FF5A1F" />

      {/* Monitor Power LED & Knobs */}
      <circle cx="126" cy="24" r="2.5" fill="#FF5A1F" />
      <circle cx="134" cy="24" r="2.5" fill="#16181D" />
      <circle cx="142" cy="24" r="2" fill="#D8D2C5" stroke="#16181D" strokeWidth="1" />

      {/* Floppy Drive Slot on CRT Case Base */}
      <rect x="88" y="21" width="30" height="3.5" rx="1" fill="#16181D" />
      <circle cx="121" cy="22.75" r="1.25" fill="#FF5A1F" />

      {/* Monitor Stand Base */}
      <path d="M84 110L80 120H112L108 110H84Z" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" strokeLinejoin="round" />
      <rect x="70" y="119" width="52" height="5" rx="2" fill="#ECE7DE" stroke="#16181D" strokeWidth="2" />

      {/* Mechanical Keyboard Base (Perspective) */}
      <path d="M30 144L44 126H148L162 144H30Z" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Keyboard Key Rows */}
      {/* Row 1 */}
      <rect x="49" y="129" width="8" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="60" y="129" width="8" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="71" y="129" width="8" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="82" y="129" width="8" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="93" y="129" width="8" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="104" y="129" width="8" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="115" y="129" width="8" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="126" y="129" width="14" height="3.5" rx="0.5" fill="#FF5A1F" />

      {/* Row 2 */}
      <rect x="46" y="134" width="9" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="58" y="134" width="9" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="70" y="134" width="9" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="82" y="134" width="9" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="94" y="134" width="9" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="106" y="134" width="9" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="118" y="134" width="9" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="130" y="134" width="13" height="3.5" rx="0.5" fill="#16181D" />

      {/* Spacebar Row */}
      <rect x="42" y="139.5" width="12" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="57" y="139.5" width="10" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="70" y="139.5" width="46" height="3.5" rx="0.5" fill="#FF5A1F" />
      <rect x="119" y="139.5" width="10" height="3.5" rx="0.5" fill="#16181D" />
      <rect x="132" y="139.5" width="14" height="3.5" rx="0.5" fill="#16181D" />

      {/* Coiled Cord */}
      <path d="M148 132C156 130 162 124 158 116C154 108 164 104 168 110" stroke="#16181D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
