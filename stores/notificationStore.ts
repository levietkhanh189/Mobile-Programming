import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  type: 'order' | 'promo' | 'system';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'seed-1',
    type: 'order',
    title: 'Đơn hàng đã được xác nhận',
    body: 'Đơn hàng #ORD001 của bạn đã được xác nhận và đang được xử lý.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    link: '/orders',
  },
  {
    id: 'seed-2',
    type: 'promo',
    title: 'Khuyến mãi hôm nay',
    body: 'Giảm 20% tất cả sản phẩm điện tử. Chỉ trong hôm nay!',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: 'seed-3',
    type: 'system',
    title: 'Chào mừng bạn đến Indie Store',
    body: 'Cảm ơn bạn đã tham gia. Khám phá hàng nghìn sản phẩm chất lượng.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

interface NotificationState {
  notifications: Notification[];
  seeded: boolean;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: SEED_NOTIFICATIONS,
      seeded: true,
      addNotification: (n) => {
        const newNotif: Notification = {
          ...n,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set({ notifications: [newNotif, ...get().notifications] });
      },
      markRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      },
      markAllRead: () => {
        set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) });
      },
      removeNotification: (id) => {
        set({ notifications: get().notifications.filter((n) => n.id !== id) });
      },
      clearAll: () => set({ notifications: [] }),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'notifications',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
