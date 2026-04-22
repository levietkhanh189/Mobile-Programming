/**
 * OrderDetailContent — full order detail screen content.
 * Sections: status timeline, shipping address, line items, order summary, actions.
 */
import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, Pressable,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { orderService } from '@/services/api';
import { OrderStatusTimeline } from '@/components/order/order-status-timeline';
import { OrderLineItemsList } from '@/components/order/order-line-items-list';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { useCartStore } from '@/stores/cartStore';

interface Props {
  orderId: string;
}

export function OrderDetailContent({ orderId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(orderId),
    onSuccess: (res) => {
      if (res.success) {
        Alert.alert('Thành công', 'Đơn hàng đã được hủy');
        queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } else {
        Alert.alert('Lỗi', res.message);
      }
    },
    onError: (e: any) => Alert.alert('Lỗi', e.message || 'Không thể hủy đơn hàng'),
  });

  const handleCancel = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn hủy đơn hàng này?', [
      { text: 'Không', style: 'cancel' },
      { text: 'Hủy đơn', style: 'destructive', onPress: () => cancelMutation.mutate() },
    ]);
  };

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((item) => {
      // Construct a minimal Product-compatible object for the cart store
      addItem({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        description: '',
        category: '',
        images: [],
        soldCount: 0,
        discountPercentage: 0,
        createdAt: '',
      }, item.quantity);
    });
    Alert.alert('Thành công', 'Đã thêm tất cả sản phẩm vào giỏ hàng');
    router.push('/(tabs)/cart');
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (isError || !data?.success) {
    const msg = (error as any)?.message || 'Không thể tải đơn hàng';
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{msg}</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  const order = data.data!;
  const canCancel = order.status === 'Pending' || order.status === 'Confirmed';
  const shippingFee: number = 0; // Free shipping - update when backend provides it

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Status Timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trạng thái đơn hàng</Text>
        <OrderStatusTimeline currentStatus={order.status} history={order.statusHistory} />
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
        <View style={styles.addressCard}>
          <Text style={styles.addressText}>{order.shippingAddress}</Text>
        </View>
      </View>

      {/* Line Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm ({order.items.length})</Text>
        <OrderLineItemsList items={order.items} />
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tạm tính</Text>
          <Text style={styles.summaryValue}>${order.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>
            {shippingFee === 0 ? 'Miễn phí' : `$${shippingFee.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalAmount}>${(order.totalAmount + shippingFee).toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Thanh toán</Text>
          <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.reorderBtn} onPress={handleReorder}>
          <Text style={styles.reorderBtnText}>Mua lại</Text>
        </Pressable>
        {canCancel && (
          <Pressable
            style={[styles.cancelBtn, cancelMutation.isPending && styles.btnDisabled]}
            onPress={handleCancel}
            disabled={cancelMutation.isPending}
          >
            <Text style={styles.cancelBtnText}>
              {cancelMutation.isPending ? 'Đang hủy...' : 'Hủy đơn hàng'}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  loadingText: { marginTop: SPACING.sm, color: COLORS.textSecondary, fontSize: TYPOGRAPHY.fontSize.sm },
  errorText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.error, textAlign: 'center', marginBottom: SPACING.md },
  backBtn: {
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary, borderRadius: 4,
  },
  backBtnText: { color: COLORS.white, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold },
  section: {
    backgroundColor: COLORS.white, marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderTopWidth: 1, borderColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text, marginBottom: SPACING.sm,
  },
  addressCard: {
    backgroundColor: COLORS.background, padding: SPACING.sm,
    borderRadius: 4, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  addressText: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, lineHeight: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  summaryLabel: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary },
  summaryValue: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.text, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.sm },
  totalLabel: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold, color: COLORS.text },
  totalAmount: { fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold, color: COLORS.priceBig },
  actionsRow: {
    flexDirection: 'row', gap: SPACING.sm,
    marginHorizontal: SPACING.screenPadding, marginTop: SPACING.sm,
  },
  reorderBtn: {
    flex: 1, backgroundColor: COLORS.btnYellow, paddingVertical: SPACING.md,
    borderRadius: 4, alignItems: 'center', borderWidth: 1, borderColor: COLORS.btnYellowBorder,
  },
  reorderBtnText: { fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, color: COLORS.text, fontSize: TYPOGRAPHY.fontSize.sm },
  cancelBtn: {
    flex: 1, borderWidth: 1, borderColor: COLORS.error, paddingVertical: SPACING.md,
    borderRadius: 4, alignItems: 'center', backgroundColor: COLORS.white,
  },
  cancelBtnText: { fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, color: COLORS.error, fontSize: TYPOGRAPHY.fontSize.sm },
  btnDisabled: { opacity: 0.6 },
});
