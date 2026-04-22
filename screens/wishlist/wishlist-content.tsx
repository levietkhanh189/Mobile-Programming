import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist, useToggleWishlist } from '../../hooks/use-wishlist';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme-colors';
import type { Product } from '../../services/api';

function WishlistItem({ item }: { item: Product }) {
  const toggle = useToggleWishlist();
  const router = useRouter();

  const discountedPrice = item.discountPercentage > 0
    ? item.price * (1 - item.discountPercentage / 100)
    : item.price;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
      accessibilityRole="button"
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {discountedPrice.toLocaleString('vi-VN')}₫
          </Text>
          {item.discountPercentage > 0 && (
            <Text style={styles.discount}>-{item.discountPercentage}%</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => toggle.mutate(item.id)}
        disabled={toggle.isPending}
        style={styles.removeBtn}
        accessibilityLabel="Xóa khỏi yêu thích"
      >
        <Ionicons name="heart" size={22} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function WishlistContent() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useWishlist();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Không thể tải danh sách yêu thích</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="heart-outline" size={72} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
        <Text style={styles.emptySubtitle}>Nhấn tim để lưu sản phẩm bạn thích</Text>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => router.push('/(tabs)/' as any)}
          accessibilityRole="button"
        >
          <Text style={styles.exploreBtnText}>Khám phá sản phẩm</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <WishlistItem item={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  list: { padding: SPACING.screenPadding, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  image: { width: 80, height: 80, borderRadius: 4, backgroundColor: COLORS.background },
  info: { flex: 1, marginHorizontal: SPACING.sm },
  name: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  category: { fontSize: TYPOGRAPHY.fontSize.xs, color: COLORS.textMuted, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceBig,
  },
  discount: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.white,
    backgroundColor: COLORS.error,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  removeBtn: { padding: SPACING.xs },
  errorText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.error, marginBottom: SPACING.md, textAlign: 'center' },
  retryBtn: {
    backgroundColor: COLORS.btnYellow,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
  },
  retryText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium, color: COLORS.text },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: { fontSize: TYPOGRAPHY.fontSize.sm, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  exploreBtn: {
    backgroundColor: COLORS.btnYellow,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.btnYellowBorder,
  },
  exploreBtnText: { fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium, color: COLORS.text },
});
