import { RainEffect } from './RainEffect.jsx';
import { SunEffect } from './SunEffect.jsx';
import { StormEffect } from './StormEffect.jsx';
import { ParticleEffect } from './ParticleEffect.jsx';
import { CalmEffect } from './CalmEffect.jsx';

const BACKGROUND_MAP = {
  happiness: SunEffect,
  sadness: RainEffect,
  anger: StormEffect,
  calm: CalmEffect,
  excitement: ParticleEffect,
  anxiety: StormEffect,
  tired: null,
  hopeful: SunEffect,
};

export const MoodBackground = ({ emotion }) => {
  const EffectComponent = emotion ? BACKGROUND_MAP[emotion] : null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gray-950" />
      {EffectComponent && <EffectComponent />}
    </div>
  );
};
