import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore.js';
import { useSocketStore } from '../stores/socketStore.js';
import { useFriendStore } from '../stores/friendStore.js';
import { useNotificationStore } from '../stores/notificationStore.js';

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
    });

    newSocket.on('message:new', (message) => {
      addNotification({
        id: message.id,
        type: 'message',
        title: 'New Message',
        body: `${message.sender?.displayName || 'Someone'} sent you a message`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);
};
