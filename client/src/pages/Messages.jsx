import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { MemePicker } from '../components/ui/MemePicker.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { useFriendStore } from '../stores/friendStore.js';
import { parseMeme } from '../utils/memes.js';
import * as messageService from '../services/messageService.js';
import * as friendService from '../services/friendService.js';

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

export const Messages = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { friends, setFriends } = useFriendStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showMemes, setShowMemes] = useState(false);
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

                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl sm:max-w-[70%] ${
                          isMeme ? 'p-1' : `px-3 py-2 sm:px-4 ${isOwn ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-200'}`
                        }`}>
                          {isMeme ? (
                            <MemeCard content={msg.content} />
                          ) : (
                            <p className="text-sm">{msg.content}</p>
                          )}
                          <p className={`mt-1 text-xs opacity-50 ${isMeme ? 'text-center text-gray-400' : ''}`}>
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
                </AnimatePresence>

                <form onSubmit={handleSend} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMemes((v) => !v)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      showMemes ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Send a meme"
                  >
                    <span className="text-lg">😂</span>
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
