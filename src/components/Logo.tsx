export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 170 170" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="85" cy="85" r="85" fill="currentColor" />
      <g transform="translate(1, 35)" fill="var(--background)">
        {/* Block 1 (Left) */}
        <polygon points="40,0 72,0 54,45 22,45" />
        {/* Block 2 (Middle) */}
        <polygon points="77,0 109,0 80,72.5 48,72.5" />
        {/* Block 3 (Right) */}
        <polygon points="114,0 146,0 106,100 74,100" />
      </g>
    </svg>
  );
}
