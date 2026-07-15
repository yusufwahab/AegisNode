// Custom wordmark icon: 2-3 concentric arcs radiating from a point,
// standing in for an NFC signal without being a generic "wifi" icon.
export default function NfcMark({ className, color = "currentColor" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="23" r="2" fill={color} />
      <path
        d="M9 17A6 6 0 0 1 15 23"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M9 12A11 11 0 0 1 20 23"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M9 7A16 16 0 0 1 25 23"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
