import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore.js';
import { useSocketStore } from '../stores/socketStore.js';
import { useFriendStore } from '../stores/friendStore.js';
import { useNotificationStore } from '../stores/notificationStore.js';
import { toast } from '../components/ui/Toast.jsx';

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { setSocket, setConnected } = useSocketStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Disconnect previous socket before creating new one
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const newSocket = io({
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 15000,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('friend:mood:update', (data) => {
      useFriendStore.getState().updateFriendMood(data.userId, data);
    });

    newSocket.on('notification:new', (notification) => {
      useNotificationStore.getState().addNotification(notification);
    });

    newSocket.on('reaction:received', (reaction) => {
      useNotificationStore.getState().addNotification({
        id: reaction.id,
        type: 'reaction',
        title: 'Yeni Reaksiyon',
        body: `Birisi sana ${reaction.type} gönderdi`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      toast(`❤️ Birisi sana ${reaction.type} gönderdi`, 'info');
    });

    newSocket.on('message:new', (message) => {
      // Don't toast if user is currently on the messages page viewing this chat
      const isOnMessagesPage = window.location.pathname.startsWith('/messages/');
      if (isOnMessagesPage) return;

      const senderName = message.sender?.displayName || 'Birisi';
      useNotificationStore.getState().addNotification({
        id: message.id,
        type: 'message',
        title: 'Yeni Mesaj',
        body: `${senderName} sana mesaj gönderdi`,
        read: false,
        createdAt: new Date().toISOString(),
      });

      const preview = message.msgType === 'meme' ? 'meme gönderdi'
        : message.msgType === 'music' ? 'şarkı paylaştı'
        : message.content?.slice(0, 50) || 'Yeni mesaj';
      toast(`💬 ${senderName}: ${preview}`, 'info');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, token]);
};
