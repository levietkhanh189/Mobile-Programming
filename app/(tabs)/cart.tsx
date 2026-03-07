import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { orderService } from '@/services/api';
import { router } from 'expo-router';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

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

  const renderItem = useCallback(({ item, index }: { item: CartItem; index: number }) => (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 80)}
      layout={Layout.springify()}
      style={styles.card}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            style={styles.deleteBtn}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name} from cart`}
          >
            <IconSymbol name="trash" size={18} color={GLASS_COLORS.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.price}</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Decrease quantity"
            >
              <IconSymbol name="minus" size={14} color={GLASS_COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.qtyBtn}
              accessibilityLabel="Increase quantity"
            >
              <IconSymbol name="plus" size={14} color={GLASS_COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  ), [removeItem, updateQuantity]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerCount}>{items.length} items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState} accessibilityRole="text">
          <View style={styles.emptyIcon}>
            <IconSymbol name="cart.fill" size={48} color={GLASS_COLORS.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Cart is empty</Text>
          <Text style={styles.emptySubtitle}>Start shopping to add items</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push('/(tabs)/' as any)}
            accessibilityRole="button"
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <Animated.View entering={FadeInUp.duration(500)} style={styles.checkoutBar}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              accessibilityRole="button"
              accessibilityLabel={`Checkout, total $${getTotal().toFixed(2)}`}
            >
              <Text style={styles.checkoutBtnText}>Checkout (COD)</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GLASS_COLORS.backgroundDark },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.md,
    backgroundColor: GLASS_COLORS.white, ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.text,
  },
  headerCount: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  listContent: { padding: SPACING.md, paddingBottom: 200 },
  card: {
    flexDirection: 'row', backgroundColor: GLASS_COLORS.white, borderRadius: 16,
    marginBottom: 12, overflow: 'hidden', borderWidth: 1,
    borderColor: GLASS_COLORS.cardBorder, ...SHADOWS.sm,
  },
  image: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: {
    flex: 1, marginRight: 8, fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, color: GLASS_COLORS.text,
  },
  deleteBtn: { padding: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.primary,
  },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: GLASS_COLORS.backgroundDark,
    borderRadius: 20, paddingHorizontal: 4, paddingVertical: 2,
  },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  qtyText: {
    marginHorizontal: 12, fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold, color: GLASS_COLORS.text,
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: GLASS_COLORS.background,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: GLASS_COLORS.textMuted, marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  browseBtn: {
    marginTop: SPACING.lg, backgroundColor: GLASS_COLORS.primary, paddingHorizontal: 28,
    paddingVertical: 14, borderRadius: 14, ...SHADOWS.md,
  },
  browseBtnText: {
    color: GLASS_COLORS.white, fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: GLASS_COLORS.white, paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md, paddingBottom: SPACING.xxl, borderTopLeftRadius: 28,
    borderTopRightRadius: 28, ...SHADOWS.lg,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.base, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  totalAmount: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: GLASS_COLORS.cta, paddingVertical: 16, borderRadius: 14,
    alignItems: 'center', ...SHADOWS.md,
  },
  checkoutBtnText: {
    color: GLASS_COLORS.white, fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, letterSpacing: 0.3,
  },
});
