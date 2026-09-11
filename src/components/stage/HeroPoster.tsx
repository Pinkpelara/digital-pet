/** Static first-paint stand-in for the soft-3D hero. No WebGL, no extra image. */

export function HeroPoster() {
  return (
    <div className="hero-poster" aria-hidden>
      <div className="hero-poster-wash" />
      <div className="hero-poster-figure">
        <svg viewBox="0 0 160 180" className="hero-poster-svg" focusable="false">
          <ellipse cx="80" cy="168" rx="38" ry="7" fill="#050014" opacity="0.45" />
          <g className="hero-poster-bob">
            <line x1="80" y1="42" x2="80" y2="22" stroke="#2A9A92" strokeWidth="3" />
            <circle cx="80" cy="16" r="8" fill="#8EE6DF" />
            <circle cx="78" cy="13" r="2.4" fill="#fff" opacity="0.85" />
            <ellipse cx="64" cy="150" rx="10" ry="7" fill="#2A9A92" />
            <ellipse cx="96" cy="150" rx="10" ry="7" fill="#2A9A92" />
            <ellipse cx="80" cy="104" rx="46" ry="46" fill="#3EC8BE" />
            <ellipse cx="80" cy="114" rx="28" ry="22" fill="#E7FFFB" />
            <ellipse cx="58" cy="108" rx="10" ry="7" fill="#B8FFF6" opacity="0.55" />
            <ellipse cx="64" cy="86" rx="8" ry="9" fill="#241C16" />
            <ellipse cx="96" cy="86" rx="8" ry="9" fill="#241C16" />
            <circle cx="61.5" cy="83" r="2.2" fill="#fff" />
            <circle cx="93.5" cy="83" r="2.2" fill="#fff" />
            <ellipse cx="56" cy="98" rx="7" ry="4" fill="#F4B4B0" opacity="0.85" />
            <ellipse cx="104" cy="98" rx="7" ry="4" fill="#F4B4B0" opacity="0.85" />
            <path d="M72 102 Q80 110 88 102" fill="none" stroke="#4A3328" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}
