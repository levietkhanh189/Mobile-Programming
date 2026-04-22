import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  discountPercentage?: number;
}

interface Props {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: Props) {
  const router = useRouter();
  if (!products.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Sản phẩm tương tự</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/product/${item.id}` as any)}
            style={styles.card}
            accessibilityRole="button"
          >
            <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" cachePolicy="memory-disk" transition={150} />
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.price}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: SPACING.lg, marginBottom: SPACING.md },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
  },
  list: { paddingHorizontal: SPACING.screenPadding, gap: SPACING.sm },
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    overflow: 'hidden',
    width: 128,
  },
  image: { width: 128, height: 128, backgroundColor: COLORS.background },
  body: { padding: SPACING.sm },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
  price: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.priceBig,
    marginTop: 4,
  },
});
