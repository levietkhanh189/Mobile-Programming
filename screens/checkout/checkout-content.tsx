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
import ShippingMethodPicker, { SHIPPING_METHODS } from '@/components/checkout/shipping-method-picker';
import PaymentMethodPicker, { PaymentMethodId } from '@/components/checkout/payment-method-picker';
import PromoCodeInput, { PromoResult } from '@/components/checkout/promo-code-input';
import OrderSummaryBreakdown from '@/components/checkout/order-summary-breakdown';

export default function CheckoutContent() {
  const { selectedItems, selectedTotal, selectedCount, removeSelected } = useCartStore();

  // Address state
  const [addresses, setAddresses] = useState<CartAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [manualAddress, setManualAddress] = useState('');

  // Shipping / payment / promo
  const [shippingMethodId, setShippingMethodId] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [promoResult, setPromoResult] = useState<PromoResult>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userService.getAddresses()
      .then((r) => {
        const list: CartAddress[] = r.data.addresses ?? [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault);
        if (def) setSelectedAddressId(def.id);
      })
      .catch(() => { /* manual input fallback */ });
  }, []);

  const selectedMethod = SHIPPING_METHODS.find((m) => m.id === shippingMethodId)!;
  const shippingFee = selectedMethod.fee;
  const subtotal = selectedTotal();
  const items = selectedItems();

  const hasAddress = selectedAddressId !== null || manualAddress.trim().length > 0;
  const canPlaceOrder = items.length > 0 && hasAddress;

  const handlePlaceOrder = useCallback(async () => {
    if (!canPlaceOrder) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm và địa chỉ giao hàng');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        ...(selectedAddressId
          ? { addressId: selectedAddressId }
          : { shippingAddress: manualAddress.trim() }),
        shippingMethod: shippingMethodId,
        paymentMethod,
        promoCode: promoResult?.code ?? undefined,
      };
      const response = await orderService.checkout(payload);
      if (response.success) {
        removeSelected();
        Alert.alert('Đặt hàng thành công!', 'Cảm ơn bạn đã mua hàng.', [
          { text: 'Xem đơn hàng', onPress: () => router.replace('/(tabs)/orders' as any) },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  }, [canPlaceOrder, items, selectedAddressId, manualAddress, shippingMethodId, paymentMethod, promoResult, removeSelected]);

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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Address */}
        <View style={styles.sectionCard}>
          <AddressPicker
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            manualAddress={manualAddress}
            onSelectAddress={setSelectedAddressId}
            onChangeManualAddress={setManualAddress}
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
                Đặt hàng ({selectedCount()} sản phẩm)
              </Text>
          }
        </TouchableOpacity>
      </View>
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
