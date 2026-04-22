import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Product } from '@/services/api';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.38;

// Fake countdown from 1 hour (3600 seconds)
const INITIAL_SECONDS = 3600;

interface FlashSaleSectionProps {
  products: Product[];
  onProductPress: (product: Product) => void;
}

const FlashCard = memo(function FlashCard({
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
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, giá ${discountedPrice.toFixed(2)}, giảm ${product.discountPercentage}%`}
    >
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>-{product.discountPercentage}%</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.salePrice}>${discountedPrice.toFixed(2)}</Text>
        <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
});

export const HomeFlashSaleSection = memo(function HomeFlashSaleSection({
  products,
  onProductPress,
}: FlashSaleSectionProps) {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const handlePress = useCallback(
    (product: Product) => onProductPress(product),
    [onProductPress]
  );

  if (!products.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Flash Sale</Text>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{mm}:{ss}</Text>
        </View>
      </View>
      <FlatList
        data={products.slice(0, 10)}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FlashCard
            product={item}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.error,
  },
  timer: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timerText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.screenPadding,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.background,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
    lineHeight: 16,
    marginBottom: 4,
  },
  salePrice: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceBig,
  },
  originalPrice: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
});
