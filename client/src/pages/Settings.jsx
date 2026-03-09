import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { AvatarPicker } from '../components/ui/AvatarPicker.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { THEME_LIST, applyTheme } from '../utils/themes.js';
import { DEFAULT_AVATAR, parseAvatarConfig, serializeAvatarConfig } from '../utils/avatars.js';
import { toast } from '../components/ui/Toast.jsx';
import api from '../services/api.js';

const STYLE_OPTIONS = [
  { key: 'default', label: 'Klasik', desc: 'Pürüzsüz organik şekil değiştirme' },
  { key: 'crystal', label: 'Kristal', desc: 'Gökkuşağı yansımalı kesme taş' },
];

const PRIVACY_LABELS = {
  public: 'Herkese Açık',
  friends: 'Sadece Arkadaşlar',
  private: 'Gizli',
};

export const Settings = () => {
  const { user, setUser, sphereStyle, setSphereStyle } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const existingAvatar = parseAvatarConfig(user?.avatarUrl);
  const [avatarConfig, setAvatarConfig] = useState(existingAvatar || { ...DEFAULT_AVATAR });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [privacy, setPrivacy] = useState(user?.preferences?.privacyLevel || 'friends');
  const [spherePreview, setSpherePreview] = useState('calm');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const avatarUrl = serializeAvatarConfig(avatarConfig);
      await api.patch('/auth/me', { displayName, bio, avatarUrl });
      setUser({ ...user, displayName, bio, avatarUrl });
      toast('Ayarlar kaydedildi!', 'success');
    } catch {
      toast('Ayarlar kaydedilemedi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">Ayarlar</h1>

        <div className="flex flex-col gap-8">
          {/* Profile */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Profil</h2>
            <div className="flex flex-col gap-4">
              {/* Avatar Creator */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Avatar</label>
                <AvatarPicker config={avatarConfig} onChange={setAvatarConfig} compact />
              </div>
              <Input label="Görünen Ad" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Hakkımda</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-purple-500"
                  placeholder="Kendinden bahset..."
                />
              </div>
              <Button onClick={handleSave} loading={saving}>Kaydet</Button>
            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Gizlilik</h2>
            <div className="flex flex-col gap-2">
              {['public', 'friends', 'private'].map((level) => (
                <label key={level} className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  privacy === level ? 'bg-purple-600/20 border border-purple-500/30' : 'border border-transparent hover:bg-white/5'
                }`}>
                  <input
                    type="radio"
                    name="privacy"
                    value={level}
                    checked={privacy === level}
                    onChange={() => setPrivacy(level)}
                    className="accent-purple-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{PRIVACY_LABELS[level]}</p>
                    <p className="text-xs text-gray-400">
                      {level === 'public' && 'Herkes ruh halini görebilir'}
                      {level === 'friends' && 'Sadece arkadaşların görebilir'}
                      {level === 'private' && 'Sadece sen görebilirsin'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Tema</h2>
            <div className="grid grid-cols-2 gap-3">
              {THEME_LIST.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleThemeChange(t.key)}
                  className={`group overflow-hidden rounded-xl border-2 text-left transition-all ${
                    theme === t.key
                      ? 'border-purple-500 ring-2 ring-purple-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex h-10 overflow-hidden">
                    <div className="flex-1" style={{ backgroundColor: t.preview[0] }} />
                    <div className="w-10" style={{ backgroundColor: t.preview[1] }} />
                    <div className="flex-1" style={{ backgroundColor: t.preview[2] }} />
                  </div>
                  <div className="px-3 py-2.5">
                    <p className={`text-sm font-semibold ${theme === t.key ? 'text-purple-400' : 'text-white'}`}>
                      {t.name}
                    </p>
                    <p className="text-[11px] text-gray-500 capitalize">{t.key}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Sphere Style */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Küre Stili</h2>
            <div className="flex justify-center">
              <MoodSphere emotion={spherePreview} intensity={7} size="medium" style={sphereStyle} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSphereStyle(s.key)}
                  className={`rounded-lg px-3 py-2.5 text-left transition-all ${
                    sphereStyle === s.key
                      ? 'bg-purple-600/20 border border-purple-500/40 ring-1 ring-purple-500/20'
                      : 'border border-white/5 bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  <p className={`text-sm font-medium ${sphereStyle === s.key ? 'text-purple-300' : 'text-gray-300'}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {['calm', 'happiness', 'excitement', 'anger', 'sadness'].map((e) => (
                <button
                  key={e}
                  onClick={() => setSpherePreview(e)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${spherePreview === e ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/15'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};
