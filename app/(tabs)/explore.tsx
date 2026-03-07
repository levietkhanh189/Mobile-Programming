import React, { useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { GLASS_COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/theme-colors';

const QUICK_ACTIONS = [
  { icon: 'flame.fill', label: 'Hot Deals', color: '#EF4444', category: 'deals' },
  { icon: 'star.fill', label: 'Top Rated', color: '#F59E0B', category: 'top' },
  { icon: 'gift.fill', label: 'New Arrivals', color: '#8B5CF6', category: 'new' },
  { icon: 'tag.fill', label: 'All Products', color: '#10B981', category: 'all' },
];

export default function ExploreScreen() {
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  const categories = categoriesData?.data || [];

  const navigateToProducts = useCallback((category?: string) => {
    router.push({ pathname: '/products' as any, params: category ? { category } : {} });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSub}>Discover products you{"'"}ll love</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search bar shortcut */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigateToProducts()}
            accessibilityRole="search"
            accessibilityLabel="Search products"
          >
            <IconSymbol name="magnifyingglass" size={20} color={GLASS_COLORS.textMuted} />
            <Text style={styles.searchPlaceholder}>Search products...</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick actions grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, idx) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionCard}
                onPress={() => navigateToProducts()}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <IconSymbol name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Browse by category */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoryList}>
            {categories.map((cat, idx) => (
              <Animated.View key={cat} entering={FadeInDown.duration(300).delay(250 + idx * 60)}>
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => navigateToProducts(cat)}
                  accessibilityRole="button"
                  accessibilityLabel={`Browse ${cat}`}
                >
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryDot, { backgroundColor: GLASS_COLORS.primary }]} />
                    <Text style={styles.categoryName}>{cat}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={GLASS_COLORS.textMuted} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GLASS_COLORS.backgroundDark },
  header: {
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.md,
    backgroundColor: GLASS_COLORS.white, ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: GLASS_COLORS.text,
  },
  headerSub: {
    fontSize: TYPOGRAPHY.fontSize.sm, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular, marginTop: 2,
  },
  scrollContent: { padding: SPACING.screenPadding, paddingTop: SPACING.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: GLASS_COLORS.white,
    paddingHorizontal: SPACING.md, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: GLASS_COLORS.cardBorder, ...SHADOWS.sm,
  },
  searchPlaceholder: {
    fontSize: TYPOGRAPHY.fontSize.base, color: GLASS_COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.semibold,
    color: GLASS_COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm,
  },
  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  actionCard: {
    width: '47%', backgroundColor: GLASS_COLORS.white, borderRadius: 16,
    padding: SPACING.md, alignItems: 'center', borderWidth: 1,
    borderColor: GLASS_COLORS.cardBorder, ...SHADOWS.sm,
  },
  actionIcon: {
    width: 48, height: 48, borderRadius: 14, justifyContent: 'center',
    alignItems: 'center', marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: GLASS_COLORS.text,
  },
  categoryList: { gap: 8 },
  categoryItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: GLASS_COLORS.white, paddingHorizontal: SPACING.md,
    paddingVertical: 14, borderRadius: 14, borderWidth: 1,
    borderColor: GLASS_COLORS.cardBorder, ...SHADOWS.sm,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryName: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: GLASS_COLORS.text,
  },
});
