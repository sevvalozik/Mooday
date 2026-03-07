import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { MemePicker } from '../components/ui/MemePicker.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { useFriendStore } from '../stores/friendStore.js';
import { parseMeme } from '../utils/memes.js';
import * as messageService from '../services/messageService.js';
import * as friendService from '../services/friendService.js';
import * as musicService from '../services/musicService.js';

const MemeCard = ({ content }) => {
  const meme = parseMeme(content);
  if (!meme) return <p className="text-sm">{content}</p>;

  return (
    <div className={`flex flex-col items-center rounded-lg bg-gradient-to-br ${meme.bg} px-4 py-3`}>
      <span className="text-4xl">{meme.emoji}</span>
      <span className="mt-1 text-center text-xs font-medium text-white/90">{meme.text}</span>
    </div>
  );
};

const PLATFORM_ICONS = { spotify: '🟢', youtube: '🔴', apple: '🍎', other: '🎵' };

const MusicCard = ({ content }) => {
  let song;
  try { song = JSON.parse(content); } catch { return <p className="text-sm">{content}</p>; }
  return (
    <a
      href={song.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 px-4 py-3 transition-colors hover:from-purple-600/40 hover:to-pink-600/40"
    >
      <span className="text-2xl">{PLATFORM_ICONS[song.platform] || '🎵'}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{song.songTitle}</p>
        {song.artistName && <p className="truncate text-xs text-gray-300">{song.artistName}</p>}
        {song.note && <p className="mt-1 truncate text-xs text-gray-400 italic">"{song.note}"</p>}
      </div>
      <span className="text-xs text-gray-400">&#8599;</span>
    </a>
  );
};

const SongShareModal = ({ onSend, onClose }) => {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [platform, setPlatform] = useState('spotify');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!songTitle.trim() || !songUrl.trim()) return;
    onSend({ songTitle: songTitle.trim(), artistName: artistName.trim(), songUrl: songUrl.trim(), platform, note: note.trim() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-white/10 bg-gray-900 p-4 shadow-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Share a Song</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="Song title *" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500" />
        <input value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Artist name" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500" />
        <input value={songUrl} onChange={(e) => setSongUrl(e.target.value)} placeholder="Song link (Spotify, YouTube, etc.) *" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500" />
        <div className="flex gap-2">
          {['spotify', 'youtube', 'apple', 'other'].map((p) => (
            <button key={p} type="button" onClick={() => setPlatform(p)} className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${platform === p ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              {PLATFORM_ICONS[p]} {p}
            </button>
          ))}
        </div>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500" />
        <button type="submit" disabled={!songTitle.trim() || !songUrl.trim()} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-40">
          Share Song
        </button>
      </form>
    </motion.div>
  );
};

export const Messages = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { friends, setFriends } = useFriendStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showMemes, setShowMemes] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    friendService.getFriends().then(setFriends).catch(() => {});
  }, []);

  useEffect(() => {
    if (friendId) {
      messageService.getConversation(friendId).then((data) => {
        setMessages(data.messages || []);
      }).catch(() => {});
    }
    setShowMemes(false);
  }, [friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !friendId) return;

    setSending(true);
    try {
      const msg = await messageService.sendMessage({
        receiverId: friendId,
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  const handleSendMeme = async (meme) => {
    if (!friendId) return;
    setShowMemes(false);
    setSending(true);
    try {
      const msg = await messageService.sendMessage({
        receiverId: friendId,
        content: JSON.stringify({ emoji: meme.emoji, text: meme.text, bg: meme.bg }),
        msgType: 'meme',
      });
      setMessages((prev) => [...prev, msg]);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  const handleSendSong = async (songData) => {
    if (!friendId) return;
    setShowMusic(false);
    setSending(true);
    try {
      const song = await musicService.shareSong({ receiverId: friendId, ...songData });
      // Add as a message-like entry in chat
      const msg = await messageService.sendMessage({
        receiverId: friendId,
        content: JSON.stringify({ songTitle: songData.songTitle, artistName: songData.artistName, songUrl: songData.songUrl, platform: songData.platform, note: songData.note }),
        msgType: 'music',
      });
      setMessages((prev) => [...prev, msg]);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  // Mobile: show friend list when no chat is selected
  const showMobileFriendList = !friendId;

  return (
    <PageWrapper>
      <div className="flex h-[calc(100vh-8rem)] gap-4 md:h-[calc(100vh-8rem)]">
        {/* Friend List — desktop sidebar / mobile full view */}
        <div className={`${
          showMobileFriendList ? 'flex' : 'hidden md:flex'
        } w-full flex-col gap-1 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3 md:w-64`}>
          <h2 className="mb-2 px-2 text-sm font-semibold text-gray-400">Conversations</h2>
          {friends.length === 0 && (
            <p className="px-2 py-4 text-center text-sm text-gray-500">No friends yet</p>
          )}
          {friends.map((f) => (
            <Link
              key={f.id}
              to={`/messages/${f.id}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                friendId === f.id ? 'bg-purple-600/20 text-white' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600/50 text-xs font-bold">
                {f.displayName?.charAt(0)}
              </div>
              <span className="text-sm">{f.displayName}</span>
            </Link>
          ))}
        </div>

        {/* Chat Area */}
        <div className={`${
          friendId ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col rounded-xl border border-white/10 bg-white/5`}>
          {friendId ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <button
                  onClick={() => navigate('/messages')}
                  className="text-gray-400 hover:text-white md:hidden"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <p className="font-semibold text-white">
                  {friends.find((f) => f.id === friendId)?.displayName || 'Chat'}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    const isMeme = msg.msgType === 'meme';
                    const isMusic = msg.msgType === 'music';
                    const isSpecial = isMeme || isMusic;

                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl sm:max-w-[70%] ${
                          isSpecial ? 'p-1' : `px-3 py-2 sm:px-4 ${isOwn ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-200'}`
                        }`}>
                          {isMeme ? (
                            <MemeCard content={msg.content} />
                          ) : isMusic ? (
                            <MusicCard content={msg.content} />
                          ) : (
                            <p className="text-sm">{msg.content}</p>
                          )}
                          <p className={`mt-1 text-xs opacity-50 ${isSpecial ? 'text-center text-gray-400' : ''}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="relative border-t border-white/10 p-2 sm:p-3">
                <AnimatePresence>
                  {showMemes && (
                    <MemePicker
                      onSelect={handleSendMeme}
                      onClose={() => setShowMemes(false)}
                    />
                  )}
                  {showMusic && (
                    <SongShareModal
                      onSend={handleSendSong}
                      onClose={() => setShowMusic(false)}
                    />
                  )}
                </AnimatePresence>

                <form onSubmit={handleSend} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowMemes((v) => !v); setShowMusic(false); }}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      showMemes ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Send a meme"
                  >
                    <span className="text-lg">😂</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowMusic((v) => !v); setShowMemes(false); }}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      showMusic ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Share a song"
                  >
                    <span className="text-lg">🎵</span>
                  </button>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 sm:px-4"
                  />
                  <Button type="submit" loading={sending} disabled={!newMessage.trim()}>
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
