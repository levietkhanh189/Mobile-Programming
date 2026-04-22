import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import { Product } from '../../services/api';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import ReviewList from '../../components/product/review-list';
import ReviewForm from '../../components/product/review-form';
import RelatedProducts from '../../components/product/related-products';
import ProductImageCarousel from '../../components/product/product-image-carousel';
import ProductQuantitySelector from '../../components/product/product-quantity-selector';
import ProductBottomActionBar from '../../components/product/product-bottom-action-bar';
import { useCartStore } from '../../stores/cartStore';

interface ReviewState {
  reviews: Array<{ id: number; rating: number; comment?: string; createdAt: string; user?: { fullName: string } }>;
  averageRating: number;
  totalReviews: number;
  alreadyReviewed: boolean;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  discountPercentage?: number;
}

interface Props {
  product: Product;
  reviews: ReviewState;
  related: RelatedProduct[];
  onReviewSuccess: (points: number) => void;
}

export default function ProductDetailContent({ product, reviews, related, onReviewSuccess }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [snackVisible, setSnackVisible] = useState(false);

  const handleAddToCart = () => {
    addItem(product, qty);
    setSnackVisible(true);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    router.push('/(tabs)/cart');
  };

  return (
    <View style={styles.flex}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <ProductImageCarousel images={product.images && product.images.length > 0 ? product.images : [product.image]} />

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

      <ReviewList
        reviews={reviews.reviews}
        averageRating={reviews.averageRating}
        totalReviews={reviews.totalReviews}
      />
      <ReviewForm
        productId={product.id}
        onSuccess={onReviewSuccess}
        alreadyReviewed={reviews.alreadyReviewed}
      />
      <RelatedProducts products={related} />

      <View style={{ height: 16 }} />
    </ScrollView>

    <ProductQuantitySelector value={qty} onChange={setQty} />

    <ProductBottomActionBar onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />

    <Snackbar
      visible={snackVisible}
      onDismiss={() => setSnackVisible(false)}
      duration={2000}
      style={styles.snackbar}
    >
      Đã thêm vào giỏ hàng
    </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  snackbar: { backgroundColor: COLORS.text },
  infoSection: { padding: SPACING.screenPadding },
  dealRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.sm },
  dealBadge: { backgroundColor: COLORS.error, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2 },
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
  metaRow: { flexDirection: 'row', gap: 16, marginTop: SPACING.sm },
  category: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.link,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  sold: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.lg },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text, marginBottom: SPACING.sm,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.base, lineHeight: 22, color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
});
