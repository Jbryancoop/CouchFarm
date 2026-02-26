/**
 * Colorado Couch Ranch — brand logo
 *
 * Inspired by the Colorado state flag: blue background, white stripe,
 * red "C" with a gold disk, and a couch silhouette as the brand mark.
 */

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer decorative ring */}
      <circle cx="60" cy="60" r="58" fill="#001845" />

      <defs>
        <clipPath id="ccr-logo-bg">
          <circle cx="60" cy="60" r="54" />
        </clipPath>
      </defs>

      <g clipPath="url(#ccr-logo-bg)">
        {/* Blue background (Colorado flag blue) */}
        <rect width="120" height="120" fill="#002868" />
        {/* White horizontal stripe */}
        <rect x="0" y="45" width="120" height="30" fill="white" />
      </g>

      {/* Red C (Colorado flag) */}
      <path
        d="M78.4 33.8A32 32 0 1 0 78.4 86.2L72 77.2A21 21 0 1 1 72 42.8Z"
        fill="#C8102E"
      />

      {/* Gold disk inside the C */}
      <circle cx="60" cy="60" r="18" fill="#FFD100" />

      {/* Couch silhouette (brand mark) — navy on gold */}
      {/* Seat */}
      <rect x="48" y="62" width="24" height="7" rx="2" fill="#002868" />
      {/* Back cushions */}
      <rect x="49" y="55" width="22" height="9" rx="2" fill="#002868" opacity="0.9" />
      {/* Left arm */}
      <rect x="45" y="57" width="6" height="12" rx="2.5" fill="#002868" />
      {/* Right arm */}
      <rect x="69" y="57" width="6" height="12" rx="2.5" fill="#002868" />

      {/* CCR initials at top */}
      <text
        x="60"
        y="22"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="14"
        fill="white"
        opacity="0.9"
      >
        CCR
      </text>

      {/* Established date at bottom */}
      <text
        x="60"
        y="108"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="9"
        fill="white"
        letterSpacing="2"
        opacity="0.85"
      >
        EST. 2025
      </text>
    </svg>
  );
}

/**
 * Small inline logo mark — used in navbar and tight spaces.
 * Colorado flag–inspired: blue + white stripe + red C + gold disk + couch.
 */
export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue background (Colorado flag blue) */}
      <rect width="64" height="64" rx="14" fill="#002868" />

      {/* White horizontal stripe */}
      <rect x="0" y="24" width="64" height="16" fill="white" />

      {/* Blue border to clean up rounded corners */}
      <rect width="64" height="64" rx="14" fill="none" stroke="#002868" strokeWidth="2" />

      {/* Red C (Colorado flag) */}
      <path
        d="M44.6 14A22 22 0 1 0 44.6 50L40 43.5A14 14 0 1 1 40 20.5Z"
        fill="#C8102E"
      />

      {/* Gold disk inside the C */}
      <circle cx="32" cy="32" r="12" fill="#FFD100" />

      {/* Couch silhouette (brand mark) — navy on gold */}
      {/* Seat */}
      <rect x="24" y="34" width="16" height="5" rx="1.5" fill="#002868" />
      {/* Back cushions */}
      <rect x="25" y="29" width="14" height="6" rx="1.5" fill="#002868" opacity="0.9" />
      {/* Left arm */}
      <rect x="22" y="30" width="5" height="9" rx="2" fill="#002868" />
      {/* Right arm */}
      <rect x="37" y="30" width="5" height="9" rx="2" fill="#002868" />
    </svg>
  );
}
