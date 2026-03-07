import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { orderService } from '@/services/api';
import { router } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) return;
    try {
      const orderData = {
        items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
        shippingAddress: '123 Default St, City, Country',
      };
      const response = await orderService.checkout(orderData);
      if (response.success) {
        Alert.alert('Success', 'Order placed successfully (COD)');
        clearCart();
        router.push('/(tabs)/orders' as any);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place order');
    }
  }, [items, clearCart]);

  const renderItem = useCallback(({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <View style={styles.cardActions}>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Decrease quantity"
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Increase quantity"
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            accessibilityLabel={`Remove ${item.name}`}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [removeItem, updateQuantity]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerCount}>{items.length} items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <IconSymbol name="cart.fill" size={48} color={COLORS.cardBorder} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(tabs)/' as any)}
            accessibilityRole="button"
          >
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal ({items.length} items):</Text>
              <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              accessibilityRole="button"
              accessibilityLabel={`Checkout, total $${getTotal().toFixed(2)}`}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout (COD)</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
  },
  headerCount: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary },
  list: { padding: SPACING.screenPadding, paddingBottom: 160 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderWidth: 1,
    borderColor: COLORS.cardBorder, borderRadius: 4, marginBottom: 10,
    overflow: 'hidden', ...SHADOWS.sm,
  },
  image: { width: 110, height: 110 },
  cardBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
  itemName: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text, lineHeight: 18,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceBig,
  },
  cardActions: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  qtyRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: COLORS.cardBorder, borderRadius: 4, overflow: 'hidden',
  },
  qtyBtn: {
    width: 34, height: 30, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  qtyBtnText: { fontSize: 16, color: COLORS.text },
  qtyText: {
    minWidth: 34, textAlign: 'center', fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium, color: COLORS.text,
    backgroundColor: COLORS.white, lineHeight: 30,
  },
  deleteText: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg, color: COLORS.textSecondary, marginTop: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  shopBtn: {
    marginTop: SPACING.xl, backgroundColor: COLORS.btnYellow, borderWidth: 1,
    borderColor: COLORS.btnYellowBorder, borderRadius: 8, paddingHorizontal: 28,
    paddingVertical: 12,
  },
  shopBtnText: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md, paddingBottom: SPACING.xxl,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.priceBig,
  },
  checkoutBtn: {
    backgroundColor: COLORS.btnYellow, borderWidth: 1, borderColor: COLORS.btnYellowBorder,
    borderRadius: 8, paddingVertical: 14, alignItems: 'center',
  },
  checkoutText: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
