import React, { useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, Order } from '@/services/api';
import { Button } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Confirmed: { bg: '#DBEAFE', text: '#1E40AF' },
  Processing: { bg: '#EDE9FE', text: '#6D28D9' },
  Shipping: { bg: '#E0E7FF', text: '#3730A3' },
  Delivered: { bg: '#D1FAE5', text: '#065F46' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function OrderHistoryScreen() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrderHistory,
  });

  const cancelMutation = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: (res) => {
      if (res.success) {
        Alert.alert('Success', 'Order cancelled');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } else {
        Alert.alert('Error', res.message);
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to cancel order');
    },
  });

  const orders = data?.data || [];

  const renderOrder = useCallback(({ item, index }: { item: Order; index: number }) => {
    const canCancel = item.status === 'Pending' || item.status === 'Confirmed';
    const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.Pending;

    return (
      <Animated.View
        entering={FadeInDown.duration(400).delay(index * 80)}
        style={styles.card}
        accessibilityRole="summary"
        accessibilityLabel={`Order ${item.id.slice(-6)}, status ${item.status}, total $${item.totalAmount.toFixed(2)}`}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {item.items.map((prod, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {prod.name} x{prod.quantity}
            </Text>
            <Text style={styles.itemPrice}>
              ${(prod.price * prod.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
        </View>

        {canCancel && (
          <Button
            mode="text"
            textColor={GLASS_COLORS.error}
            onPress={() => cancelMutation.mutate(item.id)}
            loading={cancelMutation.isPending}
            style={styles.cancelBtn}
            accessibilityLabel="Cancel this order"
          >
            Cancel Order
          </Button>
        )}
      </Animated.View>
    );
  }, [cancelMutation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={GLASS_COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GLASS_COLORS.backgroundDark },
  header: {
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.md,
    backgroundColor: GLASS_COLORS.white, ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.text,
  },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  card: {
    backgroundColor: GLASS_COLORS.white, borderRadius: 16, padding: SPACING.md,
    marginBottom: 14, borderWidth: 1, borderColor: GLASS_COLORS.cardBorder, ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  orderId: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
  },
  orderDate: {
    fontSize: TYPOGRAPHY.fontSize.xs, color: GLASS_COLORS.textMuted, marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold },
  divider: {
    height: 1, backgroundColor: GLASS_COLORS.divider, marginVertical: SPACING.sm,
  },
  itemRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4,
  },
  itemName: {
    flex: 1, fontSize: TYPOGRAPHY.fontSize.sm, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: GLASS_COLORS.text,
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm,
    paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: GLASS_COLORS.divider,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
  },
  totalAmount: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.primary,
  },
  cancelBtn: { alignSelf: 'flex-end', marginTop: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
});
