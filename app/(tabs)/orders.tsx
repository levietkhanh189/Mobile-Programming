import React, { useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, Alert, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { orderService, Order } from '@/services/api';
import { Button } from 'react-native-paper';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { useOrderNotifications } from '../../hooks/use-order-notifications';
import { OrderListSkeleton } from '@/components/order/order-card-skeleton';
import { ErrorRetry } from '@/components/ui/error-retry';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Confirmed: { bg: '#DBEAFE', text: '#1E40AF' },
  Processing: { bg: '#EDE9FE', text: '#6D28D9' },
  Shipping: { bg: '#E0E7FF', text: '#3730A3' },
  Delivered: { bg: '#D1FAE5', text: '#065F46' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function OrderHistoryScreen() {
  useOrderNotifications();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrderHistory,
  });

  const cancelMutation = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: (res) => {
      if (res.success) { Alert.alert('Success', 'Order cancelled'); queryClient.invalidateQueries({ queryKey: ['orders'] }); }
      else Alert.alert('Error', res.message);
    },
    onError: (e: any) => Alert.alert('Error', e.message || 'Failed'),
  });

  const orders = data?.data || [];

  const renderOrder = useCallback(({ item }: { item: Order }) => {
    const canCancel = item.status === 'Pending' || item.status === 'Confirmed';
    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.Pending;
    return (
      <Pressable onPress={() => router.push(`/order/${item.id}` as any)} style={({ pressed }) => [pressed && styles.cardPressed]}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.statusText, { color: sc.text }]}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        {item.items.map((prod, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>{prod.name} x{prod.quantity}</Text>
            <Text style={styles.itemPrice}>${(prod.price * prod.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Order Total:</Text>
          <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
        </View>
        {canCancel && (
          <Button mode="text" textColor={COLORS.error} onPress={() => cancelMutation.mutate(item.id)}
            loading={cancelMutation.isPending} style={{ alignSelf: 'flex-end' }}
            accessibilityLabel="Cancel this order"
          >
            Cancel Order
          </Button>
        )}
      </View>
      </Pressable>
    );
  }, [cancelMutation, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Orders</Text>
      </View>
      {isLoading ? (
        <View style={styles.list}>
          <OrderListSkeleton count={3} />
        </View>
      ) : isError ? (
        <ErrorRetry onRetry={refetch} />
      ) : orders.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>No orders yet</Text></View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
  },
  list: { padding: SPACING.screenPadding, paddingBottom: 80 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 4, borderWidth: 1,
    borderColor: COLORS.cardBorder, padding: SPACING.md, marginBottom: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
  },
  date: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  itemName: { flex: 1, fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary },
  itemPrice: { fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium, color: COLORS.text },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm,
    paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  totalLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, color: COLORS.text },
  totalAmount: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold, color: COLORS.priceBig },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.textSecondary },
  cardPressed: { opacity: 0.85 },
});
