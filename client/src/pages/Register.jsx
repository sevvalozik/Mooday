import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      setError('Passwords do not match');
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
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    setSavingAvatar(true);
    try {
      const avatarUrl = serializeAvatarConfig(avatarConfig);
      await api.patch('/auth/me', { avatarUrl });
      setUser({ ...user, avatarUrl });
      toast('Welcome to Mooday!', 'success');
      navigate('/dashboard');
    } catch {
      toast('Failed to save avatar', 'error');
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

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <p className="mb-4 text-center text-gray-400">Create your account</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange('email')} required />
                <Input label="Username" placeholder="cooluser" value={form.username} onChange={handleChange('username')} required />
                <Input label="Display Name" placeholder="Your Name" value={form.displayName} onChange={handleChange('displayName')} required />
                <Input label="Password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange('password')} required />
                <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} required />

                <Button type="submit" loading={loading} className="mt-2 w-full">
                  Next
                </Button>

                <p className="text-center text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-purple-400 hover:text-purple-300">
                    Login
                  </Link>
                </p>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <p className="mb-4 text-center text-gray-400">Design your avatar</p>
              <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <AvatarPicker config={avatarConfig} onChange={setAvatarConfig} />

                <div className="flex gap-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Skip
                  </button>
                  <Button onClick={handleSaveAvatar} loading={savingAvatar} className="flex-1">
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
