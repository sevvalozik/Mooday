import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore.js';
import { useSocketStore } from '../stores/socketStore.js';
import { useFriendStore } from '../stores/friendStore.js';
import { useNotificationStore } from '../stores/notificationStore.js';
import { toast } from '../components/ui/Toast.jsx';

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { socket, setSocket, setConnected, disconnect } = useSocketStore();
  const { updateFriendMood } = useFriendStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) disconnect();
      return;
    }

    const newSocket = io({
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('friend:mood:update', (data) => {
      updateFriendMood(data.userId, data);
    });

    newSocket.on('notification:new', (notification) => {
      addNotification(notification);
    });

    newSocket.on('reaction:received', (reaction) => {
      addNotification({
        id: reaction.id,
        type: 'reaction',
        title: 'New Reaction',
        body: `Someone sent you a ${reaction.type}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      toast(`❤️ Someone sent you a ${reaction.type}`, 'info');
    });

    newSocket.on('message:new', (message) => {
      const senderName = message.sender?.displayName || 'Someone';
      addNotification({
        id: message.id,
        type: 'message',
        title: 'New Message',
        body: `${senderName} sent you a message`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      toast(`💬 ${senderName}: ${message.msgType === 'meme' ? 'sent a meme' : message.msgType === 'music' ? 'shared a song' : message.content?.slice(0, 50) || 'New message'}`, 'info');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);
};
