import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { productService, Product } from '../../services/api';
import { useCartStore } from '../../stores/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await productService.getProductById(Number(id));
        if (response.success && response.data) setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [product, addItem]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={GLASS_COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={GLASS_COLORS.text} />
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Product not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back button overlay */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtnOverlay}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <IconSymbol name="chevron.left" size={22} color={GLASS_COLORS.text} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="cover" />
        </Animated.View>

        {/* Info card */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.infoCard}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{product.soldCount}</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{product.category}</Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky add to cart */}
      <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.addToCartBtn, added && styles.addedBtn]}
          onPress={handleAddToCart}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name} to cart`}
        >
          <IconSymbol
            name={added ? 'checkmark' : 'cart.badge.plus'}
            size={20}
            color={GLASS_COLORS.white}
          />
          <Text style={styles.addToCartText}>
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GLASS_COLORS.backgroundDark },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  backBtn: { padding: SPACING.md },
  backBtnOverlay: {
    position: 'absolute', top: 56, left: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.md,
  },
  heroImage: { width: '100%', height: 340 },
  infoCard: {
    backgroundColor: GLASS_COLORS.white, borderTopLeftRadius: 28,
    borderTopRightRadius: 28, marginTop: -24, padding: SPACING.screenPadding,
    paddingTop: SPACING.lg, ...SHADOWS.lg,
  },
  category: {
    fontSize: TYPOGRAPHY.fontSize.xs, color: GLASS_COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 6,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.text, marginBottom: 8,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.md },
  price: {
    fontSize: TYPOGRAPHY.fontSize['3xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.primary,
  },
  discountBadge: {
    backgroundColor: GLASS_COLORS.error, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: GLASS_COLORS.white, fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
  },
  statsRow: {
    flexDirection: 'row', backgroundColor: GLASS_COLORS.backgroundDark,
    borderRadius: 14, padding: SPACING.md, marginBottom: SPACING.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.text,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular, marginTop: 2,
  },
  statDivider: {
    width: 1, backgroundColor: GLASS_COLORS.divider, marginHorizontal: SPACING.md,
  },
  divider: { height: 1, backgroundColor: GLASS_COLORS.divider, marginVertical: SPACING.md },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text, marginBottom: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base, lineHeight: 24, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.screenPadding, paddingBottom: SPACING.xxl,
    backgroundColor: GLASS_COLORS.white, ...SHADOWS.lg,
  },
  addToCartBtn: {
    flexDirection: 'row', backgroundColor: GLASS_COLORS.cta, paddingVertical: 16,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 10,
    ...SHADOWS.md,
  },
  addedBtn: { backgroundColor: GLASS_COLORS.success },
  addToCartText: {
    color: GLASS_COLORS.white, fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold, letterSpacing: 0.3,
  },
});
