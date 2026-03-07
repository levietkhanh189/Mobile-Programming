import React, { memo, useCallback } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Product } from '@/services/api';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

interface TopSellersProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  onPress,
  index,
}: {
  product: Product;
  onPress: () => void;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInRight.duration(400).delay(index * 80)}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}, $${product.price}, ${product.soldCount} sold`}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.soldBadge}>
            <Text style={styles.soldText}>{product.soldCount} sold</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export const TopSellers = memo(function TopSellers({ products, onProductPress }: TopSellersProps) {
  const handlePress = useCallback(
    (product: Product) => onProductPress(product),
    [onProductPress]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Sellers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => handlePress(product)}
            index={idx}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 14,
  },
  card: {
    width: 160,
    backgroundColor: GLASS_COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_COLORS.cardBorder,
    ...SHADOWS.md,
  },
  image: {
    height: 130,
    width: '100%',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.primary,
    marginTop: 4,
  },
  soldBadge: {
    marginTop: 6,
    backgroundColor: GLASS_COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  soldText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: GLASS_COLORS.textSecondary,
  },
});
