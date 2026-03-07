import { RainEffect } from './RainEffect.jsx';
import { SunEffect } from './SunEffect.jsx';
import { StormEffect } from './StormEffect.jsx';
import { ParticleEffect } from './ParticleEffect.jsx';
import { CalmEffect } from './CalmEffect.jsx';
import { NightEffect } from './NightEffect.jsx';
import { VortexEffect } from './VortexEffect.jsx';

const BACKGROUND_MAP = {
  happiness: SunEffect,
  sadness: RainEffect,
  anger: StormEffect,
  calm: CalmEffect,
  excitement: ParticleEffect,
  anxiety: VortexEffect,
  tired: NightEffect,
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
