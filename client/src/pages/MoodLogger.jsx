import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { EmotionPicker } from '../components/ui/EmotionPicker.jsx';
import { IntensitySlider } from '../components/ui/IntensitySlider.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useMoodStore } from '../stores/moodStore.js';
import { useAuthStore } from '../stores/authStore.js';
import * as moodService from '../services/moodService.js';
import { toast } from '../components/ui/Toast.jsx';

export const MoodLogger = () => {
  const [emotion, setEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [journal, setJournal] = useState('');
  const [loading, setLoading] = useState(false);
  const addMoodLog = useMoodStore((s) => s.addMoodLog);
  const sphereStyle = useAuthStore((s) => s.sphereStyle);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!emotion) {
      toast('Please select an emotion', 'warning');
      return;
    }

    setLoading(true);
    try {
      const moodLog = await moodService.logMood({
        emotion,
        intensity,
        journal: journal.trim() || undefined,
      });
      addMoodLog(moodLog);
      toast('Mood logged!', 'success');
      navigate('/profile');
    } catch (err) {
      toast(err.response?.data?.error?.message || 'Failed to log mood', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-white">How are you feeling?</h1>

          {/* Live Preview Sphere */}
          <div className="flex justify-center">
            <MoodSphere
              emotion={emotion || 'calm'}
              intensity={intensity}
              size="medium"
              interactive={false}
              style={sphereStyle}
            />
          </div>

          {/* Emotion Picker */}
          <EmotionPicker selected={emotion} onSelect={setEmotion} />

          {/* Intensity */}
          {emotion && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <IntensitySlider value={intensity} onChange={setIntensity} emotion={emotion} />
            </motion.div>
          )}

          {/* Journal */}
          {emotion && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Journal (optional)
              </label>
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500"
              />
            </motion.div>
          )}

          {/* Submit */}
          <Button onClick={handleSubmit} loading={loading} disabled={!emotion} size="lg" className="w-full">
            Log Mood
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};
