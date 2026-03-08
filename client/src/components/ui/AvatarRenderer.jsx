import { getSkinColor, getHairColor, getBgColor } from '../../utils/avatars.js';

// SVG hair paths per style
const HairPaths = ({ style, color, behind = false }) => {
  const c = color;

  switch (style) {
    // ---- Female styles ----
    case 'f-short':
      if (behind) return null;
      return (
        <g>
          <ellipse cx="100" cy="66" rx="54" ry="32" fill={c} />
          <rect x="46" y="58" width="108" height="20" rx="6" fill={c} />
          {/* Side volume */}
          <ellipse cx="50" cy="82" rx="10" ry="18" fill={c} />
          <ellipse cx="150" cy="82" rx="10" ry="18" fill={c} />
        </g>
      );

    case 'f-bob':
      if (behind) {
        return (
          <g opacity="0.85">
            <rect x="42" y="58" width="20" height="65" rx="10" fill={c} />
            <rect x="138" y="58" width="20" height="65" rx="10" fill={c} />
          </g>
        );
      }
      return (
        <g>
          <ellipse cx="100" cy="66" rx="56" ry="32" fill={c} />
          <rect x="44" y="58" width="20" height="60" rx="10" fill={c} />
          <rect x="136" y="58" width="20" height="60" rx="10" fill={c} />
          <rect x="46" y="58" width="108" height="18" rx="5" fill={c} />
          {/* Bangs */}
          <path d="M58 75 Q80 62 100 68 Q120 62 142 75 L142 58 Q120 50 100 52 Q80 50 58 58 Z" fill={c} />
        </g>
      );

    case 'f-long':
      if (behind) {
        return (
          <g opacity="0.85">
            <rect x="40" y="58" width="20" height="95" rx="10" fill={c} />
            <rect x="140" y="58" width="20" height="95" rx="10" fill={c} />
            {/* Hair behind shoulders */}
            <ellipse cx="48" cy="150" rx="14" ry="8" fill={c} />
            <ellipse cx="152" cy="150" rx="14" ry="8" fill={c} />
          </g>
        );
      }
      return (
        <g>
          <ellipse cx="100" cy="66" rx="56" ry="34" fill={c} />
          <rect x="42" y="58" width="18" height="90" rx="9" fill={c} />
          <rect x="140" y="58" width="18" height="90" rx="9" fill={c} />
          <rect x="46" y="58" width="108" height="18" rx="5" fill={c} />
          {/* Soft bangs */}
          <path d="M56 78 Q78 60 100 66 Q122 60 144 78 L144 62 Q122 48 100 50 Q78 48 56 62 Z" fill={c} />
        </g>
      );

    case 'f-bun':
      if (behind) return null;
      return (
        <g>
          <ellipse cx="100" cy="66" rx="54" ry="30" fill={c} />
          <rect x="46" y="58" width="108" height="16" rx="5" fill={c} />
          {/* Bun on top */}
          <circle cx="100" cy="36" r="22" fill={c} />
          {/* Bun highlight */}
          <ellipse cx="94" cy="30" rx="6" ry="4" fill="rgba(255,255,255,0.1)" />
          {/* Hair band */}
          <ellipse cx="100" cy="52" rx="22" ry="4" fill={c} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        </g>
      );

    // ---- Male styles ----
    case 'm-straight':
      if (behind) return null;
      return (
        <g>
          <ellipse cx="100" cy="68" rx="52" ry="28" fill={c} />
          <rect x="48" y="60" width="104" height="18" rx="4" fill={c} />
          {/* Side taper */}
          <path d="M48 78 L48 88 Q48 92 52 90 L56 78 Z" fill={c} />
          <path d="M152 78 L152 88 Q152 92 148 90 L144 78 Z" fill={c} />
        </g>
      );

    case 'm-curly':
      if (behind) {
        return (
          <g opacity="0.6">
            <circle cx="48" cy="80" r="12" fill={c} />
            <circle cx="152" cy="80" r="12" fill={c} />
          </g>
        );
      }
      return (
        <g>
          <circle cx="62" cy="58" r="16" fill={c} />
          <circle cx="82" cy="48" r="16" fill={c} />
          <circle cx="100" cy="46" r="16" fill={c} />
          <circle cx="118" cy="48" r="16" fill={c} />
          <circle cx="138" cy="58" r="16" fill={c} />
          <circle cx="50" cy="74" r="13" fill={c} />
          <circle cx="150" cy="74" r="13" fill={c} />
          {/* Fill center top */}
          <ellipse cx="100" cy="58" rx="42" ry="14" fill={c} />
        </g>
      );

    case 'm-bald':
      return null;

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
const Accessories = ({ style }) => {
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

// Eyelashes for female avatars
const Eyelashes = ({ gender }) => {
  if (gender !== 'female') return null;
  return (
    <g stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
      <line x1="74" y1="94" x2="72" y2="91" />
      <line x1="78" y1="93" x2="77" y2="89" />
      <line x1="82" y1="93" x2="83" y2="89" />
      <line x1="86" y1="94" x2="88" y2="91" />
      <line x1="114" y1="94" x2="112" y2="91" />
      <line x1="118" y1="93" x2="117" y2="89" />
      <line x1="122" y1="93" x2="123" y2="89" />
      <line x1="126" y1="94" x2="128" y2="91" />
    </g>
  );
};

export const AvatarRenderer = ({ config, size = 48, className = '' }) => {
  if (!config) return null;

  const skinColor = getSkinColor(config.skin);
  const hairColor = getHairColor(config.hairColor);
  const bgColor = getBgColor(config.bg);
  const gender = config.gender || 'female';

  const showEyes = config.accessory !== 'sunglasses';
  const hasBehindHair = ['f-long', 'f-bob', 'm-curly'].includes(config.hair);

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

      {/* Hair behind head */}
      {hasBehindHair && <HairPaths style={config.hair} color={hairColor} behind />}

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

      {/* Eyelashes */}
      <Eyelashes gender={gender} />

      {/* Eyes */}
      {showEyes && <Eyes style={config.eyes} />}

      {/* Nose */}
      <path d="M97 110 Q100 114 103 110" stroke="#1A1A2E" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />

      {/* Mouth */}
      <Mouth style={config.mouth} />

      {/* Accessories */}
      <Accessories style={config.accessory} />
    </svg>
  );
};
