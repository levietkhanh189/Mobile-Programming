import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';
import { router } from 'expo-router';

// SF Symbol name type subset used here
type IconName =
  | 'bag.fill'
  | 'tag.fill'
  | 'house.fill'
  | 'star.fill'
  | 'heart.fill'
  | 'creditcard.fill'
  | 'location.fill'
  | 'gear';

const CATEGORY_ICONS: Record<string, IconName> = {
  electronics: 'creditcard.fill',
  clothing: 'bag.fill',
  home: 'house.fill',
  beauty: 'heart.fill',
  sports: 'star.fill',
  toys: 'star.fill',
  food: 'tag.fill',
  books: 'tag.fill',
  furniture: 'house.fill',
  jewelry: 'star.fill',
  shoes: 'bag.fill',
  bags: 'bag.fill',
};

const CATEGORY_COLORS: string[] = [
  '#FF9900', '#007185', '#067D62', '#B12704',
  '#131921', '#C45500', '#565959', '#7B2D8B',
];

function getCategoryIcon(name: string): IconName {
  const key = name.toLowerCase();
  for (const k of Object.keys(CATEGORY_ICONS)) {
    if (key.includes(k)) return CATEGORY_ICONS[k];
  }
  return 'tag.fill';
}

interface CategoryIconGridProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export const HomeCategoryIconGrid = memo(function HomeCategoryIconGrid({
  categories,
  onSelectCategory,
}: CategoryIconGridProps) {
  const visible = categories.slice(0, 8);
  const hasMore = categories.length > 8;

  const handlePress = useCallback(
    (cat: string) => onSelectCategory(cat),
    [onSelectCategory]
  );

  const handleViewAll = useCallback(() => {
    router.push('/products' as any);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Danh Mục</Text>
        {hasMore && (
          <TouchableOpacity onPress={handleViewAll} accessibilityRole="button">
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.grid}>
        {visible.map((cat, i) => {
          const iconName = getCategoryIcon(cat);
          const bgColor = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
          return (
            <TouchableOpacity
              key={cat}
              style={styles.tile}
              onPress={() => handlePress(cat)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Danh mục: ${cat}`}
            >
              <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
                <IconSymbol name={iconName} size={22} color={COLORS.white} />
              </View>
              <Text style={styles.label} numberOfLines={2}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const TILE_SIZE = '25%';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
  },
  viewAll: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.link,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    width: TILE_SIZE,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});
