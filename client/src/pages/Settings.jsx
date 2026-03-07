import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { THEME_LIST, applyTheme } from '../utils/themes.js';
import { toast } from '../components/ui/Toast.jsx';
import api from '../services/api.js';

const STYLE_OPTIONS = [
  { key: 'default', label: 'Classic', desc: 'Smooth organic displacement' },
  { key: 'crystal', label: 'Crystal', desc: 'Faceted gem with rainbow refraction' },
  { key: 'nebula', label: 'Nebula', desc: 'Deep space with aurora bands' },
  { key: 'wireframe', label: 'Wireframe', desc: 'Holographic data grid' },
];

export const Settings = () => {
  const { user, setUser, sphereStyle, setSphereStyle } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [privacy, setPrivacy] = useState(user?.preferences?.privacyLevel || 'friends');
  const [spherePreview, setSpherePreview] = useState('calm');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/auth/me`, { displayName, bio });
      toast('Settings saved!', 'success');
    } catch {
      toast('Failed to save settings', 'error');
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
        <h1 className="mb-6 text-2xl font-bold text-white">Settings</h1>

        <div className="flex flex-col gap-8">
          {/* Profile */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
            <div className="flex flex-col gap-4">
              <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-purple-500"
                  placeholder="Tell something about yourself..."
                />
              </div>
              <Button onClick={handleSave} loading={saving}>Save Profile</Button>
            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Privacy</h2>
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
                    <p className="text-sm font-medium text-white capitalize">{level}</p>
                    <p className="text-xs text-gray-400">
                      {level === 'public' && 'Anyone can see your mood'}
                      {level === 'friends' && 'Only friends can see your mood'}
                      {level === 'private' && 'Only you can see your mood'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Theme</h2>
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
            <h2 className="mb-4 text-lg font-semibold text-white">Sphere Style</h2>
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
