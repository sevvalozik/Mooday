import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AvatarPicker } from '../components/ui/AvatarPicker.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { toast } from '../components/ui/Toast.jsx';
import api from '../services/api.js';

export const AvatarSetup = () => {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/me', { avatarUrl: selected });
      setUser({ ...user, avatarUrl: selected });
      toast('Avatar set!', 'success');
      navigate('/dashboard');
    } catch {
      toast('Failed to save avatar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Choose Your Avatar</h1>
          <p className="mt-2 text-gray-400">Pick an avatar that represents you</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <AvatarPicker selected={selected} onSelect={setSelected} />

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Skip for now
            </button>
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={!selected}
              className="flex-1"
            >
              Save Avatar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
