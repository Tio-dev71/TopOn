import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import api from '@/lib/api';
import { useAuthStore } from './auth.store';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  socket: null,

  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length
  }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  })),

  connectSocket: (token) => {
    if (get().socket) return;
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
    const newSocket = io(socketUrl, {
      auth: { token }
    });

    newSocket.on('notification', (notification: Notification) => {
      get().addNotification(notification);
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));

export const useNotifications = () => {
  const { user, accessToken } = useAuthStore();
  const store = useNotificationStore();

  useEffect(() => {
    if (user && accessToken) {
      // Fetch initial notifications
      api.get('/notifications?limit=20').then(res => {
        store.setNotifications(res.data.data);
      }).catch(console.error);

      // Connect socket
      store.connectSocket(accessToken);
    } else {
      store.disconnectSocket();
    }

    return () => {
      // Don't disconnect on unmount, wait for logout
    };
  }, [user?.id, accessToken]);

  return store;
};
