/**
 * OrderLineItemsList — renders the list of products in an order.
 * Shows image (60x60), name, quantity, unit price, and line subtotal.
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import { OrderItem } from '@/services/api';

interface Props {
  items: OrderItem[];
}

export function OrderLineItemsList({ items }: Props) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={`${item.productId}-${index}`} style={styles.row}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>?</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.qty}>Số lượng: {item.quantity}</Text>
            <Text style={styles.unitPrice}>${item.price.toFixed(2)} / cái</Text>
          </View>
          <Text style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 20, color: COLORS.textMuted },
  info: { flex: 1, paddingHorizontal: SPACING.sm },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  qty: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textMuted },
  unitPrice: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textSecondary, marginTop: 2 },
  subtotal: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceBig,
    minWidth: 56,
    textAlign: 'right',
  },
});
