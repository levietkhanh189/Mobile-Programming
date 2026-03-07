import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Product } from '@/services/api';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

interface DiscountedProductsProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.screenPadding * 2 - 12) / 2;

const DiscountCard = memo(function DiscountCard({
  product,
  onPress,
  index,
}: {
  product: Product;
  onPress: () => void;
  index: number;
}) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 60)}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}, was $${product.price}, now $${discountedPrice.toFixed(2)}, ${product.discountPercentage}% off`}
      >
        <View>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>${product.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
      <Text style={styles.title}>Special Offers</Text>
      <View style={styles.grid}>
        {products.map((product, idx) => (
          <DiscountCard
            key={product.id}
            product={product}
            onPress={() => handlePress(product)}
            index={idx}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.screenPadding,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
    marginBottom: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: GLASS_COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: GLASS_COLORS.cardBorder,
    ...SHADOWS.md,
  },
  image: {
    height: 140,
    width: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: GLASS_COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: GLASS_COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.primary,
  },
  originalPrice: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: GLASS_COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
});
