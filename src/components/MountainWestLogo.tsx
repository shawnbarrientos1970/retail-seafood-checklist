import React from 'react';

interface MountainWestLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * High-fidelity vector rendition of the Mountain West Division logo
 * Featuring the cobalt mountain peaks, bold typography, Albertsons mark, and Lucky script.
 */
export const MountainWestLogo: React.FC<MountainWestLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  }[size];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Mountain Peaks Symbol */}
        <svg
          viewBox="0 0 120 70"
          className="h-8 w-auto flex-shrink-0 drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base / Background mountain shadow */}
          <path
            d="M5 60 L38 28 L50 38 L72 10 L115 60 Z"
            fill="#0b3f7a"
          />
          {/* Main front facets - Royal Mountain Blue */}
          <path
            d="M5 60 L38 28 L48 37 L34 46 L20 60 Z"
            fill="#145db4"
          />
          <path
            d="M38 28 L52 14 L72 10 L84 28 L64 36 L52 48 L48 37 Z"
            fill="#1a6cd1"
          />
          <path
            d="M72 10 L100 42 L115 60 L85 60 L68 44 L84 28 Z"
            fill="#11509c"
          />
          {/* White snowy ridge highlights */}
          <path
            d="M38 28 L44 34 L38 40 L48 37 L52 14 Z"
            fill="#ffffff"
          />
          <path
            d="M72 10 L76 22 L66 32 L84 28 Z"
            fill="#ffffff"
          />
          <path
            d="M34 46 L46 44 L52 48 L38 52 Z"
            fill="#e2e8f0"
          />
          <path
            d="M64 36 L74 44 L68 48 L60 42 Z"
            fill="#ffffff"
          />
          <path
            d="M5 60 L115 60 L110 63 L10 63 Z"
            fill="#092f5d"
          />
        </svg>

        <div className="flex flex-col">
          <span className="text-xs font-black tracking-wider uppercase text-white leading-none">
            Mountain West
          </span>
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-blue-200 leading-tight">
            Division
          </span>
        </div>
      </div>
    );
  }

  // Full detailed brand logo matching user image
  return (
    <div
      className={`inline-flex flex-col items-center select-none ${className}`}
      role="img"
      aria-label="Mountain West Division - Albertsons & Lucky"
    >
      <svg
        viewBox="0 0 320 180"
        className={`${sizeClasses} w-auto max-w-full`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mountain Graphic Group */}
        <g id="mountain-peaks">
          {/* Left Peak Background & Ridges */}
          <polygon
            points="25,108 85,46 115,70 135,52 65,108"
            fill="#0d4685"
          />
          <polygon
            points="25,108 85,46 100,68 70,82 45,108"
            fill="#1761b0"
          />

          {/* Central Summit & Primary High Peak */}
          <polygon
            points="110,66 160,8 215,64 200,84 150,88 115,72"
            fill="#0f4c8e"
          />
          <polygon
            points="160,8 185,42 165,58 145,46 130,58 120,68 110,66 160,8"
            fill="#1e73cf"
          />

          {/* Right Peak & Slopes */}
          <polygon
            points="185,42 220,52 295,108 240,108 215,76 195,82"
            fill="#12569e"
          />
          <polygon
            points="220,52 245,74 295,108 260,108 230,86"
            fill="#196ac5"
          />

          {/* White Snow & Ice Facet Accents (Matching authentic Albertsons Mountain West logo) */}
          <polygon
            points="85,46 95,58 88,68 102,62 108,54"
            fill="#ffffff"
          />
          <polygon
            points="160,8 168,26 156,36 172,32 185,42 172,46 162,38 148,46"
            fill="#ffffff"
          />
          <polygon
            points="132,56 142,66 156,62 146,74 136,70"
            fill="#ffffff"
          />
          <polygon
            points="198,60 210,68 202,76 218,72 225,60"
            fill="#ffffff"
          />
          <polygon
            points="95,78 120,74 135,84 110,88"
            fill="#ffffff"
          />
          <polygon
            points="160,70 178,76 192,72 180,82 165,80"
            fill="#ffffff"
          />

          {/* Base Mountain Foundation Bar */}
          <polygon
            points="20,110 300,110 295,114 25,114"
            fill="#093566"
          />
        </g>

        {/* Text: MOUNTAIN WEST */}
        <text
          x="160"
          y="138"
          textAnchor="middle"
          fill="#111827"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="24"
          letterSpacing="1.2"
        >
          MOUNTAIN WEST
        </text>

        {/* Text: DIVISION */}
        <text
          x="160"
          y="155"
          textAnchor="middle"
          fill="#475569"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="600"
          fontSize="12.5"
          letterSpacing="4"
        >
          DIVISION
        </text>

        {/* Lower Banner: Albertsons "A" icon | Safeway/Lucky Red cursive script */}
        <g id="brand-logos" transform="translate(100, 161)">
          {/* Albertsons classic blue mark */}
          <g transform="translate(0, 0)">
            <path
              d="M3 13 C3 7, 7 3, 12 3 C17 3, 21 7, 21 13 Z"
              fill="#00529b"
            />
            <path
              d="M7 13 C7 9, 9 6, 12 6 C15 6, 17 9, 17 13 Z"
              fill="#ffffff"
            />
            <path
              d="M9 13 C9 11, 10 9.5, 12 9.5 C14 9.5, 15 11, 15 13 Z"
              fill="#00529b"
            />
          </g>

          {/* Separator Line */}
          <line
            x1="29"
            y1="2"
            x2="29"
            y2="15"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Red Albertsons / Lucky Emblem & Lucky cursive text */}
          <g transform="translate(35, 1)">
            {/* Red Circle/Oval motif */}
            <circle cx="7" cy="7.5" r="6" fill="#d32323" />
            <circle cx="7" cy="7.5" r="3.5" fill="#ffffff" />
            <path d="M5.5 5.5 Q7 9.5 8.5 5.5" stroke="#d32323" strokeWidth="1.2" fill="none" />

            {/* Lucky script in red */}
            <text
              x="18"
              y="11"
              fill="#d32323"
              fontFamily="Brush Script MT, 'Segoe Script', cursive, sans-serif"
              fontWeight="bold"
              fontSize="14.5"
              letterSpacing="0.2"
            >
              Lucky
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
