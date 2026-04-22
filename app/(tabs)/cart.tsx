import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import CartLineItem from '../../components/cart/cart-line-item';
import CartSelectAllHeader from '../../components/cart/cart-select-all-header';
import CartCheckoutBar from '../../components/cart/cart-checkout-bar';

export default function CartScreen() {
  const {
    items,
    updateQuantity,
    removeItem,
    toggleSelected,
    setAllSelected,
    selectedTotal,
    selectedCount,
  } = useCartStore();

  const handleCheckout = useCallback(() => {
    if (selectedCount() === 0) return;
    router.push('/checkout' as any);
  }, [selectedCount]);

  const renderItem = useCallback(({ item }: { item: CartItem }) => (
    <CartLineItem
      item={item}
      onToggleSelected={toggleSelected}
      onUpdateQuantity={updateQuantity}
      onRemove={removeItem}
    />
  ), [toggleSelected, updateQuantity, removeItem]);

  const selCount = selectedCount();
  const selTotal = selectedTotal();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <Text style={styles.headerCount}>{items.length} sản phẩm</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <IconSymbol name="cart.fill" size={48} color={COLORS.cardBorder} />
          <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(tabs)/' as any)}
            accessibilityRole="button"
          >
            <Text style={styles.shopBtnText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <CartSelectAllHeader
            selectedCount={selCount}
            totalCount={items.length}
            onSetAllSelected={setAllSelected}
          />
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <CartCheckoutBar
            selectedCount={selCount}
            total={selTotal}
            onCheckout={handleCheckout}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
  },
  headerCount: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary },
  list: { padding: SPACING.screenPadding, paddingBottom: 160 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  shopBtn: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.btnYellow,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  shopBtnText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
