import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Product } from '@/services/api';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

interface DiscountedProductsProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.screenPadding * 2 - 10) / 2;

const DiscountCard = memo(function DiscountCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, $${discountedPrice.toFixed(2)}, ${product.discountPercentage}% off`}
    >
      <View>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.discountPercentage}% off</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.salePrice}>${discountedPrice.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>${product.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export const DiscountedProducts = memo(function DiscountedProducts({
  products,
  onProductPress,
}: DiscountedProductsProps) {
  const handlePress = useCallback(
    (product: Product) => onProductPress(product),
    [onProductPress]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today{"'"}s Deals</Text>
      <View style={styles.grid}>
        {products.map((product) => (
          <DiscountCard
            key={product.id}
            product={product}
            onPress={() => handlePress(product)}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.screenPadding,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  image: {
    height: 140,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
  info: {
    padding: 8,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  salePrice: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceBig,
  },
  originalPrice: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
});
