import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore.js';
import * as authService from '../services/authService.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { AvatarPicker } from '../components/ui/AvatarPicker.jsx';
import { DEFAULT_AVATAR, serializeAvatarConfig } from '../utils/avatars.js';
import { toast } from '../components/ui/Toast.jsx';
import api from '../services/api.js';

export const Register = () => {
  const [step, setStep] = useState(1); // 1 = account info, 2 = avatar
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '', confirmPassword: '' });
  const [avatarConfig, setAvatarConfig] = useState({ ...DEFAULT_AVATAR });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const { login, setUser, user } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register({
        email: form.email,
        username: form.username,
        displayName: form.displayName,
        password: form.password,
      });
      login(data.user, data.accessToken, data.refreshToken);
      setLoading(false);
      setStep(2);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || 'Kayıt başarısız');
    }
  };

  const handleSaveAvatar = async () => {
    setSavingAvatar(true);
    try {
      const avatarUrl = serializeAvatarConfig(avatarConfig);
      await api.patch('/auth/me', { avatarUrl });
      setUser({ ...user, avatarUrl });
      toast('Mooday\'e hoş geldin!', 'success');
      navigate('/dashboard');
    } catch {
      toast('Avatar kaydedilemedi', 'error');
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="text-3xl font-bold text-white">
            Mood<span className="text-purple-400">ay</span>
          </Link>
        </div>

        {/* Step indicators */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            step >= 1 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-500'
          }`}>1</div>
          <div className={`h-0.5 w-12 rounded ${step >= 2 ? 'bg-purple-600' : 'bg-white/10'}`} />
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            step >= 2 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-500'
          }`}>2</div>
        </div>

        {/* Step 1: Account Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-4 text-center text-gray-400">Hesabını oluştur</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Input label="E-posta" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange('email')} required />
              <Input label="Kullanıcı Adı" placeholder="kullanici_adi" value={form.username} onChange={handleChange('username')} required />
              <Input label="Görünen Ad" placeholder="Adın" value={form.displayName} onChange={handleChange('displayName')} required />
              <Input label="Şifre" type="password" placeholder="En az 6 karakter" value={form.password} onChange={handleChange('password')} required />
              <Input label="Şifre Tekrar" type="password" placeholder="Şifreyi tekrarla" value={form.confirmPassword} onChange={handleChange('confirmPassword')} required />

              <Button type="submit" loading={loading} className="mt-2 w-full">
                İleri
              </Button>

              <p className="text-center text-sm text-gray-400">
                Zaten hesabın var mı?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300">
                  Giriş yap
                </Link>
              </p>
            </form>
          </motion.div>
        )}

        {/* Step 2: Avatar Creator */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="mb-4 text-center text-gray-400">Avatarını tasarla</p>
            <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <AvatarPicker config={avatarConfig} onChange={setAvatarConfig} />

              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Atla
                </button>
                <Button onClick={handleSaveAvatar} loading={savingAvatar} className="flex-1">
                  Tamam
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
