import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';
import { Product } from '@/services/api';
import { router } from 'expo-router';

interface Props {
  query: string;
  suggestions?: Product[];
}

export function NoResultsEmptyState({ query, suggestions }: Props) {
  return (
    <View style={styles.container}>
      <IconSymbol name="magnifyingglass" size={48} color={COLORS.textMuted} />
      <Text style={styles.title}>Không tìm thấy "{query}"</Text>
      <Text style={styles.subtitle}>Thử từ khóa khác hoặc kiểm tra chính tả</Text>

      {suggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>Có thể bạn quan tâm</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsList}>
            {suggestions.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.suggestionCard}
                onPress={() => router.push(`/product/${product.id}` as any)}
                accessibilityRole="button"
                accessibilityLabel={product.name}
              >
                <Image source={{ uri: product.image }} style={styles.suggestionImage} resizeMode="cover" />
                <Text style={styles.suggestionName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.suggestionPrice}>${product.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.screenPadding,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  suggestionsSection: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  suggestionsTitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  suggestionsList: {
    gap: SPACING.sm,
    paddingRight: SPACING.sm,
  },
  suggestionCard: {
    width: 120,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  suggestionImage: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.background,
  },
  suggestionName: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
    padding: 6,
    lineHeight: 16,
  },
  suggestionPrice: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: COLORS.priceWhole,
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
});
