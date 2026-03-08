import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { MoodSphere } from '../components/sphere/MoodSphere.jsx';
import { ReactionButton } from '../components/ui/ReactionButton.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ProfileSkeleton } from '../components/ui/Skeleton.jsx';
import { UserAvatar } from '../components/ui/UserAvatar.jsx';
import { EMOTIONS } from '../utils/emotionConfig.js';
import { useFriendStore } from '../stores/friendStore.js';
import * as reactionService from '../services/reactionService.js';
import * as insightService from '../services/insightService.js';
import { toast } from '../components/ui/Toast.jsx';

export const FriendProfile = () => {
  const { id } = useParams();
  const friends = useFriendStore((s) => s.friends);
  const friend = friends.find((f) => f.id === id);
  const [compatibility, setCompatibility] = useState(null);
  const [loadingCompat, setLoadingCompat] = useState(true);

  useEffect(() => {
    if (id) {
      insightService.getCompatibility(id)
        .then(setCompatibility)
        .catch(() => {})
        .finally(() => setLoadingCompat(false));
    }
  }, [id]);

  if (!friend) {
    return (
      <PageWrapper>
        <ProfileSkeleton />
      </PageWrapper>
    );
  }

  const emotion = friend.latestMood?.emotion || 'calm';
  const config = EMOTIONS[emotion] || EMOTIONS.calm;

  const handleReact = async (type) => {
    try {
      await reactionService.sendReaction({
        receiverId: friend.id,
        moodLogId: friend.latestMood?.id,
        type,
      });
      toast('Reaction sent!', 'success');
    } catch {
      toast('Failed to send reaction', 'error');
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <UserAvatar user={friend} size="xl" className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">{friend.displayName}</h1>
          <p className="text-gray-400">@{friend.username}</p>
        </div>

        <MoodSphere emotion={emotion} intensity={friend.latestMood?.intensity || 5} size="large" />

        {friend.latestMood && (
          <div className="text-center">
            <p className="text-lg">
              <span className="mr-2 text-2xl">{config.icon}</span>
              Feeling <span className="font-bold" style={{ color: config.color }}>{config.label}</span>
            </p>
            {friend.latestMood.journal && (
              <p className="mt-2 max-w-sm text-sm text-gray-400 italic">"{friend.latestMood.journal}"</p>
            )}
          </div>
        )}

        {/* Reactions */}
        <div>
          <p className="mb-2 text-center text-sm text-gray-400">Send a reaction</p>
          <ReactionButton onReact={handleReact} />
        </div>

        {/* Compatibility */}
        {compatibility && (
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm text-gray-400">Emotional Compatibility</p>
            <p className="text-4xl font-bold text-purple-400">{compatibility.score}%</p>
            <p className="mt-2 text-sm text-gray-400">{compatibility.insight}</p>
            {compatibility.sharedEmotions?.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Shared emotions: {compatibility.sharedEmotions.map((e) => EMOTIONS[e]?.icon).join(' ')}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => window.location.href = `/messages/${friend.id}`}>
            Message
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};
