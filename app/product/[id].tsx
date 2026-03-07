import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productService, Product } from '../../services/api';
import { useCartStore } from '../../stores/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

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
        const res = await productService.getProductById(Number(id));
        if (res.success && res.data) setProduct(res.data);
      } catch (e) { console.error('Error:', e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [product, addItem]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
            <IconSymbol name="chevron.left" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centered}><Text>Product not found</Text></View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>{product.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="contain" />

        <View style={styles.infoSection}>
          {product.discountPercentage > 0 && (
            <View style={styles.dealRow}>
              <View style={styles.dealBadge}>
                <Text style={styles.dealBadgeText}>{product.discountPercentage}% off</Text>
              </View>
              <Text style={styles.dealLabel}>Limited time deal</Text>
            </View>
          )}

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.sold}>{product.soldCount} bought</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About this item</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom add to cart */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.addBtn, added && styles.addedBtn]}
          onPress={handleAddToCart}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name} to cart`}
        >
          <Text style={styles.addBtnText}>
            {added ? 'Added to Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding, paddingTop: 50, paddingBottom: 10,
    backgroundColor: COLORS.headerBg,
  },
  topBarTitle: {
    flex: 1, textAlign: 'center', fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium, color: COLORS.white,
    marginHorizontal: SPACING.sm,
  },
  heroImage: {
    width: '100%', height: 300, backgroundColor: COLORS.white,
  },
  infoSection: {
    padding: SPACING.screenPadding,
  },
  dealRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.sm,
  },
  dealBadge: {
    backgroundColor: COLORS.error, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2,
  },
  dealBadgeText: {
    color: COLORS.white, fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
  },
  dealLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.error,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize['4xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.priceWhole,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text, marginTop: 4, lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row', gap: 16, marginTop: SPACING.sm,
  },
  category: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  sold: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary,
  },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.lg },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text, marginBottom: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base, lineHeight: 22, color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.screenPadding, paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  addBtn: {
    backgroundColor: COLORS.btnYellow, borderWidth: 1, borderColor: COLORS.btnYellowBorder,
    borderRadius: 20, paddingVertical: 14, alignItems: 'center',
  },
  addedBtn: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  addBtnText: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
