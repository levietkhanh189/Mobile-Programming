import { useEffect } from 'react';
import { Alert } from 'react-native';
import { getSocket } from '../services/socket';

const STATUS_VI: Record<string, string> = {
  Confirmed: 'Đã xác nhận',
  Processing: 'Đang xử lý',
  Shipping: 'Đang giao hàng',
  Delivered: 'Đã giao thành công 🎉',
  Cancelled: 'Đã hủy',
};

interface OrderStatusEvent {
  orderId: string;
  status: string;
}

export function useOrderNotifications(): void {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (event: OrderStatusEvent) => {
      const label = STATUS_VI[event.status] || event.status;
      Alert.alert(
        '📦 Cập nhật đơn hàng',
        `Đơn #${event.orderId.slice(-8).toUpperCase()}: ${label}`,
      );
    };

    socket.on('order:status_changed', handler);
    return () => {
      socket.off('order:status_changed', handler);
    };
  }, []);
}
