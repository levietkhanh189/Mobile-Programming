import React, { memo, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Product } from '@/services/api';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

interface TopSellersProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, $${product.price}`}
    >
      <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" cachePolicy="memory-disk" transition={150} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.sold}>{product.soldCount} bought</Text>
      </View>
    </TouchableOpacity>
  );
});

export const TopSellers = memo(function TopSellers({ products, onProductPress }: TopSellersProps) {
  const handlePress = useCallback(
    (product: Product) => onProductPress(product),
    [onProductPress]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Best Sellers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => handlePress(product)}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 10,
  },
  card: {
    width: 150,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  image: {
    height: 150,
    width: '100%',
    backgroundColor: COLORS.background,
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
  price: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceWhole,
    marginTop: 4,
  },
  sold: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
