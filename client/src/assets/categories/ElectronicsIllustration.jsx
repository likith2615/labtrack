import React from 'react';

/**
 * Risograph-style Electronic Oscilloscope & Test Bench Illustration
 * 3-Color Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper Surface)
 */
export default function ElectronicsIllustration({ className = '', width = '100%', height = '100%', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="Electronic Test and Measurement Illustration"
    >
      {/* Background Registration Grid */}
      <pattern id="dot-grid-el" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
      </pattern>
      <rect x="10" y="10" width="180" height="140" fill="url(#dot-grid-el)" opacity="0.6" rx="4" />

      {/* Heavy Steel Oscilloscope Case Shadow */}
      <rect x="22" y="24" width="156" height="114" rx="5" fill="#16181D" />

      {/* Oscilloscope Outer Chassis */}
      <rect x="18" y="20" width="156" height="114" rx="5" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" />

      {/* Top Carry Handle */}
      <path d="M60 20V14H140V20" stroke="#16181D" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="85" y="11" width="30" height="5" rx="1" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />

      {/* CRT Display Bezel */}
      <rect x="26" y="30" width="84" height="76" rx="4" fill="#16181D" />

      {/* Phosphor Grid Screen */}
      <rect x="30" y="34" width="76" height="68" rx="2" fill="#F4F1EA" />

      {/* Reticle / Graticule Grid Lines (8x8 divisions) */}
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <React.Fragment key={`grid-${i}`}>
          <line
            x1={30 + i * 9.5}
            y1="34"
            x2={30 + i * 9.5}
            y2="102"
            stroke="#D8D2C5"
            strokeWidth="0.75"
            strokeDasharray={i === 4 ? 'none' : '1 2'}
          />
          <line
            x1="30"
            y1={34 + i * 8.5}
            x2="106"
            y2={34 + i * 8.5}
            stroke="#D8D2C5"
            strokeWidth="0.75"
            strokeDasharray={i === 4 ? 'none' : '1 2'}
          />
        </React.Fragment>
      ))}

      {/* Sine Wave & Signal Trigger Display (Signal Orange) */}
      <path
        d="M32 68 Q 40 46, 48 68 T 64 68 T 80 68 T 96 68 T 104 68"
        stroke="#FF5A1F"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Dual Channel Pulse Wave (Dark Ink) */}
      <path
        d="M32 86 H 42 V 76 H 54 V 86 H 66 V 76 H 78 V 86 H 90 V 76 H 102"
        stroke="#16181D"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* On-Screen Measurement Header Text */}
      <rect x="33" y="37" width="22" height="4" rx="0.5" fill="#16181D" />
      <rect x="58" y="37" width="18" height="4" rx="0.5" fill="#FF5A1F" />

      {/* Right Control Instrument Panel (Knobs & Switches) */}
      <rect x="116" y="30" width="52" height="96" rx="2" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />

      {/* Large TIME/DIV Rotary Knob */}
      <circle cx="142" cy="46" r="10" fill="#16181D" />
      <circle cx="142" cy="46" r="8" fill="#ECE7DE" stroke="#16181D" strokeWidth="1.5" />
      <line x1="142" y1="46" x2="148" y2="40" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round" />
      <circle cx="142" cy="46" r="2.5" fill="#16181D" />

      {/* Volts/Div Knobs (CH1 and CH2) */}
      <circle cx="130" cy="70" r="7" fill="#16181D" />
      <circle cx="130" cy="70" r="5" fill="#ECE7DE" stroke="#16181D" strokeWidth="1" />
      <line x1="130" y1="70" x2="134" y2="67" stroke="#FF5A1F" strokeWidth="1.5" />

      <circle cx="154" cy="70" r="7" fill="#16181D" />
      <circle cx="154" cy="70" r="5" fill="#ECE7DE" stroke="#16181D" strokeWidth="1" />
      <line x1="154" y1="70" x2="151" y2="66" stroke="#16181D" strokeWidth="1.5" />

      {/* Trigger Level & Mode Buttons */}
      <rect x="124" y="84" width="8" height="6" rx="1" fill="#FF5A1F" stroke="#16181D" strokeWidth="1" />
      <rect x="136" y="84" width="8" height="6" rx="1" fill="#16181D" />
      <rect x="148" y="84" width="8" height="6" rx="1" fill="#16181D" />

      {/* Channel 1 & Channel 2 BNC Sockets */}
      <g>
        <circle cx="130" cy="104" r="5" fill="#ECE7DE" stroke="#16181D" strokeWidth="2" />
        <circle cx="130" cy="104" r="2" fill="#FF5A1F" />
        <circle cx="130" cy="104" r="0.75" fill="#16181D" />
      </g>
      <g>
        <circle cx="154" cy="104" r="5" fill="#ECE7DE" stroke="#16181D" strokeWidth="2" />
        <circle cx="154" cy="104" r="2" fill="#16181D" />
        <circle cx="154" cy="104" r="0.75" fill="#F4F1EA" />
      </g>

      {/* External Trigger & Ground Lug */}
      <circle cx="142" cy="117" r="3.5" fill="#16181D" />
      <circle cx="142" cy="117" r="1.5" fill="#D8D2C5" />

      {/* Bottom Panel Power Rocker & Calibrator Port */}
      <rect x="28" y="112" width="14" height="8" rx="1" fill="#16181D" />
      <circle cx="35" cy="116" r="2" fill="#FF5A1F" />

      <rect x="48" y="114" width="16" height="4" rx="0.5" fill="#16181D" />
      <circle cx="70" cy="116" r="2.5" fill="#16181D" />

      {/* BNC Coaxial Probe Cable with Clip */}
      <path
        d="M130 109C130 140 76 138 60 148"
        stroke="#16181D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Probe Handle */}
      <rect x="46" y="145" width="16" height="6" rx="1" transform="rotate(-15 46 145)" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />
      <line x1="42" y1="148" x2="34" y2="150" stroke="#16181D" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
