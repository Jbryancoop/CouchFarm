/**
 * Colorado Couch Farm — brand logo
 *
 * Highland cow with rainbow sunglasses on a purple circle.
 * Placeholder SVG until final brand assets are delivered.
 */

export function Logo({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={{ width: "2rem", height: "2rem", ...style }}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="58" fill="#5b21b6" />
      <circle cx="60" cy="60" r="54" fill="#7c3aed" />
      <path d="M30 42 C28 28, 38 24, 42 34" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M90 42 C92 28, 82 24, 78 34" stroke="#fbbf24" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="44" rx="8" ry="6" fill="#a78bfa" transform="rotate(-20 36 44)" />
      <ellipse cx="84" cy="44" rx="8" ry="6" fill="#a78bfa" transform="rotate(20 84 44)" />
      <ellipse cx="36" cy="44" rx="5" ry="3.5" fill="#c4b5fd" transform="rotate(-20 36 44)" />
      <ellipse cx="84" cy="44" rx="5" ry="3.5" fill="#c4b5fd" transform="rotate(20 84 44)" />
      <ellipse cx="60" cy="62" rx="28" ry="26" fill="#e9d5ff" />
      <circle cx="50" cy="38" r="8" fill="#e9d5ff" />
      <circle cx="60" cy="36" r="9" fill="#e9d5ff" />
      <circle cx="70" cy="38" r="8" fill="#e9d5ff" />
      <circle cx="55" cy="34" r="6" fill="#f3e8ff" />
      <circle cx="65" cy="34" r="6" fill="#f3e8ff" />
      <rect x="40" y="54" width="16" height="12" rx="3" fill="#ef4444" />
      <rect x="40" y="57" width="16" height="3" fill="#f59e0b" />
      <rect x="40" y="60" width="16" height="3" fill="#22c55e" />
      <rect x="40" y="63" width="16" height="3" rx="0 0 3 3" fill="#3b82f6" />
      <rect x="64" y="54" width="16" height="12" rx="3" fill="#ef4444" />
      <rect x="64" y="57" width="16" height="3" fill="#f59e0b" />
      <rect x="64" y="60" width="16" height="3" fill="#22c55e" />
      <rect x="64" y="63" width="16" height="3" rx="0 0 3 3" fill="#3b82f6" />
      <rect x="56" y="57" width="8" height="3" rx="1.5" fill="#374151" />
      <rect x="38" y="53" width="44" height="3" rx="1.5" fill="#374151" />
      <ellipse cx="60" cy="78" rx="16" ry="10" fill="#c4b5fd" />
      <ellipse cx="54" cy="77" rx="3" ry="2.5" fill="#7c3aed" opacity="0.4" />
      <ellipse cx="66" cy="77" rx="3" ry="2.5" fill="#7c3aed" opacity="0.4" />
      <path d="M55 82 Q60 86 65 82" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
      <text x="60" y="108" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="bold" fontSize="11" fill="white" letterSpacing="3" opacity="0.9">CCF</text>
    </svg>
  );
}

export function LogoMark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={{ width: "2rem", height: "2rem", ...style }}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="0" fill="#7c3aed" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="0" stroke="#1a1a1a" strokeWidth="3" fill="none" />
      <path d="M16 22 C14 14, 20 12, 23 18" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M48 22 C50 14, 44 12, 41 18" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="19" cy="24" rx="5" ry="4" fill="#a78bfa" transform="rotate(-15 19 24)" />
      <ellipse cx="45" cy="24" rx="5" ry="4" fill="#a78bfa" transform="rotate(15 45 24)" />
      <ellipse cx="32" cy="34" rx="16" ry="15" fill="#e9d5ff" />
      <circle cx="27" cy="20" r="5" fill="#e9d5ff" />
      <circle cx="32" cy="19" r="6" fill="#e9d5ff" />
      <circle cx="37" cy="20" r="5" fill="#e9d5ff" />
      <circle cx="30" cy="18" r="4" fill="#f3e8ff" />
      <circle cx="34" cy="18" r="4" fill="#f3e8ff" />
      <rect x="21" y="29" width="10" height="8" rx="2" fill="#ef4444" />
      <rect x="21" y="31.5" width="10" height="2" fill="#f59e0b" />
      <rect x="21" y="33.5" width="10" height="2" fill="#22c55e" />
      <rect x="21" y="35.5" width="10" height="1.5" fill="#3b82f6" />
      <rect x="33" y="29" width="10" height="8" rx="2" fill="#ef4444" />
      <rect x="33" y="31.5" width="10" height="2" fill="#f59e0b" />
      <rect x="33" y="33.5" width="10" height="2" fill="#22c55e" />
      <rect x="33" y="35.5" width="10" height="1.5" fill="#3b82f6" />
      <rect x="31" y="31" width="2" height="2" rx="1" fill="#374151" />
      <rect x="20" y="28.5" width="24" height="2" rx="1" fill="#374151" />
      <ellipse cx="32" cy="43" rx="9" ry="6" fill="#c4b5fd" />
      <ellipse cx="29" cy="42.5" rx="2" ry="1.5" fill="#7c3aed" opacity="0.4" />
      <ellipse cx="35" cy="42.5" rx="2" ry="1.5" fill="#7c3aed" opacity="0.4" />
      <path d="M29 46 Q32 48 35 46" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}
