import React from 'react';

/**
 * Risograph Retro Beige Computer Terminal for Login Page Artwork
 * Palette: #16181D (Ink), #FF5A1F (Signal Orange), #ECE7DE (Paper), #D8D2C5 (Grid)
 */
export default function RetroTerminalArt({ className = '', width = '100%', height = '100%', style = {} }) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`risograph-terminal-art ${className}`}
      style={{ width, height, ...style }}
      aria-label="Retro Beige Computer Terminal Artwork"
    >
      <defs>
        <pattern id="dot-grid-term" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="#D8D2C5" />
        </pattern>
        <style>{`
          @keyframes terminalBlink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }
          .term-cursor {
            animation: terminalBlink 1s infinite steps(1);
          }
          @keyframes glowScan {
            0% { transform: translateY(0); }
            100% { transform: translateY(110px); }
          }
          .scanline-sweep {
            animation: glowScan 4s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .term-cursor, .scanline-sweep {
              animation: none !important;
            }
          }
        `}</style>
      </defs>

      {/* Blueprint Grid Canvas Area */}
      <rect x="10" y="10" width="300" height="260" rx="8" fill="#ECE7DE" />
      <rect x="10" y="10" width="300" height="260" rx="8" fill="url(#dot-grid-term)" opacity="0.6" />
      <rect x="14" y="14" width="292" height="252" rx="6" stroke="#D8D2C5" strokeWidth="1" strokeDasharray="4 4" fill="none" />

      {/* Main Terminal Unit Drop Shadow */}
      <rect x="64" y="24" width="192" height="170" rx="10" fill="#16181D" />

      {/* Main Beige Computer Enclosure */}
      <rect x="58" y="18" width="192" height="170" rx="10" fill="#F4F1EA" stroke="#16181D" strokeWidth="3" />

      {/* Left Cooling Louver Slits */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={`louver-${i}`}
          x1="74"
          y1={32 + i * 5}
          x2="108"
          y2={32 + i * 5}
          stroke="#16181D"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      {/* Badge Plate: LABTRACK OS */}
      <rect x="122" y="30" width="64" height="12" rx="2" fill="#16181D" />
      <text x="127" y="39" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#FF5A1F">
        LABTRACK_OS
      </text>

      {/* Power Toggle Rocker Switch */}
      <rect x="210" y="28" width="24" height="16" rx="2" fill="#16181D" />
      <rect x="212" y="30" width="20" height="12" rx="1" fill="#FF5A1F" stroke="#16181D" strokeWidth="1" />
      <circle cx="222" cy="36" r="2" fill="#FFFFFF" />

      {/* CRT Bezel Cavity */}
      <rect x="70" y="52" width="168" height="114" rx="6" fill="#16181D" stroke="#16181D" strokeWidth="2" />

      {/* Phosphor Cathode Tube Screen */}
      <rect x="76" y="58" width="156" height="102" rx="4" fill="#16181D" />

      {/* Subtle CRT Screen Glow Matrix */}
      <rect x="78" y="60" width="152" height="98" rx="3" fill="#16181D" stroke="#2B2F38" strokeWidth="1" />

      {/* Scan Lines on Screen */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((s) => (
        <line
          key={`scan-${s}`}
          x1="80"
          y1={64 + s * 8}
          x2="228"
          y2={64 + s * 8}
          stroke="#2B2F38"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
      ))}

      {/* Animated Scanline Sweep */}
      <line x1="78" y1="60" x2="230" y2="60" stroke="#FF5A1F" strokeWidth="1.5" opacity="0.35" className="scanline-sweep" />

      {/* Terminal Text Snippets */}
      <text x="86" y="76" fontFamily="monospace" fontSize="7.5" fontWeight="bold" fill="#FF5A1F">
        &gt; LABTRACK_SECURE_OS v2.4
      </text>
      <text x="86" y="88" fontFamily="monospace" fontSize="7" fill="#ECE7DE">
        &gt; MEMORY: 640K OK
      </text>
      <text x="86" y="99" fontFamily="monospace" fontSize="7" fill="#ECE7DE">
        &gt; TELEMETRY: 5 LABS ACTIVE
      </text>
      <text x="86" y="110" fontFamily="monospace" fontSize="7" fill="#ECE7DE">
        &gt; CIPHER: RSA/HMAC-256
      </text>
      <text x="86" y="124" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#FF5A1F">
        &gt; AUTH_PROMPT: READY
      </text>

      {/* Blinking Prompt Cursor */}
      <rect x="194" y="115" width="8" height="11" fill="#FF5A1F" className="term-cursor" />

      {/* Small Waveform Graph at bottom of CRT */}
      <path d="M86 142 H 100 L 106 134 L 112 148 L 118 138 L 124 142 H 222" stroke="#FF5A1F" strokeWidth="1.5" fill="none" />

      {/* Floppy Disk Bay 1 & 2 (Right side of CRT bezel) */}
      <rect x="76" y="174" width="70" height="8" rx="1" fill="#16181D" />
      <circle cx="140" cy="178" r="2" fill="#1B873F" />

      <rect x="162" y="174" width="70" height="8" rx="1" fill="#16181D" />
      <circle cx="226" cy="178" r="2" fill="#FF5A1F" />

      {/* Mechanical Keyboard Base (Tilted Perspective) */}
      <path
        d="M34 250 L 52 208 H 256 L 274 250 Z"
        fill="#F4F1EA"
        stroke="#16181D"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M34 250 H 274 V 254 H 34 Z" fill="#16181D" />

      {/* Keyboard Keycaps */}
      {/* Row 1 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
        <rect
          key={`kb-r1-${k}`}
          x={58 + k * 16}
          y="213"
          width="13"
          height="6"
          rx="1"
          fill={k === 11 ? '#FF5A1F' : '#16181D'}
        />
      ))}

      {/* Row 2 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
        <rect
          key={`kb-r2-${k}`}
          x={54 + k * 18}
          y="222"
          width="15"
          height="6"
          rx="1"
          fill="#16181D"
        />
      ))}

      {/* Row 3 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
        <rect
          key={`kb-r3-${k}`}
          x={50 + k * 20}
          y="231"
          width="17"
          height="6"
          rx="1"
          fill={k === 0 || k === 9 ? '#FF5A1F' : '#16181D'}
        />
      ))}

      {/* Spacebar Row */}
      <rect x="46" y="240" width="22" height="7" rx="1" fill="#16181D" />
      <rect x="74" y="240" width="160" height="7" rx="1" fill="#FF5A1F" />
      <rect x="240" y="240" width="22" height="7" rx="1" fill="#16181D" />

      {/* Coiled Spiral Cable */}
      <path
        d="M256 216 C 274 210 286 198 280 184 C 274 170 290 162 296 172"
        stroke="#16181D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
