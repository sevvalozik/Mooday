import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarRenderer } from './AvatarRenderer.jsx';
import {
  SKIN_TONES, HAIR_STYLES, HAIR_COLORS,
  EYE_STYLES, MOUTH_STYLES, ACCESSORIES, BG_COLORS,
  DEFAULT_AVATAR,
} from '../../utils/avatars.js';

const TABS = [
  { key: 'bg', label: 'BG', icon: '🎨' },
  { key: 'skin', label: 'Skin', icon: '✋' },
  { key: 'hair', label: 'Hair', icon: '💇' },
  { key: 'eyes', label: 'Eyes', icon: '👁️' },
  { key: 'mouth', label: 'Mouth', icon: '👄' },
  { key: 'acc', label: 'Extra', icon: '✨' },
];

const ColorSwatch = ({ color, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`h-9 w-9 rounded-full border-2 transition-all ${
      selected ? 'border-white scale-110 ring-2 ring-purple-500' : 'border-transparent hover:border-white/30'
    }`}
    style={{ backgroundColor: color }}
  />
);

const OptionButton = ({ label, selected, onClick, preview }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 text-xs font-medium transition-all ${
      selected
        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
    }`}
  >
    {preview && <span className="mb-0.5 text-lg">{preview}</span>}
    {label}
  </button>
);

export const AvatarPicker = ({ config, onChange, compact = false }) => {
  const [activeTab, setActiveTab] = useState('bg');
  const avatarConfig = config || DEFAULT_AVATAR;

  const update = (field, value) => {
    onChange({ ...avatarConfig, [field]: value });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <motion.div
        key={JSON.stringify(avatarConfig)}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <AvatarRenderer config={avatarConfig} size={compact ? 80 : 120} />
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Options Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="w-full"
        >
          {/* Background Color */}
          {activeTab === 'bg' && (
            <div className="flex flex-wrap justify-center gap-2">
              {BG_COLORS.map((bg) => (
                <ColorSwatch
                  key={bg.key}
                  color={bg.color}
                  selected={avatarConfig.bg === bg.key}
                  onClick={() => update('bg', bg.key)}
                />
              ))}
            </div>
          )}

          {/* Skin Tone */}
          {activeTab === 'skin' && (
            <div className="flex flex-wrap justify-center gap-2">
              {SKIN_TONES.map((skin) => (
                <ColorSwatch
                  key={skin.key}
                  color={skin.color}
                  selected={avatarConfig.skin === skin.key}
                  onClick={() => update('skin', skin.key)}
                />
              ))}
            </div>
          )}

          {/* Hair — style + color */}
          {activeTab === 'hair' && (
            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-gray-500">Style</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {HAIR_STYLES.map((h) => (
                    <OptionButton
                      key={h.key}
                      label={h.label}
                      selected={avatarConfig.hair === h.key}
                      onClick={() => update('hair', h.key)}
                    />
                  ))}
                </div>
              </div>
              {avatarConfig.hair !== 'none' && (
                <div>
                  <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-gray-500">Color</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {HAIR_COLORS.map((hc) => (
                      <ColorSwatch
                        key={hc.key}
                        color={hc.color}
                        selected={avatarConfig.hairColor === hc.key}
                        onClick={() => update('hairColor', hc.key)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Eyes */}
          {activeTab === 'eyes' && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {EYE_STYLES.map((e) => (
                <OptionButton
                  key={e.key}
                  label={e.label}
                  selected={avatarConfig.eyes === e.key}
                  onClick={() => update('eyes', e.key)}
                  preview={e.key === 'normal' ? '• •' : e.key === 'happy' ? '^ ^' : e.key === 'round' ? 'O O' : e.key === 'wink' ? '• ^' : '– –'}
                />
              ))}
            </div>
          )}

          {/* Mouth */}
          {activeTab === 'mouth' && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {MOUTH_STYLES.map((m) => (
                <OptionButton
                  key={m.key}
                  label={m.label}
                  selected={avatarConfig.mouth === m.key}
                  onClick={() => update('mouth', m.key)}
                  preview={m.key === 'smile' ? '⌣' : m.key === 'grin' ? '😁' : m.key === 'neutral' ? '—' : m.key === 'open' ? 'O' : 'ω'}
                />
              ))}
            </div>
          )}

          {/* Accessories */}
          {activeTab === 'acc' && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {ACCESSORIES.map((a) => (
                <OptionButton
                  key={a.key}
                  label={a.label}
                  selected={avatarConfig.accessory === a.key}
                  onClick={() => update('accessory', a.key)}
                  preview={a.key === 'none' ? '∅' : a.key === 'glasses' ? '👓' : a.key === 'sunglasses' ? '🕶️' : a.key === 'blush' ? '😊' : '·.·'}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
