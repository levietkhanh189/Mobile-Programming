import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { productService, reviewService, Product } from '../../services/api';
import { useCartStore } from '../../stores/cartStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';
import ProductDetailContent from '../../screens/product/product-detail-content';

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

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<ReviewState>({
    reviews: [], averageRating: 0, totalReviews: 0, alreadyReviewed: false,
  });
  const [related, setRelated] = useState<RelatedProduct[]>([]);

  const productId = Number(id);

  useEffect(() => {
    (async () => {
      try {
        const res = await productService.getProductById(productId);
        if (res.success && res.data) setProduct(res.data);

        const [reviewsRes, relatedRes] = await Promise.allSettled([
          reviewService.getProductReviews(productId),
          productService.getRelatedProducts(productId),
        ]);
        if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data);
        if (relatedRes.status === 'fulfilled') setRelated(relatedRes.value.data.products ?? []);
      } catch (e) {
        console.error('ProductDetail error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [product, addItem]);

  const handleToggleFavorite = useCallback(() => {
    if (!product) return;
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  }, [product, isFavorite, addFavorite, removeFavorite]);

  const handleReviewSuccess = useCallback((pointsEarned: number) => {
    // Refresh reviews after successful submission
    reviewService.getProductReviews(productId)
      .then(res => setReviews(res.data))
      .catch(() => {});
    if (pointsEarned > 0) {
      Alert.alert('Điểm thưởng', `Bạn nhận được +${pointsEarned} điểm!`);
    }
  }, [productId]);

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

  const liked = isFavorite(product.id);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>{product.name}</Text>
        <TouchableOpacity onPress={handleToggleFavorite} accessibilityLabel={liked ? 'Remove from favorites' : 'Add to favorites'}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#ef4444' : '#ffffff'} />
        </TouchableOpacity>
      </View>

      <ProductDetailContent
        product={product}
        reviews={reviews}
        related={related}
        onReviewSuccess={handleReviewSuccess}
      />

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
