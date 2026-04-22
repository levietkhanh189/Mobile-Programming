import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, StyleSheet, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useCartStore } from '@/stores/cartStore';
import { orderService, userService } from '@/services/api';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AddressPicker, { CartAddress } from '@/components/cart/address-picker';
import CartStepIndicator from '@/components/cart/cart-step-indicator';
import ShippingMethodPicker, { SHIPPING_METHODS } from '@/components/checkout/shipping-method-picker';
import PaymentMethodPicker, { PaymentMethodId } from '@/components/checkout/payment-method-picker';
import PromoCodeInput, { PromoResult } from '@/components/checkout/promo-code-input';
import OrderSummaryBreakdown from '@/components/checkout/order-summary-breakdown';
import AddressFormModal from '@/components/profile/address-form-modal';

export default function CheckoutContent() {
  const { selectedItems, selectedTotal, selectedCount, removeSelected } = useCartStore();

  // Address state
  const [addresses, setAddresses] = useState<CartAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // Shipping / payment / promo
  const [shippingMethodId, setShippingMethodId] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [promoResult, setPromoResult] = useState<PromoResult>(null);

  const [loading, setLoading] = useState(false);

  // Reload addresses. If `selectNewest` is true, auto-select the highest-id entry (just created).
  const loadAddresses = useCallback(async (selectNewest = false) => {
    try {
      const r = await userService.getAddresses();
      const list: CartAddress[] = r.data.addresses ?? [];
      setAddresses(list);
      setSelectedAddressId((prev) => {
        if (selectNewest && list.length > 0) {
          return list.reduce((a, b) => (a.id > b.id ? a : b)).id;
        }
        if (prev && list.some((a) => a.id === prev)) return prev;
        return list.find((a) => a.isDefault)?.id ?? list[0]?.id ?? null;
      });
    } catch {
      setAddresses([]);
      setSelectedAddressId(null);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const selectedMethod = SHIPPING_METHODS.find((m) => m.id === shippingMethodId)!;
  const shippingFee = selectedMethod.fee;
  const subtotal = selectedTotal();
  const items = selectedItems();

  const hasAddress = selectedAddressId !== null;
  const canPlaceOrder = items.length > 0 && hasAddress;

  const handlePlaceOrder = useCallback(async () => {
    if (!canPlaceOrder) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm và địa chỉ giao hàng');
      return;
    }
    setLoading(true);
    try {
      // Backend expects 'COD' | 'SEPAY' uppercase.
      const backendPaymentMethod = paymentMethod === 'sepay' ? 'SEPAY' : 'COD';
      const payload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        addressId: selectedAddressId!,
        shippingMethod: shippingMethodId,
        paymentMethod: backendPaymentMethod,
        promoCode: promoResult?.code ?? undefined,
      };
      const response = await orderService.checkout(payload);
      if (response.success) {
        removeSelected();
        const createdOrder = response.data;
        if (paymentMethod === 'sepay' && createdOrder?.id) {
          // Jump to WebView to finish SePay payment.
          router.replace({ pathname: '/payment/sepay' as any, params: { orderId: createdOrder.id } });
          return;
        }
        Alert.alert('Đặt hàng thành công!', 'Cảm ơn bạn đã mua hàng.', [
          { text: 'Xem đơn hàng', onPress: () => router.replace('/(tabs)/orders' as any) },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  }, [canPlaceOrder, items, selectedAddressId, shippingMethodId, paymentMethod, promoResult, removeSelected]);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button">
            <IconSymbol name="chevron.left" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thanh toán</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Không có sản phẩm nào được chọn</Text>
          <TouchableOpacity style={styles.backToCartBtn} onPress={() => router.back()} accessibilityRole="button">
            <Text style={styles.backToCartText}>Quay lại giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button">
          <IconSymbol name="chevron.left" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.backBtn} />
      </View>

      <CartStepIndicator current="checkout" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Address */}
        <View style={styles.sectionCard}>
          <AddressPicker
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onAddNewAddress={() => setAddressModalVisible(true)}
          />
        </View>

        {/* Shipping */}
        <ShippingMethodPicker selected={shippingMethodId} onSelect={setShippingMethodId} />

        {/* Payment */}
        <PaymentMethodPicker selected={paymentMethod} onSelect={setPaymentMethod} />

        {/* Promo */}
        <PromoCodeInput onApply={setPromoResult} appliedPromo={promoResult} />

        {/* Summary */}
        <OrderSummaryBreakdown
          subtotal={subtotal}
          shippingFee={shippingFee}
          promoResult={promoResult}
        />

        {/* Bottom space for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place order button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderBtn, !canPlaceOrder && styles.placeOrderBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={!canPlaceOrder || loading}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canPlaceOrder || loading }}
        >
          {loading
            ? <ActivityIndicator color={COLORS.text} />
            : <Text style={[styles.placeOrderText, !canPlaceOrder && styles.placeOrderTextDisabled]}>
                {!hasAddress
                  ? 'Vui lòng chọn địa chỉ giao hàng'
                  : `Đặt hàng (${selectedCount()} sản phẩm)`}
              </Text>
          }
        </TouchableOpacity>
      </View>

      <AddressFormModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSuccess={() => loadAddresses(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: SPACING.sm },
  sectionCard: { backgroundColor: COLORS.white, marginBottom: SPACING.sm },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxl,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  placeOrderBtn: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  placeOrderBtnDisabled: {
    backgroundColor: COLORS.divider,
    borderColor: COLORS.cardBorder,
  },
  placeOrderText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  placeOrderTextDisabled: { color: COLORS.textSecondary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    marginBottom: SPACING.xl,
  },
  backToCartBtn: {
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  backToCartText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
