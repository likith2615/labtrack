import React from 'react';

/**
 * Risograph-style Microcontroller & Measuring Instrument Board Illustration
 * 3-Color Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper Surface)
 */
export default function MeasuringInstrumentsIllustration({ className = '', width = '100%', height = '100%', style = {} }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-svg ${className}`}
      style={{ width, height, ...style }}
      aria-label="Microcontrollers and Measuring Instruments Illustration"
    >
      {/* Background Registration Grid */}
      <pattern id="dot-grid-meas" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#D8D2C5" />
      </pattern>
      <rect x="10" y="10" width="180" height="140" fill="url(#dot-grid-meas)" opacity="0.6" rx="4" />

      {/* PCB Circuit Board Drop Shadow */}
      <rect x="28" y="24" width="144" height="112" rx="6" fill="#16181D" />

      {/* Main PCB Substrate */}
      <rect x="24" y="20" width="144" height="112" rx="6" fill="#ECE7DE" stroke="#16181D" strokeWidth="2.5" />

      {/* PCB Corner Mounting Holes */}
      <circle cx="32" cy="28" r="3.5" fill="#D8D2C5" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="160" cy="28" r="3.5" fill="#D8D2C5" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="32" cy="124" r="3.5" fill="#D8D2C5" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="160" cy="124" r="3.5" fill="#D8D2C5" stroke="#16181D" strokeWidth="1.5" />

      {/* USB-C / Type-B Metal Connector */}
      <rect x="14" y="58" width="16" height="36" rx="2" fill="#D8D2C5" stroke="#16181D" strokeWidth="2" />
      <rect x="18" y="66" width="10" height="20" rx="1" fill="#16181D" />

      {/* DC Barrel Jack */}
      <rect x="24" y="100" width="22" height="20" rx="2" fill="#16181D" />
      <circle cx="35" cy="110" r="4" fill="#ECE7DE" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="35" cy="110" r="1.5" fill="#16181D" />

      {/* Top Female Header Pins (14-pin single-in-line) */}
      <rect x="54" y="23" width="94" height="8" rx="1" fill="#16181D" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <circle key={`top-pin-${i}`} cx={58 + i * 7.5} cy="27" r="1.75" fill="#F4F1EA" />
      ))}

      {/* Bottom Header Pins */}
      <rect x="54" y="121" width="94" height="8" rx="1" fill="#16181D" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <circle key={`bot-pin-${i}`} cx={58 + i * 7.5} cy="125" r="1.75" fill="#F4F1EA" />
      ))}

      {/* Main SoC Processor QFP/DIP Chip with Orange Accent */}
      <rect x="74" y="52" width="48" height="48" rx="3" fill="#16181D" />
      <rect x="78" y="56" width="40" height="40" rx="2" fill="#FF5A1F" stroke="#16181D" strokeWidth="1.5" />
      <circle cx="83" cy="61" r="2" fill="#16181D" />
      <rect x="86" y="68" width="24" height="16" rx="1" fill="#16181D" />
      <text x="89" y="79" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#F4F1EA">
        MCU
      </text>

      {/* Microcontroller Pin Leads */}
      {[0, 1, 2, 3, 4].map((i) => (
        <React.Fragment key={`mcu-pin-${i}`}>
          <line x1={78 + i * 8} y1="48" x2={78 + i * 8} y2="52" stroke="#16181D" strokeWidth="1.5" />
          <line x1={78 + i * 8} y1="100" x2={78 + i * 8} y2="104" stroke="#16181D" strokeWidth="1.5" />
          <line x1="70" y1={58 + i * 8} x2="74" y2={58 + i * 8} stroke="#16181D" strokeWidth="1.5" />
          <line x1="122" y1={58 + i * 8} x2="126" y2={58 + i * 8} stroke="#16181D" strokeWidth="1.5" />
        </React.Fragment>
      ))}

      {/* Crystal Oscillator (16.000 MHz) */}
      <rect x="52" y="70" width="14" height="8" rx="2" fill="#D8D2C5" stroke="#16181D" strokeWidth="1.5" />
      <text x="54" y="76" fontFamily="monospace" fontSize="4.5" fontWeight="bold" fill="#16181D">
        16M
      </text>

      {/* Reset Pushbutton with Orange Cap */}
      <rect x="134" y="44" width="14" height="14" rx="2" fill="#16181D" />
      <circle cx="141" cy="51" r="4" fill="#FF5A1F" stroke="#16181D" strokeWidth="1" />

      {/* Surface-Mount LEDs (Power & TX/RX) */}
      <rect x="134" y="70" width="5" height="4" rx="0.5" fill="#FF5A1F" />
      <circle cx="146" cy="72" r="1.5" fill="#1B873F" />
      <rect x="134" y="80" width="5" height="4" rx="0.5" fill="#16181D" />
      <circle cx="146" cy="82" r="1.5" fill="#FF5A1F" />

      {/* Trace Routes on PCB (Signal Tracks) */}
      <path d="M30 76 H 50 V 74" stroke="#D8D2C5" strokeWidth="1.5" fill="none" />
      <path d="M30 84 H 46 V 110 H 54" stroke="#D8D2C5" strokeWidth="1.5" fill="none" />
      <path d="M126 66 H 134" stroke="#D8D2C5" strokeWidth="1.5" fill="none" />
      <path d="M126 82 H 134" stroke="#D8D2C5" strokeWidth="1.5" fill="none" />
      <path d="M98 48 V 31" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />
      <path d="M86 104 V 121" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
