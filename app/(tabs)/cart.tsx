import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useCartStore, CartItem } from '@/stores/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import CartLineItem from '../../components/cart/cart-line-item';
import CartSelectAllHeader from '../../components/cart/cart-select-all-header';
import CartCheckoutBar from '../../components/cart/cart-checkout-bar';
import CartStepIndicator from '../../components/cart/cart-step-indicator';

export default function CartScreen() {
  const {
    items,
    updateQuantity,
    removeItem,
    toggleSelected,
    setAllSelected,
    removeSelected,
  } = useCartStore();

  const { selCount, selSubtotal, selSavings } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let savings = 0;
    for (const it of items) {
      if (!it.selected) continue;
      count += 1;
      const discount = it.discountPercentage ?? 0;
      const finalPrice = discount > 0 ? it.price * (1 - discount / 100) : it.price;
      subtotal += finalPrice * it.quantity;
      savings += (it.price - finalPrice) * it.quantity;
    }
    return { selCount: count, selSubtotal: subtotal, selSavings: savings };
  }, [items]);

  const handleCheckout = useCallback(() => {
    if (selCount === 0) return;
    router.push('/checkout' as any);
  }, [selCount]);

  const renderItem = useCallback(({ item }: { item: CartItem }) => (
    <CartLineItem
      item={item}
      onToggleSelected={toggleSelected}
      onUpdateQuantity={updateQuantity}
      onRemove={removeItem}
    />
  ), [toggleSelected, updateQuantity, removeItem]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <Text style={styles.headerCount}>
          {items.length > 0 ? `${items.length} sản phẩm` : ''}
        </Text>
      </View>

      <CartStepIndicator current="cart" />

      {items.length === 0 ? (
        <View style={styles.empty}>
          <IconSymbol name="cart.fill" size={64} color={COLORS.cardBorder} />
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySub}>Khám phá sản phẩm và thêm vào giỏ hàng nhé!</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(tabs)/' as any)}
            accessibilityRole="button"
          >
            <Text style={styles.shopBtnText}>Bắt đầu mua sắm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/wishlist' as any)}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryBtnText}>Xem danh sách yêu thích</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <CartSelectAllHeader
            selectedCount={selCount}
            totalCount={items.length}
            onSetAllSelected={setAllSelected}
            onRemoveSelected={removeSelected}
          />
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <Text style={styles.hint}>
                Chọn sản phẩm bạn muốn thanh toán bằng ô vuông bên trái
              </Text>
            }
          />
          <CartCheckoutBar
            selectedCount={selCount}
            subtotal={selSubtotal}
            savings={selSavings}
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
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
  },
  headerCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  list: { padding: SPACING.screenPadding, paddingBottom: 180 },
  hint: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginTop: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.text,
    marginTop: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
  emptySub: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
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
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
  },
  secondaryBtn: {
    marginTop: SPACING.sm,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
  },
});
