import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { useFriendStore } from '../stores/friendStore.js';
import * as friendService from '../services/friendService.js';
import { EMOTIONS } from '../utils/emotionConfig.js';

export const Friends = () => {
  const { friends, setFriends, pendingRequests, setPendingRequests } = useFriendStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('friends');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [friendsData, requests] = await Promise.all([
          friendService.getFriends(),
          friendService.getPendingRequests(),
        ]);
        setFriends(friendsData);
        setPendingRequests(requests);
      } catch (err) {
        console.error('Friends load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await friendService.searchUsers(searchQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSendRequest = async (userId) => {
    try {
      await friendService.sendRequest(userId);
      setActionMsg('Friend request sent!');
      setSearchResults((prev) => prev.filter((u) => u.id !== userId));
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setActionMsg(err.response?.data?.error?.message || 'Failed to send request');
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const handleAccept = async (friendshipId) => {
    try {
      await friendService.acceptRequest(friendshipId);
      setPendingRequests(pendingRequests.filter((r) => r.friendshipId !== friendshipId));
      const updatedFriends = await friendService.getFriends();
      setFriends(updatedFriends);
      setActionMsg('Friend request accepted!');
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setActionMsg('Failed to accept request');
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const getMoodColor = (mood) => {
    if (!mood?.emotion) return '#6b7280';
    return EMOTIONS[mood.emotion]?.color || '#6b7280';
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-white">Friends</h1>

        {/* Action message */}
        <AnimatePresence>
          {actionMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg bg-purple-600/20 px-4 py-2 text-sm text-purple-300"
            >
              {actionMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500"
          />
          {searching && (
            <div className="absolute right-3 top-3 h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-sm font-medium text-gray-400">Search Results</h3>
            <div className="flex flex-col gap-2">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/30 text-sm font-bold text-purple-300">
                      {user.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.displayName}</p>
                      <p className="text-sm text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    className="rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('friends')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'friends' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'requests' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
          </button>
        </div>

        {/* Friends List */}
        {tab === 'friends' && (
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="py-8 text-center text-gray-500">Loading...</div>
            ) : friends.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">No friends yet</p>
                <p className="mt-1 text-sm">Search for users above to add friends</p>
              </div>
            ) : (
              friends.map((friend) => (
                <Link
                  key={friend.friendshipId}
                  to={`/friends/${friend.id}`}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                    style={{ backgroundColor: getMoodColor(friend.latestMood) + '30', color: getMoodColor(friend.latestMood) }}
                  >
                    {friend.displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{friend.displayName}</p>
                    <p className="text-sm text-gray-400">@{friend.username}</p>
                  </div>
                  {friend.latestMood && (
                    <span className="text-lg">{EMOTIONS[friend.latestMood.emotion]?.icon || ''}</span>
                  )}
                </Link>
              ))
            )}
          </div>
        )}

        {/* Pending Requests */}
        {tab === 'requests' && (
          <div className="flex flex-col gap-2">
            {pendingRequests.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No pending requests</div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.friendshipId} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/30 text-sm font-bold text-purple-300">
                      {req.sender.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{req.sender.displayName}</p>
                      <p className="text-sm text-gray-400">@{req.sender.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAccept(req.friendshipId)}
                    className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-500"
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
