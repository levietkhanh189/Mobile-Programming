import React, { useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme-colors';

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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Search shortcut */}
        <TouchableOpacity style={styles.searchBar} onPress={() => navigateToProducts()}
          accessibilityRole="search" accessibilityLabel="Search products">
          <IconSymbol name="magnifyingglass" size={18} color={COLORS.textMuted} />
          <Text style={styles.searchText}>Search products...</Text>
        </TouchableOpacity>

        {/* Browse by category */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.catItem} onPress={() => navigateToProducts(cat)}
            accessibilityRole="button" accessibilityLabel={`Browse ${cat}`}>
            <Text style={styles.catName}>{cat}</Text>
            <IconSymbol name="chevron.right" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Browse all */}
        <TouchableOpacity style={styles.browseAllBtn} onPress={() => navigateToProducts()}
          accessibilityRole="button">
          <Text style={styles.browseAllText}>See all products</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.screenPadding, paddingVertical: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'], fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text,
  },
  scroll: { padding: SPACING.screenPadding, paddingBottom: 80 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md, paddingVertical: 12, borderRadius: 4,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  searchText: { fontSize: TYPOGRAPHY.fontSize.base, color: COLORS.textMuted },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg, fontFamily: TYPOGRAPHY.fontFamily.poppins.bold,
    color: COLORS.text, marginTop: SPACING.xl, marginBottom: SPACING.sm,
  },
  catItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: 14,
    borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 4, marginBottom: 6,
  },
  catName: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.openSans.regular,
    color: COLORS.text,
  },
  browseAllBtn: {
    backgroundColor: COLORS.btnYellow, borderWidth: 1, borderColor: COLORS.btnYellowBorder,
    borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: SPACING.xl,
  },
  browseAllText: {
    fontSize: TYPOGRAPHY.fontSize.base, fontFamily: TYPOGRAPHY.fontFamily.poppins.medium,
    color: COLORS.text,
  },
});
