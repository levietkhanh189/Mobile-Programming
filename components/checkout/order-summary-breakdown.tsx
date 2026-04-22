import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import type { PromoResult } from './promo-code-input';

interface Props {
  subtotal: number;
  shippingFee: number;
  promoResult: PromoResult;
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export default function OrderSummaryBreakdown({ subtotal, shippingFee, promoResult }: Props) {
  const freeShipping = promoResult?.type === 'free_shipping';
  const percentOff = promoResult?.type === 'percent_off' ? promoResult.value : 0;

  const effectiveShipping = freeShipping ? 0 : shippingFee;
  const discount = subtotal * percentOff;
  const total = subtotal - discount + effectiveShipping;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Tạm tính</Text>
        <Text style={styles.value}>{formatVND(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Phí vận chuyển</Text>
        <Text style={[styles.value, freeShipping && styles.free]}>
          {freeShipping ? 'Miễn phí' : shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
        </Text>
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Giảm giá ({percentOff * 100}%)</Text>
          <Text style={styles.discount}>-{formatVND(discount)}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalValue}>{formatVND(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
    padding: SPACING.screenPadding,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  free: {
    color: COLORS.success,
  },
  discount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.priceBig,
  },
});
