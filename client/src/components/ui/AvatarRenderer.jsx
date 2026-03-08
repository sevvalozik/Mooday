import { getSkinColor, getHairColor, getBgColor } from '../../utils/avatars.js';

// SVG hair paths per style
const HairPaths = ({ style, color }) => {
  if (style === 'none') return null;

  const c = color;

  switch (style) {
    case 'short':
      return (
        <g>
          <ellipse cx="100" cy="68" rx="52" ry="30" fill={c} />
          <rect x="48" y="60" width="104" height="20" rx="4" fill={c} />
        </g>
      );
    case 'long':
      return (
        <g>
          <ellipse cx="100" cy="68" rx="55" ry="32" fill={c} />
          <rect x="45" y="60" width="16" height="80" rx="8" fill={c} />
          <rect x="139" y="60" width="16" height="80" rx="8" fill={c} />
          <rect x="48" y="60" width="104" height="15" rx="4" fill={c} />
        </g>
      );
    case 'curly':
      return (
        <g>
          <circle cx="60" cy="60" r="18" fill={c} />
          <circle cx="82" cy="50" r="18" fill={c} />
          <circle cx="100" cy="48" r="18" fill={c} />
          <circle cx="118" cy="50" r="18" fill={c} />
          <circle cx="140" cy="60" r="18" fill={c} />
          <circle cx="50" cy="78" r="14" fill={c} />
          <circle cx="150" cy="78" r="14" fill={c} />
        </g>
      );
    case 'spiky':
      return (
        <g>
          <polygon points="100,28 90,65 110,65" fill={c} />
          <polygon points="75,35 72,68 92,62" fill={c} />
          <polygon points="125,35 128,68 108,62" fill={c} />
          <polygon points="55,50 55,75 75,65" fill={c} />
          <polygon points="145,50 145,75 125,65" fill={c} />
          <rect x="48" y="60" width="104" height="15" rx="4" fill={c} />
        </g>
      );
    case 'bob':
      return (
        <g>
          <ellipse cx="100" cy="68" rx="56" ry="32" fill={c} />
          <rect x="44" y="60" width="18" height="55" rx="9" fill={c} />
          <rect x="138" y="60" width="18" height="55" rx="9" fill={c} />
          <rect x="48" y="60" width="104" height="18" rx="4" fill={c} />
        </g>
      );
    case 'bun':
      return (
        <g>
          <ellipse cx="100" cy="68" rx="52" ry="30" fill={c} />
          <circle cx="100" cy="38" r="20" fill={c} />
          <rect x="48" y="60" width="104" height="15" rx="4" fill={c} />
        </g>
      );
    case 'buzz':
      return (
        <g>
          <ellipse cx="100" cy="72" rx="50" ry="24" fill={c} />
        </g>
      );
    default:
      return null;
  }
};

// SVG eye shapes
const Eyes = ({ style }) => {
  switch (style) {
    case 'normal':
      return (
        <g>
          <circle cx="80" cy="100" r="5" fill="#1A1A2E" />
          <circle cx="120" cy="100" r="5" fill="#1A1A2E" />
          <circle cx="82" cy="98" r="1.5" fill="white" />
          <circle cx="122" cy="98" r="1.5" fill="white" />
        </g>
      );
    case 'happy':
      return (
        <g>
          <path d="M73 100 Q80 93 87 100" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M113 100 Q120 93 127 100" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'round':
      return (
        <g>
          <circle cx="80" cy="100" r="8" fill="white" stroke="#1A1A2E" strokeWidth="2" />
          <circle cx="120" cy="100" r="8" fill="white" stroke="#1A1A2E" strokeWidth="2" />
          <circle cx="82" cy="99" r="4" fill="#1A1A2E" />
          <circle cx="122" cy="99" r="4" fill="#1A1A2E" />
          <circle cx="83.5" cy="97.5" r="1.5" fill="white" />
          <circle cx="123.5" cy="97.5" r="1.5" fill="white" />
        </g>
      );
    case 'wink':
      return (
        <g>
          <circle cx="80" cy="100" r="5" fill="#1A1A2E" />
          <circle cx="82" cy="98" r="1.5" fill="white" />
          <path d="M113 100 Q120 93 127 100" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'sleepy':
      return (
        <g>
          <path d="M73 101 Q80 97 87 101" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M113 101 Q120 97 127 101" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="73" y1="99" x2="87" y2="99" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="113" y1="99" x2="127" y2="99" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};

// SVG mouth shapes
const Mouth = ({ style }) => {
  switch (style) {
    case 'smile':
      return <path d="M85 118 Q100 132 115 118" stroke="#1A1A2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    case 'grin':
      return (
        <g>
          <path d="M82 116 Q100 136 118 116" stroke="#1A1A2E" strokeWidth="2.5" fill="white" strokeLinecap="round" />
          <line x1="82" y1="116" x2="118" y2="116" stroke="#1A1A2E" strokeWidth="2" />
        </g>
      );
    case 'neutral':
      return <line x1="88" y1="120" x2="112" y2="120" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />;
    case 'open':
      return <ellipse cx="100" cy="120" rx="8" ry="6" fill="#1A1A2E" />;
    case 'cat':
      return (
        <g>
          <path d="M88 118 Q94 124 100 118" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M100 118 Q106 124 112 118" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
};

// Accessories
const Accessories = ({ style, skinColor }) => {
  switch (style) {
    case 'none':
      return null;
    case 'glasses':
      return (
        <g>
          <circle cx="80" cy="100" r="14" fill="none" stroke="#1A1A2E" strokeWidth="2.5" />
          <circle cx="120" cy="100" r="14" fill="none" stroke="#1A1A2E" strokeWidth="2.5" />
          <line x1="94" y1="100" x2="106" y2="100" stroke="#1A1A2E" strokeWidth="2.5" />
          <line x1="66" y1="100" x2="54" y2="96" stroke="#1A1A2E" strokeWidth="2" />
          <line x1="134" y1="100" x2="146" y2="96" stroke="#1A1A2E" strokeWidth="2" />
        </g>
      );
    case 'sunglasses':
      return (
        <g>
          <rect x="64" y="90" width="30" height="20" rx="4" fill="#1A1A2E" />
          <rect x="106" y="90" width="30" height="20" rx="4" fill="#1A1A2E" />
          <line x1="94" y1="100" x2="106" y2="100" stroke="#1A1A2E" strokeWidth="3" />
          <line x1="64" y1="98" x2="52" y2="94" stroke="#1A1A2E" strokeWidth="2.5" />
          <line x1="136" y1="98" x2="148" y2="94" stroke="#1A1A2E" strokeWidth="2.5" />
          {/* Lens shine */}
          <rect x="68" y="93" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
          <rect x="110" y="93" width="8" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
        </g>
      );
    case 'blush':
      return (
        <g>
          <ellipse cx="68" cy="112" rx="10" ry="6" fill="#FF6B6B" opacity="0.35" />
          <ellipse cx="132" cy="112" rx="10" ry="6" fill="#FF6B6B" opacity="0.35" />
        </g>
      );
    case 'freckles':
      return (
        <g fill="#A0522D" opacity="0.5">
          <circle cx="72" cy="108" r="1.5" />
          <circle cx="78" cy="112" r="1.5" />
          <circle cx="75" cy="104" r="1.5" />
          <circle cx="128" cy="108" r="1.5" />
          <circle cx="122" cy="112" r="1.5" />
          <circle cx="125" cy="104" r="1.5" />
        </g>
      );
    default:
      return null;
  }
};

export const AvatarRenderer = ({ config, size = 48, className = '' }) => {
  if (!config) return null;

  const skinColor = getSkinColor(config.skin);
  const hairColor = getHairColor(config.hairColor);
  const bgColor = getBgColor(config.bg);

  // Determine if eyes should render or sunglasses cover them
  const showEyes = config.accessory !== 'sunglasses';

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      style={{ minWidth: size, minHeight: size }}
    >
      {/* Background */}
      <circle cx="100" cy="100" r="100" fill={bgColor} />

      {/* Neck */}
      <rect x="85" y="140" width="30" height="25" rx="8" fill={skinColor} />

      {/* Hair behind head (for long/bob styles) */}
      {(config.hair === 'long' || config.hair === 'bob') && (
        <g opacity="0.7">
          <HairPaths style={config.hair} color={hairColor} />
        </g>
      )}

      {/* Face */}
      <ellipse cx="100" cy="105" rx="52" ry="55" fill={skinColor} />

      {/* Ears */}
      <ellipse cx="48" cy="102" rx="8" ry="10" fill={skinColor} />
      <ellipse cx="152" cy="102" rx="8" ry="10" fill={skinColor} />

      {/* Hair on top */}
      <HairPaths style={config.hair} color={hairColor} />

      {/* Eyebrows */}
      <line x1="72" y1="88" x2="88" y2="86" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <line x1="112" y1="86" x2="128" y2="88" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

      {/* Eyes */}
      {showEyes && <Eyes style={config.eyes} />}

      {/* Nose */}
      <path d="M97 110 Q100 114 103 110" stroke="#1A1A2E" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* Mouth */}
      <Mouth style={config.mouth} />

      {/* Accessories (rendered last) */}
      <Accessories style={config.accessory} skinColor={skinColor} />
    </svg>
  );
};
