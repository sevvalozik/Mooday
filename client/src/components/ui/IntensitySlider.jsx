import { EMOTIONS } from '../../utils/emotionConfig.js';

export const IntensitySlider = ({ value, onChange, emotion = 'calm' }) => {
  const color = EMOTIONS[emotion]?.color || '#8b5cf6';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">Yoğunluk</label>
        <span className="text-sm font-bold" style={{ color }}>{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
        style={{
          accentColor: color,
          background: `linear-gradient(to right, ${color}40, ${color})`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Hafif</span>
        <span>Yoğun</span>
      </div>
    </div>
  );
};
